import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900 ring-1 ring-zinc-800">
        <span className="text-5xl font-bold text-zinc-600">?</span>
      </div>
      <h1 className="text-6xl font-bold text-zinc-800">404</h1>
      <p className="mt-2 text-xl text-zinc-400">Page not found</p>
      <Link to="/" className="mt-6 rounded-full bg-emerald-400 px-6 py-2.5 font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300">
        Go home
      </Link>
    </div>
  )
}
