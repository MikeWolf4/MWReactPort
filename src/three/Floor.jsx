import { MeshReflectorMaterial, useTexture } from '@react-three/drei'

export function Floor() {
    const roughnessMap = useTexture('worn-rusted-painted-bl/worn-rusted-painted_roughness.png')
 
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, -13.4, 5]}>
        <planeGeometry args={[150, 150]} />
        <MeshReflectorMaterial
          blur={[30, 20]}
          resolution={1024}
          mixBlur={.9}
          mixStrength={800}
          roughnessMap={roughnessMap}
          // normalMap={normalMap}
          // metalnessMap={metalMap}
          roughness={1}
          depthScale={3}
          minDepthThreshold={0.3}
          maxDepthThreshold={.6}
          color="#020202"
          metalness={1}
        />
      </mesh>
    )
}