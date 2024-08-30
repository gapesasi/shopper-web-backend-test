import { z } from "zod";
import IService from "..";
import { ErrorCodeEnum } from "../../models/error-code-enum";
import { ConfirmSchema } from "../../schemas/zod-schemas";
import { IMeasurementsRepository } from "../../repositories/measurements/params";
import BadRequestError from "../../utils/error/bad-request-error";
import ConflictError from "../../utils/error/conflict-error";
import NotFoundError from "../../utils/error/not-found-error";

export const confirmSchema = z.object({
  measure_uuid: z.string().uuid(),
  confirmed_value: z.number(),
});

interface ResponseDTO {
  success: boolean;
}

export default class ConfirmMeasurementService implements IService<ConfirmSchema, ResponseDTO> {
  constructor(private readonly repository: IMeasurementsRepository) {}

  async execute(body: ConfirmSchema): Promise<ResponseDTO> {
    const schema = confirmSchema.safeParse(body);
    if (schema.success === false) {
      throw new BadRequestError(schema.error.message, ErrorCodeEnum.INVALID_DATA);
    }
    const { measure_uuid, confirmed_value } = schema.data;

    const find = await this.repository.findByUuid(measure_uuid);

    if (find === null) {
      throw new NotFoundError("Leitura do mês não encontrada", ErrorCodeEnum.MEASURE_NOT_FOUND);
    }

    if (find.has_confirmed) {
      throw new ConflictError("Leitura do mês já confirmada", ErrorCodeEnum.CONFIRMATION_DUPLICATE);
    }

    await this.repository.update({
      measure_uuid,
      measure_value: confirmed_value,
      has_confirmed: true,
    });

    return {
      success: true,
    };
  }
}
