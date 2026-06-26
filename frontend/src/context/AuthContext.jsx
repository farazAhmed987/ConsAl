import { createContext, useState, useEffect, useContext } from 'react'
import api from '../api/client'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const clearAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (!token || !savedUser) {
      clearAuth()
      setLoading(false)
      return
    }
    api.get('/auth/me').then(res => {
      setUser(res.data)
      localStorage.setItem('user', JSON.stringify(res.data))
    }).catch(() => {
      clearAuth()
    }).finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const signup = async (data) => {
    const res = await api.post('/auth/signup', data)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    clearAuth()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
