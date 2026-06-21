import { useState, useEffect } from 'react'
import api from '../../api/client'
import DataTable from '../../components/admin/DataTable'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => api.get('/doctors').then(res => setDoctors(res.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleApprove = async (id) => {
    try {
      await api.patch(`/doctors/${id}`, { status: 'approved' })
      setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d))
    } catch (e) {
      alert('Failed to update')
    }
  }

  const handleReject = async (id) => {
    try {
      await api.patch(`/doctors/${id}`, { status: 'rejected' })
      setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d))
    } catch (e) {
      alert('Failed to update')
    }
  }

  const columns = [
    { key: 'doctor_name', label: 'Name' },
    { key: 'specialty', label: 'Specialty' },
    { key: 'clinic_name', label: 'Clinic' },
    { key: 'city', label: 'City' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
          val === 'approved' ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-500/30' :
          val === 'rejected' ? 'bg-red-500/10 text-red-400 ring-red-500/30' :
          'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30'
        }`}>{val}</span>
      )
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => row.status === 'pending' ? (
        <div className="flex gap-2">
          <button onClick={() => handleApprove(row.id)}
            className="whitespace-nowrap rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-400/20">Approve</button>
          <button onClick={() => handleReject(row.id)}
            className="whitespace-nowrap rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/30 transition hover:bg-red-500/20">Reject</button>
        </div>
      ) : null
    }
  ]

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-50">Manage Doctors</h2>
      <p className="mb-6 text-sm text-zinc-500">Approve or reject veterinarian registrations</p>
      {loading ? <LoadingSpinner /> : doctors.length === 0 ? <EmptyState message="No doctor registrations yet" /> : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">
          <DataTable columns={columns} data={doctors} />
        </div>
      )}
    </div>
  )
}
