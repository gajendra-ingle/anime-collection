const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function fetchAllAnime() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/anime?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  )
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`)
  const rows = await res.json()

  return rows.map((row) => ({
    mal_id:         row.mal_id,
    title:          row.title,
    title_english:  row.title_english,
    title_japanese: row.title_japanese,
    type:           row.type,
    status:         row.status,
    year:           row.year,
    score:          row.score,
    synopsis:       row.synopsis,
    genres:         row.genres,   
    images:         row.images,
    aired: { prop: { from: { year: row.year } } },
  }))
}

// Jikan image fallback — called only if DB image is missing
const JIKAN_IMG_CACHE = {}

export async function getAnimeImage(malId) {
  if (JIKAN_IMG_CACHE[malId]) return JIKAN_IMG_CACHE[malId]
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}`)
    const json = await res.json()
    const url = json.data?.images?.jpg?.large_image_url
    JIKAN_IMG_CACHE[malId] = url
    return url
  } catch {
    return null
  }
}