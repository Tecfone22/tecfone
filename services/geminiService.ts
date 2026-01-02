import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistant = async (issue: string, imageBase64?: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Error: No se ha configurado la API_KEY en Vercel.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const textPart = { 
    text: `Eres el experto técnico de Tecfone. 
    Analiza la siguiente consulta: "${issue}". 
    Proporciona un diagnóstico detallado y pasos técnicos para reparar el equipo. 
    Sé profesional y preciso.`
  };

  const contents = imageBase64 
    ? { parts: [textPart, { inlineData: { mimeType: "image/jpeg", data: imageBase64.split(',')[1] || imageBase64 } }] }
    : { parts: [textPart] };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents
    });
    
    return response.text || "Lo siento, no pude procesar el diagnóstico.";
  } catch (e: any) {
    console.error("Error en Gemini:", e);
    return "Error de comunicación con el asistente IA.";
  }
};