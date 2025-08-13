import { useEffect, useState } from 'react'
import { fetchTopMovies } from '@api/rapidapi'
import MovieCard from '@components/MovieCard'

export default function Home() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        setError(null)

        // 1) სცადე cache-იდან ამოღება
        const cached = localStorage.getItem('top100_cache_v1')
        if (cached) {
          setMovies(JSON.parse(cached))
          setLoading(false)
          // პარალელურად მშვიდად განვაახლოთ
          try {
            const fresh = await fetchTopMovies()
            if (Array.isArray(fresh) && fresh.length) {
              setMovies(fresh)
              localStorage.setItem('top100_cache_v1', JSON.stringify(fresh))
            }
          } catch {/* ჩუმად */}
          return
        }

        // 2) თუ cache არაა – მოიტანე ნეტიდან
        const data = await fetchTopMovies()
        setMovies(data)
        localStorage.setItem('top100_cache_v1', JSON.stringify(data))
      } catch (err: any) {
        // 3) 429-ზე სცადე fallback ფაილი (სტატიკური JSON public-ში)
        if (err?.response?.status === 429) {
          try {
            const res = await fetch('/top100.fallback.json', { cache: 'no-store' })
            if (res.ok) {
              const data = await res.json()
              setMovies(data)
              setError('API Limit Exceeded – Showing cached sample')
            } else {
              setError('API Limit Exceeded – Try again later')
            }
          } catch {
            setError('API Limit Exceeded – Try again later')
          }
        } else if (err?.response?.status === 400) {
          setError('Bad Request – Check params')
        } else {
          setError('Failed to load movies')
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <p className="text-gray-400 p-4">Loading...</p>
  return (
    <div className="p-4">
      {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((m: any) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  )
}
