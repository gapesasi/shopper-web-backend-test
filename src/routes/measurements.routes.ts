import { Router } from "express";
import ConfirmMeasurementController from "../controllers/measurements/confirm";
import GetListController from "../controllers/measurements/get-list";
import UploadMeasurementController from "../controllers/measurements/upload";
import prisma from "../db";
import { PrismaMeasurementsRepository } from "../repositories/measurements/prisma-repository";
import FileService from "../services/file";
import { GeminiService } from "../services/llm";
import ConfirmMeasurementService from "../services/measurements/confirm";
import GetMeasurementsListService from "../services/measurements/get-list";
import UploadMeasurementService from "../services/measurements/upload";

const router = Router();

const repository = new PrismaMeasurementsRepository(prisma);
const aiService = new GeminiService();
const imageService = new FileService();
const uploadService = new UploadMeasurementService(repository, aiService, imageService);
const uploadController = new UploadMeasurementController(uploadService);

const confirmService = new ConfirmMeasurementService(repository);
const confirmController = new ConfirmMeasurementController(confirmService);

const getListService = new GetMeasurementsListService(repository);
const getListController = new GetListController(getListService);

router.post("/upload", uploadController.handle.bind(uploadController));
router.patch("/confirm", confirmController.handle.bind(confirmController));
router.get("/:costumer_code/list", getListController.handle.bind(getListController));

export default router;
