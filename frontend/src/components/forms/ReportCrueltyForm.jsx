import { useState } from 'react'
import api from '../../api/client'
import MapPicker from '../map/MapPicker'

export default function ReportCrueltyForm({ onSuccess }) {
  const [form, setForm] = useState({ location: '', incident_description: '', severity: 'medium', lat: '', lng: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleMapClick = (lat, lng) => {
    setForm(prev => ({ ...prev, lat, lng }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.location || !form.incident_description) {
      setError('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/cruelty-reports', form)
      onSuccess?.(res.data)
      setForm({ location: '', incident_description: '', severity: 'medium', lat: '', lng: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
      <h3 className="mb-6 text-xl font-bold tracking-tight text-zinc-50">Incident Details</h3>
      {error && <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Location <span className="text-emerald-300">*</span></label>
          <input name="location" value={form.location} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            placeholder="Where did this happen?" required />
          <input type="hidden" name="lat" value={form.lat} />
          <input type="hidden" name="lng" value={form.lng} />
          {form.lat && form.lng && <p className="text-xs text-emerald-400">✓ Location pinned on map</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-400">Pin exact location on map <span className="text-zinc-600">(optional)</span></label>
          <MapPicker lat={form.lat ? parseFloat(form.lat) : null} lng={form.lng ? parseFloat(form.lng) : null} onChange={handleMapClick} onAddressChange={addr => setForm(prev => ({ ...prev, location: addr }))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Severity Level</label>
          <select name="severity" value={form.severity} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Incident Description <span className="text-emerald-300">*</span></label>
          <textarea name="incident_description" value={form.incident_description} onChange={handleChange} rows={5}
            className="resize-none rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            placeholder="Please describe what happened in detail. Include date, time, and any other relevant information..." required />
        </div>
      </div>
      <div className="mt-8">
        <button type="submit" disabled={submitting}
          className="rounded-full bg-emerald-400 px-8 py-2.5 font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </form>
  )
}
