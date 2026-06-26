import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const PRIMARY_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/map', label: 'Map' },
  { to: '/report-animal', label: 'Report' },
  { to: '/report-cruelty', label: 'Cruelty' },
  { to: '/adopt', label: 'Adopt' },
  { to: '/donate', label: 'Donate' }
]

const MORE_LINKS = [
  { to: '/register-doctor', label: 'Register Doctor' },
  { to: '/profile', label: 'Profile' },
  { to: '/my-applications', label: 'My Apps' },
  { to: '/blog', label: 'Blog' },
  { to: '/awareness', label: 'Awareness' },
  { to: '/rescue-updates', label: 'Rescue' }
]

const linkClass = ({ isActive }) =>
  `rounded-lg px-2.5 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`

export default function Header() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeMenus = () => {
    setMobileOpen(false)
    setMoreOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-1 md:mr-6">
          <Link to="/home" onClick={closeMenus} className="text-lg font-black tracking-tight text-emerald-300 no-underline">ConsAl</Link>
          {user?.role === 'admin' && (
            <span className="ml-2 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-500/30">Admin</span>
          )}
        </div>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {user?.role === 'user' && (
            <>
              {PRIMARY_LINKS.map(l => (
                <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
              ))}
              <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
                <button className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200">
                  More ▾
                </button>
                {moreOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl backdrop-blur-xl">
                    {MORE_LINKS.map(l => (
                      <NavLink key={l.to} to={l.to} onClick={closeMenus}
                        className={({ isActive }) =>
                          `block rounded-lg px-3 py-2 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
                        }>
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkClass}>Dashboard</NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user?.role === 'user' && (
            <button onClick={() => setMobileOpen(prev => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 lg:hidden">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
          <button onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="hidden text-sm text-zinc-400 lg:inline">{user?.name || user?.email}</span>
          <button onClick={handleLogout}
            className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800">Logout</button>
        </div>
      </div>

      {mobileOpen && user?.role === 'user' && (
        <div className="border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {[...PRIMARY_LINKS, ...MORE_LINKS].map(l => (
              <NavLink key={l.to} to={l.to} onClick={closeMenus}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
                }>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
