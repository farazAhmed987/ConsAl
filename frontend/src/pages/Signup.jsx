import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signup(form)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
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
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Create Account</h1>
          <p className="mt-1 text-sm text-zinc-500">Join ConsAl to help animals in need</p>
        </div>
        {error && <p className="mb-4 text-center text-sm text-red-400">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              placeholder="John Doe" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              placeholder="you@example.com" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Phone (optional)</label>
            <input name="phone" value={form.phone} onChange={handleChange}
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              placeholder="+92 300 1234567" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              placeholder="Min 6 characters" required />
          </div>
          <button type="submit" disabled={loading}
            className="mt-2 rounded-full bg-emerald-400 py-2.5 font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          Already have an account? <Link to="/login" className="font-medium text-emerald-300 hover:text-emerald-300">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
