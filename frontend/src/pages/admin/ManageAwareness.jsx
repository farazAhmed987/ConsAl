import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/client'
import AdminCardGrid from '../../components/admin/AdminCardGrid'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Modal from '../../components/ui/Modal'

export default function ManageAwareness() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', link_url: '' })
  const location = useLocation()

  const load = () => {
    setLoading(true)
    api.get('/awareness').then(r => setPosts(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [location.key])

  const resetForm = () => setForm({ title: '', content: '', link_url: '' })

  const handleOpen = (item) => {
    if (item) { setEditing(item.id); setForm({ title: item.title, content: item.content, link_url: item.link_url || '' }) }
    else { setEditing(null); resetForm() }
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) { alert('Title and content are required'); return }
    try {
      if (editing) {
        await api.put(`/awareness/${editing}`, form)
        setPosts(prev => prev.map(p => p.id === editing ? { ...p, ...form } : p))
      } else {
        const res = await api.post('/awareness', form)
        setPosts(prev => [res.data, ...prev])
      }
      setModalOpen(false)
      resetForm()
    } catch (e) { alert('Failed to save') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/awareness/${id}`)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (e) { alert('Failed to delete') }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-50">Manage Awareness Posts</h2>
          <p className="mt-1 text-sm text-zinc-500">Add, edit, or remove awareness & education content</p>
        </div>
        <button onClick={() => handleOpen(null)}
          className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-medium text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300">
          + Add Post
        </button>
      </div>

      <AdminCardGrid items={posts} emptyMessage="No awareness posts" renderCard={p => (
        <>
          <div className="mb-2">
            <h3 className="font-semibold text-zinc-100">{p.title}</h3>
          </div>
          <p className="mb-3 flex-1 text-sm leading-relaxed text-zinc-400">{p.content}</p>
          <div className="mb-3 text-xs text-zinc-500">
            {p.link_url && <p><a href={p.link_url} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">Read More</a></p>}
            <p>📅 {p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</p>
          </div>
          <div className="mt-auto flex gap-2 border-t border-zinc-800 pt-3">
            <button onClick={() => handleOpen(p)}
              className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-400/20">Edit</button>
            <button onClick={() => handleDelete(p.id)}
              className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/30 transition hover:bg-red-500/20">Delete</button>
          </div>
        </>
      )} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Awareness Post' : 'Add Awareness Post'}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-300">Title</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-300">Content</label>
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2 text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-300">Link URL (optional)</label>
            <input value={form.link_url} onChange={e => setForm(p => ({ ...p, link_url: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30" placeholder="https://" />
          </div>
          <button onClick={handleSave}
            className="mt-2 self-start rounded-full bg-emerald-400 px-6 py-2 font-medium text-zinc-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300">
            {editing ? 'Update' : 'Publish'} Post
          </button>
        </div>
      </Modal>
    </div>
  )
}
