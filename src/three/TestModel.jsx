import { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function TestModel({
  url,
  emissiveColor = '#ffffff',
  emissiveIntensity = -0.01,
  outlineColor = '#353535',
  outlineThickness = 0.002,
}) {
  const meshRef = useRef()
  const { scene } = useGLTF(url)
  const [outlineScene, setOutlineScene] = useState(null)

  useEffect(() => {
    if (!scene) return

    const outlineClone = scene.clone()

    scene.traverse((child) => {
      if (child.isMesh) {
        const oldMat = child.material
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

    outlineClone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(outlineColor),
          side: THREE.BackSide,
        })
        child.scale.multiplyScalar(1 + outlineThickness)
      }
    })

    setOutlineScene(outlineClone) // ✅ triggers React re-render
  }, [scene, emissiveColor, emissiveIntensity, outlineColor, outlineThickness])

  return (
    <>
      <primitive
        ref={meshRef}
        object={scene}
        rotation={[0, 0, 0]}
        scale={[15, 15, 15]}
        position={[0.5, -13, -20]}
      />
      {outlineScene && (
        <primitive
          object={outlineScene}
          rotation={[0, 0, 0]}
          scale={[15, 15, 15]}
          position={[0.5, -13, -20]}
        />
      )}
    </>
  )
}
