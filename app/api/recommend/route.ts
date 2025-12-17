import { NextRequest, NextResponse } from 'next/server';
import { imdbSuggestSearch } from '@/lib/imdb-suggest';
import {
  getRecommendations as getCsvRecommendations,
  loadMovies as loadCsvMovies,
  searchMoviesByKeyword,
  Movie as CsvMovie,
} from '@/lib/recommendation';

// API response types (beginner-friendly + always stable shape)
type ApiMovie = {
  title?: string;
  year?: number;
  imdbId?: string;
  poster?: string;
  imdbUrl?: string;
  industry?: string;
  genre?: string;
  language?: string;
  release_year?: number;
  overview?: string;
};

type ApiRecommendation = ApiMovie & { similarity_score?: number | null };

type ApiResponse = {
  success: boolean;
  searchedMovie: ApiMovie | {};
  recommendations: ApiRecommendation[];
  externalLinks: { viewDetails?: string; movieBox?: string };
  // optional extras (still safe to ignore on frontend)
  errorMessage?: string;
  suggestions?: ApiMovie[];
};

function normalizeTitle(input: string): string {
  return (input || '').trim().toLowerCase();
}

function buildMovieBoxLink(title: string): string {
  return `https://moviebox.ph/search/${encodeURIComponent(title)}`;
}

function parseIndustriesParam(raw: string | null): string[] {
  if (!raw) return [];
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned || cleaned === 'all') return [];
  return cleaned
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x[0].toUpperCase() + x.slice(1)); // "hollywood" -> "Hollywood"
}

async function enrichTitlesWithImdb(
  items: ApiRecommendation[],
  maxConcurrency: number = 5
): Promise<ApiRecommendation[]> {
  // Fill poster + imdbUrl for items that only have title.
  const queue = items.map((item, idx) => ({ item, idx }));
  const out = [...items];

  async function worker() {
    while (queue.length > 0) {
      const next = queue.shift();
      if (!next) return;

      const { item, idx } = next;
      if (!item?.title || item.poster || item.imdbUrl) continue;

      const suggestions = await imdbSuggestSearch(item.title);
      const best = suggestions[0];
      if (best) {
        out[idx] = {
          ...item,
          imdbId: item.imdbId || best.imdbId,
          poster: item.poster || best.poster,
          imdbUrl: item.imdbUrl || best.imdbUrl,
        };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, maxConcurrency) }, () => worker()));
  return out;
}

function findBestCsvMatch(movies: CsvMovie[], query: string): CsvMovie | null {
  const q = normalizeTitle(query);
  if (!q) return null;

  // 1) Exact match
  const exact = movies.find((m) => normalizeTitle(m.title) === q) || null;
  if (exact) return exact;

  // 2) Partial match
  const partial = movies.find((m) => normalizeTitle(m.title).includes(q)) || null;
  return partial;
}

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters (?title=...&num=10)
    const searchParams = request.nextUrl.searchParams;
    const movieTitle = searchParams.get('title');
    const numRecs = parseInt(searchParams.get('num') || '10', 10);
    const industriesParam = searchParams.get('industries'); // "all" or "Hollywood,Bollywood"
    const industries = parseIndustriesParam(industriesParam);

    // Basic validation: movie title must be provided
    if (!movieTitle || movieTitle.trim() === '') {
      const body: ApiResponse = {
        success: false,
        searchedMovie: {},
        recommendations: [],
        externalLinks: {},
        errorMessage: 'Please enter a movie title.',
        suggestions: [],
      };
      return NextResponse.json(body, { status: 400 });
    }

    // Basic validation: clamp the number of recommendations
    if (numRecs < 1 || numRecs > 50) {
      const body: ApiResponse = {
        success: false,
        searchedMovie: {},
        recommendations: [],
        externalLinks: {},
        errorMessage: 'Number of recommendations must be between 1 and 50.',
        suggestions: [],
      };
      return NextResponse.json(body, { status: 400 });
    }

    const rawQuery = movieTitle.trim();
    const normalized = normalizeTitle(rawQuery);

    // ============================
    // A) PRIMARY SEARCH (FREE API)
    // ============================
    const imdbResults = await imdbSuggestSearch(normalized);

    // Find best match (partial match first, then first item)
    const imdbBest =
      imdbResults.find((m) => normalizeTitle(m.title) === normalized) ||
      imdbResults.find((m) => normalizeTitle(m.title).includes(normalized)) ||
      imdbResults[0] ||
      null;

    // suggestions: show top 5 choices (for UX “Did you mean?”)
    const suggestions: ApiMovie[] = imdbResults.slice(0, 5).map((m) => ({
      title: m.title,
      year: m.year,
      imdbId: m.imdbId,
      poster: m.poster,
      imdbUrl: m.imdbUrl,
    }));

    // ============================
    // B) SECONDARY (LOCAL CSV)
    // ============================
    const csvMovies = loadCsvMovies();
    const csvMatch =
      findBestCsvMatch(csvMovies, imdbBest?.title || rawQuery) || findBestCsvMatch(csvMovies, rawQuery);

    // If the user typed a keyword ("love", "fight", etc.) OR they want industry filtering,
    // we will generate recommendations from the CSV keyword search.
    const keywordCandidates = searchMoviesByKeyword(rawQuery, industries, Math.max(20, numRecs));

    // If we found a movie via IMDb OR CSV, we can respond with a searchedMovie
    if (imdbBest || csvMatch || keywordCandidates.length > 0) {
      const searchedTitle = csvMatch?.title || imdbBest?.title || rawQuery;

      // Build searched movie object with best available info
      const searchedMovie: ApiMovie = {
        title: searchedTitle,
        year: imdbBest?.year ?? (csvMatch ? csvMatch.release_year : undefined),
        imdbId: imdbBest?.imdbId,
        poster: imdbBest?.poster,
        imdbUrl: imdbBest?.imdbUrl,
        industry: csvMatch?.industry,
        genre: csvMatch?.genre,
        language: csvMatch?.language,
        release_year: csvMatch?.release_year,
        overview: csvMatch?.overview,
      };

      // Recommendations strategy (top 20):
      // - If user typed a keyword OR selected industries: keyword-search CSV and return top 20.
      // - Else if CSV has a title match: TF‑IDF recommender.
      // - Else: fall back to IMDb suggestions.
      let recommendations: ApiRecommendation[] = [];

      const wantTopN = Math.max(1, Math.min(50, industriesParam ? 20 : numRecs));

      if (keywordCandidates.length > 0 && (!csvMatch || industriesParam)) {
        recommendations = keywordCandidates.slice(0, wantTopN).map((r) => ({
          title: r.title,
          industry: r.industry,
          genre: r.genre,
          language: r.language,
          release_year: r.release_year,
          overview: r.overview,
          similarity_score: null,
        }));
      } else if (csvMatch) {
        const recs = getCsvRecommendations(csvMatch.title, wantTopN);
        recommendations = recs.map((r) => ({
          title: r.title,
          industry: r.industry,
          genre: r.genre,
          language: r.language,
          release_year: r.release_year,
          overview: r.overview,
          // Hide similarity in UI by default: keep null (still safe if UI ignores it)
          similarity_score: null,
        }));
      } else {
        recommendations = imdbResults
          .filter((m) => normalizeTitle(m.title) !== normalizeTitle(searchedTitle))
          .slice(0, wantTopN)
          .map((m) => ({
            title: m.title,
            year: m.year,
            imdbId: m.imdbId,
            poster: m.poster,
            imdbUrl: m.imdbUrl,
            similarity_score: null,
          }));
      }

      // Add posters to CSV-based results (best-effort, cached, no crashes)
      recommendations = await enrichTitlesWithImdb(recommendations, 5);

      const externalLinks = {
        viewDetails: imdbBest?.imdbUrl,
        movieBox: buildMovieBoxLink(searchedTitle),
      };

      const body: ApiResponse = {
        success: true,
        searchedMovie,
        recommendations,
        externalLinks,
        suggestions,
      };

      return NextResponse.json(body, { status: 200 });
    }

    // If not found anywhere: respond safely with suggestions (may be empty)
    const body: ApiResponse = {
      success: false,
      searchedMovie: {},
      recommendations: [],
      externalLinks: {},
      errorMessage: `Movie "${rawQuery}" not found. Please try another title.`,
      suggestions,
    };
    return NextResponse.json(body, { status: 404 });
  } catch (error: any) {
    const message =
      error?.message ||
      'An error occurred while fetching recommendations. Please try again.';

    const body: ApiResponse = {
      success: false,
      searchedMovie: {},
      recommendations: [],
      externalLinks: {},
      errorMessage: message,
      suggestions: [],
    };

    return NextResponse.json(body, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Keep POST supported for beginners; just forward to GET logic.
  // This ensures one consistent response shape.
  const json = await request.json().catch(() => ({}));
  const title = typeof json?.title === 'string' ? json.title : '';
  const num = typeof json?.num === 'number' || typeof json?.num === 'string' ? String(json.num) : '10';

  const url = new URL(request.url);
  url.searchParams.set('title', title);
  url.searchParams.set('num', num);

  // Reuse GET logic
  return GET(new NextRequest(url.toString(), request as any));
}

