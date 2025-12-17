'use client'

import { useState, useEffect } from 'react'
import MovieCard from '@/components/MovieCard'
import { Movie } from '@/lib/recommendation-grok'

const industries = ['Hollywood', 'Bollywood', 'Lollywood']

export default function Industries() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [displayCount, setDisplayCount] = useState(12)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!selectedIndustry) return

    setLoading(true)
    fetch(`/api/industries?industry=${encodeURIComponent(selectedIndustry)}&limit=${displayCount}&offset=0`)
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
  }, [selectedIndustry, displayCount])

  const industryInfo = {
    Hollywood: {
      description: 'Blockbuster movies from the American film industry, known for high production values and global appeal.',
      color: 'blue'
    },
    Bollywood: {
      description: 'Entertaining films from the Indian film industry, famous for musical numbers and dramatic storytelling.',
      color: 'red'
    },
    Lollywood: {
      description: 'Cinematic gems from the Pakistani film industry, featuring unique storytelling and cultural perspectives.',
      color: 'green'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Movies by Industry
          </h1>
          <p className="text-xl text-gray-600">
            Discover movies from Hollywood, Bollywood, and Lollywood
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4"></div>
        </div>

        {/* Industry Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {industries.map((industry) => {
            const info = industryInfo[industry as keyof typeof industryInfo]
            const isSelected = selectedIndustry === industry
            const colorClasses = {
              blue: isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 hover:bg-blue-100 text-blue-700',
              red: isSelected ? 'bg-red-600 text-white' : 'bg-red-50 hover:bg-red-100 text-red-700',
              green: isSelected ? 'bg-green-600 text-white' : 'bg-green-50 hover:bg-green-100 text-green-700',
            }

            return (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`p-6 rounded-lg shadow-md transition-all duration-200 text-left ${colorClasses[info.color as keyof typeof colorClasses]}`}
              >
                <h2 className="text-2xl font-bold mb-2">{industry}</h2>
                <p className="text-sm opacity-90">{info.description}</p>
              </button>
            )
          })}
        </div>

        {/* Selected Industry Info */}
        {selectedIndustry && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedIndustry} Movies
              </h2>
              <p className="text-gray-600 mb-4">
                {industryInfo[selectedIndustry as keyof typeof industryInfo].description}
              </p>
              <p className="text-sm text-gray-500">
                Showing {movies.length} of {total} movies
              </p>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {selectedIndustry && (
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
                <p className="text-gray-600">No movies found for this industry.</p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!selectedIndustry && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">
              Select an industry above to explore movies
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

