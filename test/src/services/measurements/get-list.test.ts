import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { ErrorCodeEnum } from "../../../../src/models/error-code-enum";
import { MeasureTypeEnum } from "../../../../src/models/measure-type-enum";

import {
  IFindByCodeAndType,
  IMeasurementsRepository
} from "../../../../src/repositories/measurements/params";
import GetMeasurementsListService from "../../../../src/services/measurements/get-list";
import BadRequestError from "../../../../src/utils/error/bad-request-error";
import NotFoundError from "../../../../src/utils/error/not-found-error";
import { mock_measurements_repository } from "../../../mocks/mesurements-repo.mock";
import { GetListSchema } from "../../../../src/schemas/zod-schemas";
import { Measure } from "../../../../src/models/measure";

describe("Get List Measurements service Tests", () => {
  let repository: jest.Mocked<IMeasurementsRepository>;
  let service: GetMeasurementsListService;
  let validReq: GetListSchema = {
    costumer_code: "12345",
    measure_type: "water",
  };
  let validMeasure: Measure = {
    measure_uuid: "6ce7455c-ff45-4cad-bb4b-4430c84fb81f",
    measure_type: MeasureTypeEnum.WATER,
    costumer_code: "12345",
    measure_datetime: new Date(),
    image_url: "http://localhost:3000/image/12345-WATER.jpeg",
    measure_value: 0o0001,
    has_confirmed: false,
  };

  beforeAll(() => {
    repository = mock_measurements_repository;
    service = new GetMeasurementsListService(repository);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("Should return INVALID TYPE error if invalid measure_type is sent", async () => {
    const invalidReq: GetListSchema = { ...validReq, measure_type: "power" };

    await expect(service.execute(invalidReq)).rejects.toThrowError(
      new BadRequestError("Tipo de medição não permitida", ErrorCodeEnum.INVALID_TYPE)
    );
    expect(repository.findByCodeAndType).not.toHaveBeenCalled();
  });

  it("Should return MEASURES NOT FOUND error if no measure is found", async () => {
    repository.findByCodeAndType.mockResolvedValueOnce([]);

    await expect(service.execute(validReq)).rejects.toThrowError(
      new NotFoundError("Nenhuma leitura encontrada", ErrorCodeEnum.MEASURES_NOT_FOUND)
    );
  });

  it("Should successfully find measures if no type is sent", async () => {
    const noTypeReq: GetListSchema = { ...validReq, measure_type: undefined };
    const expectedResult = {
      costumer_code: noTypeReq.costumer_code,
      measures: [validMeasure],
    };

    repository.findByCodeAndType.mockResolvedValueOnce([validMeasure]);

    const result = await service.execute(noTypeReq);

    expect(repository.findByCodeAndType).toHaveBeenCalledWith(noTypeReq);
    expect(result).toEqual(expectedResult);
  });

  it("Should successfully find measures if undercase type is sent", async () => {
    const undercaseTypeReq: GetListSchema = { ...validReq, measure_type: "water" };
    const repoReq: IFindByCodeAndType = {
        costumer_code: validReq.costumer_code,
        measure_type: MeasureTypeEnum.WATER,
    }
    const expectedResult = {
      costumer_code: undercaseTypeReq.costumer_code,
      measures: [validMeasure],
    };

    repository.findByCodeAndType.mockResolvedValueOnce([validMeasure]);

    const result = await service.execute(undercaseTypeReq);

    expect(repository.findByCodeAndType).toHaveBeenCalledWith(repoReq);
    expect(result).toEqual(expectedResult);
  });

  it("Should successfully find measures if uppercase type is sent", async () => {
    const undercaseTypeReq: GetListSchema = { ...validReq, measure_type: "GAS" };
    const repoReq: IFindByCodeAndType = {
        costumer_code: validReq.costumer_code,
        measure_type: MeasureTypeEnum.GAS,
    }
    const expectedResult = {
      costumer_code: undercaseTypeReq.costumer_code,
      measures: [validMeasure],
    };

    repository.findByCodeAndType.mockResolvedValueOnce([validMeasure]);

    const result = await service.execute(undercaseTypeReq);

    expect(repository.findByCodeAndType).toHaveBeenCalledWith(repoReq);
    expect(result).toEqual(expectedResult);
  });
});
