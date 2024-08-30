import IController from "..";
import UploadMeasurementService from "../../services/measurements/upload";

export default class UploadMeasurementController extends IController {
  constructor(service: UploadMeasurementService) {
    super(service);
  }
}
