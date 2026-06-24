import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-1 md:mr-6">
          <Link to="/home" className="text-lg font-black tracking-tight text-emerald-300 no-underline">ConsAl</Link>
          {user?.role === 'admin' && (
            <span className="ml-2 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-500/30">Admin</span>
          )}
        </div>

        <nav className="hidden items-center gap-0.5 md:flex">
          {user?.role === 'user' && (
            <>
              <NavLink to="/home" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>Home</NavLink>
              <NavLink to="/doctors" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>Doctors</NavLink>
              <NavLink to="/register-doctor" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>Register Doctor</NavLink>
              <NavLink to="/report-animal" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>Report Animal</NavLink>
              <NavLink to="/report-cruelty" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>Report Cruelty</NavLink>
              <NavLink to="/donate" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>Donate</NavLink>
              <NavLink to="/adopt" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>Adopt</NavLink>
              <NavLink to="/my-applications" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>My Apps</NavLink>
              <NavLink to="/blog" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>Blog</NavLink>
              <NavLink to="/awareness" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>Awareness</NavLink>
              <NavLink to="/rescue-updates" className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
              }>Rescue</NavLink>
            </>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) =>
              `rounded-lg px-2 py-1.5 text-sm font-medium no-underline transition ${isActive ? 'bg-emerald-400/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`
            }>Dashboard</NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="hidden text-sm text-zinc-400 lg:inline">{user?.name || user?.email}</span>
          <button onClick={handleLogout}
            className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800">Logout</button>
        </div>
      </div>
    </header>
  )
}
