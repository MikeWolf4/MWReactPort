import { useState, useEffect, useRef, Suspense } from 'react'

import { Stats } from '@react-three/drei' 
import { SpeakerMutedIcon, SpeakerUnmutedIcon, BurgerMenuIcon } from '../utils/SVGicons'; 
import { HamburgerMenu } from "./HamburgerMenu.jsx";
import { ThreeScene } from './ThreeScene'
import { ProjectCard } from './ProjectCard'
import { LoadingScreen } from './LoadingScreen';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('web')
  const [mainVideo, setMainVideo] = useState(null)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(.25)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [performanceMode, setPerformanceMode] = useState(false)

  const modelRef = useRef()

  const [isCanvasVisible, setIsCanvasVisible] = useState(true)
  const [isSectionVisible, setIsSectionVisible] = useState(true)
  

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
      
      // try to play if unmuting
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
    
    // direct immediate update
    if (mainVideo) {
      mainVideo.muted = newMuted
      if (!newMuted) {
        mainVideo.play().catch(err => console.log('Play error:', err))
      }
      console.log('Video element muted state:', mainVideo.muted, 'volume:', mainVideo.volume)
    }
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-sm border-b border-zinc-800 z-50">
    <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
    
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-emerald-400">MW</h1>
        </div>
     
        <div className="flex gap-6  justify-center -ml-10">
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-emerald-400 transition-colors">Skills</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
        </div>
        
      {/* <Stats/> */}
        <div className="flex items-center gap-3  justify-end">
            
            {/* Desktop-Only Controls (Stats and commented Audio) */}
            <div className="**hidden sm:flex** items-center gap-3">
{/* here is the audio stuff but I dont think I need it so commenting it just in case///////////////////////////// */}

     {/* <div className="flex items-center gap-2">

         <button onClick={handleMuteToggle} className="p-2 text-zinc-400 hover:text-white transition-colors">
            {muted || volume === 0
                ? <SpeakerMutedIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                : <SpeakerUnmutedIcon className="w-6 h-6 text-gray-800 dark:text-white" />
            }
        </button>

        <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
                setHasInteracted(true);
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
            }}

            className={`w-40 accent-emerald-500`}
        />

          </div> */}

{/* here is the audio stuff but I dont think I need it so commenting it just in case///////////////////////////// */}

            </div>
          
            <HamburgerMenu
                isSectionVisible={isSectionVisible}
                setIsSectionVisible={setIsSectionVisible}
                isCanvasVisible={isCanvasVisible}
                setIsCanvasVisible={setIsCanvasVisible}
                performanceMode={performanceMode}
                setPerformanceMode={setPerformanceMode}
            />
        </div>
        
    </nav>
</header>
      

      {/* canvas title overlay */}
      <section className="h-screen flex items-center justify-center relative">          
{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
       
        
        {/* conditional rendering of threescene */}
        {isCanvasVisible && (
          <div className="absolute inset-0 z-0">
            <Suspense fallback={<LoadingScreen />}> 
                <ThreeScene 
                  modelRef={modelRef} 
                  setMainVideo={setMainVideo} 
                  performanceMode={performanceMode} 
                />
            </Suspense>
          </div>
        )}
        <div className="text-center z-10">
          
          <div className='flex justify-center gap-4 mb-8'>
            {/* hide section toggle button */}
            
            
            {/* three.js canvas toggle button */}
         
          </div>

          {/* conditional rendering of section content */}
          {isSectionVisible && (
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
                  My Focus
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
            <p>Hey, I’m Michael Wolford, if you’re working on a game or web project and feeling stuck, I’m happy to help.</p>
            <p>I’ve spent years working with Unreal Engine on things like locomotion setups, motion matching, ALSv4, combat and melee systems, weapon line tracing (1st & 3rd person), inventory, replication, and character asset management.</p>
            <p>On the web side, I also work with React, Three.js, and WebGL building interactive sites and tools that bring game assets or ideas to life right in the browser.</p>
            <p>Whether your Blueprint logic won’t behave, your React component chain’s breaking, or you just need a second pair of eyes to untangle a system, I get it. Balancing creativity and tech can be frustrating when you’re solo or short on time.</p>
            
            <p>I’m here to help people get unstuck, learn something new, and keep their projects moving forward without the stress. If that sounds like what you need, feel free to reach out.</p>
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