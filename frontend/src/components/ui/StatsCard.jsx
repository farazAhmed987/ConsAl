export default function StatsCard({ title, value, sub }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition-colors hover:border-emerald-500/40 md:p-6">
      <p className="mb-1 text-sm font-medium text-zinc-400">{title}</p>
      <p className="text-2xl font-bold tracking-tight text-zinc-50 md:text-3xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </div>
  )
}
