import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/client'
import AdminCardGrid, { StatusBadge } from '../../components/admin/AdminCardGrid'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function ManageReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const load = () => {
    setLoading(true)
    api.get('/reports').then(res => setReports(res.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [location.key])

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/reports/${id}/status`, { status })
      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } catch (e) { alert('Failed to update') }
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
            <StatusBadge status={r.status} mapping={{ in_progress: 'bg-blue-500/10 text-blue-400 ring-blue-500/30' }} />
          </div>
          <p className="mb-2 flex-1 text-sm leading-relaxed text-zinc-400">{r.description}</p>
          <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
            <span>📍 {r.location}</span>
            <span>📅 {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</span>
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-zinc-800 pt-3">
            <span className="text-xs text-zinc-500">Status:</span>
            <select value={r.status} onChange={e => handleStatus(r.id, e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </>
      )} />
    </div>
  )
}
