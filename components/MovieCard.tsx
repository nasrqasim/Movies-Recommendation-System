import Image from 'next/image'

// This component is used for BOTH:
// - Local CSV-based movies (industry/genre/overview)
// - API-enriched movies (poster + imdbUrl)
type MovieCardMovie = {
  title?: string
  industry?: string
  genre?: string
  language?: string
  release_year?: number
  overview?: string
  poster?: string
  imdbUrl?: string
}

interface MovieCardProps {
  movie: MovieCardMovie
  showLinks?: boolean
}

export default function MovieCard({ movie, showLinks = false }: MovieCardProps) {
  const industryColors: { [key: string]: string } = {
    Hollywood: 'bg-blue-100 text-blue-800',
    Bollywood: 'bg-red-100 text-red-800',
    Lollywood: 'bg-green-100 text-green-800',
  }

  const industryColor = movie.industry
    ? industryColors[movie.industry] || 'bg-gray-100 text-gray-800'
    : 'bg-gray-100 text-gray-800'

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Poster (best-effort) */}
      {movie.poster ? (
        <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
          <Image
            src={movie.poster}
            alt={movie.title || 'Movie poster'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
            {movie.title || 'Untitled'}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.industry ? (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${industryColor}`}>
              {movie.industry}
            </span>
          ) : null}
          {movie.language ? (
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
              {movie.language}
            </span>
          ) : null}
          {movie.release_year ? (
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
              {movie.release_year}
            </span>
          ) : null}
        </div>
        
        {movie.genre ? (
          <div className="mb-3">
            <p className="text-sm text-gray-600 font-medium mb-1">Genres:</p>
            <p className="text-sm text-gray-800">{movie.genre}</p>
          </div>
        ) : null}
        
        {movie.overview ? (
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Overview:</p>
            <p className="text-sm text-gray-700 line-clamp-3">{movie.overview}</p>
          </div>
        ) : null}

        {/* External links (only for searched movie card / when requested) */}
        {showLinks && movie.title ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {movie.imdbUrl ? (
              <a
                href={movie.imdbUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Details
              </a>
            ) : null}
            <a
            href="https://moviebox.ph/"              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
            Download          </div>
        ) : null}
      </div>
    </div>
  )
}

