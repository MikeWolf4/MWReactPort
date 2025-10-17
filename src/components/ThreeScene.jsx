
import { Canvas } from '@react-three/fiber'

import { EffectComposer, DepthOfField, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// Import R3F components
import { Floor } from '../three/Floor'
import { Model } from '../three/Model'
import { TestModel } from '../three/TestModel'
import { CameraRig } from '../three/CameraRig'



export function ThreeScene({ setMainVideo, modelRef, setModelLoaded, performanceMode }) {

  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={performanceMode ? [0.7, 0.] : [1, 1.5]} >
      <ambientLight intensity={0} />
      <directionalLight position={[5, 5, 5]} rotation={0} intensity={.1} />
      <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={.5} />
      <spotLight
        position={[5, 24, -20]}
        angle={Math.PI / 3}
        intensity={5.5}
        penumbra={.1}
        color={0xffffff}
        decay={0}
      />
      <mesh position={[5, 12, -22]} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <coneGeometry args={[1, 1, 2]} />
        <meshBasicMaterial color="red" />
      </mesh>
      
        
        <Floor />
        <Model 
          modelRef={modelRef}
          video1="testvideo2.mp4"
          video2="testvideo2.mp4"
          video3="tvbars.mp4"
          video4="testvideo2.mp4"
          video5="testvideo2.mp4"
          video6="testvideo2.mp4"
          video7="tvstatic.mp4"
          video8="testvideo2.mp4"
          video9="testvideo2.mp4"
          video10="testvideo2.mp4"
          setMainVideo={setMainVideo}
          setModelLoaded={setModelLoaded}
        />

        {/* <TestModel url="animefe.glb" frustumCulled={false} /> */}
        <CameraRig />
        
        {!performanceMode && (
          <EffectComposer disableNormalPass>
            <DepthOfField
                focusDistance={0.07}
                focalLength={.076}
                bokehScale={1}
                height={580}
            />
            <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={.9} intensity={.2} />
            <Vignette offset={.8} darkness={0.4} eskil={false} blendFunction={BlendFunction.NORMAL} />
            <Noise opacity={.04}/>
          </EffectComposer>
        )}
      
    </Canvas>
  )
}
