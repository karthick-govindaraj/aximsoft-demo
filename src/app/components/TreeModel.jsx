'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'

export default function TreeModel({ position = [0, 0, 0], scale = 1 }) {
  const modelRef = useRef()
  const { scene } = useGLTF('/models/tree.glb')

  const [direction, setDirection] = useState('center')

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
      { y: position[1], duration: 2, ease: 'elastic.out(1, 0.5)' }
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

    return () => tl.kill()
  }, [position, scale, scene])

  // Handle mouse move
  const handlePointerMove = (e) => {
    const x = e.clientX
    const width = window.innerWidth

    if (x < width * 0.4) setDirection('left')
    else if (x > width * 0.6) setDirection('right')
    else setDirection('center')
  }

  // Apply continuous hover rotation
  useFrame(() => {
    if (!modelRef.current) return

    const targetRotation = {
      left: -0.1,
      right: 0.1,
      center: 0,
    }
    
    // Animate Y rotation using GSAP
    gsap.to(modelRef.current.rotation, {
      y: targetRotation[direction],
      duration: 2,
      ease: 'power2.out',
    })

    // Subtle floating
    const t = performance.now() / 1000
    modelRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.05
  })

  return (
    <group onPointerMove={handlePointerMove}>
      <primitive
        ref={modelRef}
        object={scene}
        position={position}
        scale={[0, 0, 0]} // will animate to actual size
        dispose={null}
      />
    </group>
  )
}

useGLTF.preload('/models/tree.glb')
