import { useState } from "react";
import { Movie, getSentiment, OTT_PLATFORMS } from "@/data/movies";
import { usePersonalization } from "@/hooks/usePersonalization";
import { Heart, ThumbsUp, ThumbsDown, ExternalLink, Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const { likedMovies, dislikedMovies, favorites, likeMovie, dislikeMovie, toggleFavorite } = usePersonalization();
  const [showDetails, setShowDetails] = useState(false);
  const sentiment = getSentiment(movie.rating);
  const isLiked = likedMovies.includes(movie.id);
  const isDisliked = dislikedMovies.includes(movie.id);
  const isFav = favorites.includes(movie.id);

  return (
    <div
      className="group relative rounded-lg overflow-hidden gradient-card border border-border hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 card-shine animate-slide-up flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = `https://placehold.co/500x750/1a1a2e/e0e0e0?text=${encodeURIComponent(movie.title)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

        {/* Sentiment Badge */}
        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full border ${sentiment.class} bg-background/70 backdrop-blur-sm`}>
          {sentiment.label}
        </span>

        {/* Rating */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/70 backdrop-blur-sm rounded-full px-2 py-0.5">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-foreground">{movie.rating}</span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => likeMovie(movie)}
            className={`p-2 rounded-full glass transition-colors ${isLiked ? "bg-green-500/30 text-green-400" : "text-foreground hover:text-green-400"}`}
            title="Like"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => dislikeMovie(movie)}
            className={`p-2 rounded-full glass transition-colors ${isDisliked ? "bg-red-500/30 text-red-400" : "text-foreground hover:text-red-400"}`}
            title="Dislike"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(movie.id)}
            className={`p-2 rounded-full glass transition-colors ${isFav ? "bg-pink-500/30 text-pink-400" : "text-foreground hover:text-pink-400"}`}
            title="Favorite"
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-pink-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground text-sm truncate">{movie.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {movie.language} · {movie.genre} · {movie.releaseYear}
        </p>

        {/* OTT Badges */}
        <div className="flex flex-wrap gap-1 mt-2">
          {movie.platforms.map((p) => {
            const info = OTT_PLATFORMS[p];
            return (
              <a
                key={p}
                href={info?.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${info?.color || "bg-muted text-foreground"} hover:opacity-80 transition-opacity`}
              >
                {info?.label || p}
              </a>
            );
          })}
        </div>

        {/* View Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          {showDetails ? "Hide Details" : "View Details"}
        </button>

        {showDetails && (
          <div className="mt-2 text-xs text-muted-foreground leading-relaxed animate-fade-in">
            {movie.reviewSummary}
          </div>
        )}
      </div>
    </div>
  );
}
