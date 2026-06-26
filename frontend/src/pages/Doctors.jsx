import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import MapView from '../components/map/MapView'

export default function Doctors() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/doctors')
      .then(res => {
        const approved = (res.data || []).filter(d => d.is_approved === 1)
        setDoctors(approved)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Registered Doctors</h1>
          <p className="mt-2 text-zinc-400">Find approved veterinarians in your area</p>
        </div>
        <button onClick={() => navigate('/register-doctor')}
          className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300">
          Register a Doctor
        </button>
      </div>

      {doctors.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-12 text-center backdrop-blur">
          <p className="text-lg text-zinc-500">No doctors registered yet</p>
          <p className="mt-1 text-sm text-zinc-600">Check back soon</p>
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map(d => (
              <div key={d.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-emerald-500/30">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">{d.name}</h3>
                    {d.clinic_name && <p className="text-xs text-zinc-500">{d.clinic_name}</p>}
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/30">Approved</span>
                </div>
                {d.specialty && <p className="mb-2 text-sm text-zinc-400">{d.specialty}</p>}
                <div className="space-y-1 text-xs text-zinc-500">
                  {d.city && <p>{d.city}</p>}
                  <p>{d.contact}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="h-80 overflow-hidden rounded-2xl border border-zinc-800">
            <MapView items={doctors.map(d => ({ ...d, type: 'doctor' }))} center={[20, 0]} zoom={2} />
          </div>
        </>
      )}
    </div>
  )
}
