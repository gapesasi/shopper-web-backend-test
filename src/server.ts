import express, { Request, Response } from "express";
import appConfig from "./config/app";
import router from "./routes";
import handleError from "./utils/error/error-handler";
import BadRequestError from "./utils/error/bad-request-error";
import { ErrorCodeEnum } from "./models/error-code-enum";
import cors from "cors"

const server = express();

const corsOptions = {
  origin: "*",
  methods: "GET,PATCH,POST",
};
server.use(cors(corsOptions));

//Limit here is needed to avoid the error "Payload Too Large" when sending a big image
server.use(express.json({ limit: "10mb" }));

server.use(router);

server.use((req, res, next) => {
  const error = new BadRequestError("Route not found", ErrorCodeEnum.ROUTE_NOT_FOUND);
  next(error);
});

server.use((error: any, req: Request, res: Response) => {
  return handleError(error, res);
});

const port = appConfig.port;
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
