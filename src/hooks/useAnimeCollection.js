import { useState, useEffect, useMemo } from 'react'
import { fetchAllAnime } from '../utils/supabaseApi.js'

export function useAnimeCollection() {
  const [anime,   setAnime]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const docs = await fetchAllAnime()
        if (!cancelled) {
          setAnime(docs)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[AniCol] Supabase fetch error:', err)
          setError(err.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const genres = useMemo(() => {
    const set = new Set()
    anime.forEach((a) =>
      (a.genres || []).forEach((g) => set.add(g.name))
    )
    return [...set].sort()
  }, [anime])

  return { anime, genres, loading, error }
}