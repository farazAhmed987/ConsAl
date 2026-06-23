import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/client'
import AdminCardGrid from '../../components/admin/AdminCardGrid'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function ManageDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    setLoading(true)
    api.get('/donations').then(res => setDonations(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [location.key])

  const total = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0)

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-50">Manage Donations</h2>
          <p className="text-sm text-zinc-500">View all donations received</p>
        </div>
        <div className="rounded-xl border border-emerald-800 bg-emerald-400/10 px-5 py-3 text-right">
          <p className="text-xs font-medium text-emerald-300">Total Donations</p>
          <p className="text-2xl font-bold text-emerald-300">${total.toFixed(2)}</p>
        </div>
      </div>

      <AdminCardGrid items={donations} emptyMessage="No donations received yet" renderCard={d => (
        <>
          <div className="mb-2">
            <h3 className="font-semibold text-zinc-100">{d.donor_name}</h3>
            {d.donor_email && <p className="text-xs text-zinc-500">{d.donor_email}</p>}
          </div>
          <p className="mb-3 text-2xl font-bold text-emerald-300">${parseFloat(d.amount).toFixed(2)}</p>
          <div className="mt-auto space-y-1 text-xs text-zinc-500">
            <p>💳 {d.payment_method ? d.payment_method.replace(/_/g, ' ') : 'credit card'}</p>
            <p className="font-mono text-zinc-600">ID: {d.transaction_id}</p>
            <p>📅 {d.created_at ? new Date(d.created_at).toLocaleDateString() : ''}</p>
            {d.notes && <p className="italic text-zinc-600">"{d.notes}"</p>}
          </div>
        </>
      )} />
    </div>
  )
}
