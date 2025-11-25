import React from 'react';
import { AppMode, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavBarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  lang: Language;
}

export const NavBar: React.FC<NavBarProps> = ({ currentMode, setMode, lang }) => {
  const t = TRANSLATIONS[lang];

  const NavItem = ({ mode, icon, label }: { mode: AppMode; icon: React.ReactNode; label: string }) => {
    const isActive = currentMode === mode;
    return (
      <button 
        onClick={() => setMode(mode)}
        className={`flex flex-col items-center justify-center w-full py-3 transition-all duration-300 relative ${isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
      >
        {isActive && (
            <div className="absolute -top-1 w-8 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
        )}
        <div className={`transform transition-transform ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
            {icon}
        </div>
        <span className="text-[10px] font-bold mt-1 tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <div className="absolute bottom-6 left-6 right-6 z-40">
      <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex justify-around items-center px-2 max-w-md mx-auto overflow-hidden">
        
        <NavItem 
          mode="3D" 
          label={t.nav3D}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          } 
        />
        
        <div className="w-px h-8 bg-white/10"></div>

        <NavItem 
          mode="ISSUES" 
          label={t.navIssues}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          } 
        />

        <div className="w-px h-8 bg-white/10"></div>

        <NavItem 
          mode="CHAT" 
          label={t.navAI}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          } 
        />

      </div>
    </div>
  );
};