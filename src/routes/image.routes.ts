import { Router } from "express";
import ReturnImageService from "../services/image/return";
import ReturnImageController from "../controllers/image/return-image";

const router = Router();

const returnImageService = new ReturnImageService();
const imageController = new ReturnImageController(returnImageService);

router.get("/:name", imageController.handle.bind(imageController));

export default router;