import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistant = async (issue: string, imageBase64?: string) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return "⚠️ Configuración incompleta: La API_KEY no está llegando a la aplicación. Realiza un 'Redeploy' en Vercel.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const textPart = { 
      text: `Eres el soporte técnico experto de Tecfone. 
      Analiza y responde de forma técnica pero concisa a: "${issue}". 
      Si hay una imagen, indica posibles fallas en componentes visibles.` 
    };

    const contents = imageBase64 ? [
      {
        parts: [
          textPart,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64
            }
          }
        ]
      }
    ] : [{ parts: [textPart] }];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents
    });
    
    return response.text || "No se pudo generar una respuesta técnica.";
  } catch (e: any) {
    console.error("Error en Gemini:", e);
    return "Error de conexión con el asistente. Verifica que tu API KEY sea válida y tenga cuota disponible.";
  }
};
