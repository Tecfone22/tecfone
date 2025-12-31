import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistant = async (issue: string, imageBase64?: string) => {
  // En Vercel, process.env.API_KEY se inyecta automáticamente si la configuraste en el panel.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const textPart = { 
    text: `Eres el experto técnico de Tecfone, un servicio técnico profesional. 
    Analiza la siguiente consulta: "${issue}". 
    Proporciona un diagnóstico detallado, posibles componentes fallidos y pasos a seguir. 
    Sé muy técnico pero claro.`
  };

  const parts: any[] = [textPart];

  if (imageBase64) {
    const data = imageBase64.split(',')[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts }
    });
    
    return response.text || "Lo siento, no pude generar una respuesta técnica en este momento.";
  } catch (e: any) {
    console.error("Error en Gemini:", e);
    return "Error de conexión con el asistente IA. Verifica la configuración de la API Key.";
  }
};