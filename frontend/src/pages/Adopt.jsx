import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import MapView from '../components/map/MapView'

export default function Adopt() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ name: '', contact: '', address: '', reason: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/adoptions/available')
      .then(res => setAnimals(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.contact.trim() || !form.address.trim()) {
      setError('Name, contact, and address are required')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/adoptions', { cruelty_report_id: selected.id, ...form })
      setSuccess('Application submitted! The rescue team will review it soon.')
      setForm({ name: '', contact: '', address: '', reason: '' })
      setSelected(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Adopt an Animal</h1>
        <p className="mt-2 text-zinc-400">Give a rescued animal a loving forever home</p>
      </div>

      {animals.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-12 text-center backdrop-blur">
          <p className="text-lg text-zinc-500">No animals available for adoption right now</p>
          <p className="mt-1 text-sm text-zinc-600">Check back soon — new rescues are being added regularly</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {animals.map(a => (
            <div key={a.id} className="group flex cursor-pointer flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">{a.animal_type || 'Unknown animal'}</h3>
                  {a.breed && <p className="text-xs text-zinc-500">{a.breed}</p>}
                </div>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/30">Available</span>
              </div>
              <p className="mb-3 flex-1 text-sm leading-relaxed text-zinc-400">{a.incident_description || a.description}</p>
              <div className="mb-3 text-xs text-zinc-500">
                <p>{a.location}</p>
                <p>Reported: {new Date(a.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelected(a)}
                className="w-full rounded-xl bg-emerald-400/10 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-400/20">
                Apply to Adopt
              </button>
            </div>
          ))}
        </div>
      )}

      {animals.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-zinc-50">Animal Locations</h2>
          <div className="h-80 overflow-hidden rounded-2xl border border-zinc-800">
            <MapView items={animals.map(a => ({ ...a, type: 'adoption' }))} center={[20, 0]} zoom={2} />
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="mb-1 text-xl font-bold text-zinc-50">Apply to Adopt</h2>
            <p className="mb-4 text-sm text-zinc-400">{selected.animal_type} - {selected.location}</p>
            {success && <p className="mb-4 rounded-lg bg-emerald-400/10 p-3 text-sm text-emerald-300">{success}</p>}
            {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-300">Your Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" placeholder="John Doe" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-300">Contact *</label>
                <input value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" placeholder="Phone or email" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-300">Address *</label>
                <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" placeholder="Your home address" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-300">Why do you want to adopt? (optional)</label>
                <textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} rows={3}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" placeholder="Tell us why this animal is right for you..." />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setSelected(null)}
                  className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 rounded-xl bg-emerald-400 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300 disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
