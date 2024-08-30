import { join } from "path";
import app from "../../config/app";

export const returnImageName = (costumerCode: string, measureType: string) => {
  return `${costumerCode}-${measureType}.jpeg`;
};

export const returnImagePath = (imageName: string) => {
  const basePath = join(process.cwd(), "/src/0-saved");
  const imagePath = join(basePath, imageName);
  return imagePath;
};

export const returnImageUrl = (imageName: string) => {
  return `${app.serverUrl}:${app.port}/image/${imageName}`;
};
