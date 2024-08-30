import { Router } from "express";
import * as swaggerDocument from "../swagger.json";
import swaggerUi from "swagger-ui-express";

const router = Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;