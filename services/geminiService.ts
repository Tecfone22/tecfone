import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistant = async (issue: string, imageBase64?: string) => {
  // En Vite/Vercel, usamos process.env.API_KEY si está definido en el config
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return "⚠️ Error: No se detectó la API_KEY. Asegúrate de configurarla en Vercel (Settings > Environment Variables) y hacer un 'Redeploy'.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const parts: any[] = [
      { text: `Eres el soporte técnico experto de Tecfone. 
               Resuelve esta duda técnica: "${issue}". 
               Da pasos claros, herramientas necesarias y precauciones. 
               Si hay una imagen, analízala buscando daños físicos o componentes quemados.` }
    ];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts }]
    });
    
    return response.text || "La IA no pudo procesar la respuesta.";
  } catch (e: any) {
    console.error("Gemini Error:", e);
    return "Lo siento, hubo un error conectando con la IA. Verifica tu conexión o los límites de la API.";
  }
};
