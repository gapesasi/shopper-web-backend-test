import { HttpStatusCode } from "../../controllers/protocols";
import { ErrorCodeEnum } from "../../models/error-code-enum";

export default class NotFoundError extends Error {
  errorCode: ErrorCodeEnum;
  httpCode: HttpStatusCode;

  constructor(message: string, errorCode: ErrorCodeEnum) {
    super(message), (this.name = "NotFoundError");
    this.errorCode = errorCode;
    this.httpCode = HttpStatusCode.NOT_FOUND;
  }
}
