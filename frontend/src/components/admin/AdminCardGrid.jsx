export default function AdminCardGrid({ items, renderCard, emptyMessage = 'No items', getKey }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center backdrop-blur">
        <p className="text-sm text-zinc-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map(item => (
        <div key={getKey ? getKey(item) : item.id} className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition-colors hover:border-emerald-500/40">
          {renderCard(item)}
        </div>
      ))}
    </div>
  )
}

export function StatusBadge({ status, mapping = {} }) {
  const colorMap = {
    approved: 'bg-emerald-400/10 text-emerald-300 ring-emerald-500/30',
    rejected: 'bg-red-500/10 text-red-400 ring-red-500/30',
    pending: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30',
    in_progress: 'bg-blue-500/10 text-blue-400 ring-blue-500/30',
    investigating: 'bg-orange-500/10 text-orange-400 ring-orange-500/30',
    resolved: 'bg-emerald-400/10 text-emerald-300 ring-emerald-500/30',
    ...mapping
  }
  const colors = colorMap[status] || 'bg-zinc-800 text-zinc-400 ring-zinc-700'
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${colors}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
