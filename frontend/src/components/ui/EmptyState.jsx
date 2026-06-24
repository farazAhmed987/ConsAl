export default function EmptyState({ message = 'No data found', icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-4 py-16 text-center">
      {icon && <span className="mb-4 text-5xl opacity-90">{icon}</span>}
      <p className="text-lg font-medium text-zinc-300">{message}</p>
      {action && (
        <button onClick={action.onClick} className="mt-5 rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300">
          {action.label}
        </button>
      )}
    </div>
  )
}
