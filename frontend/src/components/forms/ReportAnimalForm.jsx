import { useState } from 'react'
import api from '../../api/client'
import { useAuth } from '../../hooks/useAuth'
import MapPicker from '../map/MapPicker'

export default function ReportAnimalForm({ onSuccess }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    animal_type: '', location: '', description: '', contact_name: user?.name || '', contact_phone: user?.phone || '', lat: '', lng: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleMapClick = (lat, lng) => {
    setForm(prev => ({ ...prev, lat, lng }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.animal_type || !form.location || !form.description) {
      setError('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/reports', form)
      onSuccess?.(res.data)
      setForm({ animal_type: '', location: '', description: '', contact_name: user?.name || '', contact_phone: user?.phone || '', lat: '', lng: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
      <h3 className="mb-6 text-xl font-bold tracking-tight text-zinc-50">Report Details</h3>
      {error && (
        <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      )}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Animal Type <span className="text-emerald-300">*</span></label>
          <select name="animal_type" value={form.animal_type} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" required>
            <option value="">Select type...</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Cow">Cow</option>
            <option value="Goat">Goat</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Location <span className="text-emerald-300">*</span></label>
          <input name="location" value={form.location} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            placeholder="e.g. Street 12, Lahore" required />
          <input type="hidden" name="lat" value={form.lat} />
          <input type="hidden" name="lng" value={form.lng} />
          {form.lat && form.lng && <p className="text-xs text-emerald-400">✓ Location pinned on map</p>}
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-zinc-400">Pin exact location on map <span className="text-zinc-600">(optional)</span></label>
          <MapPicker lat={form.lat ? parseFloat(form.lat) : null} lng={form.lng ? parseFloat(form.lng) : null} onChange={handleMapClick} onAddressChange={addr => setForm(prev => ({ ...prev, location: addr }))} />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-zinc-300">Description <span className="text-emerald-300">*</span></label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            className="resize-none rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            placeholder="Describe the animal's condition, injuries, behavior..." required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Your Name</label>
          <input name="contact_name" value={form.contact_name} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Contact No.</label>
          <input name="contact_phone" value={form.contact_phone} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            placeholder="+92 300 1234567" />
        </div>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <button type="submit" disabled={submitting}
          className="rounded-full bg-emerald-400 px-8 py-2.5 font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
        <span className="text-xs text-zinc-500">All submissions are reviewed promptly</span>
      </div>
    </form>
  )
}
