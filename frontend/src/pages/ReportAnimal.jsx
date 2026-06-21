import { useState, useEffect } from 'react'
import ReportAnimalForm from '../components/forms/ReportAnimalForm'
import PageLayout from '../components/layout/PageLayout'
import api from '../api/client'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { statusBadge, formatDate } from '../utils/formatters'

export default function ReportAnimal() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(true)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    api.get('/reports').then(res => setSubmissions(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSuccess = (data) => {
    setSubmissions(prev => [data, ...prev])
    setShowForm(false)
    setSuccess('Report submitted successfully!')
    setTimeout(() => setSuccess(null), 4000)
  }

  return (
    <PageLayout title="Report a Sick Animal" subtitle="Help us find and treat animals in need.">
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border-l-4 border-emerald-500 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          <span>✓</span> {success}
        </div>
      )}

      {showForm ? (
        <ReportAnimalForm onSuccess={handleSuccess} />
      ) : (
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => { setShowForm(true); setSuccess(null) }}
            className="rounded-full bg-emerald-400 px-6 py-2.5 font-medium text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300">
            + Report Another Animal
          </button>
        </div>
      )}

      <div className="mt-10">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-zinc-100">
          Your Reports
          {submissions.length > 0 && <span className="text-sm font-normal text-zinc-500">({submissions.length})</span>}
        </h3>
        {loading ? <LoadingSpinner /> : submissions.length === 0 ? (
          <EmptyState message="No reports submitted yet" icon="🐾" />
        ) : (
          <div className="flex flex-col gap-3">
            {submissions.map(r => (
              <div key={r.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-zinc-700">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-lg">🐕</span>
                      <p className="font-bold text-zinc-100">{r.animal_type}</p>
                      <span className="text-zinc-600">•</span>
                      <p className="text-zinc-400">{r.location}</p>
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">{r.description}</p>
                    {r.contact_name && (
                      <p className="mt-2 text-xs text-zinc-500">
                        Contact: {r.contact_name}{r.contact_phone ? ` (${r.contact_phone})` : ''}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-zinc-600">{formatDate(r.created_at)}</p>
                  </div>
                  <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(r.status)}`}>
                    {r.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
