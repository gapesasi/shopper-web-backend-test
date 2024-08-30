import dotEnv from "dotenv";
dotEnv.config();

export default {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || "production",
  serverUrl: process.env.SERVER_URL || "http://localhost",
};
