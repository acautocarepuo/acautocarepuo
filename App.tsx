import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ViewState, PartData, Language, AppMode } from './types';
import { VIEW_CONFIGS, TRANSLATIONS } from './constants';
import { Car } from './components/Car';
import { EngineBay } from './components/EngineBay';
import { InfoPopup } from './components/InfoPopup';
import { LanguageModal } from './components/LanguageModal';
import { NavBar } from './components/NavBar';
import { FeaturesOverlay } from './components/FeaturesOverlay';

// Simple Loader Component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-48">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-cyan-400 font-mono text-sm tracking-widest">{progress.toFixed(0)}% LOADING</div>
      </div>
    </Html>
  );
}

// Camera Controller Component
const CameraController: React.FC<{ view: ViewState; controlsRef: React.RefObject<any> }> = ({ view, controlsRef }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Safety check: ensure controls exist before trying to access properties
    const controls = controlsRef.current;
    if (!controls) return;

    const targetConfig = VIEW_CONFIGS[view];
    if (targetConfig) {
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(...targetConfig.position);
      
      // Safe access to target
      const startTarget = controls.target ? controls.target.clone() : new THREE.Vector3(0, 0, 0);
      const endTarget = new THREE.Vector3(...targetConfig.target);
      
      let progress = 0;
      const duration = 1200; // ms
      let animationFrameId: number;
      const startTime = performance.now();
      
      const animate = (time: number) => {
        const elapsed = time - startTime;
        progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        
        camera.position.lerpVectors(startPos, endPos, ease);
        
        // Safe update of target
        if (controls.target) {
          controls.target.lerpVectors(startTarget, endTarget, ease);
          controls.update();
        }
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
    }
  }, [view, camera, controlsRef]);

  return null;
};

export default function App() {
  const [lang, setLang] = useState<Language | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('3D');
  const [view, setView] = useState<ViewState>('EXTERIOR');
  const [selectedPart, setSelectedPart] = useState<PartData | null>(null);
  const controlsRef = useRef<any>(null);

  const handleOpenHood = () => setView('ENGINE');
  const handleEnterAC = () => setView('AC_SYSTEM');
  const handleBack = () => {
    setSelectedPart(null);
    if (view === 'AC_SYSTEM') setView('ENGINE');
    else if (view === 'ENGINE') setView('EXTERIOR');
  };

  const handleModeChange = (mode: AppMode) => {
    setAppMode(mode);
    // If exiting 3D mode, we might want to reset or pause interactions, 
    // but keeping the 3D BG active looks cooler.
    if (mode === '3D') {
      setSelectedPart(null);
    }
  };

  const t = lang ? TRANSLATIONS[lang] : TRANSLATIONS['en']; // Default for background render

  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden font-sans select-none">
      
      {/* 3D Scene - Always Rendered for background effect */}
      <div className={`absolute inset-0 z-0 transition-all duration-500 ${appMode !== '3D' || !lang ? 'blur-sm opacity-50 scale-105' : 'blur-0 opacity-100 scale-100'}`}>
        <Canvas shadows className="w-full h-full" dpr={[1, 2]}>
          <PerspectiveCamera makeDefault fov={45} position={[8, 5, 8]} />
          <CameraController view={view} controlsRef={controlsRef} />
          
          <OrbitControls 
            ref={controlsRef}
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2 - 0.05}
            enablePan={false}
            maxDistance={20}
            minDistance={1}
            dampingFactor={0.05}
            // Disable interaction if not in 3D mode or Language Modal is open
            enabled={appMode === '3D' && !selectedPart && !!lang}
            autoRotate={!lang} // Auto rotate on language selection screen for effect
            autoRotateSpeed={0.5}
          />
          
          <Suspense fallback={<Loader />}>
            {/* Ambient Light for base visibility */}
            <ambientLight intensity={0.5} />
            
            {/* Main Key Light */}
            <spotLight 
              position={[5, 10, 5]} 
              angle={0.5} 
              penumbra={1} 
              intensity={2} 
              castShadow 
              shadow-bias={-0.0001}
            />
            
            {/* Fill Light (Cyan tinted) */}
            <spotLight position={[-5, 5, 5]} intensity={1.5} color="#4fd1c5" />
            
            {/* Rim Light (Red tinted) */}
            <spotLight position={[5, 2, -5]} intensity={1} color="#f00" />

            <Environment preset="city" />
            
            <group position={[0, -0.5, 0]}>
              <Car view={view} onOpenHood={handleOpenHood} />
              <EngineBay 
                view={view} 
                onSelectPart={(part) => {
                  if (appMode === '3D' && lang) setSelectedPart(part);
                }} 
                onEnterAC={handleEnterAC} 
              />
              <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.6} far={10} color="#000000" />
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* Language Modal Overlay */}
      {!lang && <LanguageModal onSelect={setLang} />}

      {/* Main UI Overlay (Header & Back Button) - Only visible in 3D mode when lang selected */}
      {lang && (
        <div className={`absolute top-0 left-0 w-full p-6 z-10 pointer-events-none flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent h-32 transition-opacity duration-300 ${appMode !== '3D' ? 'opacity-0' : 'opacity-100'}`}>
          <div>
             <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter drop-shadow-lg">
               AI ENGINE <span className="text-cyan-500">HELPER</span>
             </h1>
             <p className="text-gray-400 text-xs md:text-sm mt-1 uppercase tracking-widest font-semibold">{t.subtitle}</p>
          </div>
          
          {view !== 'EXTERIOR' && (
            <button 
              onClick={handleBack}
              className="pointer-events-auto bg-white/5 hover:bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.back}
            </button>
          )}
        </div>
      )}

      {/* Breadcrumb / Current Mode Indicator */}
      {lang && appMode === '3D' && (
        <div className="absolute top-24 left-6 z-10 pointer-events-none hidden md:block">
            <div className="flex flex-col gap-1">
              <div className={`text-xs font-bold transition-all duration-300 ${view === 'EXTERIOR' ? 'text-cyan-400 scale-110 origin-left' : 'text-gray-600'}`}>EXTERIOR</div>
              <div className="w-0.5 h-2 bg-gray-800 ml-1"></div>
              <div className={`text-xs font-bold transition-all duration-300 ${view === 'ENGINE' ? 'text-cyan-400 scale-110 origin-left' : 'text-gray-600'}`}>ENGINE BAY</div>
              <div className="w-0.5 h-2 bg-gray-800 ml-1"></div>
              <div className={`text-xs font-bold transition-all duration-300 ${view === 'AC_SYSTEM' ? 'text-cyan-400 scale-110 origin-left' : 'text-gray-600'}`}>AC SYSTEM</div>
            </div>
        </div>
      )}

      {/* Selection Popup (3D Mode) */}
      {lang && <InfoPopup part={selectedPart} onClose={() => setSelectedPart(null)} lang={lang} />}
      
      {/* Feature Overlays (Issues / Chat) */}
      {lang && <FeaturesOverlay mode={appMode} lang={lang} onClose={() => setAppMode('3D')} />}

      {/* Navigation Bar */}
      {lang && <NavBar currentMode={appMode} setMode={handleModeChange} lang={lang} />}

      {/* Instructions Overlay (Fades out) */}
      {lang && view === 'EXTERIOR' && appMode === '3D' && !selectedPart && (
          <div className="absolute bottom-24 md:bottom-10 w-full text-center pointer-events-none px-4">
              <div className="animate-bounce inline-block">
                <p className="text-cyan-300 text-xs md:text-sm font-bold bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    {lang === 'ms' ? '👆 Seret untuk Putar • Tekan Bonet' : '👆 Drag to Rotate • Tap Hood to Open'}
                </p>
              </div>
          </div>
      )}

    </div>
  );
}