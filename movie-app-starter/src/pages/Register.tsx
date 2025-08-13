
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      await register(email, password)
      nav('/', { replace: true })
    } catch (e: any) {
      setError(e?.message || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        {error && <div className="text-red-300">{error}</div>}
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating…' : 'Register'}</button>
      </form>
      <p className="text-sm text-muted mt-3">
        Already have an account? <Link className="underline" to="/login">Login</Link>
      </p>
    </div>
  )
}
