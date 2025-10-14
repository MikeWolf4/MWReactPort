export function ProjectCard({ title, description, tech, liveLink, githubLink }) {
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