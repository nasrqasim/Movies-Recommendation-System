/**
 * Grok API Integration for Movie Data
 * Fetches movie information dynamically from Grok API
 */

export interface GrokMovie {
  movie_id?: number;
  title: string;
  industry: string;
  genre: string;
  language: string;
  release_year: number;
  overview: string;
}

interface GrokResponse {
  movies?: GrokMovie[];
  movie?: GrokMovie;
  error?: string;
}

/**
 * Fetch movies from Grok API
 * Note: This is a placeholder implementation. Replace with actual Grok API endpoints.
 */
export async function fetchMoviesFromGrok(query?: string): Promise<GrokMovie[]> {
  const apiKey = process.env.GROK_API_KEY || process.env.NEXT_PUBLIC_GROK_API_KEY;
  
  if (!apiKey) {
    // Fallback: Return sample movies if API key is not configured
    console.warn('Grok API key not found. Using sample data.');
    return getSampleMovies();
  }

  try {
    // Grok API endpoint (X AI API)
    const apiUrl = 'https://api.x.ai/v1/chat/completions';

    const prompt = query 
      ? `Provide detailed information about the movie "${query}". Return ONLY a valid JSON object (no markdown, no code blocks) with these exact fields: {"title": "movie title", "genre": "comma-separated genres", "overview": "plot description", "release_year": year as number, "industry": "Hollywood/Bollywood/Lollywood", "language": "language name"}.`
      : `Provide a list of 20 popular movies from Hollywood, Bollywood, and Lollywood. Return ONLY a valid JSON array (no markdown, no code blocks) where each movie object has these exact fields: {"title": "movie title", "genre": "comma-separated genres", "overview": "plot description", "release_year": year as number, "industry": "Hollywood/Bollywood/Lollywood", "language": "language name"}.`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: 'You are a movie database assistant. Always respond with valid JSON only, no additional text or explanation.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse Grok response (adjust based on actual response structure)
    // Grok typically returns text, so we need to parse the JSON from the response
    const content = data.choices?.[0]?.message?.content || '';
    
    try {
      // Clean the content - remove markdown code blocks if present
      let cleanContent = content.trim();
      cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
      cleanContent = cleanContent.replace(/^```\s*/i, '').replace(/```\s*$/, '');
      cleanContent = cleanContent.trim();
      
      // Try to parse as JSON
      const parsed = JSON.parse(cleanContent);
      
      // Handle array response
      if (Array.isArray(parsed)) {
        return parsed.map((movie, index) => ({
          ...movie,
          movie_id: movie.movie_id || index + 1,
          genre: typeof movie.genre === 'string' ? movie.genre.replace(/,/g, ' ') : String(movie.genre || ''),
        }));
      }
      
      // Handle single object response
      if (typeof parsed === 'object' && parsed.title) {
        return [{
          ...parsed,
          movie_id: parsed.movie_id || 1,
          genre: typeof parsed.genre === 'string' ? parsed.genre.replace(/,/g, ' ') : String(parsed.genre || ''),
        }];
      }
      
      // Fallback to sample data if structure is unexpected
      console.warn('Unexpected Grok API response structure. Using sample data.');
      return getSampleMovies();
    } catch (parseError) {
      console.error('Error parsing Grok response:', parseError);
      console.log('Raw response:', content.substring(0, 200));
      return getSampleMovies();
    }
  } catch (error) {
    console.error('Error fetching from Grok API:', error);
    // Return sample data as fallback
    return getSampleMovies();
  }
}

/**
 * Search for a specific movie using Grok API
 */
export async function searchMovieInGrok(movieTitle: string): Promise<GrokMovie | null> {
  const movies = await fetchMoviesFromGrok(movieTitle);
  
  // Find match (case-insensitive + trimmed).
  // IMPORTANT: Do NOT fall back to the first movie, otherwise invalid titles
  // will "randomly succeed" and the UI can never show a proper "not found" message.
  const normalized = (movieTitle || '').trim().toLowerCase();
  const found = movies.find((movie) => (movie.title || '').trim().toLowerCase() === normalized);

  return found || null;
}

/**
 * Get all movies from Grok (with caching)
 */
let moviesCache: GrokMovie[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function getAllMoviesFromGrok(): Promise<GrokMovie[]> {
  // Return cached data if still valid
  if (moviesCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return moviesCache;
  }

  // Fetch fresh data
  moviesCache = await fetchMoviesFromGrok();
  cacheTimestamp = Date.now();
  
  return moviesCache;
}

/**
 * Sample movies data (fallback when API is unavailable)
 * Expanded list for better recommendations
 */
function getSampleMovies(): GrokMovie[] {
  return [
    {
      movie_id: 1,
      title: 'Inception',
      industry: 'Hollywood',
      genre: 'Action Sci-Fi Thriller',
      language: 'English',
      release_year: 2010,
      overview: 'A skilled thief enters people\'s dreams to steal secrets and is offered a chance to have his past crimes forgiven.',
    },
    {
      movie_id: 2,
      title: 'The Dark Knight',
      industry: 'Hollywood',
      genre: 'Action Crime Drama',
      language: 'English',
      release_year: 2008,
      overview: 'Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.',
    },
    {
      movie_id: 3,
      title: 'Dangal',
      industry: 'Bollywood',
      genre: 'Drama Sports',
      language: 'Hindi',
      release_year: 2016,
      overview: 'A former wrestler trains his daughters to become world-class wrestlers against all odds.',
    },
    {
      movie_id: 4,
      title: '3 Idiots',
      industry: 'Bollywood',
      genre: 'Comedy Drama',
      language: 'Hindi',
      release_year: 2009,
      overview: 'Two friends search for their long-lost college friend who inspired them to think differently.',
    },
    {
      movie_id: 5,
      title: 'Jawani Phir Nahi Ani',
      industry: 'Lollywood',
      genre: 'Comedy Romance',
      language: 'Urdu',
      release_year: 2015,
      overview: 'A group of friends go on a hilarious adventure to Dubai, facing unexpected challenges.',
    },
    {
      movie_id: 6,
      title: 'Interstellar',
      industry: 'Hollywood',
      genre: 'Adventure Drama Sci-Fi',
      language: 'English',
      release_year: 2014,
      overview: 'A team of explorers travel through a wormhole in space to ensure humanity\'s survival.',
    },
    {
      movie_id: 7,
      title: 'Lagaan',
      industry: 'Bollywood',
      genre: 'Drama Sports',
      language: 'Hindi',
      release_year: 2001,
      overview: 'Indian villagers challenge British rule through a game of cricket.',
    },
    {
      movie_id: 8,
      title: 'The Matrix',
      industry: 'Hollywood',
      genre: 'Action Sci-Fi',
      language: 'English',
      release_year: 1999,
      overview: 'A computer hacker learns about the true nature of reality and his role in a war against its controllers.',
    },
    {
      movie_id: 9,
      title: 'PK',
      industry: 'Bollywood',
      genre: 'Comedy Drama',
      language: 'Hindi',
      release_year: 2014,
      overview: 'An alien on Earth loses his communication device and questions religious dogmas.',
    },
    {
      movie_id: 10,
      title: 'Bol',
      industry: 'Lollywood',
      genre: 'Drama',
      language: 'Urdu',
      release_year: 2011,
      overview: 'A father on death row tells his daughter the story of their family.',
    },
    {
      movie_id: 11,
      title: 'The Avengers',
      industry: 'Hollywood',
      genre: 'Action Adventure Sci-Fi',
      language: 'English',
      release_year: 2012,
      overview: 'Earth\'s mightiest heroes must come together to stop Loki and his alien army.',
    },
    {
      movie_id: 12,
      title: 'Bahubali: The Beginning',
      industry: 'Bollywood',
      genre: 'Action Drama',
      language: 'Hindi',
      release_year: 2015,
      overview: 'A warrior fights to rescue his queen from a tyrannical ruler.',
    },
    {
      movie_id: 13,
      title: 'Waar',
      industry: 'Lollywood',
      genre: 'Action Thriller',
      language: 'Urdu',
      release_year: 2013,
      overview: 'A retired counter-terrorism officer returns to stop a major terrorist attack.',
    },
    {
      movie_id: 14,
      title: 'Pulp Fiction',
      industry: 'Hollywood',
      genre: 'Crime Drama',
      language: 'English',
      release_year: 1994,
      overview: 'The lives of two mob hitmen, a boxer, and others intertwine in a tale of violence and redemption.',
    },
    {
      movie_id: 15,
      title: 'Zindagi Na Milegi Dobara',
      industry: 'Bollywood',
      genre: 'Comedy Drama',
      language: 'Hindi',
      release_year: 2011,
      overview: 'Three friends go on a road trip through Spain before one of them gets married.',
    },
    {
      movie_id: 16,
      title: 'Moor',
      industry: 'Lollywood',
      genre: 'Drama',
      language: 'Urdu',
      release_year: 2015,
      overview: 'A railway station master in Balochistan faces corruption and political challenges.',
    },
    {
      movie_id: 17,
      title: 'Titanic',
      industry: 'Hollywood',
      genre: 'Drama Romance',
      language: 'English',
      release_year: 1997,
      overview: 'A young aristocrat falls in love with a kind but poor artist aboard the ill-fated RMS Titanic.',
    },
  ];
}

