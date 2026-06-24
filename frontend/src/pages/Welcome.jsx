import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 md:flex-row">
      <div className="relative h-[50vh] w-full overflow-hidden md:order-2 md:h-screen md:w-1/2">
        <img
          src="/assets/image_sec.jpg"
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/10 via-transparent to-zinc-950/30 md:bg-gradient-to-l md:from-emerald-400/10 md:via-transparent md:to-zinc-950/30"></div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0">
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-950/60 p-4 text-center backdrop-blur-sm md:text-left">
            <p className="text-sm font-medium text-emerald-300">Every paw matters.</p>
            <p className="text-xs text-zinc-400">Join us in making a difference.</p>
          </div>
        </div>
      </div>
      <div className="flex h-[50vh] w-full flex-col items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-6 text-center md:h-screen md:w-1/2">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 ring-1 ring-emerald-500/20">
          <span className="text-3xl font-bold text-emerald-300">C</span>
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-50 md:text-5xl">Welcome to ConsAl</h1>
        <p className="mb-8 max-w-md text-sm text-zinc-400 md:text-base">
          Connecting people with animal welfare initiatives across Punjab. Report injured animals,
          find veterinarians, donate, and stay updated on rescues.
        </p>
        <button onClick={() => navigate('/login')}
          className="rounded-full bg-emerald-400 px-10 py-3 text-lg font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300">
          Get Started
        </button>
      </div>
    </div>
  )
}
