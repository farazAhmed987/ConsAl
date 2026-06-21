export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export function formatCurrency(amount) {
  return `$${parseFloat(amount).toFixed(2)}`
}

export function statusBadge(status) {
  const colors = {
    pending: 'bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30',
    in_progress: 'bg-sky-500/15 text-sky-300 ring-1 ring-inset ring-sky-500/30',
    investigating: 'bg-sky-500/15 text-sky-300 ring-1 ring-inset ring-sky-500/30',
    resolved: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30',
    approved: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30',
    rejected: 'bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30',
  }
  const cls = colors[status] || 'bg-zinc-700/40 text-zinc-300 ring-1 ring-inset ring-zinc-600/40'
  return cls
}

export function severityColor(severity) {
  const colors = {
    low: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30',
    medium: 'bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30',
    high: 'bg-orange-500/15 text-orange-300 ring-1 ring-inset ring-orange-500/30',
    critical: 'bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30',
  }
  return colors[severity] || 'bg-zinc-700/40 text-zinc-300 ring-1 ring-inset ring-zinc-600/40'
}
