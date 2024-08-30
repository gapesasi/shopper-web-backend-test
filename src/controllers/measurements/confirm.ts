import IController from "..";
import ConfirmMeasurementService from "../../services/measurements/confirm";

export default class ConfirmMeasurementController extends IController {
  constructor(service: ConfirmMeasurementService) {
    super(service);
  }
}
