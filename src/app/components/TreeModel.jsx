// "use client";

// import { useRef, useEffect, useState } from "react";
// import { useFrame } from "@react-three/fiber";
// import { useGLTF } from "@react-three/drei";
// import gsap from "gsap";

// export default function TreeModel({ position = [0, 0, 0], scale = 1 }) {
//   const modelRef = useRef();
//   const { scene } = useGLTF("/models/tree.glb");

//   const [direction, setDirection] = useState("center");

//   useEffect(() => {
//     if (scene) {
//       scene.rotation.set(-Math.PI / 12, 0, 0);
//       scene.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//           const material = child.material;

//           // Handle multi-materials
//           if (Array.isArray(material)) {
//             material.forEach((mat) => {
//               mat.transparent = true;
//         mat.emissiveIntensity = 0.75
//             });
//           } else {
//             material.transparent = true;
//       material.emissiveIntensity = 0.75
//           }
//         }
//       });
//     }

//     const tl = gsap.timeline();

//     tl.fromTo(
//       modelRef.current.position,
//       { y: -5 },
//       { y: position[1], duration: 2, ease: "elastic.out(1, 0.5)" }
//     );

//     tl.fromTo(
//       modelRef.current.rotation,
//       { y: -Math.PI },
//       { y: 0, duration: 3, ease: "power2.out" },
//       "-=1.5"
//     );

//     tl.fromTo(
//       modelRef.current.scale,
//       { x: 0, y: 0, z: 0 },
//       { x: scale, y: scale, z: scale, duration: 1.5, ease: "back.out(1.7)" },
//       "-=2.5"
//     );

//     return () => tl.kill();
//   }, [position, scale, scene]);

//   // Handle mouse move
//   const handlePointerMove = (e) => {
//     const x = e.clientX;
//     const width = window.innerWidth;

//     if (x < width * 0.4) setDirection("left");
//     else if (x > width * 0.6) setDirection("right");
//     else setDirection("center");
//   };

//   // Apply continuous hover rotation
//   useFrame(() => {
//     if (!modelRef.current) return;

//     const targetRotation = {
//       left: 0.1,
//       right: -0.1,
//       center: 0,
//     };

//     // Animate Y rotation using GSAP
//     gsap.to(modelRef.current.rotation, {
//       y: targetRotation[direction],
//       duration: 2,
//       ease: "power2.out",
//     });

//     // Subtle floating
//     const t = performance.now() / 1000;
//     modelRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.05;
//   });

//   return (
//     <group onPointerMove={handlePointerMove}>
//       <primitive
//         ref={modelRef}
//         object={scene}
//         position={position}
//         scale={[0, 0, 0]} // will animate to actual size
//         dispose={null}
//       />
//     </group>
//   );
// }

// useGLTF.preload("/models/tree.glb");

"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import { useGLTF, Html } from "@react-three/drei";
import gsap from "gsap";

export default function TreeModel({ position = [0, 0, 0], scale = 0 }) {
  const modelRef = useRef();
  const { scene } = useGLTF("/models/tree.glb");
  const [direction, setDirection] = useState("center");
  const meshRefs = useRef({});
  const [textboxes, setTextboxes] = useState([]);
  const [hoveredMesh, setHoveredMesh] = useState(null);

  // Content for each mesh's textbox
  const textboxContent = {
    Mesh1: "Branch 1: Growth begins here",
    Mesh3: "Branch 3: Expanding outward",
    Mesh4: "Branch 4: Seeking the sun",
    Mesh7: "Branch 7: Withstanding storms",
    Mesh8: "Branch 8: Bearing fruit",
    Mesh11: "Branch 11: New beginnings",
    Mesh12: "Branch 12: Reaching skyward",
  };

  useEffect(() => {
    if (scene) {
      scene.rotation.set(-Math.PI / 15, 0, 0);
      
      // Find and store references to all named meshes
      const textboxPositions = [];
      
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Store reference to named meshes (Mesh1-Mesh13)
          if (child.name.startsWith("Mesh") && parseInt(child.name.substring(4))) {
            meshRefs.current[child.name] = child;
            
            // Add pointer event handlers to mesh
            if (textboxContent[child.name]) {
              child.userData = { name: child.name }; // Store name for raycasting
              
              // Make the mesh interactive
              child.layers.enable(0);
              
              // Get mesh's world position
              const worldPos = new THREE.Vector3();
              child.getWorldPosition(worldPos);
              
              // Default offsets
              let offsetX = 0.1;
              let offsetY = 0.15;
              let offsetZ = 0.1;
            
              // Apply custom right-shift for specific meshes
              if (["Mesh1", "Mesh3", "Mesh4"].includes(child.name)) {
                offsetX -= 0.3; // Move right
              }
            
              textboxPositions.push({
                name: child.name,
                position: [
                  child.position.x + offsetX,
                  child.position.y + offsetY,
                  child.position.z + offsetZ,
                ],
                content: textboxContent[child.name],
              });
            }
          }
          
          const material = child.material;
          // Handle multi-materials
          if (Array.isArray(material)) {
            material.forEach((mat) => {
              mat.transparent = true;
              mat.emissiveIntensity = 0.75;
            });
          } else {
            material.transparent = true;
            material.emissiveIntensity = 0.75;
          }
        }
      });
      
      setTextboxes(textboxPositions);
    }
    
    const tl = gsap.timeline();
    tl.fromTo(
      modelRef.current.position,
      { y: -5 },
      { y: position[1], duration: 2, ease: "elastic.out(1, 0.5)" }
    );
    tl.fromTo(
      modelRef.current.rotation,
      { y: -Math.PI },
      { y: 0, duration: 3, ease: "power2.out" },
      "-=1.5"
    );
    tl.fromTo(
      modelRef.current.scale,
      { x: 0, y: 0, z: 0 },
      { x: scale, y: scale, z: scale, duration: 1.5, ease: "back.out(1.7)" },
      "-=2.5"
    );
    
    // Set up event listener
    window.addEventListener("mousemove", handlePointerMove);
    
    return () => {
      tl.kill();
      window.removeEventListener("mousemove", handlePointerMove);
    };
  }, [position, scale, scene]);

  // Handle mouse move
  const handlePointerMove = (e) => {
    const x = e.clientX;
    const width = window.innerWidth;
    if (x < width * 0.4) setDirection("left");
    else if (x > width * 0.6) setDirection("right");
    else setDirection("center");
  };

  // State for blinking animation
  const [blinkOpacity, setBlinkOpacity] = useState(1);

  // Apply continuous hover rotation and blinking effect
  useFrame(({ raycaster, camera, clock }) => {
    if (!modelRef.current) return;
    
    // Tree rotation
    const targetRotation = {
      left: 0.1,
      right: -0.1,
      center: 0,
    };
    
    // Animate Y rotation using GSAP
    gsap.to(modelRef.current.rotation, {
      y: targetRotation[direction],
      duration: 2,
      ease: "power2.out",
    });
    
    // Subtle floating
    const t = performance.now() / 1000;  
    modelRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.05;
    
    // Calculate blinking opacity (5 second cycle)
    const blinkTime = (clock.getElapsedTime() % 5) / 5; // 0 to 1 over 5 seconds
    // Create a smooth pulse effect
    const newOpacity = 0.3 + (Math.sin(blinkTime * Math.PI * 2) * 0.7 + 0.7) / 2;
    setBlinkOpacity(newOpacity);
    
    // Raycasting for hover effect
    // Update raycaster and check for intersections
    raycaster.setFromCamera(
      { x: (window.mouseX || 0) / window.innerWidth * 2 - 1, 
        y: -((window.mouseY || 0) / window.innerHeight) * 2 + 1 }, 
      camera
    );
    
    // Check for mesh intersections
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      const firstMesh = intersects.find(i => 
        i.object.userData && 
        i.object.userData.name && 
        i.object.userData.name.startsWith('Mesh')
      );
      
      if (firstMesh) {
        setHoveredMesh(firstMesh.object.userData.name);
      } else {
        setHoveredMesh(null);
      }
    } else {
      setHoveredMesh(null);
    }
  });
  
  // Track mouse position for raycasting
  useEffect(() => {
    const trackMouse = (e) => {
      window.mouseX = e.clientX;
      window.mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', trackMouse);
    return () => window.removeEventListener('mousemove', trackMouse);
  }, []);

  return (
    <group ref={modelRef} position={position}>
      <primitive object={scene}/>
      
      {/* Render textboxes with blinking or hover effect */}
      {textboxes.map((textbox) => (
        <Html
          key={textbox.name}
          position={textbox.position}
          center
          distanceFactor={2}
          occlude={false}
          sprite
          transform
          zIndexRange={[1, 0]}
          style={{
            background: "rgba(0,0,0,0.7)",
            padding: "4px 10px",
            borderRadius: "5px",
            color: "white",
            fontSize: "12px",
            whiteSpace: "nowrap",
            // Full opacity when hovered, blinking opacity otherwise
            opacity: hoveredMesh === textbox.name ? 1 : blinkOpacity,
            transition: "opacity 0.2s ease", // Smooth transition when hovering
          }}
        >
          {textbox.content}
        </Html>
      ))}
    </group>
  );
}

useGLTF.preload("/models/tree.glb");