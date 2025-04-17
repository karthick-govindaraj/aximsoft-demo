'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 20000 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Generate particles in a tighter and fixed range
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 4 + 2 // tighter: radius 2 - 6
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
      const y = initial[1] + Math.sin(time * speed * 2) * 0.1 // vertical oscillation

      dummy.position.set(x, y, z)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()

      mesh.current.setMatrixAt(i, dummy.matrix)
    })

    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
    </instancedMesh>
  )
}
