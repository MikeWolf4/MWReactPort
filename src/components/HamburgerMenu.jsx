import { useState } from "react";
import { SpeakerMutedIcon, SpeakerUnmutedIcon, BurgerMenuIcon } from '../utils/SVGicons'; 

export function  HamburgerMenu({
  isSectionVisible,
  setIsSectionVisible,
  isCanvasVisible,
  setIsCanvasVisible,
  performanceMode,
  setPerformanceMode
}) {
  
  // The rest of the component body is correct
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-[8px] z-50">
      
      {/* Hamburger Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="p-3 bg-black/70  border-zinc-700 hover:bg-black/90 transition"
      >
        {open ? (
          <BurgerMenuIcon className="w-6 h-6 text-emerald-400" />
        ) : (
          <BurgerMenuIcon className="w-6 h-6 text-emerald-400" />
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-black/80 border border-zinc-700 rounded-xl shadow-lg backdrop-blur-md p-2 text-sm flex flex-col gap-2">
          <button
            onClick={() => {
              setIsSectionVisible(!isSectionVisible);
              setOpen(false);
            }}
            className="hover:bg-emerald-500/10 text-emerald-400 px-3 py-2 rounded transition"
          >
            {isSectionVisible ? "Hide Section" : "Show Section"}
          </button>

          <button
            onClick={() => {
              setIsCanvasVisible(!isCanvasVisible);
              setOpen(false);
            }}
            className={`px-3 py-2 rounded transition ${
              isCanvasVisible
                ? "hover:bg-red-500/10 text-red-400"
                : "hover:bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {isCanvasVisible ? "Disable 3D" : "Enable 3D"}
          </button>

          <button
            onClick={() => {
              setPerformanceMode(!performanceMode);
              setOpen(false);
            }}
            className={`px-3 py-2 rounded transition ${
              performanceMode
                ? "hover:bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                : "hover:bg-zinc-800/45 text-zinc-400 hover:text-white"
            }`}
          >
            {performanceMode ? "Performance" : "Quality"}
          </button>
        </div>
      )}
    </div>
  );
}

