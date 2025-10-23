3D web portfolio built with **React**, **Vite**, **TailwindCSS**, and **React Three Fiber (R3F)** 

---

##  Setup Process

### 1. Initial Project Setup
- Created a **React + Vite** boilerplate for a fast development environment.  
- Integrated **TailwindCSS** for responsive, utility-based styling.  
- Built a base portfolio layout with sections for web, game, and 3D projects.

### 2. Integrating Three.js with React
- Added a **React Three Fiber** `<Canvas>` as the main 3D viewport.  
- Configured a dynamic **camera rig** for pointer-driven motion.  
- Used **lazy loading** (`React.lazy` + `<Suspense>`) to defer heavy components and reduce initial load.  
- Memoized static components (`React.memo`, `useMemo`) to avoid unnecessary re-renders.

---

##  Model Creation & Optimization

### 3. Acquiring & Preparing Assets
- Imported models from **Unreal Engine Marketplace** and **DAZ Studio**.  
- Transferred assets to **Blender** for cleanup and optimization.

### 4. Mesh & Texture Cleanup
- **Combined** multiple UV maps into single atlases for optimized texture usage.  
- **Decimated** geometry one mesh at a time to reduce polygon count while preserving shape.  
- **Separated** TV screen meshes for each display and assigned unique material slots.  
- Exported optimized models in **GLTF/GLB** format for web compatibility.

---

##  Scene Construction

### 5. Canvas & Scene Composition
- Mounted all 3D assets inside the R3F `<Canvas>`.  
- Implemented traversal functions to locate meshes by name and apply dynamic materials.  
- Assigned **toon**, **metal**, and **transparent** materials through regex-based naming logic.

### 6. Dynamic Video Textures
- Each TV screen uses a **video texture** that can:
  - Loop specific videos.  
  - Toggle **on/off** states.  
  - Revert to original static screen textures when off.

### 7. Reflective & Environmental Effects
- Created a **reflective floor** using `MeshReflectorMaterial`.  
- Applied **postprocessing effects** like Depth of Field, Vignette, and Noise for cinematic tone.

---

##  Interactivity & Logic

### 8. User Interface Controls
- Built UI buttons in React to control:
  - Scene visibility.  
  - Performance mode.  
  - Stats / performance overlay.  
- Integrated a loading screen with `<Suspense>` for async model loading feedback.

### 9. Material Management
- Used **scene traversal and caching** to:
  - Apply textures and shaders by material name.  
  - Dispose of geometries and materials on unmount to prevent GPU memory leaks.  
  - Clear Drei’s GLTF cache when changing models.

### 10. Performance Optimization
- Used **lazy loading** for large Three.js components to improve startup time.  
- Wrapped expensive logic in `useMemo` and static assets in `React.memo`.  
- Monitored draw calls and triangle counts using **r3f-perf** for real-time GPU metrics.  
- Ensured consistent 150–175 FPS average on desktop at ~1M triangles.

---

## Development Notes

- Used AI-assisted tooling (ChatGPT / Copilot) for:
  - Refactoring traversal logic.  
  - Establishing best practices for material management.  
  - Learning optimal disposal patterns to avoid memory leaks.  
- Iteratively tested emissive texture maps, transparency layering, and reflective shaders.  
- Verified WebGL stability with controlled scene reloading and context preservation.

---

##  Tech Stack

| Category | Tool |
|-----------|------|
| Framework | React + Vite |
| Styling | TailwindCSS |
| 3D Engine | React Three Fiber + Drei |
| Shading | Three.js (Toon + Standard Materials) |
| Post FX | postprocessing (DoF, Vignette, Noise) |
| Assets | Blender, DAZ, Unreal Marketplace |
| Optimization | React.lazy, useMemo, React.memo |
| Debugging | r3f-perf, Stats.js |
| Asset Format | GLTF / GLB |

---

## 🧾 License
MIT — open source, free to modify with credit.
