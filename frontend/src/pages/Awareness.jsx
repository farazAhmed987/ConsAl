import { useState, useEffect } from 'react'
import api from '../api/client'
import PageLayout from '../components/layout/PageLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

export default function Awareness() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/awareness').then(res => setPosts(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout title="Awareness & Education" subtitle="Learn about animal welfare and how you can make a difference.">
      {loading ? <LoadingSpinner /> : posts.length === 0 ? (
        <EmptyState message="No awareness posts available yet" icon="📚" />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {posts.map(p => (
            <div key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-zinc-700">
              <h3 className="mb-2 text-lg font-bold text-zinc-50">{p.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{p.content}</p>
              {p.link_url && (
                <a href={p.link_url} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-300 hover:text-emerald-300">
                  Read More →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
