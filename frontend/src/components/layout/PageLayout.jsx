export default function PageLayout({ children, title, subtitle, maxWidth = 'md:w-4/5 lg:w-3/5' }) {
  return (
    <div className="relative min-h-screen bg-zinc-950">
      {/* Ambient image + dark wash so content stays high-contrast */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
        style={{ backgroundImage: "url(/assets/image_sec.jpg)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/80 to-zinc-950" aria-hidden="true" />

      <div className={`relative z-10 w-full ${maxWidth} mx-auto min-h-screen px-4 md:px-12 py-10 md:py-16`}>
        {title && (
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-50 text-balance">{title}</h2>
            {subtitle && <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-zinc-400">{subtitle}</p>}
            <div className="mt-5 h-1 w-16 rounded-full bg-emerald-400" />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
