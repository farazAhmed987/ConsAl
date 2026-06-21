import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Email and password are required')
      return
    }
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 ring-1 ring-emerald-500/20">
            <span className="text-2xl font-bold text-emerald-300">C</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Welcome Back</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in to your ConsAl account</p>
        </div>
        {error && <p className="mb-4 text-center text-sm text-red-400">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              placeholder="you@example.com" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading}
            className="mt-2 rounded-full bg-emerald-400 py-2.5 font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          Don't have an account? <Link to="/signup" className="font-medium text-emerald-300 hover:text-emerald-300">Sign up</Link>
        </p>
        <p className="mt-2 text-center text-xs text-zinc-600">
          Demo admin: admin@pawpal.com / admin123
        </p>
      </div>
    </div>
  )
}
