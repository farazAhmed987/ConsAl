import { useState, useEffect } from 'react'
import api from '../api/client'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const STATUS_BADGE = {
  pending: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30',
  approved: 'bg-emerald-400/10 text-emerald-300 ring-emerald-500/30',
  rejected: 'bg-red-500/10 text-red-400 ring-red-500/30',
}

export default function MyApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/adoptions')
      .then(res => setApps(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">My Adoption Applications</h1>
        <p className="mt-2 text-zinc-400">Track your adoption requests</p>
      </div>

      {apps.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-12 text-center backdrop-blur">
          <p className="text-lg text-zinc-500">No applications yet</p>
          <p className="mt-1 text-sm text-zinc-600">Browse available animals and apply to adopt one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map(a => (
            <div key={a.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-zinc-700">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-zinc-100">{a.animal_type || 'Animal'} Adoption</h3>
                  <p className="text-xs text-zinc-500">Applied on {new Date(a.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_BADGE[a.status] || 'bg-zinc-800 text-zinc-400 ring-zinc-700'}`}>
                  {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                </span>
              </div>
              <div className="grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
                <p><span className="text-zinc-500">Contact:</span> {a.applicant_contact}</p>
                <p><span className="text-zinc-500">Address:</span> {a.applicant_address}</p>
              </div>
              {a.reason && <p className="mt-2 text-sm text-zinc-500"><span className="text-zinc-400">Reason:</span> {a.reason}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
