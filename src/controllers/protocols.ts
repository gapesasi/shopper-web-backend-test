export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLITCT = 409,
  SERVER_ERROR = 500,
}

export interface HttpResponse<T> {
  status_code: HttpStatusCode;
  body: T;
}

export interface HttpRequest<B> {
  params?: any;
  query?: any;
  body?: B;
}
