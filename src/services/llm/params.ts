export interface ILLMService {
  readImage(prompt: string, imageBase64: string): Promise<string>;
}
