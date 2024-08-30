import { HttpStatusCode } from "../../controllers/protocols";
import { ErrorCodeEnum } from "../../models/error-code-enum";

export default class BadRequestError extends Error {
  errorCode: ErrorCodeEnum;
  httpCode: HttpStatusCode;

  constructor(message: string, errorCode: ErrorCodeEnum) {
    super(message), (this.name = "BadRequestError");
    this.errorCode = errorCode;
    this.httpCode = HttpStatusCode.BAD_REQUEST;
  }
}
