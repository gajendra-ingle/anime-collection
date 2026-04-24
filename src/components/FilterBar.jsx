export default function FilterBar({ genres, activeGenre, onFilter }) {
  return (
    <nav className="filter-bar" aria-label="Filter by genre">
      <button
        className={`filter-btn${activeGenre === 'All' ? ' active' : ''}`}
        onClick={() => onFilter('All')}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          className={`filter-btn${activeGenre === genre ? ' active' : ''}`}
          onClick={() => onFilter(genre)}
        >
          {genre}
        </button>
      ))}
    </nav>
  )
}
