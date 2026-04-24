import { useState } from 'react'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'

import { useAnimeCollection } from './hooks/useAnimeCollection.js'
import Header    from './components/Header.jsx'
import Hero      from './components/Hero.jsx'
import FilterBar from './components/FilterBar.jsx'
import AnimeGrid from './components/AnimeGrid.jsx'
import Footer    from './components/Footer.jsx'

const OS_OPTIONS = {
  scrollbars: {
    theme:         'os-theme-dark',
    autoHide:      'scroll',
    autoHideDelay: 800,
    clickScroll:   true,
  },
  overflow: {
    x: 'scroll',
    y: 'scroll', // vertical still scrolls; bar is hidden via CSS
  },
}

export default function App() {
  const { anime, genres, loading, error } = useAnimeCollection()
  const [activeGenre, setActiveGenre] = useState('All')

  return (
    <OverlayScrollbarsComponent
      options={OS_OPTIONS}
      style={{ height: '100vh', width: '100vw' }}
      defer
    >
      <Header count={anime.length} loading={loading} />
      <Hero />
      <FilterBar
        genres={genres}
        activeGenre={activeGenre}
        onFilter={setActiveGenre}
      />
      <AnimeGrid
        anime={anime}
        activeGenre={activeGenre}
        loading={loading}
        error={error}
      />
      <Footer />
    </OverlayScrollbarsComponent>
  )
}
