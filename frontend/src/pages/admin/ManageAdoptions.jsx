import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/client'
import AdminCardGrid from '../../components/admin/AdminCardGrid'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const STATUS_BADGE = {
  pending: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30',
  approved: 'bg-emerald-400/10 text-emerald-300 ring-emerald-500/30',
  rejected: 'bg-red-500/10 text-red-400 ring-red-500/30',
}

export default function ManageAdoptions() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const load = () => {
    setLoading(true)
    api.get('/adoptions/admin')
      .then(res => setApps(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [location.key])

  const handleDecision = async (id, status) => {
    if (!confirm(`Are you sure you want to ${status} this application?`)) return
    try {
      await api.put(`/adoptions/${id}`, { status })
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    } catch (e) {
      alert('Failed to update application')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-50">Manage Adoption Applications</h2>
        <p className="text-sm text-zinc-500">Review and approve adoption requests</p>
      </div>

      <AdminCardGrid items={apps} emptyMessage="No adoption applications yet" renderCard={a => (
        <>
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-zinc-100">{a.applicant_name}</h3>
              <p className="text-xs text-zinc-500">Applied on {new Date(a.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_BADGE[a.status] || 'bg-zinc-800 text-zinc-400 ring-zinc-700'}`}>
              {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
            </span>
          </div>

          <div className="mb-3 space-y-1.5 text-sm">
            <p><span className="text-zinc-500">Animal:</span> <span className="text-zinc-200">{a.animal_type || 'Unknown'}</span></p>
            <p><span className="text-zinc-500">Contact:</span> {a.applicant_contact}</p>
            <p><span className="text-zinc-500">Address:</span> {a.applicant_address}</p>
            {a.reason && <p><span className="text-zinc-500">Reason:</span> {a.reason}</p>}
          </div>

          {a.status === 'pending' && (
            <div className="flex gap-2 border-t border-zinc-800 pt-4">
              <button onClick={() => handleDecision(a.id, 'approved')}
                className="flex-1 rounded-xl bg-emerald-400/10 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-400/20">Approve</button>
              <button onClick={() => handleDecision(a.id, 'rejected')}
                className="flex-1 rounded-xl bg-red-500/10 py-2 text-sm font-semibold text-red-400 ring-1 ring-inset ring-red-500/30 transition hover:bg-red-500/20">Reject</button>
            </div>
          )}
        </>
      )} />
    </div>
  )
}
