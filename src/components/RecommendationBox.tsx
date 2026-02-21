import { MovieAnalysis } from "@/utils/reviewAnalyzer";
import { Star, Sparkles, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecommendationBoxProps {
  movie: MovieAnalysis | null;
  isLoading?: boolean;
  preferredGenre?: string | null;
  isGenreFiltered?: boolean;
}

export default function RecommendationBox({
  movie,
  isLoading = false,
  preferredGenre = null,
  isGenreFiltered = false,
}: RecommendationBoxProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Finding best movie...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fallback Message */}
      {preferredGenre && !isGenreFiltered && (
        <div className="glass rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
              No highly rated movies in "{preferredGenre}"
            </p>
            <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-1">
              Showing the overall highest rated movie instead. You can explore all {preferredGenre} movies in the dashboard.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Movie Card */}
        <div className="glass rounded-lg border border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Recommended{isGenreFiltered && preferredGenre ? " for " + preferredGenre : ""} Movie
              </h2>
              {isGenreFiltered && preferredGenre && (
                <p className="text-xs text-muted-foreground mt-1">
                  Based on your interest in {preferredGenre}
                </p>
              )}
            </div>
          </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Movie Title</p>
            <h3 className="text-3xl font-bold text-foreground break-words">
              {movie.movie}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Genre</p>
              <Badge className="w-full flex justify-center py-2 text-sm">
                {movie.genre}
              </Badge>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Avg Rating</p>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-2xl font-bold text-foreground">
                  {movie.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Positive Reviews</p>
            <div className="bg-background/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">
                  {movie.positivePercentage.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  ({movie.positiveReviews}/{movie.totalReviews} reviews)
                </span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-primary h-full"
                  style={{ width: `${movie.positivePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Recommended */}
      <div className="glass rounded-lg border border-border p-8">
        <h3 className="text-xl font-bold text-foreground mb-6">Why Recommended</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">
                Highest Rated
              </p>
              <p className="text-sm text-muted-foreground">
                Outstanding average rating of {movie.averageRating}/5 stars
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">
                Highly Positive Reception
              </p>
              <p className="text-sm text-muted-foreground">
                {movie.positivePercentage.toFixed(0)}% of reviewers gave it 4+ stars
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">
                Strong in {movie.genre}
              </p>
              <p className="text-sm text-muted-foreground">
                Excels in {movie.genre} genre with consistent appreciation
              </p>
            </div>
          </div>

          {movie.topKeywords.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">
                  Most Praised For
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
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
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-foreground font-semibold mb-2">
            Overall Rating Analysis
          </p>
          <p className="text-xs text-muted-foreground">
            Based on {movie.totalReviews} reviews in multiple languages, this
            movie stands out as the top choice with exceptional audience
            satisfaction.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
