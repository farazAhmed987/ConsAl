export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-md" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-zinc-50">{title}</h2>
          <button onClick={onClose} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-zinc-800/60 text-2xl leading-none text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
