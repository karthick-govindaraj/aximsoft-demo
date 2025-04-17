'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'

// Array of annotation data
const ANNOTATIONS = [
  {
    position: [1.5, 1.5, 0],
    content: "1Lorem ipsum dolor sit amet",
    side: "right"
  },
  {
    position: [-2, 1.5, 0],
    content: "2Lorem ipsum dolor",
    side: "left"
  },
  {
    position: [0, 2, 0],
    content: "3dolor sit amet",
    side: "top"
  },
  {
    position: [1.5, 0, 1],
    content: "4Lorem ipsum dolor sit amet",
    side: "right"
  },
  {
    position: [-3, 0, 0],
    content: "5Lorem ipsum dolor",
    side: "left"
  }
];

export default function Annotations() {
  return (
    <>
      {ANNOTATIONS.map((annotation, index) => (
        <Annotation key={index} {...annotation} />
      ))}
    </>
  )
}

// Individual annotation component
function Annotation({ position, content, side = "right" }) {
  const annotationRef = useRef()
  const { camera } = useThree()
  const [opacity, setOpacity] = useState(0)
  
  // Determine which CSS classes to apply based on the side parameter
  const getPositionClass = () => {
    switch(side) {
      case "left": return "right-2";
      case "right": return "left-2";
      case "top": return "bottom-2";
      case "bottom": return "top-2";
      default: return "left-2";
    }
  }

  useEffect(() => {
    // Fade in animation
    const timeout = setTimeout(() => {
      setOpacity(1)
    }, 500 + Math.random() * 2000) // Stagger the appearance
    
    return () => clearTimeout(timeout)
  }, [])

  return (
    <group position={position}>
<Html
  ref={annotationRef}
  as='div'
  className="pointer-events-none"
  distanceFactor={10}
  style={{
    transition: 'opacity 0.5s ease-in-out',
    opacity: opacity
  }}
>
  <div
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#ffffff',
      border: '2px solid #acacac',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px', // lock font size
      maxWidth: '200px',
      whiteSpace: 'nowrap',
    //   boxShadow: '0 0 10px #F3823D, 0 0 20px #F3823D, 0 0 40px #F3823D',
    }}
    className={getPositionClass()}
  >
    {content}
  </div>
</Html>



    </group>
  )
}