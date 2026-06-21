import { useState, useEffect } from 'react'
import api from '../../api/client'
import DataTable from '../../components/admin/DataTable'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

export default function ManageCruelty() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => api.get('/cruelty').then(res => setReports(res.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/cruelty/${id}`, { status })
      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } catch (e) { alert('Failed to update') }
  }

  const columns = [
    { key: 'reporter_name', label: 'Reporter' },
    { key: 'animal_type', label: 'Animal' },
    { key: 'location', label: 'Location' },
    {
      key: 'severity', label: 'Severity',
      render: (val) => {
        const colors = {
          low: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30',
          medium: 'bg-orange-500/10 text-orange-400 ring-orange-500/30',
          high: 'bg-red-500/10 text-red-400 ring-red-500/30',
          critical: 'bg-purple-500/10 text-purple-400 ring-purple-500/30'
        }
        return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${colors[val] || 'bg-zinc-800 text-zinc-400 ring-zinc-700'}`}>{val}</span>
      }
    },
    {
      key: 'status', label: 'Status',
      render: (val, row) => (
        <select value={val} onChange={e => handleStatusChange(row.id, e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30">
          <option value="pending">Pending</option>
          <option value="investigating">Investigating</option>
          <option value="action_taken">Action Taken</option>
          <option value="resolved">Resolved</option>
        </select>
      )
    },
    {
      key: 'created_at', label: 'Date',
      render: (val) => new Date(val).toLocaleDateString()
    }
  ]

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-50">Manage Cruelty Reports</h2>
      <p className="mb-6 text-sm text-zinc-500">Review and update the status of cruelty reports</p>
      {loading ? <LoadingSpinner /> : reports.length === 0 ? <EmptyState message="No cruelty reports submitted" icon="🚨" /> : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">
          <DataTable columns={columns} data={reports} />
        </div>
      )}
    </div>
  )
}
