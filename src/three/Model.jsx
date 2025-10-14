import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { createVideoTexture } from '../utils/Three'

export function Model({ 
  video1, video2, video3, video4, video5, 
  video6, video7, video8, video9, video10,
  setMainVideo, modelRef,   
}) {
  const gltf = useGLTF('tv_scene/tv_scene.gltf')
  const videoTexturesRef = useRef({})

  useEffect(() => {
    if (!modelRef.current) return

    // Only create textures if they don't exist
    if (Object.keys(videoTexturesRef.current).length === 0) {
      const videos = [
        { src: video1, name: 'tv1', muted: true },
        { src: video2, name: 'tv2', muted: true },
        { src: video3, name: 'tv3', muted: true },
        { src: video4, name: 'tv4', muted: true },
        { src: video5, name: 'tv5', muted: true },
        { src: video6, name: 'tv6', muted: true },
        { src: video7, name: 'tv7', muted: true },
        { src: video8, name: 'tv8', muted: true },
        { src: video9, name: 'tv9', muted: true },
        { src: video10, name: 'tv10', muted: true }
      ]

      videos.forEach(({ src, name, muted }) => {
        if (src) {
          videoTexturesRef.current[name] = createVideoTexture(src, { muted })
        }
      })

      // Expose the main video for UI control - only once
      if (videoTexturesRef.current['tv1']?.video) {
        setMainVideo(videoTexturesRef.current['tv1'].video)
      }
    }

    // Collect materials
    const materials = {}
    modelRef.current.traverse((child) => {
      if (child.isMesh && child.material?.name?.startsWith("tv")) {
        materials[child.material.name] = child.material
      }
    })

    // Assign each TV material directly
    const assignTexture = (materialName) => {
      const material = materials[materialName]
      const videoTexture = videoTexturesRef.current[materialName]
      if (material && videoTexture?.texture) {
        material.map = videoTexture.texture
        material.emissive = new THREE.Color(0xffffff)
        material.emissiveMap = videoTexture.texture
        material.emissiveIntensity = 0.90
        material.color.set(0xffffff)
        material.needsUpdate = true
      }
    }

    assignTexture('tv1')
    assignTexture('tv2')
    assignTexture('tv3')
    assignTexture('tv4')
    assignTexture('tv5')
    assignTexture('tv6')
    assignTexture('tv7')
    assignTexture('tv8')
    assignTexture('tv9')
    assignTexture('tv10')

    return () => {
      Object.values(videoTexturesRef.current).forEach(({ video, texture }) => {
        video.pause()
        texture.dispose()
      })
      videoTexturesRef.current = {}
    }
    
  }, [video1, video2, video3, video4, video5, video6, video7, video8, video9, video10]) // Included video props for clarity, though they likely won't change after mounting

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={1}
      position={[0, -15, -45]}
      rotation={[0, 1.58, 0]}
    />
  )
}