import React from 'react' // 👈 Import React to access React.memo
import { Canvas } from '@react-three/fiber'
import { EffectComposer, DepthOfField, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { MeshReflectorMaterial, useTexture } from '@react-three/drei'



// R3F Components
import { Floor } from '../three/Floor'
import { Model } from '../three/Model'
import { TestModel } from '../three/TestModel'
import { CameraRig } from '../three/CameraRig'


function ThreeSceneComponent({ setMainVideo, modelRef, setModelLoaded, performanceMode }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 41 }}
      dpr={performanceMode ? [1, 1.5] : [1, 1.5]} // Lower DPR for mobile/performance
    >
      {/* Lights */}
      <directionalLight position={[5, 5, 5]} rotation={0} intensity={0.1} />
      <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={0.5} />
      <spotLight
        position={[5, 24, -20]}
        angle={Math.PI / 3}
        intensity={performanceMode ? 1 : 5}
        penumbra={0.1}
        color={0xffffff}
        decay={0}
      />
      <ambientLight intensity={performanceMode ? 2 : 0.5} />

      {/* Scene Elements */}
      
      <TestModel url="animefeKat1.glb" frustumCulled={false} />
      <CameraRig />

      {/* Postprocessing Effects (only in quality mode) */}
      {!performanceMode && (
        <EffectComposer disableNormalPass>
          <DepthOfField focusDistance={0.06} focalLength={0.09} bokehScale={.9} height={580} />
          <Bloom
            luminanceThreshold={0}
            mipmapBlur
            luminanceSmoothing={0.3}
            intensity={0.07}
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

      {performanceMode&& (
        <mesh rotation={[-Math.PI / 5, 0, 0]} position={[-5, -90, 5]}>
                <planeGeometry args={[750, 750]}  />
                <meshStandardMaterial
                  color="#414141"
                />
              </mesh>
              
      )}
      {!performanceMode&& (
       <Floor />
              
      )}

      {!performanceMode && (
      <Model
        modelRef={modelRef}
        video1={ 'testvideo2.mp4'}
        video2={'testvideo2.mp4'}
        video3={ 'tvbars.mp4'}
        video4={ 'testvideo2.mp4'}
        video5={'testvideo2.mp4'}
        video6={ 'testvideo2.mp4'}
        video7={  'tvstatic.mp4'}
        video8={ 'tvstatic.mp4'}
        video9={ 'testvideo2.mp4'}
        video10={ 'testvideo2.mp4'}
        setMainVideo={setMainVideo}
        setModelLoaded={setModelLoaded}
      />
        )}

    </Canvas>
  )
} 

export default React.memo(ThreeSceneComponent)


      //   modelRef={modelRef}
      //   video1={performanceMode ? 'testvideo21.mp4' : 'testvideo2.mp4'}
      //   video2={performanceMode ? 'tvbars1.mp4' : 'testvideo2.mp4'}
      //   video3={performanceMode ? 'tvbars.mp4' : 'tvbars.mp4'}
      //   video4={performanceMode ? 'testvideo2.mp4' : 'testvideo2.mp4'}
      //   video5={performanceMode ? 'tvbars.mp4' : 'testvideo2.mp4'}
      //   video6={performanceMode ? 'tvbars.mp4' : 'testvideo2.mp4'}
      //   video7={performanceMode ? 'tvstatic1.mp4' : 'tvstatic.mp4'}
      //   video8={performanceMode ? 'tvstatic1.mp4' : 'tvstatic.mp4'}
      //   video9={performanceMode ? 'testvideo21.mp4' : 'testvideo2.mp4'}
      //   video10={performanceMode ? 'testvideo21.mp4' : 'testvideo2.mp4'}
      //   setMainVideo={setMainVideo}
      //   setModelLoaded={setModelLoaded}
      // />