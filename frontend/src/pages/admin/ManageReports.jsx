import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/client'
import AdminCardGrid from '../../components/admin/AdminCardGrid'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const STATUS_OPTIONS = ['pending', 'in_progress', 'rescued', 'recovering', 'released']

const STATUS_BADGE = {
  pending: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30',
  in_progress: 'bg-blue-500/10 text-blue-400 ring-blue-500/30',
  rescued: 'bg-emerald-400/10 text-emerald-300 ring-emerald-500/30',
  recovering: 'bg-purple-500/10 text-purple-400 ring-purple-500/30',
  released: 'bg-zinc-500/10 text-zinc-300 ring-zinc-500/30'
}

export default function ManageReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [notesInput, setNotesInput] = useState({})
  const location = useLocation()

  const load = () => {
    setLoading(true)
    api.get('/reports').then(res => setReports(res.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [location.key])

  const handleStatus = async (id, status) => {
    try {
      const res = await api.put(`/reports/${id}/status`, { status })
      setReports(prev => prev.map(r => r.id === id ? { ...r, ...res.data } : r))
    } catch (e) { alert(e.response?.data?.detail || e.response?.data?.error || 'Failed to update') }
  }

  const handleNotesSave = async (id) => {
    const val = notesInput[id] !== undefined ? notesInput[id] : ''
    try {
      const res = await api.put(`/reports/${id}/status`, { admin_notes: val })
      setReports(prev => prev.map(r => r.id === id ? { ...r, ...res.data } : r))
      setNotesInput(prev => ({ ...prev, [id]: '' }))
    } catch (e) { alert(e.response?.data?.detail || e.response?.data?.error || 'Failed to save notes') }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-50">Manage Animal Reports</h2>
        <p className="text-sm text-zinc-500">View and manage all animal sighting & rescue reports</p>
      </div>
      <AdminCardGrid items={reports} emptyMessage="No animal reports submitted yet" renderCard={r => (
        <>
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-zinc-100">{r.animal_type}</h3>
              <p className="text-xs text-zinc-500">by {r.submitter || 'Unknown'}</p>
            </div>
            <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_BADGE[r.status] || 'bg-zinc-800 text-zinc-400 ring-zinc-700'}`}>
              {r.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="mb-2 flex-1 text-sm leading-relaxed text-zinc-400">{r.description}</p>
          <div className="mb-3 text-xs text-zinc-500">
            <p>{r.location}</p>
            <p>{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</p>
          </div>
          <div className="mb-3 flex items-center gap-2 border-t border-zinc-800 pt-3">
            <span className="text-xs text-zinc-500">Status:</span>
            <select value={r.status} onChange={e => handleStatus(r.id, e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="border-t border-zinc-800 pt-3">
            <div className="flex items-start gap-2">
              <input value={notesInput[r.id] !== undefined ? notesInput[r.id] : (r.admin_notes || '')}
                onChange={e => setNotesInput(prev => ({ ...prev, [r.id]: e.target.value }))}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                placeholder="Admin notes (optional)" />
              <button onClick={() => handleNotesSave(r.id)}
                className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-400/20">Save</button>
            </div>
            {r.admin_notes && <p className="mt-2 text-xs italic text-zinc-500">Notes: {r.admin_notes}</p>}
          </div>
        </>
      )} />
    </div>
  )
}
