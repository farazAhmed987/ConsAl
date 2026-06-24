import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/client'
import AdminCardGrid from '../../components/admin/AdminCardGrid'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const SOURCE_COLORS = {
  animal_report: 'border-l-blue-500',
  cruelty_report: 'border-l-red-500'
}

const SOURCE_BADGE = {
  animal_report: 'bg-blue-500/10 text-blue-400',
  cruelty_report: 'bg-red-500/10 text-red-400'
}

const SOURCE_LABEL = {
  animal_report: 'Animal Report',
  cruelty_report: 'Cruelty Report'
}

const STATUS_OPTIONS = {
  animal_report: ['pending', 'in_progress', 'rescued', 'recovering', 'released'],
  cruelty_report: ['pending', 'investigating', 'rescued', 'recovering', 'adopted']
}

const STATUS_BADGE = {
  pending: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30',
  in_progress: 'bg-blue-500/10 text-blue-400 ring-blue-500/30',
  investigating: 'bg-orange-500/10 text-orange-400 ring-orange-500/30',
  rescued: 'bg-emerald-400/10 text-emerald-300 ring-emerald-500/30',
  recovering: 'bg-purple-500/10 text-purple-400 ring-purple-500/30',
  released: 'bg-zinc-500/10 text-zinc-300 ring-zinc-500/30',
  adopted: 'bg-pink-500/10 text-pink-400 ring-pink-500/30'
}

export default function ManageRescue() {
  const [reports, setReports] = useState([])
  const [cruelty, setCruelty] = useState([])
  const [loading, setLoading] = useState(true)
  const [notesInput, setNotesInput] = useState({})
  const [tab, setTab] = useState('all')
  const location = useLocation()

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get('/reports').catch(() => ({ data: [] })),
      api.get('/cruelty-reports').catch(() => ({ data: [] }))
    ]).then(([r, c]) => {
      setReports(r.data || [])
      setCruelty(c.data || [])
    }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [location.key])

  const reFetcher = (setter, endpoint) => async (id) => {
    const res = await api.get(`${endpoint}/${id}`).catch(() => null)
    if (res?.data) setter(prev => prev.map(x => x.id === id ? { ...x, ...res.data } : x))
  }

  const allItems = [
    ...reports.map(r => ({ ...r, source: 'animal_report', typeLabel: 'Animal Report' })),
    ...cruelty.map(c => ({ ...c, source: 'cruelty_report', typeLabel: 'Cruelty Report' }))
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const filtered = tab === 'all' ? allItems : allItems.filter(i => i.source === tab)

  const handleStatus = async (item, status) => {
    const endpoint = item.source === 'animal_report' ? '/reports' : '/cruelty-reports'
    try {
      const res = await api.put(`${endpoint}/${item.id}/status`, { status })
      if (item.source === 'animal_report') {
        setReports(prev => prev.map(r => r.id === item.id ? { ...r, ...res.data } : r))
      } else {
        setCruelty(prev => prev.map(r => r.id === item.id ? { ...r, ...res.data } : r))
      }
    } catch (e) { alert('Failed to update status') }
  }

  const handleNotesSave = async (item) => {
    const endpoint = item.source === 'animal_report' ? '/reports' : '/cruelty-reports'
    const val = notesInput[`${item.source}-${item.id}`] !== undefined ? notesInput[`${item.source}-${item.id}`] : ''
    try {
      const res = await api.put(`${endpoint}/${item.id}/status`, { admin_notes: val })
      if (item.source === 'animal_report') {
        setReports(prev => prev.map(r => r.id === item.id ? { ...r, ...res.data } : r))
      } else {
        setCruelty(prev => prev.map(r => r.id === item.id ? { ...r, ...res.data } : r))
      }
      setNotesInput(prev => ({ ...prev, [`${item.source}-${item.id}`]: '' }))
    } catch (e) { alert('Failed to save notes') }
  }

  if (loading) return <LoadingSpinner />

  const count = (src) => allItems.filter(i => i.source === src).length

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-50">Manage Rescue</h2>
        <p className="mt-1 text-sm text-zinc-500">Update status and add notes on animal & cruelty reports</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 backdrop-blur">
        {[
          { key: 'all', label: 'All' },
          { key: 'animal_report', label: 'Animal Reports' },
          { key: 'cruelty_report', label: 'Cruelty Reports' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === t.key ? 'bg-emerald-400/20 text-emerald-300 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>
            {t.label} <span className="ml-1 text-xs opacity-60">({t.key === 'all' ? allItems.length : count(t.key)})</span>
          </button>
        ))}
      </div>

      <AdminCardGrid items={filtered} emptyMessage="No items found" getKey={item => `${item.source}-${item.id}`} renderCard={item => (
        <div className={`border-l-4 ${SOURCE_COLORS[item.source] || 'border-l-zinc-700'} pl-4`}>
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${SOURCE_BADGE[item.source]}`}>
                  {SOURCE_LABEL[item.source]}
                </span>
                {item.animal_type && <span className="text-xs text-zinc-500">{item.animal_type}</span>}
                {item.severity && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    item.severity === 'critical' ? 'bg-purple-500/10 text-purple-400' :
                    item.severity === 'high' ? 'bg-red-500/10 text-red-400' :
                    item.severity === 'medium' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>{item.severity}</span>
                )}
              </div>
              <h3 className="font-semibold text-zinc-100">{item.title || item.incident_description || `${item.animal_type || 'Report'} at ${item.location}`}</h3>
              {item.submitter && <p className="text-xs text-zinc-500">by {item.submitter}</p>}
            </div>
            <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_BADGE[item.status] || 'bg-zinc-800 text-zinc-400 ring-zinc-700'}`}>
              {item.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="mb-2 text-sm leading-relaxed text-zinc-400">{item.description || item.incident_description}</p>
          <div className="mb-3 text-xs text-zinc-500">
            <p>{item.location}</p>
            <p>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</p>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs text-zinc-500">Status:</span>
            <select value={item.status} onChange={e => handleStatus(item, e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30">
              {(STATUS_OPTIONS[item.source] || ['pending']).map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div className="border-t border-zinc-800 pt-3">
            <div className="flex items-start gap-2">
              <input value={notesInput[`${item.source}-${item.id}`] !== undefined ? notesInput[`${item.source}-${item.id}`] : (item.admin_notes || '')}
                onChange={e => setNotesInput(prev => ({ ...prev, [`${item.source}-${item.id}`]: e.target.value }))}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                placeholder="Admin notes (optional)" />
              <button onClick={() => handleNotesSave(item)}
                className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-400/20">Save</button>
            </div>
            {item.admin_notes && (
              <p className="mt-2 text-xs italic text-zinc-500">Notes: {item.admin_notes}</p>
            )}
          </div>
        </div>
      )} />
    </div>
  )
}
