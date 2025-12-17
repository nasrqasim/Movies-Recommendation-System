/**
 * Poster enrichment for locally-sourced movies (industry/genre pages).
 *
 * We use the free IMDb suggestion API via `imdbSuggestSearch(title)` and attach:
 * - poster
 * - imdbUrl
 *
 * Safety rules:
 * - NEVER throw (always returns a list)
 * - Only accept real IMDb title IDs: tt1234567
 * - Cache is already handled inside `imdbSuggestSearch`
 */

import { imdbSuggestSearch } from '@/lib/imdb-suggest';

export type EnrichableMovie = {
  title?: string;
  poster?: string;
  imdbUrl?: string;
  imdbId?: string;
};

function isValidImdbTitleId(id: string | undefined): boolean {
  return typeof id === 'string' && /^tt\d{5,}$/.test(id);
}

export async function enrichMoviesWithImdbPosters<T extends EnrichableMovie>(
  movies: T[],
  maxConcurrency: number = 5
): Promise<T[]> {
  if (!Array.isArray(movies) || movies.length === 0) return Array.isArray(movies) ? movies : [];

  const out = [...movies];
  const queue = movies
    .map((m, idx) => ({ m, idx }))
    .filter(({ m }) => Boolean(m?.title) && !m.poster && !m.imdbUrl);

  async function worker() {
    while (queue.length > 0) {
      const next = queue.shift();
      if (!next) return;

      const { m, idx } = next;
      const title = (m.title || '').trim();
      if (!title) continue;

      const results = await imdbSuggestSearch(title);
      const best = results.find((r) => isValidImdbTitleId(r.imdbId)) || null;
      if (!best) continue;

      out[idx] = {
        ...out[idx],
        imdbId: out[idx].imdbId || best.imdbId,
        poster: out[idx].poster || best.poster,
        imdbUrl: out[idx].imdbUrl || best.imdbUrl,
      };
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, maxConcurrency) }, () => worker()));
  return out;
}


