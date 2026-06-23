import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/client'
import AdminCardGrid, { StatusBadge } from '../../components/admin/AdminCardGrid'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function ManageCruelty() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const load = () => {
    setLoading(true)
    api.get('/cruelty-reports').then(res => setReports(res.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [location.key])

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/cruelty-reports/${id}/status`, { status })
      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } catch (e) { alert('Failed to update') }
  }

  const severityColors = {
    low: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30',
    medium: 'bg-orange-500/10 text-orange-400 ring-orange-500/30',
    high: 'bg-red-500/10 text-red-400 ring-red-500/30',
    critical: 'bg-purple-500/10 text-purple-400 ring-purple-500/30'
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-50">Manage Cruelty Reports</h2>
        <p className="text-sm text-zinc-500">Review and update the status of cruelty reports</p>
      </div>
      <AdminCardGrid items={reports} emptyMessage="No cruelty reports submitted" renderCard={r => (
        <>
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-zinc-100">{r.submitter || 'Anonymous'}</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${severityColors[r.severity] || 'bg-zinc-800 text-zinc-400 ring-zinc-700'}`}>
                {r.severity}
              </span>
            </div>
            <StatusBadge status={r.status} mapping={{ investigating: 'bg-orange-500/10 text-orange-400 ring-orange-500/30' }} />
          </div>
          <p className="mb-2 flex-1 text-sm leading-relaxed text-zinc-400">{r.incident_description}</p>
          <div className="mb-3 text-xs text-zinc-500">
            <p>📍 {r.location}</p>
            <p>📅 {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</p>
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-zinc-800 pt-3">
            <span className="text-xs text-zinc-500">Status:</span>
            <select value={r.status} onChange={e => handleStatus(r.id, e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30">
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </>
      )} />
    </div>
  )
}
