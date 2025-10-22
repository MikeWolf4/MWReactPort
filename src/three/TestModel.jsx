import { useRef, useEffect, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function TestModel({
  url,
  emissiveColor = '#ffffff',
  emissiveIntensity = -0.01,
  outlineColor = '#353535',
  outlineThickness = 0.0025,
}) {
  const meshRef = useRef()
  const { scene } = useGLTF(url)

  // Memoize to ensure the effect only runs once per URL
  const [outlineScene, setOutlineScene] = useState(null)

  useEffect(() => {
    if (!scene) return

    // Clone once
    const outlineClone = scene.clone(true)

    // Replace materials only once
    scene.traverse((child) => {
      if (!child.isMesh) return

      // Old material must be disposed once
      child.material?.dispose?.()

      const oldMat = child.material
      const name = child.name.toLowerCase()

      if (/(cyber|23)/i.test(name)) {
        child.material = new THREE.MeshStandardMaterial({
          color: oldMat?.color?.clone() || new THREE.Color('silver'),
          roughness: 0.2,
          metalness: 1,
          map: oldMat?.map || null,
          side: THREE.FrontSide,
        })
      } else {
        child.material = new THREE.MeshToonMaterial({
          color: oldMat?.color?.clone() || new THREE.Color('white'),
          map: oldMat?.map || null,
          emissive: new THREE.Color(emissiveColor),
          emissiveIntensity,
          transparent: !!oldMat?.transparent,
          opacity: oldMat?.opacity ?? 1,
          alphaMap: oldMat?.alphaMap || null,
          side: THREE.DoubleSide,
        })
      }
    })

    // Outline material setup
    outlineClone.traverse((child) => {
      if (!child.isMesh) return
      child.material?.dispose?.()
      child.material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(outlineColor),
        side: THREE.BackSide,
      })
      child.scale.multiplyScalar(1 + outlineThickness)
    })

    setOutlineScene(outlineClone)

    // Cleanup — runs only once when URL changes or unmount
    return () => {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose?.()
          if (Array.isArray(child.material))
            child.material.forEach((m) => m.dispose?.())
          else child.material?.dispose?.()
        }
      })

      outlineClone.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose?.()
          if (Array.isArray(child.material))
            child.material.forEach((m) => m.dispose?.())
          else child.material?.dispose?.()
        }
      })

      // Clear Drei GLTF cache on unmount
      useGLTF.clear(url)
      setOutlineScene(null)
    }
  }, [url]) // Only rerun when the model changes

  return (
    <>
      <primitive
        ref={meshRef}
        object={scene}
        scale={[14, 14, 14]}
        position={[1, -13, -20]}
      />
      {outlineScene && (
        <primitive
          object={outlineScene}
          scale={[14, 14, 14]}
          position={[1, -13, -20]}
        />
      )}
    </>
  )
}

