import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { createVideoTexture } from '../utils/Three'

export function Model({ 
  video1, video2, video3, video4, video5, 
  video6, video7, video8, video9, video10,
  setMainVideo, modelRef,   
}) {
  const gltf = useGLTF('tv_scene/tv_scene1.glb')
  const videoTexturesRef = useRef({})

 useEffect(() => {
  if (!modelRef.current) return;

  if (Object.keys(videoTexturesRef.current).length === 0) {
    const videos = [
      { src: video1, name: 'tv1' },
      { src: video2, name: 'tv2' },
      { src: video3, name: 'tv3' },
      { src: video4, name: 'tv4' },
      { src: video5, name: 'tv5' },
      { src: video6, name: 'tv6' },
      { src: video7, name: 'tv7' },
      { src: video8, name: 'tv8' },
      { src: video9, name: 'tv9' },
      { src: video10, name: 'tv10' }
    ];

    videos.forEach(({ src, name }) => {
      if (src) {
        videoTexturesRef.current[name] = createVideoTexture(src, { muted: true });
      }
    });

    if (videoTexturesRef.current['tv1']?.video) {
      setMainVideo(videoTexturesRef.current['tv1'].video);
    }
  }

  const materials = {};
  modelRef.current.traverse((child) => {
    if (child.isMesh && child.material?.name?.startsWith("tv")) {
      materials[child.material.name] = child.material;
    }
  });

  Object.keys(materials).forEach((name) => {
    const mat = materials[name];
    const vid = videoTexturesRef.current[name];
    if (mat && vid?.texture) {
      mat.map = vid.texture;
      mat.emissive = new THREE.Color(0xffffff);
      mat.emissiveMap = vid.texture;
      mat.emissiveIntensity = 0.6;
      mat.color.set(0xffffff);
      mat.needsUpdate = true;
    }
  });

  // Cleanup
  return () => {
  // Dispose videos & textures
  Object.values(videoTexturesRef.current).forEach(({ video, texture }) => {
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    texture?.dispose();
  });
  videoTexturesRef.current = {};

  // Dispose geometries/materials safely
  const model = modelRef.current;
  if (model) { // Add this null check
    model.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }

  // Safe cache clear
  useGLTF.clear('tv_scene/tv_scene1.glb');
};
}, [video1, video2, video3, video4, video5, video6, video7, video8, video9, video10]);

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={1.1}
      position={[0, -15, -55]}
      rotation={[0, 1.58, 0]}
    />
  )
}