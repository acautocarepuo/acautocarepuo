import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PartData, ViewState } from '../types';
import { PARTS } from '../constants';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface EngineBayProps {
  view: ViewState;
  onSelectPart: (part: PartData) => void;
  onEnterAC: () => void;
}

export const EngineBay: React.FC<EngineBayProps> = ({ view, onSelectPart, onEnterAC }) => {
  const isACView = view === 'AC_SYSTEM';
  const pipingRef = useRef<THREE.Mesh>(null);
  const fanRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (fanRef.current && isACView) {
      fanRef.current.rotation.z -= delta * 15; // Faster fan spin
    }
  });
  
  const handleInteraction = (e: any, part: PartData) => {
    e.stopPropagation();
    onSelectPart(part);
  };

  const HoverGlow = ({ color }: { color: string }) => (
    <meshStandardMaterial 
      color={color} 
      emissive={color}
      emissiveIntensity={0.2}
      roughness={0.3}
      metalness={0.8}
    />
  );

  // Materials
  const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: '#bdc3c7',
      roughness: 0.2,
      metalness: 0.9,
  });

  const blackPlasticMaterial = new THREE.MeshStandardMaterial({
      color: '#111',
      roughness: 0.8,
      metalness: 0.1,
  });

  return (
    <group position={[1.5, 0.5, 0]}>
      
      {/* --- GENERAL ENGINE PARTS --- */}

      {/* Engine Block */}
      <group 
        position={[0, 0, 0]} 
        onClick={(e) => handleInteraction(e, PARTS.ENGINE_BLOCK)}
        visible={!isACView}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.8, 1.2]} />
          <HoverGlow color="#7f8c8d" />
        </mesh>
        {/* Valve Cover Detail */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.1, 0.15, 1.1]} />
          <meshStandardMaterial color="#333" roughness={0.5} />
        </mesh>
        {/* Spark Plug Wires Simulation */}
        {[0.3, 0.1, -0.1, -0.3].map((x, i) => (
             <mesh key={i} position={[x, 0.53, 0]}>
                 <cylinderGeometry args={[0.03, 0.03, 0.05]} />
                 <meshStandardMaterial color="black" />
             </mesh>
        ))}
      </group>

      {/* Battery */}
      <group 
        position={[-0.8, 0, 0.6]} 
        onClick={(e) => handleInteraction(e, PARTS.BATTERY)}
        visible={!isACView}
      >
         <mesh castShadow>
          <boxGeometry args={[0.4, 0.4, 0.5]} />
          <HoverGlow color="#2c3e50" />
         </mesh>
         {/* Terminals */}
         <mesh position={[0.1, 0.25, 0.1]}>
           <cylinderGeometry args={[0.03, 0.03, 0.1]} />
           <meshStandardMaterial color="#e74c3c" /> {/* Positive */}
         </mesh>
         <mesh position={[-0.1, 0.25, 0.1]}>
           <cylinderGeometry args={[0.03, 0.03, 0.1]} />
           <meshStandardMaterial color="#2c3e50" /> {/* Negative */}
         </mesh>
      </group>

      {/* --- AC SYSTEM PARTS --- */}
      
      {/* AC Compressor - Detailed */}
      <group position={[0.4, -0.3, 0.7]} onClick={(e) => handleInteraction(e, PARTS.COMPRESSOR)}>
        {/* Main Body */}
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.4, 16]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Pulley/Clutch */}
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
             <meshStandardMaterial color="#111" />
        </mesh>
        {/* Mounting Brackets */}
        <mesh position={[-0.1, 0.15, 0]}>
             <boxGeometry args={[0.2, 0.1, 0.1]} />
             <meshStandardMaterial color="#555" />
        </mesh>
        
        {/* Entry Point Label */}
        {!isACView && (
            <Html distanceFactor={6} zIndexRange={[100, 0]}>
                <div 
                    onClick={(e) => { e.stopPropagation(); onEnterAC(); }}
                    className="group cursor-pointer"
                >
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_10px_#06b6d4]">
                        <span className="text-white text-xs font-bold">AC</span>
                    </div>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-cyan-900/90 text-cyan-100 text-[10px] font-bold px-2 py-1 rounded border border-cyan-500/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        INSPECT AC
                    </div>
                </div>
            </Html>
        )}
      </group>

      {/* AC Condenser - Detailed */}
      <group 
        position={[1.2, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => handleInteraction(e, PARTS.CONDENSER)}
        visible={isACView || view === 'ENGINE'}
      >
        <mesh castShadow>
           <boxGeometry args={[1.4, 0.8, 0.06]} />
           <meshStandardMaterial color="#bdc3c7" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Cooling Fins Texture Simulator using lines */}
        <mesh position={[0, 0, 0.04]}>
           <planeGeometry args={[1.3, 0.7, 1, 20]} />
           <meshBasicMaterial color="#7f8c8d" wireframe opacity={0.3} transparent />
        </mesh>
        
        {/* Fan Shroud */}
        {isACView && (
            <group position={[0, 0, -0.15]}>
                {/* Shroud */}
                <mesh>
                    <boxGeometry args={[1.3, 0.7, 0.05]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                {/* Fan Blades */}
                <group ref={fanRef} position={[0,0,0.05]}>
                    <mesh>
                        <cylinderGeometry args={[0.08, 0.08, 0.05]} rotation={[Math.PI/2, 0, 0]}/>
                        <meshStandardMaterial color="#333" />
                    </mesh>
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <mesh key={i} rotation={[0, 0, i * (Math.PI / 3)]} position={[0, 0, 0]}>
                            <mesh position={[0, 0.25, 0]}>
                                <boxGeometry args={[0.1, 0.5, 0.02]} />
                                <meshStandardMaterial color="#fff" transparent opacity={0.5} />
                            </mesh>
                        </mesh>
                    ))}
                </group>
            </group>
        )}
      </group>
      
      {/* AC Piping - Detailed */}
      {isACView && (
        <>
            <group onClick={(e) => handleInteraction(e, PARTS.PIPING)}>
                {/* High Pressure Line (Thinner) */}
                <mesh position={[0, 0.1, 0.5]}>
                    <tubeGeometry args={[new THREE.CatmullRomCurve3([
                        new THREE.Vector3(0.4, -0.3, 0.2), // From Compressor
                        new THREE.Vector3(0.8, 0.0, 0.2), 
                        new THREE.Vector3(1.2, 0.2, -0.3), // To Condenser
                    ]), 32, 0.015, 8, false]} />
                    <primitive object={aluminumMaterial} />
                </mesh>
                
                {/* Low Pressure Line (Thicker, often insulated) */}
                 <mesh position={[0, 0.3, 0.5]}>
                    <tubeGeometry args={[new THREE.CatmullRomCurve3([
                        new THREE.Vector3(0.4, -0.2, 0.2), // To Compressor
                        new THREE.Vector3(-0.5, 0.3, 0.1),
                        new THREE.Vector3(-1.2, 0.2, 0), // From Evaporator
                    ]), 32, 0.025, 8, false]} />
                    <primitive object={blackPlasticMaterial} />
                </mesh>
                
                {/* Service Port Valves */}
                <mesh position={[0.8, 0.1, 0.7]}>
                     <cylinderGeometry args={[0.02, 0.02, 0.05]} />
                     <meshStandardMaterial color="#3498db" /> {/* Low Side Cap */}
                </mesh>
                 <mesh position={[0.6, 0.1, 0.7]}>
                     <cylinderGeometry args={[0.015, 0.015, 0.05]} />
                     <meshStandardMaterial color="#e74c3c" /> {/* High Side Cap */}
                </mesh>
            </group>
        </>
      )}

      {/* Evaporator (Cooling Coil) */}
      <group 
        position={[-1.2, 0.2, 0]} 
        onClick={(e) => handleInteraction(e, PARTS.EVAPORATOR)}
        visible={isACView}
      >
        {/* Housing Box */}
        <mesh>
           <boxGeometry args={[0.4, 0.5, 0.6]} />
           <meshStandardMaterial color="#2c3e50" transparent opacity={0.8} />
        </mesh>
        {/* Internal Core Hint */}
        <mesh position={[0, 0, 0]} visible={isACView}>
            <boxGeometry args={[0.35, 0.45, 0.55]} />
            <meshStandardMaterial color="#ecf0f1" wireframe />
        </mesh>
      </group>

    </group>
  );
};