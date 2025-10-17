import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function TestModel({
  url,
  emissiveColor = '#ffffff',
  emissiveIntensity = -0.01,
  outlineColor = '#353535',
  outlineThickness = 0.002, // increase for thicker lines
}) {
  const meshRef = useRef()
  const outlineRef = useRef()
  const { scene } = useGLTF(url)

  useEffect(() => {
    if (!scene) return

    // clone the scene for the outline layer
    const outlineScene = scene.clone()

    scene.traverse((child, index) => {
      if (child.isMesh) {
        const oldMat = child.material
        child.castShadow = false
        child.receiveShadow = false

        // main toon material
        child.material = new THREE.MeshToonMaterial({
          color: oldMat.color ? oldMat.color.clone() : new THREE.Color('white'),
          map: oldMat.map || null,
          emissive: new THREE.Color(emissiveColor),
          emissiveIntensity,
          transparent: oldMat.transparent || false,
          opacity: oldMat.opacity ?? 1,
          alphaMap: oldMat.alphaMap || null,
          side: THREE.FrontSide,
          depthWrite: oldMat.depthWrite ?? true,
        })
      }
    })

    outlineScene.traverse((child) => {
      if (child.isMesh) {
        // outline material black backface only no lighting
        child.material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(outlineColor),
          side: THREE.BackSide,
        })
        // slightly scale up for visible outline
        child.scale.multiplyScalar(1 + outlineThickness)
      }
    })

    outlineRef.current = outlineScene
  }, [scene, emissiveColor, emissiveIntensity, outlineColor, outlineThickness])

  return (
    <>
      {/* main model */}
      <primitive
        ref={meshRef}
        object={scene}
        rotation={[0, 0, 0]}
        scale={[15, 15, 15]}
        position={[.5, -13, -20]}
      />
      {/* outline pass */}
      {outlineRef.current && (
        <primitive
          object={outlineRef.current}
          rotation={[0, 0, 0]}
          scale={[15.03, 15, 15]}
          position={[.5, -13, -20]}
        />
      )}
    </>
  )
}