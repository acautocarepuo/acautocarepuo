import React from 'react';
import { Language } from '../types';

interface LanguageModalProps {
  onSelect: (lang: Language) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="text-center space-y-8 p-6 w-full max-w-2xl">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic drop-shadow-2xl">
                AI ENGINE <span className="text-cyan-500">HELPER</span>
            </h1>
            <p className="text-gray-200 text-sm tracking-[0.3em] uppercase font-bold text-shadow-sm">Interactive 3D Maintenance</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-10">
          <button 
            onClick={() => onSelect('en')}
            className="group relative px-8 py-6 bg-[#1a1a1a]/90 rounded-2xl border border-gray-600 hover:border-cyan-500 hover:bg-black transition-all duration-300 w-full md:w-64 text-left overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-bl-full group-hover:bg-cyan-500/20 transition-colors"></div>
            <span className="block text-xs text-gray-400 mb-1 font-bold">LANGUAGE</span>
            <span className="text-2xl font-bold text-white group-hover:text-cyan-400">English</span>
          </button>

          <button 
            onClick={() => onSelect('ms')}
            className="group relative px-8 py-6 bg-[#1a1a1a]/90 rounded-2xl border border-gray-600 hover:border-red-500 hover:bg-black transition-all duration-300 w-full md:w-64 text-left overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full group-hover:bg-red-500/20 transition-colors"></div>
            <span className="block text-xs text-gray-400 mb-1 font-bold">BAHASA</span>
            <span className="text-2xl font-bold text-white group-hover:text-red-400">Bahasa Melayu</span>
          </button>
        </div>
        
        <p className="text-xs text-gray-300 mt-8 font-semibold drop-shadow">Powered by HaxSytem</p>
      </div>
    </div>
  );
};