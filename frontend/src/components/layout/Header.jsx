import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { useState } from 'react'

export default function Header() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const links = [
    { to: '/home', label: 'Home' },
    { to: '/report-animal', label: 'Report Animal' },
    { to: '/register-doctor', label: 'Register Doctor' },
    { to: '/rescue-updates', label: 'Rescue' },
    { to: '/donate', label: 'Donate' },
    { to: '/map', label: 'Map' },
    { to: '/report-cruelty', label: 'Report Cruelty' },
    { to: '/awareness', label: 'Awareness' },
    { to: '/blog', label: 'Blog' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/70 bg-zinc-950/70 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-8 py-3.5">
        <Link to="/home" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 text-sm font-black text-zinc-950">C</span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-50">
            Cons<span className="text-emerald-300">Al</span>
          </h2>
        </Link>

        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-200 text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-full left-0 w-full md:w-auto border-b border-zinc-800/70 md:border-0 bg-zinc-950/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-0 z-50 p-4 md:p-0 gap-1 md:gap-1 md:items-center`}>
          {links.map(link => (
            <Link key={link.to} to={link.to}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-300 no-underline transition-colors hover:bg-zinc-800/60 hover:text-emerald-300"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col md:mt-0 md:ml-3 md:flex-row md:items-center gap-2 md:border-l md:border-zinc-800 md:pl-4">
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className="cursor-pointer rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-sm text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-300">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <span className="px-2 text-sm font-medium text-zinc-400">{user?.name}</span>
            {user?.role === 'admin' && (
              <Link to="/admin" className="px-2 text-sm font-semibold text-emerald-300 no-underline transition-colors hover:text-emerald-300" onClick={() => setMenuOpen(false)}>Admin</Link>
            )}
            <Link to="/profile" className="px-2 text-sm text-zinc-300 no-underline transition-colors hover:text-emerald-300" onClick={() => setMenuOpen(false)}>Profile</Link>
            <button onClick={handleLogout} className="cursor-pointer rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-sm font-medium text-zinc-200 transition-colors hover:border-emerald-500/50 hover:text-emerald-300">
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
