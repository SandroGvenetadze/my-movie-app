import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-7xl items-center px-3 sm:px-4">
        {/* Left: Logo */}
        <div className="min-w-0 flex-1">
          <Link to="/" className="font-semibold tracking-tight">
            <span className="text-sky-400">Top</span>Movies
          </Link>
        </div>

        {/* Center: Credit */}
        <div className="hidden sm:flex flex-1 justify-center">
          <span className="rounded-full px-3 py-1 text-xs font-medium text-zinc-300/90 ring-1 ring-zinc-700/60">
            by <span className="font-semibold">Sandro Gvenetadze</span>
          </span>
        </div>

        {/* Right: Nav + Theme */}
        <div className="min-w-0 flex-1 items-center justify-end gap-3 sm:gap-4 flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm ${isActive ? "text-white" : "text-zinc-300"}`
            }
          >
            Top 100
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `text-sm ${isActive ? "text-white" : "text-zinc-300"}`
            }
          >
            Favorites
          </NavLink>
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile-only credit (ქვემოთ, რომ არ აირიოს ლეიაუითი) */}
      <div className="sm:hidden flex justify-center py-2">
        <span className="rounded-full px-3 py-1 text-xs font-medium text-zinc-300/90 ring-1 ring-zinc-700/60">
          by <span className="font-semibold">Sandro Gvenetadze</span>
        </span>
      </div>
    </header>
  );
}
