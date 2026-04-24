import AnimeCard from './AnimeCard.jsx'
import SkeletonCard from './SkeletonCard.jsx'

const SKELETON_COUNT = 12

export default function AnimeGrid({ anime, activeGenre, loading, error }) {
  const filtered =
    activeGenre === 'All'
      ? anime
      : anime.filter((a) => (a.genres || []).some((g) => g.name === activeGenre))

  let label = 'Loading collection…'
  if (!loading && !error) {
    if (filtered.length === 0)    label = 'No results'
    else if (filtered.length === 1) label = '1 title'
    else label = `${filtered.length} titles${activeGenre !== 'All' ? ' · ' + activeGenre : ''}`
  }
  if (error) label = 'Failed to load'

  return (
    <main className="grid-section">
      <p className="grid-label" aria-live="polite">{label}</p>

      <div className="anime-grid" role="list">
        {/* Error */}
        {error && (
          <div className="state-msg">
            <span className="icon">⚠️</span>
            <p>Could not load titles.<br />Check your connection or try refreshing.</p>
          </div>
        )}

        {/* Skeletons while loading */}
        {loading && Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <SkeletonCard key={i} />
        ))}

        {/* Empty filter result */}
        {!loading && !error && filtered.length === 0 && (
          <div className="state-msg">
            <span className="icon">🔍</span>
            <p>No titles found for <strong>{activeGenre}</strong>.</p>
          </div>
        )}

        {/* Cards */}
        {filtered.map((a, i) => (
          <AnimeCard key={a.mal_id ?? a._id ?? i} anime={a} index={i} />
        ))}
      </div>
    </main>
  )
}
