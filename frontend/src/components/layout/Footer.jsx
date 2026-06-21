export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/70 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 py-6 text-center">
        <p className="text-sm font-semibold tracking-tight text-zinc-200">
          Cons<span className="text-emerald-300">Al</span>
        </p>
        <p className="text-xs text-zinc-500">© {new Date().getFullYear()} ConsAl. All rights reserved.</p>
      </div>
    </footer>
  )
}
