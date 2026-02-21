import { usePersonalization } from "@/hooks/usePersonalization";
import Navbar from "@/components/Navbar";
import { Settings, Film, Globe, ThumbsUp, ThumbsDown, Heart } from "lucide-react";

export default function Preferences() {
  const { likedMovies, dislikedMovies, favorites, likedGenres, likedLanguages, topGenre, topLanguage } = usePersonalization();

  const statCards = [
    { label: "Liked Movies", value: likedMovies.length, icon: ThumbsUp, color: "text-green-400" },
    { label: "Disliked Movies", value: dislikedMovies.length, icon: ThumbsDown, color: "text-red-400" },
    { label: "Favorites", value: favorites.length, icon: Heart, color: "text-pink-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground mb-6">
          <Settings className="w-6 h-6 text-primary" />
          My Preferences
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass rounded-lg p-4 text-center">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Top Preferences */}
        <div className="glass rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Your Taste Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Favorite Genre</p>
                <p className="font-semibold text-foreground">{topGenre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Favorite Language</p>
                <p className="font-semibold text-foreground">{topLanguage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Genre Breakdown */}
        {Object.keys(likedGenres).length > 0 && (
          <div className="glass rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4">Genre Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(likedGenres)
                .sort((a, b) => b[1] - a[1])
                .map(([genre, count]) => {
                  const max = Math.max(...Object.values(likedGenres));
                  return (
                    <div key={genre}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{genre}</span>
                        <span className="text-muted-foreground">{count} likes</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {Object.keys(likedGenres).length === 0 && (
          <div className="glass rounded-lg p-6 text-center">
            <p className="text-muted-foreground">Like some movies to see your taste profile build up!</p>
          </div>
        )}
      </main>
    </div>
  );
}
