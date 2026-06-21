import { useState, useEffect } from 'react'
import api from '../../api/client'
import DataTable from '../../components/admin/DataTable'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

export default function ManageDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/donations').then(res => setDonations(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const columns = [
    { key: 'donor_name', label: 'Donor' },
    { key: 'donor_email', label: 'Email' },
    {
      key: 'amount', label: 'Amount',
      render: (val) => <span className="font-semibold text-emerald-300">${parseFloat(val).toFixed(2)}</span>
    },
    {
      key: 'payment_method', label: 'Method',
      render: (val) => <span className="capitalize text-zinc-400">{val.replace('_', ' ')}</span>
    },
    {
      key: 'transaction_id', label: 'Transaction ID',
      render: (val) => <span className="font-mono text-xs text-zinc-500">{val}</span>
    },
    {
      key: 'created_at', label: 'Date',
      render: (val) => new Date(val).toLocaleDateString()
    }
  ]

  const total = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0)

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

      {loading ? <LoadingSpinner /> : donations.length === 0 ? <EmptyState message="No donations received yet" icon="💰" /> : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">
          <DataTable columns={columns} data={donations} />
        </div>
      )}
    </div>
  )
}
