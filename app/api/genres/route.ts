import { NextRequest, NextResponse } from 'next/server';
import { getMoviesByGenre } from '@/lib/recommendation-grok';
import { enrichMoviesWithImdbPosters } from '@/lib/imdb-enrich';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const genre = searchParams.get('genre');
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '24', 10), 1), 60);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

    if (!genre) {
      return NextResponse.json(
        { error: 'Genre parameter is required' },
        { status: 400 }
      );
    }

    const allMovies = await getMoviesByGenre(genre);
    const total = Array.isArray(allMovies) ? allMovies.length : 0;
    const slice = Array.isArray(allMovies) ? allMovies.slice(offset, offset + limit) : [];

    const movies = await enrichMoviesWithImdbPosters(slice, 5);

    return NextResponse.json({
      success: true,
      genre,
      movies,
      count: movies.length,
      total,
      offset,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred while fetching movies',
      },
      { status: 500 }
    );
  }
}

