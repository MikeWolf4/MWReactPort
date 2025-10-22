import { useRef, useEffect, useState } from 'react'
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
  const [outlineScene, setOutlineScene] = useState(null)

  useEffect(() => {
    if (!scene) return

    const outlineClone = scene.clone(true)

    // Grouping keywords
    const toonKeywords = /(clamps|thermal|eye|fingernails|legs|arms|head|body|tophair|gloves|base|legging|brow|shadow|mouth|teeth|shorts|ufsb9shape|tophair)/i
    const metalKeywords = /(rubber|muscle|metal|frame|cyber|23)/i
    const transparentKeywords = /(eyelashes|shadowplane|brow)/i


    // Cache so we don't recreate identical materials
    const materialCache = new Map()

    scene.traverse((child) => {
  if (!child.isMesh) return

  const materials = Array.isArray(child.material)
    ? child.material
    : [child.material]

  const newMaterials = materials.map((oldMat) => {
    if (!oldMat) return null

    const matName = (oldMat.name || '').toLowerCase()
    const meshName = (child.name || '').toLowerCase()
    const key = `${matName}-${meshName}`

    if (materialCache.has(key)) return materialCache.get(key)

    let newMat

    // Transparent materials first
    if (transparentKeywords.test(matName) || transparentKeywords.test(meshName)) {
  if (/eyelashes/i.test(matName) || /eyelashes/i.test(meshName) ||
      /brow/i.test(matName) || /brow/i.test(meshName)) {
    newMat = new THREE.MeshToonMaterial({
      map: oldMat.map || null,
      alphaMap: oldMat.alphaMap || oldMat.map || null,
      color: oldMat.color?.clone() || new THREE.Color('white'),
      transparent: true,
      opacity: 1.0,
      alphaTest: 0.5,   // sharp cutout instead of fading
      depthWrite: true, // prevents other meshes showing through
      side: THREE.DoubleSide,
    })
    child.renderOrder = 2
    console.log('Cutout transparency applied:', child.name)
  }

  else if (/shadowplane/i.test(matName) || /shadowplane/i.test(meshName)) {
    newMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x000000),
      transparent: true,
      opacity: 0.25, // soft ground shadow
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    child.renderOrder = 1
    console.log('Shadow plane transparency applied:', child.name)
  }
}

    // Metals
    else if (metalKeywords.test(matName) || metalKeywords.test(meshName)) {
      newMat = new THREE.MeshStandardMaterial({
        color: oldMat.color?.clone() || new THREE.Color('white'),
        map: oldMat.map || null,
        metalness: 1,
        roughness: 0.0,
        emissive: new THREE.Color(emissiveColor),
        emissiveIntensity: Math.max(0, emissiveIntensity),
        side: THREE.DoubleSide,
      })
      console.log(`Metal: ${child.name} (${oldMat.name})`)
    }

    // Toon
    else if (toonKeywords.test(matName) || toonKeywords.test(meshName)) {
      newMat = new THREE.MeshToonMaterial({
        color: oldMat.color?.clone() || new THREE.Color('white'),
        map: oldMat.map || null,
        emissive: new THREE.Color(emissiveColor),
        emissiveIntensity: Math.max(0, emissiveIntensity),
        lightMapIntensity: 1.5,
        side: THREE.DoubleSide,
      })
      console.log(`Toon: ${child.name} (${oldMat.name})`)
    }

    // Fallback
    else {
      newMat = new THREE.MeshToonMaterial({
        color: oldMat.color?.clone() || new THREE.Color('white'),
        map: oldMat.map || null,
        emissive: new THREE.Color(emissiveColor),
        emissiveIntensity: Math.max(0, emissiveIntensity),
        lightMapIntensity: 1.5,
        side: THREE.DoubleSide,
      })
      console.log(`Default: ${child.name} (${oldMat.name})`)
    }

    materialCache.set(key, newMat)
    return newMat
  })

  child.material = Array.isArray(child.material)
    ? newMaterials
    : newMaterials[0]
})

    // Outline setup
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

    // Cleanup
    return () => {
      const disposeScene = (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose?.()
            if (Array.isArray(child.material))
              child.material.forEach((m) => m.dispose?.())
            else child.material?.dispose?.()
          }
        })
      }
      disposeScene(scene)
      disposeScene(outlineClone)
      useGLTF.clear(url)
      setOutlineScene(null)
      materialCache.clear()
    }
  }, [scene, url, emissiveColor, emissiveIntensity, outlineColor, outlineThickness])

  return (
    <>
      <primitive
        ref={meshRef}
        object={scene}
        scale={[14, 14, 14.5]}
        rotation={[0, 0, 0]}
        position={[1, -15, -23]}
      />
      {outlineScene && (
        <primitive
          object={outlineScene}
          scale={[14, 14, 14.5]}
          rotation={[0, , 0]}
          position={[1, -15, -23]}
        />
      )}
    </>
  )
}
