import { HttpStatusCode } from "../../controllers/protocols";
import { ErrorCodeEnum } from "../../models/error-code-enum";

export default class ConflictError extends Error {
  errorCode: ErrorCodeEnum;
  httpCode: HttpStatusCode;

  constructor(message: string, errorCode: ErrorCodeEnum) {
    super(message), (this.name = "ConflictError");
    this.errorCode = errorCode;
    this.httpCode = HttpStatusCode.CONFLITCT;
  }
}
