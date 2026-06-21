import { useState, useEffect } from 'react'
import api from '../api/client'
import PageLayout from '../components/layout/PageLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { formatDate } from '../utils/formatters'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/blog').then(res => setPosts(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout title="Environment Blog" subtitle="Articles about climate change, conservation, and wildlife protection.">
      {loading ? <LoadingSpinner /> : posts.length === 0 ? (
        <EmptyState message="No blog posts yet" icon="📝" />
      ) : (
        <div className="flex flex-col gap-5">
          {posts.map(p => (
            <article key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur transition hover:border-zinc-700">
              <h3 className="mb-1 text-xl font-bold tracking-tight text-zinc-50">{p.title}</h3>
              <div className="mb-3 flex items-center gap-3 text-xs text-zinc-500">
                {p.author && <span>By {p.author}</span>}
                <span>{formatDate(p.created_at)}</span>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-400">{p.content}</p>
            </article>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
