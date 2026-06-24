import { useState, useEffect } from 'react'
import api from '../api/client'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import MapView from '../components/map/MapView'

const STATUS_BADGE = {
  rescued: 'bg-emerald-400/10 text-emerald-300 ring-emerald-500/30',
  recovering: 'bg-purple-500/10 text-purple-400 ring-purple-500/30',
  released: 'bg-zinc-500/10 text-zinc-300 ring-zinc-500/30',
  adopted: 'bg-pink-500/10 text-pink-400 ring-pink-500/30',
  in_progress: 'bg-blue-500/10 text-blue-400 ring-blue-500/30',
  investigating: 'bg-orange-500/10 text-orange-400 ring-orange-500/30',
}

export default function RescueUpdates() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/reports/rescue-feed').catch(() => ({ data: [] })),
      api.get('/cruelty-reports/rescue-feed').catch(() => ({ data: [] }))
    ]).then(([r, c]) => {
      const animal = (r.data || []).map(x => ({ ...x, source: 'animal_report', typeLabel: 'Animal Rescue' }))
      const cruelty = (c.data || []).map(x => ({ ...x, source: 'cruelty_report', typeLabel: 'Cruelty Rescue' }))
      const merged = [...animal, ...cruelty].sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
      setItems(merged)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Rescue Updates</h1>
        <p className="mt-2 text-zinc-400">Track the progress of animals being rescued and rehabilitated</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-12 text-center backdrop-blur">
          <p className="text-lg text-zinc-500">No rescue updates yet</p>
          <p className="mt-1 text-sm text-zinc-600">When reports are actioned, updates will appear here</p>
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map(item => {
              const key = item.source === 'animal_report' ? `animal-${item.id}` : `cruelty-${item.id}`
              return (
                <div key={key} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-zinc-700">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-zinc-100">{item.animal_type || 'Animal'} - {item.location}</h3>
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                        {item.typeLabel}
                      </span>
                    </div>
                    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_BADGE[item.status] || 'bg-zinc-800 text-zinc-400 ring-zinc-700'}`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-zinc-400">{item.description || item.incident_description}</p>
                  {item.admin_notes && (
                    <p className="mb-2 rounded-lg bg-zinc-800/50 p-3 text-xs italic text-zinc-400">
                      {item.admin_notes}
                    </p>
                  )}
                  <div className="text-xs text-zinc-500">
                    {item.updated_at ? <p>Updated: {new Date(item.updated_at).toLocaleDateString()}</p> : null}
                    <p>Reported: {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="h-80 overflow-hidden rounded-2xl border border-zinc-800">
            <MapView items={items.map(i => ({ ...i, type: i.source }))} center={[20, 0]} zoom={2} />
          </div>
        </>
      )}
    </div>
  )
}
