import React, { useState, useEffect } from 'react';
import { PartData, Language } from '../types';
import { getPartInsights, generatePartImage } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';

interface InfoPopupProps {
  part: PartData | null;
  onClose: () => void;
  lang: Language;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ part, onClose, lang }) => {
  const t = TRANSLATIONS[lang];
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [realImage, setRealImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    setAiInsight(null);
    setRealImage(null);
    setLoading(false);
    setImgLoading(false);
  }, [part]);

  const handleAskAI = async () => {
    if (!part) return;
    setLoading(true);
    const text = await getPartInsights(part.name, lang);
    setAiInsight(text);
    setLoading(false);
  };

  const handleViewRealLife = async () => {
    if (!part) return;
    setImgLoading(true);
    const imgData = await generatePartImage(part.name);
    setRealImage(imgData);
    setImgLoading(false);
  }

  if (!part) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-end md:pr-10 pointer-events-none">
      
      {/* Backdrop for mobile only to dismiss */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm md:hidden pointer-events-auto"
        onClick={onClose}
      />

      <div className="relative w-full md:w-[450px] max-h-[85vh] md:max-h-[90vh] bg-[#121212] border-t md:border border-gray-800 rounded-t-3xl md:rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col animate-slideUp transform transition-all">
        
        {/* Mobile Drag Handle */}
        <div className="w-full h-6 flex justify-center items-center md:hidden shrink-0" onClick={onClose}>
            <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar pb-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${part.type === 'ac' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {part.type === 'ac' ? 'AC COMPONENT' : 'ENGINE COMPONENT'}
                  </span>
                  <h2 className="text-3xl font-black mt-2 text-white leading-tight">{part.name}</h2>
              </div>
              <button 
                  onClick={onClose} 
                  className="hidden md:flex p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light">
              {part.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
               <button 
                  onClick={handleAskAI}
                  disabled={loading}
                  className="py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-white text-xs font-bold tracking-wide transition-all border border-gray-700 flex flex-col items-center justify-center gap-2 h-20"
                >
                  {loading ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                      <>
                        <SparklesIcon className="w-5 h-5 text-purple-400" />
                        <span>{t.getDiagnosis}</span>
                      </>
                  )}
                </button>

                <button 
                  onClick={handleViewRealLife}
                  disabled={imgLoading}
                  className="py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-white text-xs font-bold tracking-wide transition-all border border-gray-700 flex flex-col items-center justify-center gap-2 h-20 overflow-hidden relative"
                >
                   {imgLoading ? (
                       <div className="absolute inset-0 bg-gray-800 z-10 flex items-center justify-center flex-col">
                           <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-1"></div>
                           <span className="text-[9px] text-gray-500">{t.generatingImage}</span>
                       </div>
                   ) : (
                      <>
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-400">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                         </svg>
                         <span>{t.viewRealLife}</span>
                      </>
                   )}
                </button>
            </div>

            {/* Real Image Display */}
            {realImage && (
              <div className="mb-6 rounded-xl overflow-hidden border border-gray-700 bg-black animate-fadeIn relative group">
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">
                      AI GENERATED PREVIEW
                  </div>
                  <img src={realImage} alt="Real Life View" className="w-full h-48 object-cover" />
              </div>
            )}

            {/* AI Insight Text */}
            {aiInsight && (
              <div className="mb-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-4 text-sm text-gray-200 animate-fadeIn border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-3 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                      <SparklesIcon className="w-4 h-4" /> AI Diagnostics
                  </div>
                  <div className="whitespace-pre-line leading-relaxed text-xs md:text-sm font-light">
                      {aiInsight}
                  </div>
              </div>
            )}

            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {lang === 'ms' ? 'Masalah Umum' : 'Common Failures'}
                </h3>
                <ul className="space-y-3">
                    {part.commonProblems.map((prob, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-200">
                        <span className="text-red-500/50 mr-2 mt-1">⚠</span>
                        {prob}
                    </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.97 11.03a.75.75 0 11-1.06-1.06l1.06 1.06z" clipRule="evenodd" />
  </svg>
);