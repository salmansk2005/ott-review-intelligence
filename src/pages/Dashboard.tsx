import { useState, useMemo, useEffect } from "react";
import { movies, Movie } from "@/data/movies";
import { usePersonalization } from "@/hooks/usePersonalization";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import LoadingScreen from "@/components/LoadingScreen";
import { TrendingUp, Sparkles, Clock } from "lucide-react";

function MovieRow({ title, icon: Icon, movieList }: { title: string; icon: React.ElementType; movieList: Movie[] }) {
  if (movieList.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground mb-4">
        <Icon className="w-5 h-5 text-primary" />
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movieList.map((m, i) => (
          <MovieCard key={m.id} movie={m} index={i} />
        ))}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { getRecommended } = usePersonalization();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let result = [...movies];
    if (search) result = result.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));
    if (language) result = result.filter((m) => m.language === language);
    if (genre) result = result.filter((m) => m.genre === genre);
    if (platform) result = result.filter((m) => m.platforms.includes(platform));
    if (sortBy === "rating-desc") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "rating-asc") result.sort((a, b) => a.rating - b.rating);
    else if (sortBy === "year-desc") result.sort((a, b) => b.releaseYear - a.releaseYear);
    else if (sortBy === "year-asc") result.sort((a, b) => a.releaseYear - b.releaseYear);
    return result;
  }, [search, language, genre, platform, sortBy]);

  const hasFilters = search || language || genre || platform || sortBy;

  const newReleases = useMemo(() => movies.filter((m) => m.releaseYear >= 2024).slice(0, 12), []);
  const trending = useMemo(() => movies.filter((m) => m.rating >= 7.5).sort((a, b) => b.rating - a.rating), []);
  const recommended = useMemo(() => getRecommended(movies).slice(0, 12), [getRecommended]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <FilterBar
          search={search} onSearch={setSearch}
          language={language} onLanguage={setLanguage}
          genre={genre} onGenre={setGenre}
          platform={platform} onPlatform={setPlatform}
          sortBy={sortBy} onSort={setSortBy}
        />

        {hasFilters ? (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Search Results ({filtered.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((m, i) => (
                <MovieCard key={m.id} movie={m} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-20">No movies found matching your filters.</p>
            )}
          </section>
        ) : (
          <>
            <MovieRow title="Newly Released" icon={Clock} movieList={newReleases} />
            <MovieRow title="Recommended For You" icon={Sparkles} movieList={recommended} />
            <MovieRow title="Trending Now" icon={TrendingUp} movieList={trending} />
          </>
        )}
      </main>
    </div>
  );
}
