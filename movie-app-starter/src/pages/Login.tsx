
import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()
  const loc = useLocation() as any

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      await login(email, password)
      const dest = loc?.state?.from?.pathname || '/'
      nav(dest, { replace: true })
    } catch (e: any) {
      setError(e?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        {error && <div className="text-red-300">{error}</div>}
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Logging in…' : 'Login'}</button>
      </form>
      <p className="text-sm text-muted mt-3">
        No account? <Link className="underline" to="/register">Register</Link>
      </p>
    </div>
  )
}
