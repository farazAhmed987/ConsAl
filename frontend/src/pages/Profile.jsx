import { useState, useEffect } from 'react'
import api from '../api/client'
import { useAuth } from '../hooks/useAuth'
import PageLayout from '../components/layout/PageLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { statusBadge, formatDate } from '../utils/formatters'

export default function Profile() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [donations, setDonations] = useState([])
  const [tab, setTab] = useState('reports')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/reports'),
      api.get('/donations').catch(() => ({ data: [] }))
    ]).then(([r, d]) => {
      setReports(r.data)
      setDonations(d.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-zinc-950"><LoadingSpinner /></div>

  return (
    <PageLayout title="My Profile" subtitle="View your submissions and activity.">
      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-xl font-bold text-emerald-300 ring-1 ring-emerald-500/30">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-50">{user?.name}</h3>
            <p className="text-sm text-zinc-400">{user?.email}{user?.phone ? ` | ${user.phone}` : ''}</p>
            <span className="mt-1 inline-block rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-400">{user?.role}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <button onClick={() => setTab('reports')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            tab === 'reports' ? 'bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-400/20' : 'border border-zinc-700 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600'
          }`}>
          My Reports ({reports.length})
        </button>
        <button onClick={() => setTab('donations')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            tab === 'donations' ? 'bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-400/20' : 'border border-zinc-700 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600'
          }`}>
          My Donations ({donations.length})
        </button>
      </div>

      {tab === 'reports' && (
        reports.length === 0 ? <EmptyState message="No reports submitted yet" /> : (
          <div className="flex flex-col gap-3">
            {reports.map(r => (
              <div key={r.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-zinc-700">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-bold text-zinc-100">{r.animal_type}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">{r.location}</span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">{r.description}</p>
                    <p className="mt-2 text-xs text-zinc-600">{formatDate(r.created_at)}</p>
                  </div>
                  <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(r.status)}`}>
                    {r.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'donations' && (
        donations.length === 0 ? <EmptyState message="No donations yet" /> : (
          <div className="flex flex-col gap-3">
            {donations.map(d => (
              <div key={d.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-emerald-300">${parseFloat(d.amount).toFixed(2)}</p>
                    <p className="mt-1 text-xs capitalize text-zinc-500">{d.payment_method.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                    <p className="font-mono text-xs text-zinc-600">TXN: {d.transaction_id}</p>
                    <p className="mt-1 text-xs text-zinc-600">{formatDate(d.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </PageLayout>
  )
}
