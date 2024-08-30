import { RequestHandler } from "express";
import IController from "..";
import GetMeasurementsListService from "../../services/measurements/get-list";
import handleError from "../../utils/error/error-handler";
import { HttpStatusCode } from "../protocols";

export default class GetListController extends IController {
  constructor(service: GetMeasurementsListService) {
    super(service);
  }

  handle: RequestHandler = async (req, res) => {
    try {
      const response = await this.service.execute({
        costumer_code: req.params.costumer_code,
        measure_type: req.query.measure_type,
      });
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      return handleError(error, res);
    }
  };
}
