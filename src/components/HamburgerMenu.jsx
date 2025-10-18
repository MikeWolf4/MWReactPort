import { useState } from "react"
import { BurgerMenuIcon } from '../utils/SVGicons'

export function HamburgerMenu({
  isSectionVisible,
  setIsSectionVisible,
  isCanvasVisible,
  setIsCanvasVisible,
  performanceMode,
  setPerformanceMode,
  isStatsVisible, 
  setIsStatsVisible
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-2 z-50">

      {/* --- Hamburger Toggle Button --- */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="p-3 bg-black/70 border border-zinc-700 rounded-lg hover:bg-black/90 transition"
      >
        <BurgerMenuIcon className="w-6 h-6 text-emerald-400" />
      </button>

      {/* --- Dropdown Menu --- */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-black/80 border border-zinc-700 
                        rounded-xl shadow-lg backdrop-blur-md p-2 text-sm flex flex-col gap-2">

          {/* Toggle Section Visibility */}
          <button
            onClick={() => {
              setIsSectionVisible(prev => !prev)
              setOpen(false)
            }}
            className="hover:bg-emerald-500/10 text-emerald-400 px-3 py-2 rounded transition"
          >
            {isSectionVisible ? "Hide Section" : "Show Section"}
          </button>

          {/* Enable / Disable 3D Canvas */}
          <button
            onClick={() => {
              setIsCanvasVisible(prev => !prev)
              setOpen(false)
            }}
            className={`px-3 py-2 rounded transition ${
              isCanvasVisible
                ? "hover:bg-red-500/10 text-red-400"
                : "hover:bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {isCanvasVisible ? "Disable 3D" : "Enable 3D"}
          </button>

          {/* Performance / Quality Mode Toggle */}
          <button
            onClick={() => {
              setPerformanceMode(prev => !prev)
              setOpen(false)
            }}
            className={`px-3 py-2 rounded transition ${
              performanceMode
                ? "text-yellow-400 hover:bg-yellow-500/10"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/45"
            }`}
          >
            {performanceMode ? "Performance" : "Quality"}
          </button>

          {/* Toggle Stats Visibility */}
          <button
            onClick={() => {
              setIsStatsVisible(prev => !prev)
              setOpen(false)
            }}
            className={`px-3 py-2 rounded transition ${
              isStatsVisible
                ? "text-emerald-400 hover:bg-emerald-500/10"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/45"
            }`}
          >
            {isStatsVisible ? "Stats" : "Stats"}
          </button>

        </div>
      )}
    </div>
  )
}
