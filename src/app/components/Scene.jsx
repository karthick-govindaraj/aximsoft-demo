'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import { OrbitControls, useProgress,Environment, Preload } from '@react-three/drei'
import TreeModel from './TreeModel'
import Particles from './Particles'
import Annotations from './Annotations'
import RadialGradientBackground from './RadialGradientBackground'
import Loader from './Loader'
import ChatWindowManager from './ChatWindowManager'
export default function Scene() {
  const [isMounted, setIsMounted] = useState(false)
  function LoadingManager() {
    const { progress, active } = useProgress()
  return <Loader progress={progress} isLoading={active} />
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
    <LoadingManager />
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
      className="bg-black"
    >
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 5, 20]} />
      <RadialGradientBackground />
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      
      <Suspense fallback={null}>
      <TreeModel position={[0, -3, 0]} scale={1.5} />
        <Particles count={2000} />
        {/* <Annotations /> */}
        <Environment preset="night" />
        <Preload all />
      </Suspense>
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        minDistance={3}
        maxDistance={10}
        />

    </Canvas>
     <ChatWindowManager />
        </>
  )
}