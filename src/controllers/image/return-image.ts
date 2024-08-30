import { RequestHandler } from "express";
import ReturnImageService from "../../services/image/return";
import handleError from "../../utils/error/error-handler";
import { HttpStatusCode } from "../protocols";
import IController from "..";

export default class ReturnImageController extends IController {
  constructor(service: ReturnImageService) {
    super(service);
  }

  handle: RequestHandler = async (req, res) => {
    try {
      const response = await this.service.execute(req.params.name);
      return res.status(HttpStatusCode.OK).sendFile(response);
    } catch (error) {
      return handleError(error, res);
    }
  };
}
