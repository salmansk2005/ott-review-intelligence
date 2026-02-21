import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/data/movies";

interface PersonalizationData {
  likedGenres: Record<string, number>;
  likedLanguages: Record<string, number>;
  likedMovies: number[];
  dislikedMovies: number[];
  favorites: number[];
}

const DEFAULT: PersonalizationData = {
  likedGenres: {},
  likedLanguages: {},
  likedMovies: [],
  dislikedMovies: [],
  favorites: [],
};

function load(): PersonalizationData {
  try {
    const d = localStorage.getItem("ott_personalization");
    return d ? { ...DEFAULT, ...JSON.parse(d) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function usePersonalization() {
  const [data, setData] = useState<PersonalizationData>(load);

  useEffect(() => {
    localStorage.setItem("ott_personalization", JSON.stringify(data));
  }, [data]);

  const likeMovie = useCallback((movie: Movie) => {
    setData((prev) => {
      const likedMovies = prev.likedMovies.includes(movie.id) ? prev.likedMovies : [...prev.likedMovies, movie.id];
      const dislikedMovies = prev.dislikedMovies.filter((id) => id !== movie.id);
      const likedGenres = { ...prev.likedGenres, [movie.genre]: (prev.likedGenres[movie.genre] || 0) + 1 };
      const likedLanguages = { ...prev.likedLanguages, [movie.language]: (prev.likedLanguages[movie.language] || 0) + 1 };
      return { ...prev, likedMovies, dislikedMovies, likedGenres, likedLanguages };
    });
  }, []);

  const dislikeMovie = useCallback((movie: Movie) => {
    setData((prev) => {
      const dislikedMovies = prev.dislikedMovies.includes(movie.id) ? prev.dislikedMovies : [...prev.dislikedMovies, movie.id];
      const likedMovies = prev.likedMovies.filter((id) => id !== movie.id);
      return { ...prev, likedMovies, dislikedMovies };
    });
  }, []);

  const toggleFavorite = useCallback((movieId: number) => {
    setData((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(movieId)
        ? prev.favorites.filter((id) => id !== movieId)
        : [...prev.favorites, movieId],
    }));
  }, []);

  const getRecommended = useCallback(
    (allMovies: Movie[]) => {
      return [...allMovies].sort((a, b) => {
        const scoreA = (data.likedGenres[a.genre] || 0) + (data.likedLanguages[a.language] || 0) + (data.likedMovies.includes(a.id) ? 5 : 0) - (data.dislikedMovies.includes(a.id) ? 10 : 0);
        const scoreB = (data.likedGenres[b.genre] || 0) + (data.likedLanguages[b.language] || 0) + (data.likedMovies.includes(b.id) ? 5 : 0) - (data.dislikedMovies.includes(b.id) ? 10 : 0);
        return scoreB - scoreA;
      });
    },
    [data]
  );

  const topGenre = Object.entries(data.likedGenres).sort((a, b) => b[1] - a[1])[0]?.[0] || "None yet";
  const topLanguage = Object.entries(data.likedLanguages).sort((a, b) => b[1] - a[1])[0]?.[0] || "None yet";

  return { ...data, likeMovie, dislikeMovie, toggleFavorite, getRecommended, topGenre, topLanguage };
}
