import { jest } from "@jest/globals";
import { IMeasurementsRepository } from "../../src/repositories/measurements/params";

export const mock_measurements_repository = { 
    findByUuid: jest.fn(),
    findByCodeDateRangeAndType: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findByCodeAndType: jest.fn(),
  } as jest.Mocked<IMeasurementsRepository>;