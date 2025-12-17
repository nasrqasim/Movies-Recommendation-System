'use client'

import { useState } from 'react'
import MovieCard from '@/components/MovieCard'

// UI types for the new stable API schema
type ApiMovie = {
  title?: string
  year?: number
  imdbId?: string
  poster?: string
  imdbUrl?: string
  industry?: string
  genre?: string
  language?: string
  release_year?: number
  overview?: string
}

type ApiRecommendation = ApiMovie & { similarity_score?: number | null }

type RecommendApiResponse = {
  success: boolean
  searchedMovie: ApiMovie | {}
  recommendations: ApiRecommendation[]
  externalLinks: { viewDetails?: string; movieBox?: string }
  errorMessage?: string
  suggestions?: ApiMovie[]
}

export default function Home() {
  const [movieTitle, setMovieTitle] = useState('')
  const [recommendations, setRecommendations] = useState<ApiRecommendation[]>([])
  const [searchedMovie, setSearchedMovie] = useState<ApiMovie | null>(null)
  const [suggestions, setSuggestions] = useState<ApiMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  // Industry filters (after searching, user can refine)
  const [industryFilter, setIndustryFilter] = useState<'all' | 'Hollywood' | 'Bollywood' | 'Lollywood'>('all')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!movieTitle.trim()) {
      setError('Please enter a movie title')
      return
    }

    setLoading(true)
    setError('')
    setHasSearched(true)
    setSearchedMovie(null)
    setSuggestions([])

    try {
      // Call the backend recommendation API (GET /api/recommend)
      const industriesParam = industryFilter === 'all' ? 'all' : industryFilter
      const response = await fetch(`/api/recommend?title=${encodeURIComponent(movieTitle.trim())}&num=20&industries=${encodeURIComponent(industriesParam)}`)
      const data = (await response.json()) as RecommendApiResponse

      // Handle non-2xx HTTP responses and API-level errors in a unified way
      if (!response.ok || !data?.success) {
        // Prefer backend error message, fall back to friendly defaults
        const message: string =
          data?.errorMessage ||
          (response.status === 404
            ? 'Movie not found. Please try another title.'
            : response.status === 503
            ? 'Our movie dataset is currently unavailable. Please try again later.'
            : 'Unable to fetch recommendations. Please try again.')

        setError(message)
        setRecommendations([])
        setSearchedMovie(null)
        setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : [])
        return
      }

      // Successful response: store the recommendations list
      setRecommendations(Array.isArray(data?.recommendations) ? data.recommendations : [])
      setSearchedMovie((data?.searchedMovie && typeof data.searchedMovie === 'object') ? (data.searchedMovie as ApiMovie) : null)
      setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : [])
    } catch (err) {
      // Network or unexpected error
      setError('An unexpected error occurred. Please check your connection and try again.')
      setRecommendations([])
      setSearchedMovie(null)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              AI Movie Rec
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Smart Movie Recommendations Powered by Artificial Intelligence
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-12">
              Discover movies you’ll love from Hollywood, Bollywood, and Lollywood using advanced AI-based recommendations.
              Search for any movie and instantly get similar suggestions tailored to your interests.
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="movie-title" className="block text-sm font-medium text-gray-700 mb-2">
                Find Your Next Favorite Movie
              </label>
              <div className="flex gap-4">
                <input
                  id="movie-title"
                  type="text"
                  value={movieTitle}
                  onChange={(e) => {
                    setMovieTitle(e.target.value)
                    // Clear stale errors while the user is typing (better UX)
                    if (error) setError('')
                  }}
                  placeholder="Enter a movie title or keyword (e.g. love, fight, romance, history)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Get Recommendations'}
                </button>
              </div>
            </div>

            {/* Industry selection */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Industry:</span>
              {(['all', 'Hollywood', 'Bollywood', 'Lollywood'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIndustryFilter(opt)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    industryFilter === opt
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {opt === 'all' ? 'All' : opt}
                </button>
              ))}
              <span className="text-xs text-gray-500 ml-auto">
                Search smarter. Watch better.
              </span>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Featured Industries Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
          <p className="text-gray-600 mt-2">Built for movie lovers worldwide.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI-powered movie recommendations</h3>
            <p className="text-gray-600">Smart suggestions based on genre, storyline, and similarity signals.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Supports multiple industries</h3>
            <p className="text-gray-600">Hollywood, Bollywood, and Lollywood—discover global cinema in one place.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fast and simple search</h3>
            <p className="text-gray-600">Search by movie title or keyword (love, fight, romance, history).</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Content-based filtering</h3>
            <p className="text-gray-600">Recommendations based on movie content—not on user tracking.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clean, modern design</h3>
            <p className="text-gray-600">Responsive UI that looks great on desktop and mobile.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Explore by industry & genre</h3>
            <p className="text-gray-600">Browse collections and discover new picks quickly.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Explore Movies by Industry
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-blue-700 mb-2">Hollywood</h3>
            <p className="text-gray-600">Global cinema featuring action, drama, sci-fi, thrillers, and blockbusters.</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-red-700 mb-2">Bollywood</h3>
            <p className="text-gray-600">Hindi-language cinema known for emotional storytelling, music, and romance.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-green-700 mb-2">Lollywood</h3>
            <p className="text-gray-600">Pakistani cinema showcasing culture, drama, and modern storytelling.</p>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {hasSearched && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Analyzing movies and finding recommendations...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <>
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                Recommended Movies
              </h2>

              {/* Searched movie card (links live inside the card, as requested) */}
              {searchedMovie?.title ? (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Searched Movie</h3>
                  <MovieCard movie={searchedMovie as any} showLinks={true} />
                  <p className="mt-2 text-xs text-gray-500">
                    External link – availability not guaranteed.
                  </p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((movie) => (
                  <MovieCard
                    key={`${movie.imdbId || movie.title}-${movie.release_year || movie.year || ''}`}
                    movie={movie as any}
                    showLinks={false}
                  />
                ))}
              </div>
            </>
          ) : !error && (
            <div className="text-center py-12">
              <p className="text-gray-600">No recommendations found. Try a different movie title.</p>
            </div>
          )}

          {/* Did you mean? suggestions (only when we have an error) */}
          {Boolean(error) && suggestions.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-semibold text-yellow-900 mb-2">Did you mean?</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={`${s.imdbId || s.title}-${s.year || s.release_year || ''}`}
                    type="button"
                    onClick={() => setMovieTitle(s.title || '')}
                    className="px-3 py-2 text-sm bg-white border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    {s.title}{(s.year || s.release_year) ? ` (${s.year || s.release_year})` : ''}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-yellow-800">
                Tip: click a suggestion to fill the search box, then press “Get Recommendations”.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

