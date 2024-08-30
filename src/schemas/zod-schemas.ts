import { z } from "zod";
import { uploadSchema } from "../services/measurements/upload";
import { confirmSchema } from "../services/measurements/confirm";
import { getListSchema } from "../services/measurements/get-list";

export type UploadImageSchema = z.infer<typeof uploadSchema>;
export type ConfirmSchema = z.infer<typeof confirmSchema>;
export type GetListSchema = z.infer<typeof getListSchema>;