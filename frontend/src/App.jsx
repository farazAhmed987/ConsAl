import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import UserLayout from './components/layout/UserLayout'
import AdminLayout from './components/layout/AdminLayout'
import PublicLayout from './components/layout/PublicLayout'

import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import ReportAnimal from './pages/ReportAnimal'
import ReportCruelty from './pages/ReportCruelty'
import Donate from './pages/Donate'
import Blog from './pages/Blog'
import Awareness from './pages/Awareness'
import RescueUpdates from './pages/RescueUpdates'
import Adopt from './pages/Adopt'
import MyApplications from './pages/MyApplications'
import RegisterDoctor from './pages/RegisterDoctor'

import Dashboard from './pages/admin/Dashboard'
import ManageReports from './pages/admin/ManageReports'
import ManageCruelty from './pages/admin/ManageCruelty'
import ManageDoctors from './pages/admin/ManageDoctors'
import ManageDonations from './pages/admin/ManageDonations'
import ManageRescue from './pages/admin/ManageRescue'
import ManageBlog from './pages/admin/ManageBlog'
import ManageAwareness from './pages/admin/ManageAwareness'
import ManageAdoptions from './pages/admin/ManageAdoptions'

function AdminGuard({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/home" replace />
  return children
}

function AuthGuard({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function GuestGuard({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/home'} replace />
  return children
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
        <Route path="/register" element={<GuestGuard><Signup /></GuestGuard>} />
      </Route>
      <Route element={<AuthGuard><UserLayout /></AuthGuard>}>
        <Route path="/home" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/report-animal" element={<ReportAnimal />} />
        <Route path="/report-cruelty" element={<ReportCruelty />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/awareness" element={<Awareness />} />
        <Route path="/rescue-updates" element={<RescueUpdates />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />
      </Route>
      <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route index element={<Dashboard />} />
        <Route path="reports" element={<ManageReports />} />
        <Route path="cruelty" element={<ManageCruelty />} />
        <Route path="doctors" element={<ManageDoctors />} />
        <Route path="donations" element={<ManageDonations />} />
        <Route path="rescue" element={<ManageRescue />} />
        <Route path="awareness" element={<ManageAwareness />} />
        <Route path="blog" element={<ManageBlog />} />
        <Route path="adoptions" element={<ManageAdoptions />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
