import { useState, useEffect } from 'react'
import api from '../../api/client'
import DataTable from '../../components/admin/DataTable'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'

export default function ManageAwareness() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', link_url: '' })

  const load = () => api.get('/awareness').then(r => setPosts(r.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const resetForm = () => setForm({ title: '', content: '', link_url: '' })

  const handleOpen = (item) => {
    if (item) { setEditing(item.id); setForm(item) }
    else { setEditing(null); resetForm() }
    setModalOpen(true)
  }

  const handleSave = async () => {
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

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'content', label: 'Content', render: (val) => <span className="max-w-xs truncate text-zinc-400">{val}</span> },
    {
      key: 'link_url', label: 'Link',
      render: (val) => val ? <a href={val} target="_blank" className="text-xs text-emerald-300 hover:underline">View</a> : <span className="text-zinc-600">—</span>
    },
    {
      key: 'id', label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={() => handleOpen(row)}
            className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-400/20">Edit</button>
          <button onClick={() => handleDelete(row.id)}
            className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/30 transition hover:bg-red-500/20">Delete</button>
        </div>
      )
    }
  ]

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

      {loading ? <LoadingSpinner /> : posts.length === 0 ? <EmptyState message="No awareness posts" /> : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">
          <DataTable columns={columns} data={posts} />
        </div>
      )}

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
