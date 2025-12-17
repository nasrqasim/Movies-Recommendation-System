/**
 * Free (no-key) movie search via IMDb public suggestion endpoint.
 *
 * Endpoint format:
 *   https://v2.sg.media-imdb.com/suggestion/{firstLetter}/{query}.json
 *
 * Notes:
 * - This is an unofficial public endpoint (no auth, no paid key).
 * - We only use it for search + basic metadata (title, year, IMDb id, poster).
 * - We DO NOT scrape any watch/download sources.
 */

export interface ImdbSuggestionItem {
  id: string; // e.g. "tt4535650"
  l?: string; // title label
  y?: number; // year
  qid?: string; // "movie", "tvSeries", ...
  q?: string; // "feature", ...
  s?: string; // starring
  i?: { imageUrl?: string; width?: number; height?: number };
}

export interface ImdbSuggestResponse {
  d?: ImdbSuggestionItem[];
  q?: string;
  v?: number;
}

export interface MovieSummary {
  imdbId: string;
  title: string;
  year?: number;
  type?: string;
  poster?: string;
  imdbUrl: string;
}

type CacheEntry<T> = { value: T; expiresAt: number };
const cache = new Map<string, CacheEntry<MovieSummary[]>>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function normalizeQuery(q: string): string {
  return (q || '').trim().toLowerCase();
}

function toSummary(item: ImdbSuggestionItem): MovieSummary | null {
  if (!item?.id || !item?.l) return null;
  return {
    imdbId: item.id,
    title: item.l,
    year: typeof item.y === 'number' ? item.y : undefined,
    type: item.qid || item.q,
    poster: item.i?.imageUrl,
    imdbUrl: `https://www.imdb.com/title/${item.id}/`,
  };
}

/**
 * Search IMDb suggestions for a query.
 * Returns [] on any error (never throws).
 */
export async function imdbSuggestSearch(query: string): Promise<MovieSummary[]> {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];

  const cached = cache.get(normalized);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const firstLetter = normalized[0] || 'a';
  const url = `https://v2.sg.media-imdb.com/suggestion/${encodeURIComponent(
    firstLetter
  )}/${encodeURIComponent(normalized)}.json`;

  try {
    const res = await fetch(url, {
      // Basic caching hint; server-side fetch in Next respects it in dev/prod.
      // We still keep our own memory cache for safety.
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      cache.set(normalized, { value: [], expiresAt: Date.now() + CACHE_TTL_MS });
      return [];
    }

    const data = (await res.json()) as ImdbSuggestResponse;
    const list = Array.isArray(data?.d) ? data!.d! : [];

    const summaries = list
      .map(toSummary)
      .filter((x): x is MovieSummary => Boolean(x));

    cache.set(normalized, { value: summaries, expiresAt: Date.now() + CACHE_TTL_MS });
    return summaries;
  } catch {
    // Network error or JSON parse error: return empty list
    cache.set(normalized, { value: [], expiresAt: Date.now() + CACHE_TTL_MS });
    return [];
  }
}


