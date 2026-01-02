import React, { useState, useRef } from 'react';
import { Sparkles, Send, Camera, Loader2, Bot, HelpCircle, X } from 'lucide-react';
import { getGeminiAssistant } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string, image?: string}[]>([
    { role: 'assistant', text: '¡Hola! Soy el asistente IA de Tecfone. Puedo ayudarte con protocolos de diagnóstico o microelectrónica. ¿Qué equipo estamos revisando?' }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!prompt && !image) return;

    const userMessage = { role: 'user' as const, text: prompt, image: image || undefined };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);
    
    try {
      const responseText = await getGeminiAssistant(prompt || "Analiza esta imagen para diagnóstico técnico", image || undefined);
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Lo siento, hubo un error al procesar tu consulta técnica." }]);
    } finally {
      setLoading(false);
      setImage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col gap-6 animate-in fade-in duration-700">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-blue-600" />
          Asistente IA Tecfone
        </h2>
        <p className="text-slate-500">Soporte técnico avanzado</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-100'
                }`}>
                  {msg.role === 'user' ? <HelpCircle size={16} className="text-white" /> : <Bot size={16} />}
                </div>
                <div className={`rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.image && <img src={msg.image} className="max-w-xs rounded-lg mb-3" alt="Preview" />}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 p-4">
              <Loader2 className="animate-spin" size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Consultando base de datos técnica...</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-slate-50/50 space-y-4">
          {image && (
            <div className="relative inline-block">
              <img src={image} className="h-20 w-20 object-cover rounded-xl border-2 border-white shadow-sm" alt="Preview" />
              <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1"><X size={12} /></button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"><Camera size={20} /></button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <input 
              type="text" 
              placeholder="Escribe tu consulta técnica..." 
              className="flex-1 p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={loading || (!prompt && !image)} className="p-3 bg-blue-600 text-white rounded-xl disabled:bg-slate-300 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"><Send size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIAssistant;