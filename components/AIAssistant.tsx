
import React, { useState, useRef } from 'react';
import { Sparkles, Send, Camera, Loader2, Bot, HelpCircle, X } from 'lucide-react';
import { getGeminiAssistant } from '../Servicios/geminiService'; // S mayúscula para que funcione en tu GitHub

const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string, image?: string}[]>([
    { role: 'assistant', text: '¡Hola! Soy el asistente IA de Tecfone. Puedo ayudarte con protocolos de diagnóstico, microelectrónica o sugerencias de reparación. ¿En qué puedo ayudarte hoy?' }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!prompt && !image) return;

    const userMessage = { role: 'user' as const, text: prompt, image: image || undefined };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);
    
    const responseText = await getGeminiAssistant(prompt || "Analiza esta imagen para diagnóstico técnico", image || undefined);
    
    setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    setLoading(false);
    setImage(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-blue-600" />
            Asistente IA Tecfone
          </h2>
          <p className="text-slate-500">Diagnósticos avanzados y soporte técnico</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {msg.role === 'user' ? <HelpCircle size={16} className="text-white" /> : <Bot size={16} />}
                </div>
                <div className={`rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.image && (
                    <img src={msg.image} alt="Technical" className="w-full max-w-xs rounded-lg mb-3 shadow-md border-2 border-white" />
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start items-center gap-2 text-slate-400 p-4">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-sm font-medium">Analizando componentes...</span>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/50 space-y-4">
          {image && (
            <div className="relative inline-block">
              <img src={image} className="h-20 w-20 object-cover rounded-xl shadow-md border-2 border-white" alt="Preview" />
              <button 
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:bg-rose-600 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl hover:shadow-md transition-all active:scale-95"
            >
              <Camera size={22} />
            </button>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange} 
            />
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Pregunta algo técnico (ej. Falla de carga iPhone 13)..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={loading || (!prompt && !image)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition-colors shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span>Powered by Gemini 3</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <span>Especialista Tecfone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
