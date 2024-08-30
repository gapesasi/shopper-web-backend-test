import fs from "fs";
import IFileService from "./params";

export default class FileService implements IFileService {
  saveFromBase64 = (base64: string, path: string) => {
    try {
      const buffer = Buffer.from(base64, "base64");
      fs.writeFileSync(path, buffer);
    } catch (error: any) {
      throw new Error(`Error in saveFromBase64: \n${error}`);
    }
  };

  deleteFromPath = (path: string) => {
    try {
      fs.rmSync(path);
    } catch (error) {
      throw new Error(`Error in deleteFromName: \n${error}`);
    }
  };
}
