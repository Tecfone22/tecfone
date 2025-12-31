import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistant = async (issue: string, imageBase64?: string) => {
  // Inicialización usando la variable de entorno configurada en Vercel
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return "Error: No se encontró la API_KEY. Configúrala en las variables de entorno de Vercel.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const textPart = { 
    text: `Eres el experto técnico líder de Tecfone (Servicio Técnico de Celulares y Electrónica). 
    Analiza esta falla técnica: "${issue}". 
    Proporciona de forma estructurada:
    1. Diagnóstico presuntivo (qué piezas podrían estar fallando).
    2. Valores técnicos a medir (Voltajes en TP, líneas de datos, impedancias).
    3. Guía paso a paso para la reparación.
    Usa un lenguaje técnico, profesional y directo.`
  };

  const parts: any[] = [textPart];

  if (imageBase64) {
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts }
    });
    
    return response.text || "La IA no pudo generar una respuesta detallada. Por favor, describe la falla con más precisión.";
  } catch (e: any) {
    console.error("Error Gemini:", e);
    return "Error al conectar con el cerebro de IA. Verifica que tu API_KEY sea válida y tengas créditos disponibles en Google AI Studio.";
  }
};
