import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const apiKey = process.env.API_KEY || '';

const getClient = () => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export const getPartInsights = async (partName: string, lang: Language): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key missing.";

  try {
    const prompt = lang === 'ms' 
      ? `Berikan ringkasan teknikal ringkas untuk pemilik kereta tentang "${partName}". Fokus pada sistem Aircond jika relevan. Sertakan: 1. Fungsi Utama. 2. Tanda kerosakan biasa. 3. Anggaran hayat komponen. Bawah 150 patah perkataan. Format bullet points.`
      : `Provide a concise technical summary for a car owner about the "${partName}". Focus on AC relevance if applicable. Includes: 1. Main Function. 2. Common failure signs. 3. Typical lifespan. Keep it under 150 words. Format as simple text with bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI.";
  }
};

export const generatePartImage = async (partName: string): Promise<string | null> => {
  const ai = getClient();
  if (!ai) return null;

  try {
    // Using gemini-2.5-flash-image for image generation as per mapping guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Generate a realistic, high-quality, white-background educational product photograph of a car part: ${partName}. It should look like a real car part.` }
        ]
      }
    });

    // Check for image in response parts
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const chatWithGemini = async (message: string, history: any[], lang: Language): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key missing.";

  try {
    const systemInstruction = lang === 'ms'
      ? "Anda adalah pakar sistem Aircond dan Enjin Kereta yang berpengalaman untuk semua jenis kereta. Jawab soalan pengguna dengan fokus teknikal tapi mudah difahami. Berikan keutamaan pada penyelesaian masalah aircond."
      : "You are an expert Car HVAC (Air Conditioning) and Engine specialist for all vehicle makes and models. Answer user questions with technical accuracy but easy to understand language. Prioritize AC troubleshooting.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text || (lang === 'ms' ? "Maaf, saya tidak dapat menjawab." : "Sorry, I couldn't answer that.");
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Connection error.";
  }
};