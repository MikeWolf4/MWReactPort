import { useRef, useEffect, useState, Suspense,  useLoader,  } from 'react'
import { Canvas, useFrame, useThree,   } from '@react-three/fiber'
import { MeshReflectorMaterial, useGLTF, useTexture , Stats, Edges  } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, ToneMapping, Outline } from '@react-three/postprocessing'
import { easing } from 'maath'
import * as THREE from 'three'
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, -13.5, 5]}>
      <planeGeometry args={[150, 150]} />
      <MeshReflectorMaterial
        blur={[300, 20]}
        resolution={512}
        mixBlur={.5}
        mixStrength={800}
        roughnessMap={roughnessMap}
        // normalMap={normalMap}
        // metalnessMap={metalMap}
        roughness={1}
        depthScale={3}
        minDepthThreshold={0.8}
        maxDepthThreshold={1.2}
        color="#111111"
        metalness={1}
      />
    </mesh>
  )
}


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

function Model({ 
  video1, video2, video3, video4, video5, 
  video6, video7, video8, video9, video10,
  setMainVideo,  modelRef,   
}) {
  const gltf = useGLTF('/tv_scene/tv_scene.gltf')
 
  const videoTexturesRef = useRef({})

  useEffect(() => {
    if (!modelRef.current) return

    // Only create textures if they don't exist
    if (Object.keys(videoTexturesRef.current).length === 0) {
      const videos = [
        { src: video1, name: 'tv1', muted: true }, // start muted, user will unmute
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
        material.emissiveIntensity = 0.55
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
    
  }, [])

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

// function TestCube() {
//   const meshRef = useRef()
  
//   return (
//     <mesh ref={meshRef} position={[0, 0, 0]}>
//       <boxGeometry args={[2, 2, 2]} />
//       <meshStandardMaterial color="red" />
//     </mesh>
//   )
// }

function ThreeScene({ setMainVideo, modelRef,  setModelLoaded,performanceMode  }) {
  const testMeshRef = useRef()
  const [selection, setSelection] = useState([])
  

  console.log(testMeshRef)

 
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}  dpr={performanceMode ? [0.3, 0.5] : [1, 1.5]} >
      <ambientLight intensity={0} />
      <directionalLight position={[5, 5, 5]} intensity={.2} />
      <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={.5} />
      <Suspense fallback={null}>
        
         <Floor />
         {/* <mesh ref={testMeshRef} position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="black" />
          <Edges color="red" />
        </mesh> */}
         <Model 
         modelRef={modelRef}
          video1="/testvideo2.mp4"
          video2="/testvideo2.mp4"
          video3="/tvbars.mp4"
          video4="/testvideo2.mp4"
          video5="/testvideo2.mp4"
          video6="/testvideo2.mp4"
          video7="/tvstatic.mp4"
          video8="/testvideo2.mp4"
          video9="/testvideo2.mp4"
          video10="/testvideo2.mp4"
          setMainVideo={setMainVideo}
          setModelLoaded={setModelLoaded}
        >
        </Model>
        
        
        <CameraRig />
        
        <EffectComposer disableNormalPass>
        
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={.9} intensity={.2} />
          <Vignette offset={.8} darkness={0.4} eskil={false} blendFunction={BlendFunction.NORMAL} />
          <Noise opacity={.02}/>
          {/* <Outline
           selection={selection}
            selectionLayer={1}
            edgeStrength={10}
            visibleEdgeColor={0x00ff00}
            pulseSpeed={1.5}
            hiddenEdgeColor={0x22090a} // the color of hidden edges
            xRay={true} // indicates whether X-Ray outlines are enabled
    /> */}
        </EffectComposer >
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
  const [mainVideo, setMainVideo] = useState(null)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(.25)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [performanceMode, setPerformanceMode] = useState(false)

   const [modelLoaded, setModelLoaded] = useState(false)
    const modelRef = useRef()

  const webProjects = [
   {
  title: 'React Basics & Logic',
  description: 'Help with React hooks, props, and clean component structure for maintainable projects.',
  tech: ['React', 'JavaScript'],
},
{
  title: 'Three.js & WebGL',
  description: 'Adding 3D elements or scenes to your React app using Three.js or React Three Fiber.',
  tech: ['React', 'Three.js', 'WebGL'],
},
{
  title: 'UI & Styling',
  description: 'Setting up TailwindCSS or styled-components for responsive, modern UIs that feel smooth.',
  tech: ['React', 'TailwindCSS'],
},
{
  title: 'Performance & Optimization',
  description: 'Improving load times, reducing re-renders, or optimizing 3D and media-heavy sites.',
  tech: ['React', 'Vite', 'Performance'],
},
  ]

  const gameProjects = [
    {
  title: 'Gameplay Systems',
  description: 'Help with locomotion setups, ALSv4, animation blending, and melee or ranged combat logic.',
  tech: ['Unreal Engine', 'Blueprints', 'C++'],
},
{
  title: 'Replication & Multiplayer',
  description: 'Fixing issues with desync, variable replication, or getting multiplayer features working smoothly.',
  tech: ['Unreal Engine', 'Replication', 'Networking'],
},
{
  title: 'Inventory & Equipment',
  description: 'Setting up modular inventory, weapon switching, or data-driven item systems that actually scale.',
  tech: ['Unreal Engine', 'Data Assets', 'Blueprints'],
},
{
  title: 'Optimization & Debugging',
  description: 'Tracking down performance drops, cleaning up Blueprints, or figuring out why something just won’t work.',
  tech: ['Unreal Engine', 'Profiling', 'Optimization'],
},
  ]

  useEffect(() => {
    if (mainVideo) {
      console.log('Setting video muted:', muted, 'volume:', volume)
      mainVideo.muted = muted
      mainVideo.volume = volume
      
      // Try to play if unmuting
      if (!muted && hasInteracted) {
        mainVideo.play().catch(err => console.log('Autoplay prevented:', err))
      }
    }
  }, [mainVideo, muted, volume, hasInteracted])

  const handleMuteToggle = () => {
    console.log('Toggle mute clicked, current muted:', muted)
    setHasInteracted(true)
    const newMuted = !muted
    setMuted(newMuted)
    
    // Direct immediate update
    if (mainVideo) {
      mainVideo.muted = newMuted
      if (!newMuted) {
        mainVideo.play().catch(err => console.log('Play error:', err))
      }
      console.log('Video element muted state:', mainVideo.muted, 'volume:', mainVideo.volume)
    }
  }
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* <header className="fixed top-0 w-full bg-black/80 backdrop-blur-sm border-b border-zinc-800 z-50">



        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-emerald-400">MW</h1>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-6">
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-emerald-400 transition-colors">Skills</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
          <Stats/>
          
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleMuteToggle}
              className={`px-4 py-2 rounded transition-colors ${
                muted 
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-emerald-500 text-black hover:bg-emerald-600"
              }`}
            >
              {muted ? 'Unmute' : 'Mute'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => {
                setHasInteracted(true)
                setVolume(parseFloat(e.target.value))
              }}
              className="w-40 accent-emerald-500"
            />
             <button
  onClick={() => setPerformanceMode(!performanceMode)}
  className={`px-4 py-2 rounded transition-colors ${
    performanceMode
      ? "bg-yellow-500 text-black hover:bg-yellow-600"
      : "bg-zinc-800 text-zinc-400 hover:text-white"
  }`}
>
  {performanceMode ? 'Performance Mode' : 'Quality Mode'}
</button>
          </div>
        </nav>
      </header> */}

      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-sm border-b border-zinc-800 z-50">
  <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Left section - Logo */}
    <div className="flex items-center gap-4 w-1/4">
      <h1 className="text-xl font-bold text-emerald-400">MW</h1>
    </div>
    
    {/* Center section - Navigation */}
    <div className="flex gap-6 w-1/2 justify-center">
      <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
      <a href="#projects" className="hover:text-emerald-400 transition-colors">Skills</a>
      <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
    </div>
    
    {/* Right section - Controls */}
    <div className="hidden sm:flex items-center gap-3 w-1/4 justify-end">
      <Stats/>
      <button
        onClick={handleMuteToggle}
        className={`px-4 py-2 rounded transition-colors min-w-[85px] ${
          muted 
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-emerald-500 text-black hover:bg-emerald-600"
        }`}
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => {
          setHasInteracted(true)
          setVolume(parseFloat(e.target.value))
        }}
        className="w-40 accent-emerald-500"
      />
      <button
        onClick={() => setPerformanceMode(!performanceMode)}
        className={`px-4 py-2 rounded transition-colors min-w-[160px] ${
          performanceMode
            ? "bg-yellow-500 text-black hover:bg-yellow-600"
            : "bg-zinc-800 text-zinc-400 hover:text-white"
        }`}
      >
        {performanceMode ? 'Performance' : 'Quality'}
      </button>
    </div>
  </nav>
</header>

      <section className="h-screen flex items-center justify-center relative">
        
        <div className="absolute inset-0 z-0">
          <ThreeScene modelRef={modelRef} setMainVideo={setMainVideo} setModelLoaded={setModelLoaded} performanceMode={performanceMode} />
        </div>
       
        <div className="text-center z-10">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="border border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded font-semibold transition-colors"
      >
        {isVisible ? "Hide Section" : "Show Section"}
      </button>

      {/* Conditional Rendering */}
      {isVisible && (
        <div className="relative z-10 text-center px-6">
          <h2 className="text-6xl font-bold mb-4">Michael Wolford</h2>
          <p className="text-2xl text-zinc-400 mb-8">
            Web Developer | Game Developer
          </p>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-8">
            I build things for fun and help others solve problems. React,
            JavaScript, Unreal Engine.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#projects"
              className="bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-3 rounded font-semibold transition-colors"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="border border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded font-semibold transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </div>
      </section>

      <section id="about" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
          <div className="text-zinc-400 space-y-4 text-lg">
            <p>Hey, I’m Michael Wolford — if you’re working on a game or web project and feeling stuck, I’m happy to help.</p>
            <p>I’ve spent years working with Unreal Engine on things like locomotion setups, motion matching, ALSv4, combat and melee systems, weapon line tracing (1st & 3rd person), inventory, replication, and character asset management.</p>
            <p>On the web side, I also work with React, Three.js, and WebGL building interactive sites and tools that bring game assets or ideas to life right in the browser.</p>
            <p>Whether your Blueprint logic won’t behave, your React component chain’s breaking, or you just need a second pair of eyes to untangle a system, I get it. Balancing creativity and tech can be frustrating when you’re solo or short on time.</p>
           
            <p>I’m here to help people get unstuck, learn something new, and keep their projects moving forward — without the stress. If that sounds like what you need, feel free to reach out.</p>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Things I Can Help With</h2>
          
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

          <div className="grid md:grid-cols-2 gap-6">
            {activeSection === 'web' && webProjects.map((project, i) => <ProjectCard key={i} {...project} />)}
            {activeSection === 'game' && gameProjects.map((project, i) => <ProjectCard key={i} {...project} />)}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Skills</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Web Development</h3>
              <ul className="text-zinc-400 space-y-2">
                <li>JavaScript</li>
                <li>React.js</li>
                <li>API & Node.js</li>
                <li>Tailwind CSS</li>
                <li>Three.js</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Game Development</h3>
              <ul className="text-zinc-400 space-y-2">
                <li>Unreal Engine</li>
                <li>Blueprints</li>
                <li>Sound Design</li>
                <li>Blender</li>
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

      <footer className="border-t border-zinc-800 py-8 px-6 text-center text-zinc-500">
        <p>© 2025 Michael Wolford. Built with React & Three Fiber/Drei.</p>
      </footer>
    </div>
  )
}