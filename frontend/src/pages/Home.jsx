export default function Home() {
  return (
    <div className="relative min-h-screen">
      <img
        src="/assets/main_pg1.jpg"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-transparent"></div>
      <div className="relative z-10 flex min-h-[90vh] w-full flex-col justify-center px-6 text-zinc-50 md:px-20">
        <div className="max-w-2xl">
          <div className="mb-6 inline-block rounded-full border border-emerald-500/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
            Animal Welfare Initiative
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight drop-shadow-lg md:text-6xl">Love, Care your Pet</h2>
          <p className="max-w-xl text-base leading-relaxed text-zinc-300 drop-shadow-md md:text-xl">
            People love pets same as their children. A pet needs quality products and care services to stay healthy and happy.
          </p>
        </div>
      </div>
    </div>
  )
}
