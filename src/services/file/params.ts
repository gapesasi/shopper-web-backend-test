export default interface IFileService {
  saveFromBase64(base64: string, path: string): void;
  deleteFromPath(path: string): void;
}
