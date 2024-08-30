import { Response } from "express";
import BadRequestError from "./bad-request-error";
import { ResponseErrorDTO } from "../../dtos/response-error-dto";
import { HttpStatusCode } from "../../controllers/protocols";
import { ErrorCodeEnum } from "../../models/error-code-enum";
import ConflictError from "./conflict-error";
import NotFoundError from "./not-found-error";

export default function handleError(error: any, res: Response): Response<ResponseErrorDTO> {
  if (
    error instanceof BadRequestError ||
    error instanceof ConflictError ||
    error instanceof NotFoundError
  ) {
    return res.status(error.httpCode).json({
      error_code: error.errorCode,
      error_description: error.message,
    });
  }
  
  return res.status(HttpStatusCode.SERVER_ERROR).json({
    error_code: ErrorCodeEnum.SERVER_ERROR,
    error_description: error.message,
  });
}
