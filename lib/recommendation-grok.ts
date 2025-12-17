/**
 * Content-Based Movie Recommendation System using Grok API
 * -------------------------------------------------------
 * - Uses TF‑IDF vectorization + cosine similarity
 * - Fetches movie data from Grok or from a local sample fallback
 * - Exposes a robust getRecommendations() function used by the /api/recommend route
 */

import { GrokMovie, getAllMoviesFromGrok, searchMovieInGrok } from './grok-api';

export interface Movie {
  movie_id?: number;
  title: string;
  industry: string;
  genre: string;
  language: string;
  release_year: number;
  overview: string;
}

export interface RecommendationResult extends Movie {
  similarity_score: number;
}

// Cache for movies and similarity matrix
let moviesCache: Movie[] | null = null;
let tfidfMatrix: number[][] | null = null;
let vocabulary: string[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

/**
 * Load movies from Grok API (or sample fallback)
 * - Uses a simple in-memory cache for 1 hour
 * - Never returns null; will return [] if absolutely no data is available
 */
export async function loadMovies(): Promise<Movie[]> {
  // Return cached data if still valid
  if (moviesCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return moviesCache;
  }

  // Fetch from Grok API
  const grokMovies = await getAllMoviesFromGrok();
  
  // If the Grok API (and sample fallback) gave us nothing, treat as empty dataset
  if (!grokMovies || grokMovies.length === 0) {
    moviesCache = [];
    cacheTimestamp = Date.now();
    return moviesCache;
  }

  // Convert GrokMovie to Movie format and normalise fields
  moviesCache = grokMovies.map((movie, index) => ({
    movie_id: movie.movie_id || index + 1,
    title: (movie.title || '').trim(),
    industry: (movie.industry || '').trim(),
    genre: (movie.genre || '').trim(),
    language: (movie.language || '').trim(),
    release_year: movie.release_year,
    overview: (movie.overview || '').trim(),
  }));

  cacheTimestamp = Date.now();
  return moviesCache;
}

/**
 * Simple tokenization and normalization
 * - Lowercases text
 * - Removes punctuation
 * - Splits on whitespace
 * - Filters out very short tokens
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

/**
 * Build vocabulary from all movies
 * - Creates a sorted list of all unique tokens across the corpus
 */
function buildVocabulary(movies: Movie[]): string[] {
  const vocabSet = new Set<string>();
  
  movies.forEach(movie => {
    const combinedText = `${movie.title} ${movie.genre} ${movie.overview}`;
    const tokens = tokenize(combinedText);
    tokens.forEach(token => vocabSet.add(token));
  });

  return Array.from(vocabSet).sort();
}

/**
 * Calculate TF‑IDF vector for a single document
 * - Returns a vector with the same length as the vocabulary
 * - Handles edge case where the document has zero valid tokens
 */
function calculateTfIdf(
  document: string,
  vocabulary: string[],
  allDocuments: string[]
): number[] {
  const tokens = tokenize(document);

  // If no tokens, return a zero vector to avoid division by zero / NaN issues
  if (tokens.length === 0) {
    return vocabulary.map(() => 0);
  }

  const termFreq: { [key: string]: number } = {};
  
  // Count term frequency
  tokens.forEach(token => {
    termFreq[token] = (termFreq[token] || 0) + 1;
  });

  // Calculate TF-IDF vector
  return vocabulary.map(word => {
    const tf = (termFreq[word] || 0) / tokens.length;
    
    // Calculate IDF (inverse document frequency)
    const docCount = allDocuments.filter(doc =>
      tokenize(doc).includes(word)
    ).length;
    const idf = Math.log(allDocuments.length / (docCount + 1));

    return tf * idf;
  });
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  // Defensive guard: if either vector is missing (e.g., cache mismatch),
  // treat similarity as 0 instead of crashing the API route.
  if (!Array.isArray(vec1) || !Array.isArray(vec2)) {
    return 0;
  }
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Build TF‑IDF matrix for all movies
 * - Returns a matrix (movies x vocabulary) and the vocabulary array
 * - Reuses cached matrix if movies have not changed
 */
function buildTfIdfMatrix(movies: Movie[]): { matrix: number[][]; vocabulary: string[] } {
  // Guard against empty dataset early so callers can handle it gracefully
  if (!movies || movies.length === 0) {
    throw new Error('Dataset is empty. Please add movies to the dataset.');
  }

  // Reuse cached matrix only if it still matches the current movie list size.
  // (Movies can be appended at runtime when we fetch a single movie from Grok.)
  if (
    tfidfMatrix &&
    vocabulary &&
    moviesCache === movies &&
    tfidfMatrix.length === movies.length
  ) {
    return { matrix: tfidfMatrix, vocabulary: vocabulary as string[] };
  }

  const combinedTexts = movies.map(
    movie => `${movie.title} ${movie.genre} ${movie.overview}`
  );

  vocabulary = buildVocabulary(movies);
  const vocabArray = vocabulary as string[];
  tfidfMatrix = combinedTexts.map(doc =>
    calculateTfIdf(doc, vocabArray, combinedTexts)
  );

  return { matrix: tfidfMatrix, vocabulary: vocabArray };
}

/**
 * Find a movie by exact title match (case-insensitive)
 */
function findMovieByTitle(movies: Movie[], title: string): Movie | null {
  const normalizedTitle = (title || '').trim().toLowerCase();
  if (!normalizedTitle) return null;

  // 1) Exact match (fast + most accurate)
  const exact =
    movies.find((movie) => (movie.title || '').trim().toLowerCase() === normalizedTitle) ||
    null;
  if (exact) return exact;

  // 2) Partial match fallback (beginner-friendly UX)
  // Example: user types "titanic" and dataset has "Titanic (1997)"
  const partial =
    movies.find((movie) => (movie.title || '').trim().toLowerCase().includes(normalizedTitle)) ||
    null;
  return partial;
}

/**
 * Get movie recommendations based on content similarity.
 *
 * Behaviour:
 * - Case‑insensitive title matching
 * - If not found in the cached list, tries Grok directly via searchMovieInGrok()
 * - If still not found, throws a clear error that the API layer can convert
 *   into a friendly JSON response.
 */
export async function getRecommendations(
  movieTitle: string,
  numRecommendations: number = 10
): Promise<RecommendationResult[]> {
  const movies = await loadMovies();

  // If we received no movies at all, signal "empty dataset" to the API layer
  if (!movies || movies.length === 0) {
    throw new Error('Dataset is empty. No movies are available for recommendation.');
  }
  
  // Find the input movie
  let inputMovie = findMovieByTitle(movies, movieTitle);
  
  // If not found in cache, try searching Grok API
  if (!inputMovie) {
    const grokMovie = await searchMovieInGrok(movieTitle);
    if (grokMovie) {
      // Add to movies array temporarily
      const newMovie: Movie = {
        movie_id: movies.length + 1,
        title: grokMovie.title.trim(),
        industry: grokMovie.industry.trim(),
        genre: grokMovie.genre.trim(),
        language: grokMovie.language.trim(),
        release_year: grokMovie.release_year,
        overview: grokMovie.overview.trim(),
      };
      movies.push(newMovie);
      inputMovie = newMovie;

      // Important: we just changed the movies list length, so any cached TF‑IDF
      // matrix is now stale (row count won't match movies.length). Invalidate it.
      tfidfMatrix = null;
      vocabulary = null;
    } else {
      throw new Error(`Movie "${movieTitle}" not found. Please try another title.`);
    }
  }

  // Build TF‑IDF matrix (may throw if dataset is empty or invalid)
  const { matrix } = buildTfIdfMatrix(movies);
  const inputMovieIndex = movies.findIndex(m => 
    m.title.toLowerCase() === inputMovie!.title.toLowerCase()
  );

  if (inputMovieIndex === -1) {
    // Extra safety: should not happen, but prevents reading matrix[-1]
    throw new Error(`Movie "${movieTitle}" not found in the dataset`);
  }

  // Calculate similarity scores
  const similarities: { movie: Movie; score: number }[] = [];
  
  for (let i = 0; i < movies.length; i++) {
    if (i === inputMovieIndex) continue; // Skip the same movie
    
    // Extra safety: if the matrix is missing a row for any reason, skip it.
    if (!matrix[inputMovieIndex] || !matrix[i]) {
      continue;
    }

    const similarity = cosineSimilarity(matrix[inputMovieIndex], matrix[i]);
    similarities.push({
      movie: movies[i],
      score: similarity,
    });
  }

  // Sort by similarity and get top N
  similarities.sort((a, b) => b.score - a.score);
  
  return similarities
    .slice(0, numRecommendations)
    .map(item => ({
      ...item.movie,
      similarity_score: parseFloat(item.score.toFixed(4)),
    }));
}

/**
 * Get movies by industry
 */
export async function getMoviesByIndustry(industry: string): Promise<Movie[]> {
  const movies = await loadMovies();
  return movies.filter(movie => movie.industry === industry);
}

/**
 * Get movies by genre
 */
export async function getMoviesByGenre(genre: string): Promise<Movie[]> {
  const movies = await loadMovies();
  return movies.filter(movie =>
    movie.genre.toLowerCase().includes(genre.toLowerCase())
  );
}

