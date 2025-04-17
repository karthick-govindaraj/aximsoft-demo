'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'

export default function TreeModel({ position = [0, 0, 0], scale = 1 }) {
  const modelRef = useRef()
  const { scene } = useGLTF('/models/tree.glb')

  const offsetY = position[1] - 1.8 // Lower the tree slightly

  useEffect(() => {
    if (scene) {
        scene.rotation.set(-Math.PI / 12, 0, 0)
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }

    const tl = gsap.timeline()

    tl.fromTo(
      modelRef.current.position,
      { y: -5 },
      { y: offsetY, duration: 2, ease: 'elastic.out(1, 0.5)' }
    )

    tl.fromTo(
      modelRef.current.rotation,
      { y: -Math.PI },
      { y: 0, duration: 3, ease: 'power2.out' },
      '-=1.5'
    )

    tl.fromTo(
      modelRef.current.scale,
      { x: 0, y: 0, z: 0 },
      { x: scale, y: scale, z: scale, duration: 1.5, ease: 'back.out(1.7)' },
      '-=2.5'
    )

    return () => {
      tl.kill()
    }
  }, [scene, scale, offsetY])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // modelRef.current.rotation.y = Math.sin(t / 8) * 0.3  
    modelRef.current.position.y = offsetY + Math.sin(t / 2) * 0.05
  })

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={position}
      scale={[0, 0, 0]} // Will be animated to scale
      dispose={null}
    />
  )
}

useGLTF.preload('/models/tree.glb')
