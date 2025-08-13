
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type User = { email: string }
type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const LS_KEY = 'movieapp:user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) setUser(JSON.parse(raw))
  }, [])

  async function login(email: string, _password: string) {
    // Mock auth for starter; replace with Firebase or your backend
    const u = { email }
    localStorage.setItem(LS_KEY, JSON.stringify(u))
    setUser(u)
  }

  async function register(email: string, password: string) {
    // Same as login for the starter
    return login(email, password)
  }

  function logout() {
    localStorage.removeItem(LS_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
