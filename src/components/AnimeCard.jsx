import { useState } from "react";

const JIKAN_BASE = "https://api.jikan.moe/v4/anime";

// In-memory cache so we don't re-fetch the same ID twice
const imgCache = {};

async function fetchJikanImage(malId) {
  if (imgCache[malId]) return imgCache[malId];
  try {
    const res = await fetch(`${JIKAN_BASE}/${malId}`);
    if (!res.ok) throw new Error();
    const json = await res.json();
    const url =
      json.data?.images?.jpg?.large_image_url ||
      json.data?.images?.jpg?.image_url ||
      null;
    imgCache[malId] = url;
    return url;
  } catch {
    imgCache[malId] = null;
    return null;
  }
}

function makePlaceholder(title) {
  return `https://placehold.co/240x340/111118/9b5de5?text=${encodeURIComponent(
    title.length > 20 ? title.slice(0, 18) + "…" : title,
  )}`;
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="var(--accent)"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function AnimeCard({ anime, index }) {
  const title = anime.title_english || anime.title || "Unknown";
  const year = anime.year || anime.aired?.prop?.from?.year || "—";
  const genres = (anime.genres || []).map((g) => g.name);
  const genre = genres[0] || "Unknown";
  const score = anime.score ? (+anime.score).toFixed(1) : null;
  const mal_id = anime.mal_id;

  const primarySrc =
    anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";

  const [src, setSrc] = useState(primarySrc || makePlaceholder(title));
  const [fallbackStage, setFallbackStage] = useState(0);
  // 0 = using primarySrc
  // 1 = tried small image
  // 2 = tried Jikan
  // 3 = using placeholder

  async function handleError() {
    if (fallbackStage === 0) {
      const small = anime.images?.jpg?.image_url;
      if (small && small !== src) {
        setFallbackStage(1);
        setSrc(small);
        return;
      }
    }

    if (fallbackStage <= 1) {
      setFallbackStage(2);
      const jikanUrl = await fetchJikanImage(mal_id);
      if (jikanUrl) {
        setSrc(jikanUrl);
        return;
      }
    }

    setFallbackStage(3);
    setSrc(makePlaceholder(title));
  }

  return (
    <article
      className="anime-card"
      role="listitem"
      tabIndex={0}
      aria-label={title}
      data-genres={genres.join(",")}
      style={{ animationDelay: `${Math.min(index * 55, 800)}ms` }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
    >
      <div className="card-image">
        {score && (
          <div className="score-badge" title={`MAL Score ${score}`}>
            <StarIcon />
            {score}
          </div>
        )}
        <img
          src={src}
          alt={`${title} cover`}
          loading="lazy"
          onError={handleError}
        />
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span className="card-year">{year}</span>
          <span className="meta-dot" aria-hidden="true" />
          <span className="card-genre">{genre}</span>
        </div>
        <h2 className="card-title">{title}</h2>
      </div>
    </article>
  );
}
