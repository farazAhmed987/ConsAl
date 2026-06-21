import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
