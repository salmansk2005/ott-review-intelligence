import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MovieAnalysis } from "@/utils/reviewAnalyzer";

interface RatingChartProps {
  movies: MovieAnalysis[];
  isLoading?: boolean;
}

export default function RatingChart({ movies, isLoading = false }: RatingChartProps) {
  const chartData = useMemo(() => {
    // Sort movies by rating (descending) and take top 25 for better visualization
    return movies
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 25)
      .map((m) => ({
        name: m.movie.length > 15 ? m.movie.substring(0, 15) + "..." : m.movie,
        fullName: m.movie,
        rating: m.averageRating,
        positive: m.positivePercentage,
      }));
  }, [movies]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        No data available for visualization
      </div>
    );
  }

  return (
    <div className="glass rounded-lg border border-border p-6 w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">
          Movie Ratings Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          Average ratings of top 25 movies sorted by rating
        </p>
      </div>

      <div className="w-full overflow-auto">
        <ResponsiveContainer width="100%" height={400} minWidth={600}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis type="number" domain={[0, 5]} stroke="currentColor" opacity={0.5} />
            <YAxis
              dataKey="name"
              type="category"
              width={195}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
              stroke="currentColor"
              opacity={0.5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "8px",
              }}
              formatter={(value: number) => [
                value.toFixed(2),
                value > 4 ? "Excellent" : value > 3 ? "Good" : "Average",
              ]}
              labelFormatter={(label) => `Movie: ${label}`}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
            />
            <Bar
              dataKey="rating"
              fill="#3b82f6"
              radius={[0, 8, 8, 0]}
              name="Average Rating"
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary/10 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Movies</p>
          <p className="text-2xl font-bold text-primary">{movies.length}</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Avg Rating</p>
          <p className="text-2xl font-bold text-green-500">
            {(
              movies.reduce((sum, m) => sum + m.averageRating, 0) / movies.length
            ).toFixed(1)}
          </p>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Highest Rated</p>
          <p className="text-2xl font-bold text-yellow-500">
            {Math.max(...movies.map((m) => m.averageRating)).toFixed(1)}
          </p>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Lowest Rated</p>
          <p className="text-2xl font-bold text-blue-500">
            {Math.min(...movies.map((m) => m.averageRating)).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
