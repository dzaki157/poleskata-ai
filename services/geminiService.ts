import { GoogleGenAI } from "@google/genai";
import { ActionType } from "../types";

// Initialize Gemini Client
// We use process.env.API_KEY here. 
// In the Online Preview: This is injected automatically.
// In VS Code (Local): This is injected via vite.config.ts from your .env file.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a prompt based on the selected action type.
 */
const getPromptForAction = (text: string, action: ActionType): string => {
  switch (action) {
    case ActionType.FIX_GRAMMAR:
      return `Perbaiki tata bahasa, ejaan, dan tanda baca dari teks berikut ini agar sesuai dengan kaidah bahasa Indonesia yang baik dan benar (PUEBI). Jangan mengubah makna aslinya. Berikan hasilnya langsung tanpa pengantar:\n\n"${text}"`;
    
    case ActionType.MAKE_FORMAL:
      return `Ubah gaya bahasa teks berikut menjadi sangat profesional, sopan, dan formal (cocok untuk email bisnis atau surat resmi). Berikan hasilnya langsung:\n\n"${text}"`;
    
    case ActionType.MAKE_FRIENDLY:
      return `Ubah gaya bahasa teks berikut menjadi santai, ramah, dan akrab (cocok untuk chat WhatsApp ke teman atau caption media sosial). Gunakan bahasa gaul yang wajar jika perlu. Berikan hasilnya langsung:\n\n"${text}"`;
    
    case ActionType.SUMMARIZE:
      return `Buat ringkasan padat dan jelas dari teks berikut ini. Ambil poin-poin utamanya saja. Berikan hasilnya dalam format paragraf:\n\n"${text}"`;
    
    case ActionType.TRANSLATE_EN:
      return `Terjemahkan teks berikut ke dalam Bahasa Inggris yang natural dan idiomatik (bukan terjemahan kaku). Berikan hasilnya langsung:\n\n"${text}"`;
    
    default:
      return text;
  }
};

/**
 * Calls the Gemini API to process the text.
 */
export const processTextWithGemini = async (text: string, action: ActionType): Promise<string> => {
  try {
    const prompt = getPromptForAction(text, action);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using Flash for speed/efficiency on text tasks
      contents: prompt,
      config: {
        temperature: 0.7, // Slightly creative but grounded
        topK: 40,
        topP: 0.95,
      }
    });

    // Clean up any potential markdown quotes or extra whitespace
    let result = response.text || "";
    result = result.trim();
    
    // Remove wrapping quotes if Gemini adds them occasionally
    if (result.startsWith('"') && result.endsWith('"') && result.length > 2) {
      result = result.slice(1, -1);
    }

    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Maaf, terjadi kesalahan saat memproses teks. Pastikan API Key benar dan koneksi internet stabil.");
  }
};