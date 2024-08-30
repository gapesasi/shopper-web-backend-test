import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { ErrorCodeEnum } from "../../../../src/models/error-code-enum";
import { MeasureTypeEnum } from "../../../../src/models/measure-type-enum";

import {
  IFindByCodeDateRangeAndType,
  IMeasurementsRepository,
  ISaveMeasurementParams,
} from "../../../../src/repositories/measurements/params";
import { ILLMService } from "../../../../src/services/llm/params";
import IFileService from "../../../../src/services/file/params";
import UploadMeasurementService from "../../../../src/services/measurements/upload";
import { parseStringToDateTime, returnMonthRange } from "../../../../src/utils/date/date";
import BadRequestError from "../../../../src/utils/error/bad-request-error";
import ConflictError from "../../../../src/utils/error/conflict-error";
import { returnPrompt } from "../../../../src/utils/prompt/return-prompt";
import { base64 } from "../../../mocks/base64";
import { mock_measurements_repository } from "../../../mocks/mesurements-repo.mock";
import { UploadImageSchema } from "../../../../src/schemas/zod-schemas";
import { Measure } from "../../../../src/models/measure";
import { UploadImageDTO } from "../../../../src/dtos/upload-image-dto";
import { returnImageName, returnImagePath } from "../../../../src/utils/files/image";

describe("Upload Measurements service Tests", () => {
  let aiService: jest.Mocked<ILLMService>;
  let repository: jest.Mocked<IMeasurementsRepository>;
  let fileService: jest.Mocked<IFileService>;
  let service: UploadMeasurementService;
  let validBody: UploadImageSchema = {
    image: base64,
    costumer_code: "12345",
    measure_datetime: new Date().toISOString(),
    measure_type: MeasureTypeEnum.WATER,
  };
  let validMeasure: Measure = {
    measure_uuid: "00001",
    measure_type: MeasureTypeEnum.WATER,
    costumer_code: "12345",
    measure_datetime: new Date(),
    image_url: "http://localhost:3000/image/12345-WATER.jpeg",
    measure_value: 0o0001,
    has_confirmed: false,
  };

  beforeAll(() => {
    aiService = { readImage: jest.fn() } as jest.Mocked<ILLMService>;
    repository = mock_measurements_repository;
    fileService = {
      saveFromBase64: jest.fn(),
      deleteFromPath: jest.fn(),
    } as jest.Mocked<IFileService>;
    service = new UploadMeasurementService(repository, aiService, fileService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("Should return invalid data error if invalid body is sent", async () => {
    const invalidBody = { ...validBody, image: "image" };
    expect.assertions(6);
    try {
      await service.execute(invalidBody);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      const e = error as BadRequestError;
      expect(e.errorCode).toBe(ErrorCodeEnum.INVALID_DATA);
      expect(repository.findByCodeDateRangeAndType).not.toHaveBeenCalled();
      expect(aiService.readImage).not.toHaveBeenCalled();
      expect(fileService.saveFromBase64).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    }
  });

  it("Should return DOUBLE REPORT error if a measure of the same type is alread saved for that month", async () => {
    const parsed_measure_datetime = parseStringToDateTime(validBody.measure_datetime);
    const date_range = returnMonthRange(parsed_measure_datetime);
    const findParams: IFindByCodeDateRangeAndType = {
      costumer_code: validBody.costumer_code,
      date_range_start: date_range.start,
      date_range_end: date_range.end,
      measure_type: validBody.measure_type,
    };

    repository.findByCodeDateRangeAndType.mockResolvedValueOnce([validMeasure]);

    await expect(service.execute(validBody)).rejects.toThrowError(
      new ConflictError("Leitura do mês já realizada", ErrorCodeEnum.DOUBLE_REPORT)
    );
    expect(repository.findByCodeDateRangeAndType).toHaveBeenCalledWith(findParams);
    expect(aiService.readImage).not.toHaveBeenCalled();
    expect(fileService.saveFromBase64).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("Should save to DB and return correct Data when valid body is sent", async () => {
    const parsed_measure_datetime = parseStringToDateTime(validBody.measure_datetime);
    const saveParams: ISaveMeasurementParams = {
      measure_type: validBody.measure_type,
      costumer_code: validBody.costumer_code,
      measure_datetime: parsed_measure_datetime,
      image_url: validMeasure.image_url,
      measure_value: validMeasure.measure_value,
    };
    const prompt = returnPrompt(validBody.measure_type);
    const expectedResponse: UploadImageDTO = {
      image_url: validMeasure.image_url,
      measure_value: validMeasure.measure_value,
      measure_uuid: validMeasure.measure_uuid,
    };
    const date_range = returnMonthRange(parsed_measure_datetime);
    const findParams: IFindByCodeDateRangeAndType = {
      costumer_code: validBody.costumer_code,
      date_range_start: date_range.start,
      date_range_end: date_range.end,
      measure_type: validBody.measure_type,
    };
    const imageName = returnImageName(validBody.costumer_code, validBody.measure_type);
    const imagePath = returnImagePath(imageName);

    aiService.readImage.mockResolvedValueOnce("00001");
    repository.findByCodeDateRangeAndType.mockResolvedValueOnce([]);
    repository.save.mockResolvedValueOnce(validMeasure);

    const result = await service.execute(validBody);
    expect(repository.findByCodeDateRangeAndType).toHaveBeenCalledWith(findParams);
    expect(aiService.readImage).toHaveBeenCalledWith(prompt, validBody.image);
    expect(fileService.saveFromBase64).toHaveBeenCalledWith(validBody.image, imagePath);
    expect(repository.save).toHaveBeenCalledWith(saveParams);
    expect(result).toEqual(expectedResponse);
  });
});
