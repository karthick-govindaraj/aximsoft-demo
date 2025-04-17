'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import { OrbitControls, Environment, Preload } from '@react-three/drei'
import TreeModel from './TreeModel'
import Particles from './Particles'
import Annotations from './Annotations'

export default function Scene() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
      className="bg-black"
    >
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 5, 20]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      
      <Suspense fallback={null}>
      <TreeModel position={[0, -2.6, 0]} scale={1.35} />
        <Particles count={2000} />
        <Annotations />
        <Environment preset="city" />
        <Preload all />
      </Suspense>
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        minDistance={3}
        maxDistance={10}
        // Limit rotation to keep annotations readable
        // maxPolarAngle={Math.PI * 0.65}
        // minPolarAngle={Math.PI * 0.25}
      />
    </Canvas>
  )
}