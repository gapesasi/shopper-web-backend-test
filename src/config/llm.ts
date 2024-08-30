import dotEnv from "dotenv";
dotEnv.config();

export default {
  apiKey: process.env.GEMINI_API_KEY,
};
