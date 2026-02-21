import { LANGUAGES, GENRES, OTT_PLATFORMS } from "@/data/movies";
import { Search, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  language: string;
  onLanguage: (v: string) => void;
  genre: string;
  onGenre: (v: string) => void;
  platform: string;
  onPlatform: (v: string) => void;
  sortBy: string;
  onSort: (v: string) => void;
}

export default function FilterBar({
  search, onSearch, language, onLanguage, genre, onGenre, platform, onPlatform, sortBy, onSort,
}: FilterBarProps) {
  const selectClass =
    "bg-secondary text-secondary-foreground border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="glass rounded-lg p-4 mb-6 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-secondary text-foreground border border-border rounded-md pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />

        <select value={language} onChange={(e) => onLanguage(e.target.value)} className={selectClass}>
          <option value="">All Languages</option>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        <select value={genre} onChange={(e) => onGenre(e.target.value)} className={selectClass}>
          <option value="">All Genres</option>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>

        <select value={platform} onChange={(e) => onPlatform(e.target.value)} className={selectClass}>
          <option value="">All Platforms</option>
          {Object.keys(OTT_PLATFORMS).map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select value={sortBy} onChange={(e) => onSort(e.target.value)} className={selectClass}>
          <option value="">Default</option>
          <option value="rating-desc">Rating: High → Low</option>
          <option value="rating-asc">Rating: Low → High</option>
          <option value="year-desc">Year: Newest</option>
          <option value="year-asc">Year: Oldest</option>
        </select>
      </div>
    </div>
  );
}
