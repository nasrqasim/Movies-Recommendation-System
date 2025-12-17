import { NextRequest, NextResponse } from 'next/server';
import { getMoviesByIndustry } from '@/lib/recommendation-grok';
import { enrichMoviesWithImdbPosters } from '@/lib/imdb-enrich';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const industry = searchParams.get('industry');
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '24', 10), 1), 60);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

    if (!industry) {
      return NextResponse.json(
        { error: 'Industry parameter is required' },
        { status: 400 }
      );
    }

    const validIndustries = ['Hollywood', 'Bollywood', 'Lollywood'];
    if (!validIndustries.includes(industry)) {
      return NextResponse.json(
        { error: 'Invalid industry. Must be one of: Hollywood, Bollywood, Lollywood' },
        { status: 400 }
      );
    }

    const allMovies = await getMoviesByIndustry(industry);
    const total = Array.isArray(allMovies) ? allMovies.length : 0;
    const slice = Array.isArray(allMovies) ? allMovies.slice(offset, offset + limit) : [];

    // Enrich with posters (best-effort, cached, no crashes)
    const movies = await enrichMoviesWithImdbPosters(slice, 5);

    return NextResponse.json({
      success: true,
      industry,
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

