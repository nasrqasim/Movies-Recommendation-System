/**
 * Content-Based Movie Recommendation System (Local CSV Dataset)
 * -------------------------------------------------------------
 * - Uses TF‑IDF vectorization + cosine similarity (content‑based filtering)
 * - Reads from the local CSV dataset in `dataset/movies_15000.csv`
 * - Designed to fail gracefully so the API can always return a friendly JSON
 */

import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

export interface Movie {
  movie_id: number;
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

/**
 * Load movies from CSV file.
 * - Uses a simple in‑memory cache so we only hit the filesystem once.
 */
export function loadMovies(): Movie[] {
  if (moviesCache) {
    return moviesCache;
  }

  const datasetPath = path.join(process.cwd(), 'dataset', 'movies_15000.csv');
  const fileContent = fs.readFileSync(datasetPath, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    cast: true,
  });

  moviesCache = records.map((record: any) => ({
    movie_id: parseInt(record.movie_id),
    title: record.title.trim(),
    industry: record.industry.trim(),
    genre: record.genre.trim(),
    language: record.language.trim(),
    release_year: parseInt(record.release_year),
    overview: record.overview.trim(),
  }));

  return moviesCache as Movie[];
}

/**
 * Simple tokenization and normalization.
 * - Lowercases text
 * - Strips punctuation
 * - Splits on whitespace
 * - Drops very short tokens
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

/**
 * Build vocabulary from all movies.
 * - Creates a sorted list of all unique tokens across title + genre + overview.
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
 * Calculate TF‑IDF for a document.
 * - Returns a vector with the same length as the vocabulary.
 * - Handles edge case where the document has zero valid tokens.
 */
function calculateTfIdf(
  document: string,
  vocabulary: string[],
  allDocuments: string[]
): number[] {
  const tokens = tokenize(document);

  // If there are no valid tokens we return a zero vector so we never divide by 0 or get NaN.
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
 * Calculate cosine similarity between two vectors.
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
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
 * Build TF‑IDF matrix for all movies.
 * - Throws a clear error if the dataset is empty so the API can respond nicely.
 */
function buildTfIdfMatrix(movies: Movie[]): { matrix: number[][]; vocabulary: string[] } {
  if (!movies || movies.length === 0) {
    throw new Error('Dataset is empty. No movies are available for recommendation.');
  }

  if (tfidfMatrix && vocabulary) {
    return { matrix: tfidfMatrix, vocabulary };
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
 * Find movie by title (case‑insensitive).
 */
function findMovieByTitle(movies: Movie[], title: string): Movie | null {
  const normalizedTitle = title.trim().toLowerCase();
  return movies.find(
    movie => movie.title.toLowerCase() === normalizedTitle
  ) || null;
}

/**
 * Get movie recommendations based on content similarity.
 *
 * Behaviour:
 * - Case‑insensitive title matching
 * - Uses cosine similarity over TF‑IDF vectors
 * - Throws descriptive errors that the API layer converts into friendly JSON
 */
export function getRecommendations(
  movieTitle: string,
  numRecommendations: number = 10
): RecommendationResult[] {
  const movies = loadMovies();

  // Guard against an empty dataset up front so the API can show a friendly message.
  if (!movies || movies.length === 0) {
    throw new Error('Dataset is empty. No movies are available for recommendation.');
  }
  
  // Find the input movie (case‑insensitive)
  const inputMovie = findMovieByTitle(movies, movieTitle);
  if (!inputMovie) {
    throw new Error(`Movie "${movieTitle}" not found in the dataset`);
  }

  // Build TF‑IDF matrix (may also throw for an empty dataset)
  const { matrix } = buildTfIdfMatrix(movies);
  const inputMovieIndex = movies.findIndex(
    m => m.movie_id === inputMovie.movie_id
  );

  // Extra safety: if for some reason we can't locate the movie index,
  // bail out with a clear error instead of indexing an undefined row (matrix[-1]).
  if (inputMovieIndex === -1 || !matrix[inputMovieIndex]) {
    throw new Error(`Movie "${movieTitle}" not found in the dataset`);
  }

  // Calculate similarity scores
  const similarities: { movie: Movie; score: number }[] = [];
  
  for (let i = 0; i < movies.length; i++) {
    if (i === inputMovieIndex) continue; // Skip the same movie
    
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
export function getMoviesByIndustry(industry: string): Movie[] {
  const movies = loadMovies();
  return movies.filter(movie => movie.industry === industry);
}

/**
 * Get movies by genre
 */
export function getMoviesByGenre(genre: string): Movie[] {
  const movies = loadMovies();
  return movies.filter(movie =>
    movie.genre.toLowerCase().includes(genre.toLowerCase())
  );
}

/**
 * Keyword search (simple + fast) over the local CSV dataset.
 *
 * Use-case:
 * - User types "love", "fight", "romance", "history", etc.
 * - We score movies by occurrences across: title + genre + overview
 * - Optionally filter by industry (Hollywood/Bollywood/Lollywood)
 *
 * Returns a ranked list of movies (highest score first).
 * This NEVER throws; it returns [] if dataset is empty or query is invalid.
 */
export function searchMoviesByKeyword(
  query: string,
  industries: string[] = [],
  limit: number = 20
): Movie[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];

  const movies = loadMovies();
  if (!movies || movies.length === 0) return [];

  const tokens = tokenize(q);
  if (tokens.length === 0) return [];

  const industrySet = new Set(
    (industries || []).map((x) => (x || '').trim().toLowerCase()).filter(Boolean)
  );
  const hasIndustryFilter = industrySet.size > 0;

  const scored: { movie: Movie; score: number }[] = [];

  for (const movie of movies) {
    if (hasIndustryFilter && !industrySet.has((movie.industry || '').toLowerCase())) {
      continue;
    }

    const haystack = `${movie.title} ${movie.genre} ${movie.overview}`.toLowerCase();

    // Simple scoring: count token occurrences
    let score = 0;
    for (const t of tokens) {
      if (!t) continue;
      // quick includes-based count (good enough + beginner-friendly)
      if (haystack.includes(t)) score += 1;
    }

    if (score > 0) {
      scored.push({ movie, score });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // tie-breaker: newer movies first
    return (b.movie.release_year || 0) - (a.movie.release_year || 0);
  });

  return scored.slice(0, Math.max(1, Math.min(limit, 50))).map((x) => x.movie);
}

