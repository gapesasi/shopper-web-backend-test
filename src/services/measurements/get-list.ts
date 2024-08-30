import { z } from "zod";
import IService from "..";
import { GetListDTO } from "../../dtos/get-list-dto";
import { ErrorCodeEnum } from "../../models/error-code-enum";
import { MeasureTypeEnum } from "../../models/measure-type-enum";
import { IMeasurementsRepository } from "../../repositories/measurements/params";
import { GetListSchema } from "../../schemas/zod-schemas";
import BadRequestError from "../../utils/error/bad-request-error";
import NotFoundError from "../../utils/error/not-found-error";

export const getListSchema = z.object({
  costumer_code: z.string(),
  measure_type: z
    .string({
      invalid_type_error: "Tipo de medição não permitida",
    })
    .transform((val) => val.toUpperCase())
    .refine((value) => Object.values(MeasureTypeEnum).includes(value as MeasureTypeEnum), {
      message: "Tipo de medição não permitida",
    })
    .optional(),
});

interface ResponseDTO {
  costumer_code: string;
  measures: GetListDTO[];
}

export default class GetMeasurementsListService implements IService<GetListSchema, ResponseDTO> {
  constructor(private readonly repository: IMeasurementsRepository) {}

  async execute(body: GetListSchema): Promise<ResponseDTO> {
    const schema = getListSchema.safeParse(body);
    if (schema.success === false) {
      throw new BadRequestError("Tipo de medição não permitida", ErrorCodeEnum.INVALID_TYPE);
    }
    const { costumer_code, measure_type } = schema.data;

    const parsedType = measure_type
      ? MeasureTypeEnum[measure_type as keyof typeof MeasureTypeEnum]
      : undefined;

    const find = await this.repository.findByCodeAndType({
      costumer_code,
      measure_type: parsedType,
    });

    if (find.length === 0) {
      throw new NotFoundError("Nenhuma leitura encontrada", ErrorCodeEnum.MEASURES_NOT_FOUND);
    }

    return {
      costumer_code,
      measures: find,
    };
  }
}
