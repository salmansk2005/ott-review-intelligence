import { MovieAnalysis } from "@/utils/reviewAnalyzer";
import { Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReviewDashboardProps {
  movies: MovieAnalysis[];
  isLoading?: boolean;
}

export default function ReviewDashboard({
  movies,
  isLoading = false,
}: ReviewDashboardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Analyzing reviews...</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No review data available. Upload a CSV file to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Movie Reviews Analysis
        </h2>
        <p className="text-muted-foreground">
          {movies.length} movies • {movies.reduce((sum, m) => sum + m.totalReviews, 0)} total reviews
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie, idx) => (
          <div
            key={`${movie.movie}-${idx}`}
            className="glass rounded-lg border border-border p-5 hover:border-primary/50 transition-all hover:shadow-lg animate-in fade-in-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Movie Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-2">
                {movie.movie}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-primary/10">
                  {movie.genre}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-foreground">
                    {movie.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Reviews</span>
                <span className="font-semibold text-foreground">
                  {movie.totalReviews}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Positive Reviews
                </span>
                <span className="font-semibold text-green-500">
                  {movie.positivePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-primary h-full transition-all"
                  style={{ width: `${movie.positivePercentage}%` }}
                />
              </div>
            </div>

            {/* Keywords */}
            {movie.topKeywords.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Top Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.topKeywords.map((keyword, i) => (
                    <Badge
                      key={`${keyword}-${i}`}
                      variant="secondary"
                      className="text-xs capitalize"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
