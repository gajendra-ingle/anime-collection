export default function Header({ count, loading }) {
  return (
    <header className="header">
      <a className="logo" href="#" aria-label="AniCol Home">
        <span className="logo-text">私のコレクション</span>
        <span className="logo-dot" aria-hidden="true" />
      </a>
      {/* <span
        className="count-badge"
        aria-live="polite"
        aria-label={`${count} titles in collection`}
      >
        {loading ? '…' : count === 0 ? '—' : count}
      </span> */}
    </header>
  )
}
