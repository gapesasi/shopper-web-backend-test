import { PrismaClient } from "@prisma/client";
import { Measure } from "../../models/measure";
import {
  IFindByCodeAndType,
  IFindByCodeDateRangeAndType,
  IMeasurementsRepository,
  ISaveMeasurementParams,
  IUpdateMeasurementParams,
} from "./params";

export class PrismaMeasurementsRepository implements IMeasurementsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUuid(measure_uuid: string): Promise<Measure | null> {
    return await this.prisma.measures.findUnique({
      where: {
        measure_uuid,
      },
    });
  }

  async findByCodeDateRangeAndType(data: IFindByCodeDateRangeAndType): Promise<Measure[]> {
    return await this.prisma.measures.findMany({
      where: {
        AND: {
          costumer_code: data.costumer_code,
          measure_datetime: {
            lte: data.date_range_end,
            gte: data.date_range_start,
          },
          measure_type: data.measure_type,
        },
      },
    });
  }

  async findByCodeAndType(data: IFindByCodeAndType): Promise<Measure[]> {
    return await this.prisma.measures.findMany({
      where: {
        costumer_code: data.costumer_code,
        measure_type: data.measure_type,
      },
    });
  }

  async update(data: IUpdateMeasurementParams): Promise<void> {
    await this.prisma.measures.update({
      where: {
        measure_uuid: data.measure_uuid,
      },
      data: {
        measure_value: data.measure_value,
        has_confirmed: data.has_confirmed,
      },
    });
  }

  async save(data: ISaveMeasurementParams): Promise<Measure> {
    return await this.prisma.measures.create({
      data,
    });
  }
}
