import { useRef, useEffect, useState, Suspense,  useLoader } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial, useGLTF, useTexture  } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, ToneMapping } from '@react-three/postprocessing'
import { easing } from 'maath'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vignette } from '@react-three/postprocessing'



function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [-1 + (state.pointer.x * state.viewport.width) / 3, (1 + state.pointer.y) / 2, 5.5], 1, delta)
    state.camera.lookAt(0, .7, -10)
  })
}


function Floor() {
    const roughnessMap = useTexture('/worn-rusted-painted-bl/worn-rusted-painted_roughness.png')
    const normalMap = useTexture('/worn-rusted-painted-bl/worn-rusted-painted_normal-ogl.png')
    const metalMap = useTexture('/worn-rusted-painted-bl/worn-rusted-painted_metallic.png')

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, -14, 5]}>
      <planeGeometry args={[800, 300]} />
      <MeshReflectorMaterial
        blur={[300, 20]}
        resolution={2024}
        mixBlur={1}
        mixStrength={5000}
        // roughnessMap={roughnessMap}
        // normalMap={normalMap}
        // metalnessMap={metalMap}
        roughness={.8}
        depthScale={3}
        minDepthThreshold={0.8}
        maxDepthThreshold={1.2}
        color="#111111"
        metalness={1}
      />
    </mesh>
  )
}
/////////////////////////
function createVideoTexture(src, { muted = true, loop = true, rotation = Math.PI / 2 } = {}) {
  const video = document.createElement('video')
  video.src = src
  video.crossOrigin = 'Anonymous'
  video.loop = loop
  video.muted = muted
  video.playsInline = true
  video.autoplay = true
  video.play()

  const texture = new THREE.VideoTexture(video)
  texture.encoding = THREE.sRGBEncoding
  texture.flipY = true
  texture.center.set(0.5, 0.5)
  texture.rotation = rotation

  return { video, texture }
}
/////////////////////////
function Model({ videoSrc, videoSrc1 }) {
  const gltf = useGLTF('/tv_scene/tv_scene.gltf')
  const modelRef = useRef()

  useEffect(() => {
    // Create two video textures
    const { video: v0, texture: texture0 } = createVideoTexture(videoSrc, { muted: false }) // this one has audio
    const { video: v1, texture: texture1 } = createVideoTexture(videoSrc1)

    modelRef.current.traverse((child) => {
      if (child.isMesh) {
        if (child.material?.name === 'tvscreenmat') {
          child.material.map = texture0
          child.material.emissive = new THREE.Color(0xffffff)
          child.material.emissiveMap = texture0
          child.material.emissiveIntensity = 0.55
          child.material.color.set(0xffffff)
          child.material.needsUpdate = true
        }
        if (child.material?.name === 'tvmaterial2') {
          child.material.map = texture1
          child.material.emissive = new THREE.Color(0xffffff)
          child.material.emissiveMap = texture1
          child.material.emissiveIntensity = 0.55
          child.material.color.set(0xffffff)
          child.material.needsUpdate = true
        }
      }
    })

    // Cleanup when component unmounts
    return () => {
      v0.pause()
      v1.pause()
      texture0.dispose()
      texture1.dispose()
    }
  }, [videoSrc, videoSrc1])

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


function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={0} />
      <directionalLight position={[5, 5, 5]} intensity={.2} />
      <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={.5} />
      <Suspense fallback={null}>
      
        <EffectComposer disableNormalPass >
          
        <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={.2} intensity={.2} />
        {/* <DepthOfField target={[0, 0, 0]} focalLength={0.8} bokehScale={1} height={400} /> */}
         {/* <Noise premultiply blendFunction={BlendFunction.ADD}/> */}

         <Vignette offset={.6} darkness={0.5} eskil={false} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
        <Floor />
        <Model videoSrc="/testvideo2.mp4" videoSrc1="/testvideo.mp4" />
        <CameraRig />
      </Suspense>
    </Canvas>
  )
}

function ProjectCard({ title, description, tech, liveLink, githubLink }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-emerald-500 transition-colors">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map((t, i) => (
          <span key={i} className="text-xs bg-zinc-800 text-emerald-400 px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-3">
        {liveLink && (
          <a href={liveLink} className="text-emerald-400 hover:text-emerald-300 text-sm">
            Live Demo →
          </a>
        )}
        {githubLink && (
          <a href={githubLink} className="text-zinc-400 hover:text-white text-sm">
            GitHub →
          </a>
        )}
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('web')

  const webProjects = [
    {
      title: 'Project Name',
      description: 'Brief description of what this project does and why you built it.',
      tech: ['React', 'Three.js', 'Tailwind'],
      liveLink: '#',
      githubLink: '#',
    },
  ]

  const gameProjects = [
    {
      title: 'Unreal Engine Project',
      description: 'Description of your game dev work, systems built, what you learned.',
      tech: ['Unreal Engine', 'Blueprints', 'C++'],
      liveLink: null,
      githubLink: null,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-sm border-b border-zinc-800 z-50">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-400">MW</h1>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-emerald-400 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 z-0">
          <ThreeScene />
        </div>
        <div className="relative z-10 text-center px-6">
          <h2 className="text-6xl font-bold mb-4">Michael Wolford</h2>
          <p className="text-2xl text-zinc-400 mb-8">Web Developer | Game Developer</p>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-8">
            I build things for fun and help others solve problems. React, JavaScript, Unreal Engine.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#projects" className="bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-3 rounded font-semibold transition-colors">
              View Projects
            </a>
            <a href="#contact" className="border border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded font-semibold transition-colors">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
          <div className="text-zinc-400 space-y-4 text-lg">
            <p>I'm a developer who codes for fun and self-fulfillment. The market's hard to break into, but that doesn't stop me from building things I want to exist and helping others solve problems.</p>
            <p>I work with React and JavaScript on the web side, and Unreal Engine for game development. Currently pursuing my CS degree while taking on freelance work and building projects that interest me.</p>
            <p>When I'm not coding, I'm working as a barista trainer at Starbucks, where I help train new team members and maintain quality standards.</p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Projects</h2>
          
          {/* Toggle */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveSection('web')}
              className={`px-6 py-2 rounded font-semibold transition-colors ${
                activeSection === 'web' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Web Development
            </button>
            <button
              onClick={() => setActiveSection('game')}
              className={`px-6 py-2 rounded font-semibold transition-colors ${
                activeSection === 'game' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Game Development
            </button>
          </div>

          {/* Project Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {activeSection === 'web' && webProjects.map((project, i) => <ProjectCard key={i} {...project} />)}
            {activeSection === 'game' && gameProjects.map((project, i) => <ProjectCard key={i} {...project} />)}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Skills</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Web Development</h3>
              <ul className="text-zinc-400 space-y-2">
                <li>JavaScript</li>
                <li>React.js</li>
                <li>HTML/CSS</li>
                <li>Tailwind CSS</li>
                <li>Three.js</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Game Development</h3>
              <ul className="text-zinc-400 space-y-2">
                <li>Unreal Engine</li>
                <li>Blueprints</li>
                <li>Unreal C++</li>
                <li>Maya</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Other</h3>
              <ul className="text-zinc-400 space-y-2">
                <li>Python</li>
                <li>C++</li>
                <li>Java</li>
                <li>Git/GitHub</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Looking for a developer who codes for the love of it? Let's talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:wolfordmichael04@gmail.com" className="bg-emerald-500 hover:bg-emerald-600 text-black px-8 py-3 rounded font-semibold transition-colors">Email Me</a>
            <a href="https://linkedin.com/in/mikewolf04" target="_blank" rel="noopener noreferrer" className="border border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 px-8 py-3 rounded font-semibold transition-colors">LinkedIn</a>
            <a href="https://github.com/MikeWolf4" target="_blank" rel="noopener noreferrer" className="border border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 px-8 py-3 rounded font-semibold transition-colors">GitHub</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6 text-center text-zinc-500">
        <p>© 2024 Michael Wolford. Built with React & Three.js.</p>
      </footer>
    </div>
  )
}