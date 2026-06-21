import { NavLink, Outlet } from 'react-router-dom'

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/rescue', label: 'Rescue Updates' },
  { to: '/admin/doctors', label: 'Doctors' },
  { to: '/admin/donations', label: 'Donations' },
  { to: '/admin/cruelty', label: 'Cruelty Reports' },
  { to: '/admin/awareness', label: 'Awareness' },
  { to: '/admin/blog', label: 'Blog' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 md:flex-row">
      <aside className="w-full border-b border-zinc-800/70 bg-zinc-950/80 p-5 backdrop-blur-md md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <NavLink to="/admin" end className="mb-8 flex items-center gap-2 no-underline">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 text-sm font-black text-zinc-950">C</span>
          <span className="text-lg font-bold tracking-tight text-zinc-50">ConsAl <span className="text-emerald-300">Admin</span></span>
        </NavLink>
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors ${
                  isActive
                    ? 'bg-emerald-400/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/" className="mt-8 block text-sm text-zinc-500 no-underline transition-colors hover:text-emerald-300">
          ← Back to Site
        </NavLink>
      </aside>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
