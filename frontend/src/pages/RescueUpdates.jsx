import { useState, useEffect } from 'react'
import api from '../api/client'
import PageLayout from '../components/layout/PageLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { formatDate } from '../utils/formatters'

export default function RescueUpdates() {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/rescue-updates').then(res => setUpdates(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout title="Rescue Updates" subtitle="Stay informed about ongoing rescue operations and their outcomes.">
      {loading ? <LoadingSpinner /> : updates.length === 0 ? (
        <EmptyState message="No rescue updates yet" icon="🚑" />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {updates.map(u => (
            <div key={u.id} className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-zinc-700">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-lg font-bold text-zinc-50 transition group-hover:text-emerald-300">{u.title}</h3>
                <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                  u.status === 'Recovering' || u.status === 'Rescued' || u.status === 'Adopted'
                    ? 'bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/30'
                    : 'bg-yellow-500/10 text-yellow-400 ring-1 ring-inset ring-yellow-500/30'
                }`}>
                  {u.status}
                </span>
              </div>
              <p className="mb-2 flex items-center gap-1 text-sm text-zinc-500">📍 {u.location}</p>
              {u.description && <p className="mt-2 text-sm leading-relaxed text-zinc-400">{u.description}</p>}
              <p className="mt-3 text-xs text-zinc-600">{formatDate(u.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
