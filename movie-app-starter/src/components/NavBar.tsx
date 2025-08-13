
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <nav className="container-max py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">🎬 MovieApp</Link>
        <div className="flex items-center gap-2">
          <NavLink to="/" className="btn-ghost">Top 100</NavLink>
          <NavLink to="/favorites" className="btn-ghost">Favorites</NavLink>
          {user ? (
            <button onClick={logout} className="btn-primary">Logout</button>
          ) : (
            <div className="flex gap-2">
              <NavLink to="/login" className="btn-ghost">Login</NavLink>
              <NavLink to="/register" className="btn-primary">Register</NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
