import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DesignAnalysis {
  fonts: string[];
  shapes: string[];
  description: string;
}

export async function analyzeDesign(base64Image: string, mimeType: string): Promise<DesignAnalysis> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this graphic design image. 
    Identify:
    1. The most likely fonts used (or very similar ones if exact cannot be determined).
    2. The key shapes and design elements (e.g., geometric, organic, specific icons, layout structures).
    3. A professional and detailed description of the design, its mood, and its target audience.
    
    Return the result in JSON format with the following structure:
    {
      "fonts": ["Font 1", "Font 2"],
      "shapes": ["Shape 1", "Shape 2"],
      "description": "Detailed description here..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fonts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            shapes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            description: { type: Type.STRING },
          },
          required: ["fonts", "shapes", "description"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as DesignAnalysis;
  } catch (error) {
    console.error("Error analyzing design:", error);
    throw new Error("Failed to analyze design. Please try again.");
  }
}
