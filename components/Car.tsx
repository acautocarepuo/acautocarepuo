import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ViewState } from '../types';

interface CarProps {
  view: ViewState;
  onOpenHood: () => void;
}

export const Car: React.FC<CarProps> = ({ view, onOpenHood }) => {
  const chassisRef = useRef<THREE.Group>(null);
  
  const isExterior = view === 'EXTERIOR';

  // Materials - More Realistic
  const paintMaterial = new THREE.MeshStandardMaterial({
    color: "#c0392b", // Deep metallic red
    roughness: 0.1,
    metalness: 0.7,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 2.5,
    transparent: true,
    opacity: isExterior ? 1 : 0.05,
    depthWrite: isExterior,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.0,
    metalness: 1.0,
    envMapIntensity: 3.0,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: "#0f172a",
    roughness: 0.0,
    metalness: 0.2,
    transmission: 0.1, // Slight transmission for depth
    transparent: true,
    opacity: isExterior ? 0.7 : 0.05,
    depthWrite: isExterior,
  });

  const rubberMaterial = new THREE.MeshStandardMaterial({
    color: "#1a1a1a",
    roughness: 0.9,
    metalness: 0.1,
  });

  return (
    <group ref={chassisRef} position={[0, 0.5, 0]}>
      {/* -- Car Body -- */}
      
      {/* Lower Chassis */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow material={paintMaterial}>
        <boxGeometry args={[4.6, 0.8, 2]} />
      </mesh>

      {/* Bumpers */}
      <mesh position={[2.35, 0.2, 0]} material={paintMaterial}>
         <boxGeometry args={[0.2, 0.5, 1.9]} />
      </mesh>
      <mesh position={[-2.35, 0.2, 0]} material={paintMaterial}>
         <boxGeometry args={[0.2, 0.5, 1.9]} />
      </mesh>

      {/* Cabin / Roof */}
      <mesh position={[-0.4, 1.1, 0]} castShadow receiveShadow material={paintMaterial}>
        <boxGeometry args={[2.5, 0.9, 1.8]} />
      </mesh>

      {/* Pillars/Trim */}
      <mesh position={[-0.4, 1.1, 0]} scale={[1.01, 1.01, 1.01]} material={new THREE.MeshStandardMaterial({ color: '#000', roughness: 0.5 })}>
        <boxGeometry args={[2.5, 0.9, 1.78]} />
      </mesh>

      {/* Windshield */}
      <mesh position={[1.0, 1.0, 0]} rotation={[0, 0, -0.5]} material={glassMaterial}>
         <boxGeometry args={[0.1, 0.9, 1.7]} />
      </mesh>
      
      {/* Rear Window */}
      <mesh position={[-1.75, 1.0, 0]} rotation={[0, 0, 0.5]} material={glassMaterial}>
         <boxGeometry args={[0.1, 0.9, 1.7]} />
      </mesh>

      {/* Wheels */}
      {[[-1.6, -0.5, 1], [1.6, -0.5, 1], [-1.6, -0.5, -1], [1.6, -0.5, -1]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
           <mesh rotation={[Math.PI / 2, 0, 0]} castShadow material={rubberMaterial}>
             <cylinderGeometry args={[0.42, 0.42, 0.4, 32]} />
           </mesh>
           {/* Rims */}
           <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, pos[2] > 0 ? 0.21 : -0.21]} material={chromeMaterial}>
              <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
           </mesh>
           {/* Lug nuts detail */}
           <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, pos[2] > 0 ? 0.24 : -0.24]} material={new THREE.MeshStandardMaterial({ color: '#111' })}>
              <cylinderGeometry args={[0.05, 0.05, 0.02, 6]} />
           </mesh>
        </group>
      ))}

      {/* Headlights */}
      <group position={[2.31, 0.5, 0.7]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#eee', emissive: '#fff', emissiveIntensity: 2 })}>
           <boxGeometry args={[0.1, 0.25, 0.5]} />
        </mesh>
      </group>
      <group position={[2.31, 0.5, -0.7]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#eee', emissive: '#fff', emissiveIntensity: 2 })}>
           <boxGeometry args={[0.1, 0.25, 0.5]} />
        </mesh>
      </group>
      
      {/* Taillights */}
       <group position={[-2.31, 0.6, 0.7]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#500', emissive: '#f00', emissiveIntensity: 3 })}>
           <boxGeometry args={[0.1, 0.3, 0.5]} />
        </mesh>
      </group>
      <group position={[-2.31, 0.6, -0.7]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#500', emissive: '#f00', emissiveIntensity: 3 })}>
           <boxGeometry args={[0.1, 0.3, 0.5]} />
        </mesh>
      </group>

      {/* Grille */}
      <mesh position={[2.31, 0.5, 0]}>
         <boxGeometry args={[0.05, 0.3, 0.8]} />
         <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>

      {/* Hood Area - Interactive Trigger */}
      {isExterior && (
        <group position={[1.6, 0.9, 0]} onClick={(e) => { e.stopPropagation(); onOpenHood(); }}>
           {/* Click target (Increased height for easier tapping on mobile) */}
           <mesh>
              <boxGeometry args={[1.5, 0.3, 1.8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.0} />
           </mesh>
           <Html position={[0, 0.5, 0]} center distanceFactor={8} zIndexRange={[100, 0]} transform sprite>
             <div 
               className="flex flex-col items-center cursor-pointer group pointer-events-auto"
               onClick={(e) => {
                 // CRITICAL FIX: Direct onClick on the HTML element for mobile touch support
                 e.stopPropagation();
                 onOpenHood();
               }}
             >
               <div className="w-10 h-10 rounded-full bg-cyan-500/90 backdrop-blur border-2 border-white flex items-center justify-center animate-bounce shadow-[0_0_25px_rgba(6,182,212,0.8)] hover:scale-110 transition-transform">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                 </svg>
               </div>
               <div className="mt-2 bg-black/80 text-cyan-300 text-[10px] font-bold px-3 py-1.5 rounded-full border border-cyan-500/30 whitespace-nowrap opacity-100 transition-opacity">
                 TAP TO OPEN HOOD
               </div>
             </div>
           </Html>
        </group>
      )}
    </group>
  );
};