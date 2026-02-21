/**
 * Review Analyzer Utility
 * Processes CSV data and extracts meaningful insights about movie reviews
 */

export interface ReviewData {
  movie: string;
  review: string;
  rating: number;
  genre: string;
}

export interface MovieAnalysis {
  movie: string;
  genre: string;
  totalReviews: number;
  averageRating: number;
  positiveReviews: number; // reviews with rating >= 4
  positivePercentage: number;
  topKeywords: string[];
  reviews: ReviewData[];
}

export interface AnalysisResult {
  movies: MovieAnalysis[];
  overallStats: {
    totalMovies: number;
    totalReviews: number;
    averageRating: number;
  };
}

// Common stop words to filter out from keyword extraction
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you',
  'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where',
  'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'same', 'so', 'than', 'too',
  'very', 'just', 'very', 'well', 'really', 'very', 'much', 'also', 'even',
  '','if', 'as', 'the', 'was', 'were'
]);

/**
 * Extract keywords from text
 * Removes stop words, punctuation, and extracts most frequent words
 */
function extractKeywords(text: string, limit: number = 3): string[] {
  if (!text) return [];

  // Convert to lowercase and split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 3) // Only words with 3+ characters
    .filter(word => !STOP_WORDS.has(word)); // Filter stop words

  // Count word frequency
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

/**
 * Parse CSV data (assumes Papa Parse is used upstream)
 * Groups reviews by movie and calculates analytics
 */
export function analyzeReviews(reviews: ReviewData[]): AnalysisResult {
  // Group reviews by movie
  const movieMap: Record<string, ReviewData[]> = {};

  reviews.forEach(review => {
    if (!movieMap[review.movie]) {
      movieMap[review.movie] = [];
    }
    movieMap[review.movie].push(review);
  });

  // Calculate analytics for each movie
  const moviesAnalysis: MovieAnalysis[] = Object.entries(movieMap).map(
    ([movieName, movieReviews]) => {
      const totalReviews = movieReviews.length;
      const ratingsSum = movieReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = ratingsSum / totalReviews;
      const positiveReviews = movieReviews.filter(r => r.rating >= 4).length;
      const positivePercentage = (positiveReviews / totalReviews) * 100;

      // Extract keywords from all reviews of this movie
      const allReviewText = movieReviews
        .map(r => r.review)
        .join(' ');
      const topKeywords = extractKeywords(allReviewText, 3);

      // Get genre from first review (assuming same movie has same genre)
      const genre = movieReviews[0]?.genre || 'Unknown';

      return {
        movie: movieName,
        genre,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        positiveReviews,
        positivePercentage: Math.round(positivePercentage * 10) / 10,
        topKeywords,
        reviews: movieReviews,
      };
    }
  );

  // Sort by average rating (descending)
  moviesAnalysis.sort((a, b) => b.averageRating - a.averageRating);

  // Calculate overall statistics
  const totalReviews = reviews.length;
  const totalMovies = moviesAnalysis.length;
  const averageRating =
    moviesAnalysis.reduce((sum, m) => sum + m.averageRating, 0) / totalMovies;

  return {
    movies: moviesAnalysis,
    overallStats: {
      totalMovies,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
    },
  };
}

/**
 * Get the top recommended movie based on ratings
 */
export function getTopRecommendedMovie(
  movies: MovieAnalysis[]
): MovieAnalysis | null {
  if (movies.length === 0) return null;
  return movies[0]; // Already sorted by rating in analyzeReviews
}

/**
 * Get the top recommended movie filtered by genre
 * Falls back to overall top movie if no movies found in selected genre
 */
export function getGenreBasedRecommendation(
  movies: MovieAnalysis[],
  preferredGenre: string | null
): { movie: MovieAnalysis | null; isGenreFiltered: boolean } {
  if (!preferredGenre || movies.length === 0) {
    return { movie: getTopRecommendedMovie(movies), isGenreFiltered: false };
  }

  // Filter movies by selected genre (case-insensitive)
  const genreMovies = movies.filter(
    (m) => m.genre.toLowerCase() === preferredGenre.toLowerCase()
  );

  if (genreMovies.length === 0) {
    // No movies in selected genre, return overall top
    return { movie: getTopRecommendedMovie(movies), isGenreFiltered: false };
  }

  // Return top movie from selected genre
  return { movie: genreMovies[0], isGenreFiltered: true };
}

/**
 * Get genre-based insights for all movies
 */
export function getGenreInsights(movies: MovieAnalysis[]): Record<string, number> {
  const genreStats: Record<string, { totalRating: number; count: number }> = {};

  movies.forEach(movie => {
    if (!genreStats[movie.genre]) {
      genreStats[movie.genre] = { totalRating: 0, count: 0 };
    }
    genreStats[movie.genre].totalRating += movie.averageRating;
    genreStats[movie.genre].count += 1;
  });

  // Calculate average rating per genre
  const genreAverages: Record<string, number> = {};
  Object.entries(genreStats).forEach(([genre, { totalRating, count }]) => {
    genreAverages[genre] = Math.round((totalRating / count) * 10) / 10;
  });

  return genreAverages;
}
