export default function StatsCard({ title, value, sub, icon, color }) {
  return (
    <div className={`rounded-2xl border bg-zinc-900/60 p-5 backdrop-blur transition-colors hover:border-emerald-500/40 md:p-6 ${color || 'border-zinc-800'}`}>
      <div className="mb-2 flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <p className="text-sm font-medium text-zinc-400">{title}</p>
      </div>
      <p className="text-2xl font-bold tracking-tight text-zinc-50 md:text-3xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </div>
  )
}
