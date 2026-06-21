import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-500" />
        <span className="text-sm text-zinc-400">Loading...</span>
      </div>
    </div>
  )
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
