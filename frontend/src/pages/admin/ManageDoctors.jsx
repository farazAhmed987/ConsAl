import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/client'
import AdminCardGrid, { StatusBadge } from '../../components/admin/AdminCardGrid'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const STATUS_MAP = { 0: 'pending', 1: 'approved', 2: 'rejected' }

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const load = () => {
    setLoading(true)
    api.get('/doctors').then(res => setDoctors(res.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [location.key])

  const handleApprove = async (id) => {
    try {
      await api.put(`/doctors/${id}/approve`, { is_approved: 1 })
      setDoctors(prev => prev.map(d => d.id === id ? { ...d, is_approved: 1 } : d))
    } catch (e) { alert('Failed to update') }
  }

  const handleReject = async (id) => {
    try {
      await api.put(`/doctors/${id}/approve`, { is_approved: 2 })
      setDoctors(prev => prev.map(d => d.id === id ? { ...d, is_approved: 2 } : d))
    } catch (e) { alert('Failed to update') }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-50">Manage Doctors</h2>
        <p className="text-sm text-zinc-500">Approve or reject veterinarian registrations</p>
      </div>
      <AdminCardGrid items={doctors} emptyMessage="No doctor registrations yet" renderCard={d => (
        <>
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-zinc-100">{d.name}</h3>
              <p className="text-xs text-zinc-500">{d.specialty || 'General'}</p>
            </div>
            <StatusBadge status={STATUS_MAP[d.is_approved] || 'pending'} />
          </div>
          <div className="mb-3 flex-1 space-y-1 text-sm text-zinc-400">
            <p>Clinic: {d.clinic_name}</p>
            <p>City: {d.city}</p>
            <p>Contact: {d.contact}</p>
            {d.submitter && <p className="text-xs text-zinc-500">Submitted by: {d.submitter}</p>}
          </div>
          <div className="mt-auto flex gap-2 border-t border-zinc-800 pt-3">
            {d.is_approved === 0 && (
              <>
                <button onClick={() => handleApprove(d.id)}
                  className="rounded-full bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-400/20">Approve</button>
                <button onClick={() => handleReject(d.id)}
                  className="rounded-full bg-red-500/10 px-4 py-1.5 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/30 transition hover:bg-red-500/20">Reject</button>
              </>
            )}
            {d.is_approved === 1 && <span className="text-xs text-emerald-500">✓ Approved</span>}
            {d.is_approved === 2 && <span className="text-xs text-red-400">✗ Rejected</span>}
          </div>
        </>
      )} />
    </div>
  )
}
