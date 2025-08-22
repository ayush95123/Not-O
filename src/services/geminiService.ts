import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function summarizeText(content: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize the following text clearly and concisely:\n\n${content}`,
      config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    }
    });

    return response.text;
  } catch (error: any) {
    throw new Error(error.message || "Failed to summarize text");
  }
}

// export async function askGemini(prompt: string) {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent(prompt);

//     return result.response.text();
//   } catch (error: any) {
//     throw new Error(error.message || "Gemini request failed");
//   }
// }
