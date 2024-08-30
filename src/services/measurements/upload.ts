import { z } from "zod";
import { ErrorCodeEnum } from "../../models/error-code-enum";
import { MeasureTypeEnum } from "../../models/measure-type-enum";
import { UploadImageDTO } from "../../dtos/upload-image-dto";
import { IMeasurementsRepository } from "../../repositories/measurements/params";
import BadRequestError from "../../utils/error/bad-request-error";
import ConflictError from "../../utils/error/conflict-error";
import { returnImageName, returnImagePath, returnImageUrl } from "../../utils/files/image";
import { returnPrompt } from "../../utils/prompt/return-prompt";
import { ILLMService } from "../llm/params";
import IFileService from "../file/params";
import IService from "..";
import { UploadImageSchema } from "../../schemas/zod-schemas";
import { parseStringToDateTime, returnMonthRange } from "../../utils/date/date";

const uploadTypeEnum = z.enum([MeasureTypeEnum.WATER, MeasureTypeEnum.GAS]);
export const uploadSchema = z.object({
  image: z.string().base64(),
  costumer_code: z.string(),
  measure_datetime: z.string().datetime(),
  measure_type: uploadTypeEnum,
});

export default class UploadMeasurementService
  implements IService<UploadImageSchema, UploadImageDTO>
{
  constructor(
    private readonly repository: IMeasurementsRepository,
    private readonly aiService: ILLMService,
    private readonly imageService: IFileService
  ) {}

  async execute(body: UploadImageSchema): Promise<UploadImageDTO> {
    const schema = uploadSchema.safeParse(body);
    if (schema.success === false) {
      throw new BadRequestError(schema.error.message, ErrorCodeEnum.INVALID_DATA);
    }
    const { measure_type, image, costumer_code, measure_datetime } = schema.data;

    const parsed_measure_datetime = parseStringToDateTime(measure_datetime);
    const date_range = returnMonthRange(parsed_measure_datetime);
    const find = await this.repository.findByCodeDateRangeAndType({
      costumer_code,
      date_range_start: date_range.start,
      date_range_end: date_range.end,
      measure_type,
    });

    if (find.length > 0) {
      throw new ConflictError("Leitura do mês já realizada", ErrorCodeEnum.DOUBLE_REPORT);
    }

    const prompt = returnPrompt(measure_type);

    const imageName = returnImageName(costumer_code, measure_type);
    const imagePath = returnImagePath(imageName);
    this.imageService.saveFromBase64(image, imagePath);

    const image_url = returnImageUrl(imageName);

    const res = await this.aiService.readImage(prompt, image);
    const measurement = Number.parseInt(res);

    const measure = await this.repository.save({
      measure_type,
      costumer_code,
      measure_datetime: parsed_measure_datetime,
      image_url,
      measure_value: measurement,
    });

    const response: UploadImageDTO = {
      image_url,
      measure_value: measurement,
      measure_uuid: measure.measure_uuid,
    };

    return response;
  }
}
