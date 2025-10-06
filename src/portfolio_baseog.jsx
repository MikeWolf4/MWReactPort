import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'


function addReflectiveFloor(scene) {
  const geometry = new THREE.PlaneGeometry(100, 100)

  const groundMirror = new Reflector(geometry, {
    clipBias: 0.5,
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0x111111,
    metalness: 0,
    roughness: 1
  })

  groundMirror.rotation.x = -Math.PI / 2
  groundMirror.position.y = -16
  scene.add(groundMirror)
}

function ThreeScene() {
  const containerRef = useRef()
  const modelRef = useRef()


  useEffect(() => {
    if (!containerRef.current) return
    

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Create a geometric shape
    const geometry = new THREE.IcosahedronGeometry(1, 0)
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x008BFF,
      wireframe: true,
      transparent: true,
      opacity: 1
    })
    const shape = new THREE.Mesh(geometry, material)
    scene.add(shape)

    // // Lighting
    // const light = new THREE.PointLight(0xffffff, 1, 100)
    // light.position.set(5, 5, 5)
    // scene.add(light)
    // const ambientLight = new THREE.AmbientLight(0x404040)
    // scene.add(ambientLight)
    // Better lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, .5) // Increased from 0.5
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1) // Increased from 1
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

  // // Add another light from opposite side
  // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1)
  // directionalLight2.position.set(-5, 3, -3)
  // scene.add(directionalLight2)

  // // Keep the point light but adjust
  // const pointLight = new THREE.PointLight(0x00ff88, 5, 100) // Increased intensity
  // pointLight.position.set(0, 3, 5)
  // scene.add(pointLight)
addReflectiveFloor(scene)

  // Add a fill light from below
const fillLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1)
scene.add(fillLight)


    camera.position.z = 3

     const loader = new GLTFLoader()
    
    loader.load(
  '/tv_scene/tv_scene.gltf',
  (gltf) => {
    const model = gltf.scene
    modelRef.current = model
    
    model.scale.set(1, 1, 1)
    model.position.set(0, -15, -45)
    model.rotation.set(0, 1.58, 0)
    
    // Step 1: Create the HTML video element
    const video = document.createElement('video')
    video.src = '/testvideo.mp4'      // <--- put your video in public folder
    video.crossOrigin = 'Anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true      //  helps iOS
    video.play()

    // Step 2: Wrap it in a THREE.VideoTexture
    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.encoding = THREE.sRGBEncoding
    videoTexture.flipY = true
    videoTexture.center.set(0.5, 0.5) // pivot around center
    videoTexture.rotation = Math.PI / 2 // rotate 90 degrees

    //  Step 3: Traverse meshes and swap the material on the screen
   model.traverse((child) => {
  if (child.material && child.material.name === 'tvscreenmat') {
  // keep it standard, but inject the videoS
  child.material.map = videoTexture
  child.material.color.set(0xffffff) // no tint
  
  // make the video self-lit (glowing)
  child.material.emissive = new THREE.Color(0xffffff)
  child.material.emissiveMap = videoTexture
  child.material.emissiveIntensity = 0.55
  child.material.needsUpdate = true
  }

})

    scene.add(model)
  },
  (progress) => {
    console.log('Loading:', (progress.loaded / progress.total * 100) + '%')
  },
  (error) => {
    console.error('Error loading model:', error)
  }
)

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    function animate() {
  requestAnimationFrame(animate)
  
  // Rotate model if it exists
  if (modelRef.current) {
    // Auto rotation
    modelRef.current.rotation.y += 0.4
    
    // Mouse follow
    const targetRotationY = mouseX * 0.3
    const targetRotationX = mouseY * 0.2
    
    modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.05
    modelRef.current.rotation.x += (targetRotationX - modelRef.current.rotation.x) * 0.05
  }
  
  renderer.render(scene, camera)
}

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
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
      title: "Project Name",
      description: "Brief description of what this project does and why you built it.",
      tech: ["React", "Three.js", "Tailwind"],
      liveLink: "#",
      githubLink: "#"
    },
    // Add more projects
  ]

  const gameProjects = [
    {
      title: "Unreal Engine Project",
      description: "Description of your game dev work, systems built, what you learned.",
      tech: ["Unreal Engine", "Blueprints", "C++"],
      liveLink: null,
      githubLink: null
    },
    // Add more projects
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
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
          <div className="text-zinc-400 space-y-4 text-lg">
            <p>
              I'm a developer who codes for fun and self-fulfillment. The market's hard to break into, 
              but that doesn't stop me from building things I want to exist and helping others solve problems.
            </p>
            <p>
              I work with React and JavaScript on the web side, and Unreal Engine for game development. 
              Currently pursuing my CS degree while taking on freelance work and building projects that interest me.
            </p>
            <p>
              When I'm not coding, I'm working as a barista trainer at Starbucks, where I help train new team 
              members and maintain quality standards.
            </p>
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
                activeSection === 'web' 
                  ? 'bg-emerald-500 text-black' 
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Web Development
            </button>
            <button
              onClick={() => setActiveSection('game')}
              className={`px-6 py-2 rounded font-semibold transition-colors ${
                activeSection === 'game' 
                  ? 'bg-emerald-500 text-black' 
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Game Development
            </button>
          </div>

          {/* Project Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {activeSection === 'web' && webProjects.map((project, i) => (
              <ProjectCard key={i} {...project} />
            ))}
            {activeSection === 'game' && gameProjects.map((project, i) => (
              <ProjectCard key={i} {...project} />
            ))}
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
            <a 
              href="mailto:wolfordmichael04@gmail.com"
              className="bg-emerald-500 hover:bg-emerald-600 text-black px-8 py-3 rounded font-semibold transition-colors"
            >
              Email Me
            </a>
            <a 
              href="https://linkedin.com/in/mikewolf04"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 px-8 py-3 rounded font-semibold transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/MikeWolf4"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 px-8 py-3 rounded font-semibold transition-colors"
            >
              GitHub
            </a>
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