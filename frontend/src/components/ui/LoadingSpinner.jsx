export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-500"></div>
      <p className="mt-4 text-sm text-zinc-400">{text}</p>
    </div>
  )
}
