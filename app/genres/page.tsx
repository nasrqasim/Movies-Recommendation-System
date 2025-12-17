'use client'

import { useState, useEffect } from 'react'
import MovieCard from '@/components/MovieCard'
import { Movie } from '@/lib/recommendation-grok'

const genres = [
  'Action', 'Romance', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 
  'Horror', 'Adventure', 'Crime', 'Fantasy', 'Mystery', 'Biography'
]

export default function Genres() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [displayCount, setDisplayCount] = useState(12)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!selectedGenre) return

    setLoading(true)
    fetch(`/api/genres?genre=${encodeURIComponent(selectedGenre)}&limit=${displayCount}&offset=0`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMovies(Array.isArray(data.movies) ? data.movies : [])
          setTotal(typeof data.total === 'number' ? data.total : (Array.isArray(data.movies) ? data.movies.length : 0))
        } else {
          setMovies([])
          setTotal(0)
        }
      })
      .catch(error => {
        console.error('Error loading movies:', error)
        setMovies([])
        setTotal(0)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [selectedGenre, displayCount])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Movies by Genre
          </h1>
          <p className="text-xl text-gray-600">
            Find movies based on your favorite genre
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4"></div>
        </div>

        {/* Genre Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Genre</h2>
          <div className="flex flex-wrap gap-4">
            {genres.map((genre) => {
              const isSelected = selectedGenre === genre
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                  }`}
                >
                  {genre}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Genre Info */}
        {selectedGenre && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedGenre} Movies
              </h2>
              <p className="text-gray-600 mb-4">
                Discover {selectedGenre.toLowerCase()} movies from Hollywood, Bollywood, and Lollywood. 
                Our AI engine suggests similar movies from multiple industries based on genre matching.
              </p>
              <p className="text-sm text-gray-500">
                Showing {movies.length} of {total} movies
              </p>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {selectedGenre && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading movies...</p>
              </div>
            ) : movies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {movies.slice(0, displayCount).map((movie) => (
                    <MovieCard key={movie.movie_id} movie={movie} />
                  ))}
                </div>
                {movies.length < total && (
                  <div className="text-center">
                    <button
                      onClick={() => setDisplayCount(prev => prev + 12)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Load More Movies
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No movies found for this genre.</p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!selectedGenre && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">
              Select a genre above to explore movies
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

