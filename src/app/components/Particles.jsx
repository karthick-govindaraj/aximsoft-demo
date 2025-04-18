'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 20000 }) {
  const whiteMesh = useRef()
  const blackMesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 4 + 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      temp.push({
        initial: [x, y, z],
        angleOffset: Math.random() * Math.PI * 2,
        scale: Math.random() * 0.3 + 0.05,
        speed: Math.random() * 0.02 + 0.005
      })
    }
    return temp
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    particles.forEach((particle, i) => {
      const { initial, scale, speed, angleOffset } = particle
      const radius = Math.sqrt(initial[0] ** 2 + initial[2] ** 2)
      const angle = angleOffset + time * speed
      const x = Math.sin(angle) * radius
      const z = Math.cos(angle) * radius
      const baseY = initial[1] + Math.sin(time * speed * 2) * 0.1

      // Main white particle
      dummy.position.set(x, baseY, z)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      whiteMesh.current.setMatrixAt(i, dummy.matrix)

      // Fake black shadow slightly lower
      dummy.position.set(x, baseY - 0.05, z)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      blackMesh.current.setMatrixAt(i, dummy.matrix)
    })

    whiteMesh.current.instanceMatrix.needsUpdate = true
    blackMesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      {/* Main white particles */}
      <instancedMesh ref={whiteMesh} args={[null, null, count]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </instancedMesh>

      {/* Shadow black particles */}
      <instancedMesh ref={blackMesh} args={[null, null, count]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </instancedMesh>
    </>
  )
}
