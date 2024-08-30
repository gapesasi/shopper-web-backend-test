import { Router } from "express";
import docsRouter from "./docs.routes";
import imageRouter from "./image.routes";
import measurementRouter from "./measurements.routes";

const router = Router()

router.use("/", measurementRouter);
router.use("/image/", imageRouter);
router.use("/docs", docsRouter);

export default router;
