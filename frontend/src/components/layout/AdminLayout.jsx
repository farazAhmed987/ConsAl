import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const SIDEBAR_LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/reports', label: 'Animal Reports' },
  { to: '/admin/cruelty', label: 'Cruelty Reports' },
  { to: '/admin/doctors', label: 'Doctors' },
  { to: '/admin/donations', label: 'Donations' },
  { to: '/admin/rescue', label: 'Rescue' },
  { to: '/admin/adoptions', label: 'Adoptions' },
  { to: '/admin/awareness', label: 'Awareness' },
  { to: '/admin/blog', label: 'Blog' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="flex">
        <aside className="fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r border-zinc-800 bg-zinc-950 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-4">
            <Link to="/admin" className="text-lg font-black tracking-tight text-emerald-300 no-underline">ConsAl Admin</Link>
            <button onClick={toggleTheme}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {SIDEBAR_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
                }>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-zinc-800 p-3">
            <button onClick={handleLogout}
              className="w-full rounded-xl border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800">Logout</button>
          </div>
        </aside>
        <main className="ml-60 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
