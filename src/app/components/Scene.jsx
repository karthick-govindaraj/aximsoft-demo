'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import { OrbitControls, useProgress,Environment, Preload } from '@react-three/drei'
import TreeModel from './TreeModel'
import Particles from './Particles'
import Annotations from './Annotations'
import RadialGradientBackground from './RadialGradientBackground'
import Loader from './Loader'
export default function Scene() {
  const [isMounted, setIsMounted] = useState(false)

  function LoadingManager() {
    const { progress, loaded, total } = useProgress()
    const [loadingComplete, setLoadingComplete] = useState(false)
    
    useEffect(() => {
      if (loaded === total && total > 0) {
        // Add a slight delay before hiding the loader to ensure everything is rendered
        const timeout = setTimeout(() => {
          setLoadingComplete(true)
        }, 500)
        
        return () => clearTimeout(timeout)
      }
    }, [loaded, total])
    
    return <Loader progress={progress} isLoading={!loadingComplete} />
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
      <ambientLight intensity={0.5} />
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
        </>
  )
}