import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { ErrorCodeEnum } from "../../../../src/models/error-code-enum";
import { MeasureTypeEnum } from "../../../../src/models/measure-type-enum";

import {
  IMeasurementsRepository,
  IUpdateMeasurementParams,
} from "../../../../src/repositories/measurements/params";
import ConfirmMeasurementService from "../../../../src/services/measurements/confirm";
import BadRequestError from "../../../../src/utils/error/bad-request-error";
import ConflictError from "../../../../src/utils/error/conflict-error";
import NotFoundError from "../../../../src/utils/error/not-found-error";
import { mock_measurements_repository } from "../../../mocks/mesurements-repo.mock";
import { ConfirmSchema } from "../../../../src/schemas/zod-schemas";
import { Measure } from "../../../../src/models/measure";

describe("Confirm Measurements service Tests", () => {
  let repository: jest.Mocked<IMeasurementsRepository>;
  let service: ConfirmMeasurementService;
  let validBody: ConfirmSchema = {
    measure_uuid: "6ce7455c-ff45-4cad-bb4b-4430c84fb81f",
    confirmed_value: 0o0001,
  };
  let validMeasure: Measure = {
    measure_uuid: "6ce7455c-ff45-4cad-bb4b-4430c84fb81f",
    measure_type: MeasureTypeEnum.WATER,
    costumer_code: "12345",
    measure_datetime: new Date(),
    image_url: "http://localhost:3000/saved/12345-WATER.jpeg",
    measure_value: 0o0001,
    has_confirmed: false,
  };

  beforeAll(() => {
    repository = mock_measurements_repository;
    service = new ConfirmMeasurementService(repository);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("Should return INVALID DATA error if invalid body is sent", async () => {
    const invalidBody: ConfirmSchema = { ...validBody, measure_uuid: "1" };
    expect.assertions(4);
    try {
      await service.execute(invalidBody);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      const e = error as BadRequestError;
      expect(e.errorCode).toBe(ErrorCodeEnum.INVALID_DATA);
      expect(repository.findByUuid).not.toHaveBeenCalled();
      expect(repository.update).not.toHaveBeenCalled();
    }
  });

  it("Should return MEASURE NOT FOUND error if a measure with the same uuid is not found", async () => {
    repository.findByUuid.mockResolvedValueOnce(null);

    await expect(service.execute(validBody)).rejects.toThrowError(
      new NotFoundError("Leitura do mês não encontrada", ErrorCodeEnum.MEASURE_NOT_FOUND)
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("Should return CONFIRMATION DUPLICATE error if a the measure is already confirmed", async () => {
    const confirmedMeasure: Measure = {
      ...validMeasure,
      has_confirmed: true,
    };

    repository.findByUuid.mockResolvedValueOnce(confirmedMeasure);

    await expect(service.execute(validBody)).rejects.toThrowError(
      new ConflictError("Leitura do mês já confirmada", ErrorCodeEnum.CONFIRMATION_DUPLICATE)
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("Should update and confirm the measure if valid body is sent and the measure is not already confirmed", async () => {
    const updateParams: IUpdateMeasurementParams = {
      measure_uuid: validBody.measure_uuid,
      measure_value: validBody.confirmed_value,
      has_confirmed: true,
    };

    repository.findByUuid.mockResolvedValueOnce(validMeasure);
    repository.update.mockResolvedValueOnce();

    const result = await service.execute(validBody);
    expect(repository.findByUuid).toHaveBeenCalledWith(validBody.measure_uuid);
    expect(repository.update).toHaveBeenCalledWith(updateParams);
    expect(result).toEqual({
      success: true,
    });
  });
});
