import { movies } from "@/data/movies";
import { usePersonalization } from "@/hooks/usePersonalization";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { favorites } = usePersonalization();
  const favMovies = movies.filter((m) => favorites.includes(m.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground mb-6">
          <Heart className="w-6 h-6 text-primary" />
          My Favorites
        </h1>

        {favMovies.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No favorites yet. Start adding movies you love!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favMovies.map((m, i) => (
              <MovieCard key={m.id} movie={m} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
