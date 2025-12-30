import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistant = async (issue: string, imageBase64?: string) => {
  // Inicialización limpia usando la variable de entorno de Vercel
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const textPart = { 
    text: `Eres el experto técnico líder de Tecfone. 
    Analiza este problema de servicio técnico: ${issue}. 
    Proporciona:
    1. Diagnóstico presuntivo detallado.
    2. Mediciones clave (Voltajes, líneas de datos) a revisar.
    3. Solución técnica recomendada.
    Sé profesional, directo y muy técnico.`
  };

  const parts: any[] = [textPart];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(',')[1]
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts }
    });
    
    return response.text || "No se pudo generar una respuesta técnica. Intenta describir mejor la falla.";
  } catch (e: any) {
    console.error("Error Assistant:", e);
    return "Error de conexión o API KEY inválida. Por favor, revisa la configuración en Vercel.";
  }
};
