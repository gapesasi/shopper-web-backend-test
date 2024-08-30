import { ErrorCodeEnum } from "../models/error-code-enum";

export interface ResponseErrorDTO {
  error_code: ErrorCodeEnum;
  error_description: string;
}