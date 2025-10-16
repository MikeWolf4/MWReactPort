


import React from 'react';

const ControlsPopover = ({ 
    muted, 
    volume, 
    handleMuteToggle, 
    setVolume, 
    setPerformanceMode, 
    setHasInteracted,
    performanceMode, 
    
}) => {
   
    return (
     
        <div className="absolute right-6 top-16 bg-zinc-800 p-4 rounded-lg shadow-xl z-50 flex flex-col gap-4"> 

         

            <div className="flex items-center gap-3">
                
                <div className="flex items-center gap-2">
                    {/* Mute/Unmute Icon Button */}
                    <button onClick={handleMuteToggle} className="p-2 text-zinc-400 hover:text-white transition-colors">
                        {/* The icon changes based on the 'muted' state */}
                        {muted || volume === 0 
                            ? (/* Speaker Muted Icon */ 
                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M5.707 4.293a1 1 0 0 0-1.414 1.414l14 14a1 1 0 0 0 1.414-1.414l-.004-.005C21.57 16.498 22 13.938 22 12a9.972 9.972 0 0 0-2.929-7.071 1 1 0 1 0-1.414 1.414A7.972 7.972 0 0 1 20 12c0 1.752-.403 3.636-1.712 4.873l-1.433-1.433C17.616 14.37 18 13.107 18 12c0-1.678-.69-3.197-1.8-4.285a1 1 0 1 0-1.4 1.428A3.985 3.985 0 0 1 16 12c0 .606-.195 1.335-.59 1.996L13 11.586V6.135c0-1.696-1.978-2.622-3.28-1.536L7.698 6.284l-1.99-1.991ZM4 8h.586L13 16.414v1.451c0 1.696-1.978 2.622-3.28 1.536L5.638 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/></svg>)
                            : (/* Speaker Unmuted Icon */ 
                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 6.037c0-1.724-1.978-2.665-3.28-1.562L5.638 7.933H4c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z"/><path fillRule="evenodd" d="M14.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 18 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 16 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z" clipRule="evenodd"/><path fillRule="evenodd" d="M17.657 4.811a.988.988 0 0 1 1.414 0A10.224 10.224 0 0 1 22 12c0 2.807-1.12 5.35-2.929 7.189a.988.988 0 0 1-1.414 0 1.029 1.029 0 0 1 0-1.438A8.173 8.173 0 0 0 20 12a8.173 8.173 0 0 0-2.343-5.751 1.029 1.029 0 0 1 0-1.438Z" clipRule="evenodd"/></svg>)
                        }
                    </button>
                    
                    {/* Volume Slider */}
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        // Add disabled state when muted for better UX
                        disabled={muted}
                        onChange={(e) => {
                            setHasInteracted(true);
                            const newVolume = parseFloat(e.target.value);
                            setVolume(newVolume);
                        }}
                        // 🛑 Add transition for smooth opacity change
                        className={`w-40 accent-emerald-500 transition-opacity duration-300 ${muted ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                    />
                </div>

                {/* Performance Mode Button */}
                <button
                    onClick={() => setPerformanceMode(prev => !prev)} // Use functional update
                    className={`px-4 py-2 rounded transition-colors min-w-[160px] ${
                        performanceMode
                            ? "bg-yellow-500 text-black hover:bg-yellow-600"
                            : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                >
                    {performanceMode ? 'Performance Mode' : 'Quality Mode'}
                </button>
            </div>
        </div>
    );
};

export default ControlsPopover;