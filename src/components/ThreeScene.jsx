import React from 'react' // 👈 Import React to access React.memo
import { Canvas } from '@react-three/fiber'
import { EffectComposer, DepthOfField, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// R3F Components
import { Floor } from '../three/Floor'
import { Model } from '../three/Model'
import { TestModel } from '../three/TestModel'
import { CameraRig } from '../three/CameraRig'

/**
 * ThreeScene Component
 * Renders the main 3D scene with optional performance mode.
 *
 * Props:
 * - setMainVideo: function — callback to set the main video element
 * - modelRef: ref — reference to the main model
 * - setModelLoaded: function — callback when the model loads
 * - performanceMode: boolean — toggle between high quality and performance
 */
function ThreeSceneComponent({ setMainVideo, modelRef, setModelLoaded, performanceMode }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      dpr={performanceMode ? [0.7, 1] : [1, 1.5]} // Lower DPR for mobile/performance
    >
      {/* Lights */}
      <directionalLight position={[5, 5, 5]} rotation={0} intensity={0.1} />
      <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={0.5} />
      <spotLight
        position={[5, 24, -20]}
        angle={Math.PI / 3}
        intensity={3}
        penumbra={0.1}
        color={0xffffff}
        decay={0}
      />
      <ambientLight intensity={performanceMode ? 2 : 0.5} />

      {/* Scene Elements */}
      <Floor />
      <TestModel url="animefe.glb" frustumCulled={false} />
      <CameraRig />

      {/* Postprocessing Effects (only in quality mode) */}
      {!performanceMode && (
        <EffectComposer disableNormalPass>
          <DepthOfField focusDistance={0.06} focalLength={0.09} bokehScale={1} height={580} />
          <Bloom
            luminanceThreshold={0}
            mipmapBlur
            luminanceSmoothing={0.3}
            intensity={0.1}
          />
          <Vignette
            offset={0.8}
            darkness={0.4}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />
          <Noise opacity={0.03} />
        </EffectComposer>
      )}

      {/* Model: swap videos based on performanceMode */}
      <Model
        modelRef={modelRef}
        video1={performanceMode ? 'testvideo21.mp4' : 'testvideo2.mp4'}
        video2={performanceMode ? 'tvbars1.mp4' : 'tvbars.mp4'}
        video3={performanceMode ? 'tvbars.mp4' : 'tvbars.mp4'}
        video4={performanceMode ? 'testvideo2.mp4' : 'testvideo2.mp4'}
        video5={performanceMode ? 'tvbars.mp4' : 'tvbars.mp4'}
        video6={performanceMode ? 'testvideo2.mp4' : 'testvideo2.mp4'}
        video7={performanceMode ? 'tvstatic1.mp4' : 'tvstatic.mp4'}
        video8={performanceMode ? 'tvstatic1.mp4' : 'tvstatic.mp4'}
        video9={performanceMode ? 'testvideo21.mp4' : 'testvideo2.mp4'}
        video10={performanceMode ? 'testvideo21.mp4' : 'testvideo2.mp4'}
        setMainVideo={setMainVideo}
        setModelLoaded={setModelLoaded}
      />
    </Canvas>
  )
}

// 1. Rename the original function (optional, but good practice)
// 2. Wrap the function with React.memo()
// 3. Export the memoized component
export default React.memo(ThreeSceneComponent)

