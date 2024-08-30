import fs from "fs";
import { join } from "path";
import { z } from "zod";
import { ErrorCodeEnum } from "../../models/error-code-enum";
import BadRequestError from "../../utils/error/bad-request-error";
import IService from "..";
import { returnImagePath } from "../../utils/files/image";

const imageNameParam = z.string();

export default class ReturnImageService implements IService<string, string> {
  constructor() {}

  async execute(imageName: string): Promise<string> {
    const name = imageNameParam.safeParse(imageName);
    if (name.success === false) {
      throw new BadRequestError(name.error.message, ErrorCodeEnum.INVALID_DATA);
    }

    const imagePath = returnImagePath(name.data);

    return new Promise((resolve, reject) => {
      fs.stat(imagePath, (error, stat) => {
        if (error) {
          if (error.code === "ENOENT") {
            reject(new BadRequestError("Arquivo não encontrado.", ErrorCodeEnum.INVALID_DATA));
          } else {
            reject(new Error());
          }
        } else {
          resolve(imagePath);
        }
      });
    });
  }
}
