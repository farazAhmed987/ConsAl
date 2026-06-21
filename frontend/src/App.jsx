import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminRoute from './components/layout/AdminRoute'
import UserLayout from './components/layout/UserLayout'
import AdminLayout from './components/layout/AdminLayout'

import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ReportAnimal from './pages/ReportAnimal'
import RegisterDoctor from './pages/RegisterDoctor'
import RescueUpdates from './pages/RescueUpdates'
import Donate from './pages/Donate'
import MapPage from './pages/MapPage'
import ReportCruelty from './pages/ReportCruelty'
import Awareness from './pages/Awareness'
import Blog from './pages/Blog'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

import AdminDashboard from './pages/admin/Dashboard'
import ManageRescue from './pages/admin/ManageRescue'
import ManageDoctors from './pages/admin/ManageDoctors'
import ManageDonations from './pages/admin/ManageDonations'
import ManageCruelty from './pages/admin/ManageCruelty'
import ManageAwareness from './pages/admin/ManageAwareness'
import ManageBlog from './pages/admin/ManageBlog'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/report-animal" element={<ReportAnimal />} />
          <Route path="/register-doctor" element={<RegisterDoctor />} />
          <Route path="/rescue-updates" element={<RescueUpdates />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/report-cruelty" element={<ReportCruelty />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/rescue" element={<ManageRescue />} />
          <Route path="/admin/doctors" element={<ManageDoctors />} />
          <Route path="/admin/donations" element={<ManageDonations />} />
          <Route path="/admin/cruelty" element={<ManageCruelty />} />
          <Route path="/admin/awareness" element={<ManageAwareness />} />
          <Route path="/admin/blog" element={<ManageBlog />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
