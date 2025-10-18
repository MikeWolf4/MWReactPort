import { useProgress } from '@react-three/drei'

export function LoadingScreen() {
  const { progress } = useProgress() // progress value (0–100)

  return (
    <div
      className="
        absolute inset-0 z-50 flex flex-col items-center justify-end
        bg-black transition-opacity duration-300 p-10
      "
    >
      <div className="text-right">
        {/* Header */}
        <h1 className="text-2xl font-bold text-emerald-400 mb-3">
          Loading Assets...
        </h1>

        {/* Progress Bar Container */}
        <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden ml-auto">
          {/* Inner Bar (animated width based on load progress) */}
          <div
            className="
              h-full bg-emerald-500
              transition-all duration-150 ease-out
            "
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <p className="mt-2 text-lg text-zinc-400">
          {progress.toFixed(0)}% Loaded
        </p>
      </div>
    </div>
  )
}
