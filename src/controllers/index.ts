import { RequestHandler } from "express";
import IService from "../services";
import handleError from "../utils/error/error-handler";
import { HttpStatusCode } from "./protocols";

export default class IController {
  constructor(protected readonly service: IService<any, any>) {}

  handle: RequestHandler = async (req, res) => {
    try {
      const response = await this.service.execute(req.body);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      return handleError(error, res);
    }
  };
}
