import { Measure } from "../models/measure";

export interface GetListDTO extends Omit<Measure, "costumer_code"> {}