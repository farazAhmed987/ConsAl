import { useState } from 'react'
import api from '../../api/client'
import MapPicker from '../map/MapPicker'

export default function RegisterDoctorForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', clinic_name: '', specialty: '', city: '', contact: '', location: '', lat: '', lng: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleMapClick = (lat, lng) => {
    setForm(prev => ({ ...prev, lat, lng }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.name || !form.clinic_name || !form.city || !form.contact) {
      setError('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/doctors', form)
      setSuccess('Doctor submitted for admin approval!')
      setForm({ name: '', clinic_name: '', specialty: '', city: '', contact: '', location: '', lat: '', lng: '' })
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur md:p-8">
      <h3 className="mb-6 text-xl font-bold tracking-tight text-zinc-50">Doctor Information</h3>
      {error && <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      {success && <div className="mb-6 rounded-lg border-l-4 border-emerald-500 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{success}</div>}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Doctor Name <span className="text-emerald-300">*</span></label>
          <input name="name" value={form.name} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" placeholder="Dr. John Doe" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Clinic Name <span className="text-emerald-300">*</span></label>
          <input name="clinic_name" value={form.clinic_name} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" placeholder="City Pet Clinic" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Specialty</label>
          <select name="specialty" value={form.specialty} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30">
            <option value="">Select specialty...</option>
            <option value="General">General</option>
            <option value="Surgeon">Surgeon</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Dentist">Dentist</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">City <span className="text-emerald-300">*</span></label>
          <input name="city" value={form.city} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" placeholder="Lahore" required />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-zinc-300">Clinic Address</label>
          <input name="location" value={form.location} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            placeholder="Street address of the clinic" />
          <input type="hidden" name="lat" value={form.lat} />
          <input type="hidden" name="lng" value={form.lng} />
          {form.lat && form.lng && <p className="text-xs text-emerald-400">✓ Location pinned on map</p>}
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-zinc-400">Pin exact location on map <span className="text-zinc-600">(optional)</span></label>
          <MapPicker lat={form.lat ? parseFloat(form.lat) : null} lng={form.lng ? parseFloat(form.lng) : null} onChange={handleMapClick} onAddressChange={addr => setForm(prev => ({ ...prev, location: addr }))} />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-zinc-300">Contact Info <span className="text-emerald-300">*</span></label>
          <input name="contact" value={form.contact} onChange={handleChange}
            className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" placeholder="Phone number or email" required />
        </div>
      </div>
      <div className="mt-8">
        <button type="submit" disabled={submitting}
          className="rounded-full bg-emerald-400 px-8 py-2.5 font-semibold text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Register Doctor'}
        </button>
      </div>
    </form>
  )
}
