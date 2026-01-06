import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistant = async (issue: string, imageBase64?: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Error: Configura la API_KEY en las variables de entorno de Vercel.";
  }

  // Inicialización correcta según estándares
  const ai = new GoogleGenAI({ apiKey });
  
  const textPart = { 
    text: `Eres el experto técnico líder de Tecfone. 
    Tu objetivo es ayudar en el taller de reparaciones.
    Consulta técnica: "${issue}". 
    Instrucciones: Proporciona pasos detallados de microsoldadura o diagnóstico de software según corresponda. Sé breve pero muy técnico.`
  };

  const parts: any[] = [textPart];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts }]
    });
    
    return response.text || "No pude generar una respuesta técnica en este momento.";
  } catch (e: any) {
    console.error("Error en Gemini API:", e);
    return "Error de comunicación con el asistente IA. Revisa tu cuota de API.";
  }
};
