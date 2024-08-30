import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import FileService from "../../../../src/services/file/index";
import { base64 } from "../../../mocks/base64";

describe("File Service", () => {
  let service: FileService;

  const _dirname = path.dirname(__filename);
  const tempDir = path.join(_dirname, "temp");
  const filePath = path.join(tempDir, "test.jpeg");
  const pdfContentBase64 = base64;

  beforeAll(async () => {
    service = new FileService();

    await fs.promises.mkdir(tempDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
    jest.clearAllMocks();
  });

  it("Should save file", () => {
    service.saveFromBase64(pdfContentBase64, filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    const savedPdfContent = fs.readFileSync(filePath, "base64");
    expect(savedPdfContent).toEqual(pdfContentBase64);
  });

  it("Should throw error if failed to save file", () => {
    const mockedError = new Error("Failed to write file");
    jest.spyOn(fs, "writeFileSync").mockImplementationOnce(() => {
      throw mockedError;
    });

    expect(() => service.saveFromBase64(pdfContentBase64, filePath)).toThrow(
      `Error in saveFromBase64: \n${mockedError}`
    );
  });

  it("Should delete file", () => {
    service.deleteFromPath(filePath);

    expect(fs.existsSync(filePath)).toBe(false);
  });

  it("Should throw error if failed to save file", () => {
    const mockedError = new Error("Failed to delete file");
    jest.spyOn(fs, "rmSync").mockImplementationOnce(() => {
      throw mockedError;
    });

    expect(() => service.deleteFromPath(filePath)).toThrow(
      `Error in deleteFromName: \n${mockedError}`
    );
  });
});
