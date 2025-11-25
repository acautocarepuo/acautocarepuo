import React, { useState, useRef, useEffect } from 'react';
import { AppMode, Language, ChatMessage } from '../types';
import { TRANSLATIONS, COMMON_ISSUES } from '../constants';
import { chatWithGemini } from '../services/geminiService';

interface FeaturesOverlayProps {
  mode: AppMode;
  lang: Language;
  onClose: () => void;
}

export const FeaturesOverlay: React.FC<FeaturesOverlayProps> = ({ mode, lang, onClose }) => {
  const t = TRANSLATIONS[lang];
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, mode]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    
    setLoading(true);
    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    const response = await chatWithGemini(text, messages, lang);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage(chatInput);
  };

  if (mode === '3D') return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-10 pointer-events-none">
      <div className="w-full max-w-lg h-[60vh] md:h-[70vh] bg-[#121212]/95 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-slideUp">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {mode === 'ISSUES' ? (
                <>
                   <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                   {t.issuesTitle}
                </>
            ) : (
                <>
                   <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
                   {t.chatTitle}
                </>
            )}
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Issues */}
        {mode === 'ISSUES' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            <p className="text-gray-400 text-sm mb-4">{t.tapToAsk}</p>
            {COMMON_ISSUES.map((issue) => (
              <button 
                key={issue.id}
                onClick={() => handleSendMessage(lang === 'ms' ? `Masalah: ${issue.ms}. Apakah puncanya dan cara baiki?` : `Problem: ${issue.en}. What are the causes and solutions?`)}
                className="w-full p-4 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 hover:border-orange-500 rounded-xl text-left transition-all group"
              >
                <div className="flex justify-between items-center">
                    <span className="text-gray-200 font-semibold group-hover:text-white">{lang === 'ms' ? issue.ms : issue.en}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-500 group-hover:text-orange-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
              </button>
            ))}
            
            {/* Show Chat results if triggered from issues */}
            {messages.length > 0 && (
                 <div className="mt-6 pt-6 border-t border-gray-800">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Analysis Result</h3>
                    {messages.filter(m => m.role === 'model').slice(-1).map((msg, idx) => (
                        <div key={idx} className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl text-sm text-gray-200">
                            {msg.text}
                        </div>
                    ))}
                 </div>
            )}
          </div>
        )}

        {/* Content - Chat */}
        {mode === 'CHAT' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                        <p>{lang === 'ms' ? 'Tanya mekanik AI anda...' : 'Ask your AI mechanic...'}</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none flex gap-1">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-black/20 border-t border-gray-800">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.chatPlaceholder}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button 
                        onClick={() => handleSendMessage(chatInput)}
                        disabled={loading}
                        className="p-3 bg-cyan-600 rounded-full text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
