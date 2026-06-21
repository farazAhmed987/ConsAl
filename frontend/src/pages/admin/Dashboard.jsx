import { useState, useEffect } from 'react'
import api from '../../api/client'
import StatsCard from '../../components/ui/StatsCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentDonations, setRecentDonations] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/donations').catch(() => ({ data: [] }))
    ]).then(([s, d]) => {
      setStats(s.data)
      setRecentDonations((d.data || []).slice(0, 5))
    }).catch(err => setError(err.message)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="py-12 text-center text-red-400">{error}</div>
  if (!stats) return null

  const cards = [
    { label: 'Total Reports', value: stats.reports, icon: '🐾', color: 'border-blue-800 bg-blue-500/10 text-blue-400' },
    { label: 'Total Donations', value: stats.donations, icon: '💰', color: 'border-emerald-800 bg-emerald-400/10 text-emerald-300' },
    { label: 'Doctor Registrations', value: stats.doctors, icon: '👨‍⚕️', color: 'border-purple-800 bg-purple-500/10 text-purple-400' },
    { label: 'Cruelty Reports', value: stats.cruelty, icon: '🚨', color: 'border-red-800 bg-red-500/10 text-red-400' },
    { label: 'Awareness Posts', value: stats.awareness, icon: '📚', color: 'border-yellow-800 bg-yellow-500/10 text-yellow-400' },
    { label: 'Blog Posts', value: stats.blog, icon: '📝', color: 'border-indigo-800 bg-indigo-500/10 text-indigo-400' },
  ]

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-50">Admin Dashboard</h2>
      <p className="mb-6 text-sm text-zinc-500">Overview of all ConsAl data and activities</p>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => <StatsCard key={c.label} {...c} />)}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur">
        <h3 className="mb-3 text-lg font-bold text-zinc-50">Recent Donations</h3>
        {recentDonations.length === 0 ? (
          <p className="py-4 text-center text-sm text-zinc-500">No donations yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-zinc-400">
                  <th className="pb-2 font-semibold">Donor</th>
                  <th className="pb-2 font-semibold">Amount</th>
                  <th className="pb-2 font-semibold">Method</th>
                  <th className="pb-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentDonations.map(d => (
                  <tr key={d.id} className="border-b border-zinc-800/50 transition hover:bg-zinc-800/20">
                    <td className="py-2.5 font-medium text-zinc-200">{d.donor_name}</td>
                    <td className="py-2.5 text-emerald-300">${parseFloat(d.amount).toFixed(2)}</td>
                    <td className="py-2.5 capitalize text-zinc-500">{d.payment_method.replace('_', ' ')}</td>
                    <td className="py-2.5 text-zinc-600">{new Date(d.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
