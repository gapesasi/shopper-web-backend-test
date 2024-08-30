import { MeasureTypeEnum } from "../../models/measure-type-enum";
import { Measure } from "../../models/measure";
import { GetListDTO } from "../../dtos/get-list-dto";

export interface IMeasurementsRepository {
  findByCodeDateRangeAndType(data: IFindByCodeDateRangeAndType): Promise<Measure[]>;
  save(data: ISaveMeasurementParams): Promise<Measure>;
  findByUuid(measure_uuid: string): Promise<Measure | null>;
  update(data: IUpdateMeasurementParams): Promise<void>;
  findByCodeAndType(data: IFindByCodeAndType): Promise<GetListDTO[]>;
}

export interface ISaveMeasurementParams extends Omit<Measure, "measure_uuid" | "has_confirmed"> {}
export interface IUpdateMeasurementParams
  extends Pick<Measure, "measure_uuid" | "measure_value" | "has_confirmed"> {}
export interface IFindByCodeDateRangeAndType
  extends Pick<Measure, "costumer_code" | "measure_type"> {
  date_range_start: Date;
  date_range_end: Date;
}
export interface IFindByCodeAndType {
  costumer_code: string;
  measure_type?: MeasureTypeEnum;
}
