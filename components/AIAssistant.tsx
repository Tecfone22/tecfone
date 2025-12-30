
import React, { useState, useRef } from 'react';
import { Sparkles, Send, Camera, Loader2, Bot, HelpCircle, X } from 'lucide-react';
import { getGeminiAssistant } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string, image?: string}[]>([
    { role: 'assistant', text: '¡Hola! Soy el asistente experto de Tecfone. Puedo ayudarte con diagramas, valores de voltajes o protocolos de microsoldadura. ¿Qué equipo estamos revisando?' }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!prompt && !image) return;

    const userMessage = { role: 'user' as const, text: prompt, image: image || undefined };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);
    
    try {
      const responseText = await getGeminiAssistant(prompt || "Analiza esta imagen técnica", image || undefined);
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Lo siento, hubo un error de conexión. Verifica tu API_KEY en Vercel." }]);
    } finally {
      setLoading(false);
      setImage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl"><Sparkles className="text-blue-600" /></div>
          Asistente IA Tecfone
        </h2>
        <p className="text-slate-500 font-medium">Soporte técnico avanzado con Inteligencia Artificial</p>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {msg.role === 'user' ? <HelpCircle size={20} /> : <Bot size={20} />}
                </div>
                <div className={`rounded-3xl p-5 shadow-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.image && (
                    <img src={msg.image} alt="Ref" className="w-full max-w-sm rounded-2xl mb-4 border-4 border-white shadow-md" />
                  )}
                  <p className="text-sm md:text-base whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start items-center gap-3 text-slate-400 p-4">
              <Loader2 className="animate-spin text-blue-600" size={24} />
              <span className="text-sm font-bold italic tracking-tight">Consultando manuales de servicio...</span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 border-t bg-slate-50/50 space-y-4">
          {image && (
            <div className="relative inline-block group">
              <img src={image} className="h-24 w-24 object-cover rounded-2xl border-4 border-white shadow-xl" alt="" />
              <button 
                onClick={() => setImage(null)}
                className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
              title="Adjuntar foto de placa o falla"
            >
              <Camera size={24} />
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Describe la falla o pregunta un valor técnico..."
                className="w-full pl-6 pr-14 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={loading || (!prompt && !image)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-lg active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
            <span>Powered by Gemini 3</span>
            <span className="w-1.5 h-1.5 bg-blue-200 rounded-full"></span>
            <span>Tecfone Intelligence Unit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
