import { GenerativeModel, GoogleGenerativeAI, Part } from "@google/generative-ai";
import gemini from "../../config/llm";
import { ILLMService } from "./params";


export class GeminiService implements ILLMService {
  private readonly generativeAi: GoogleGenerativeAI;
  private readonly model: GenerativeModel;

  constructor() {
    this.generativeAi = new GoogleGenerativeAI(gemini.apiKey!);
    this.model = this.generativeAi.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async readImage(prompt: string, imageBase64: string): Promise<string> {
    const imageData: Part = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/png",
      },
    };

    const generated = await this.model.generateContent([prompt, imageData]);
    return generated.response.text();
  }
}
