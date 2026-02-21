import { MovieAnalysis } from "@/utils/reviewAnalyzer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

interface GenreInsightsProps {
  movies: MovieAnalysis[];
  isLoading?: boolean;
}

export default function GenreInsights({
  movies,
  isLoading = false,
}: GenreInsightsProps) {
  const genreData = useMemo(() => {
    const genreStats: Record<
      string,
      { totalRating: number; count: number; positiveReviews: number }
    > = {};

    movies.forEach((movie) => {
      if (!genreStats[movie.genre]) {
        genreStats[movie.genre] = {
          totalRating: 0,
          count: 0,
          positiveReviews: 0,
        };
      }
      genreStats[movie.genre].totalRating += movie.averageRating;
      genreStats[movie.genre].count += 1;
      genreStats[movie.genre].positiveReviews += movie.positivePercentage;
    });

    return Object.entries(genreStats)
      .map(
        ([
          genre,
          { totalRating, count, positiveReviews },
        ]) => ({
          genre,
          avgRating: Math.round((totalRating / count) * 10) / 10,
          avgPositive: Math.round((positiveReviews / count) * 10) / 10,
          count,
        })
      )
      .sort((a, b) => b.avgRating - a.avgRating);
  }, [movies]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Analyzing genres...</p>
        </div>
      </div>
    );
  }

  if (genreData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No genre data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Genre Performance Analysis
        </h3>
        <p className="text-sm text-muted-foreground">
          Average ratings and positive sentiment by genre
        </p>
      </div>

      <div className="glass rounded-lg border border-border p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={genreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="genre"
              tick={{ fontSize: 12, fill: "currentColor", opacity: 0.7 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis
              domain={[0, 5]}
              tick={{ fontSize: 12, fill: "currentColor", opacity: 0.7 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => value.toFixed(2)}
              labelFormatter={(label) => `Genre: ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
            />
            <Bar
              dataKey="avgRating"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              name="Avg Rating"
              animationDuration={800}
            />
            <Bar
              dataKey="avgPositive"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
              name="Avg Positive %"
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {genreData.map((genre, idx) => (
          <div
            key={`${genre.genre}-${idx}`}
            className="glass rounded-lg border border-border p-5 hover:border-primary/50 transition-all animate-in fade-in-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-foreground text-lg">
                {genre.genre}
              </h4>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {genre.avgRating.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">/5.0</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Movies</span>
                <span className="font-semibold text-foreground">
                  {genre.count}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Avg Positive %
                </span>
                <span className="font-semibold text-green-500">
                  {genre.avgPositive.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="bg-gradient-to-r from-primary to-blue-500 h-full"
                  style={{ width: `${(genre.avgRating / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {genreData.length > 0 && (
        <div className="glass rounded-lg border border-border p-6 bg-gradient-to-r from-primary/5 to-purple-500/5">
          <h4 className="font-bold text-foreground mb-3">Genre Rankings</h4>
          <div className="space-y-2">
            {genreData.map((genre, idx) => (
              <div
                key={`ranking-${genre.genre}-${idx}`}
                className="flex items-center justify-between p-2 rounded hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-bold text-muted-foreground w-6">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-foreground">
                    {genre.genre}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {genre.count} movie{genre.count !== 1 ? "s" : ""}
                  </span>
                  <span className="font-bold text-primary">
                    {genre.avgRating.toFixed(1)} ⭐
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
