import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Star } from 'lucide-react';
import { Movie } from '../types/movie';
import { api } from '../services/api';
import { MovieCard } from '../components/MovieCard';

export const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [selectedDecade, setSelectedDecade] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // Load available genres
  useEffect(() => {
    api.getGenres()
      .then(setGenres)
      .catch((err) => console.error('Failed to load genres:', err));
  }, []);

  // Fetch search & filter results
  useEffect(() => {
    let isCurrent = true;
    setLoading(true);

    const debounceTimer = setTimeout(() => {
      api.getMovies({
        search: searchTerm.trim() || undefined,
        genre: selectedGenre || undefined,
        min_rating: minRating,
        limit: 60
      })
        .then((res) => {
          if (!isCurrent) return;
          let items = res.items;

          // Decade filtering
          if (selectedDecade) {
            if (selectedDecade === '2020s') items = items.filter(m => m.release_year >= 2020);
            else if (selectedDecade === '2010s') items = items.filter(m => m.release_year >= 2010 && m.release_year < 2020);
            else if (selectedDecade === '2000s') items = items.filter(m => m.release_year >= 2000 && m.release_year < 2010);
            else if (selectedDecade === 'classics') items = items.filter(m => m.release_year < 2000);
          }

          setMovies(items);
        })
        .catch((err) => console.error('Search error:', err))
        .finally(() => {
          if (isCurrent) setLoading(false);
        });
    }, 250);

    return () => {
      isCurrent = false;
      clearTimeout(debounceTimer);
    };
  }, [searchTerm, selectedGenre, minRating, selectedDecade]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setMinRating(undefined);
    setSelectedDecade('');
  };

  const hasActiveFilters = Boolean(searchTerm || selectedGenre || minRating || selectedDecade);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white pt-24 px-4 md:px-12 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search Bar Input */}
        <div className="relative max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-6 h-6 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, director, keyword, or actor..."
              className="w-full pl-13 pr-12 py-4 bg-cineverse-card/90 border border-neutral-700 focus:border-cineverse-red rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cineverse-red/30 text-base md:text-lg shadow-xl backdrop-blur-md transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="p-5 rounded-2xl bg-cineverse-card/50 border border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/60">
            <div className="flex items-center space-x-2 text-sm font-semibold text-neutral-300">
              <SlidersHorizontal className="w-4 h-4 text-cineverse-red" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-cineverse-red hover:underline font-medium"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Genre Pills */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block">
              Genres
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre('')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedGenre === ''
                    ? 'bg-cineverse-red text-white shadow-glow-red'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                All Genres
              </button>
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(selectedGenre === g ? '' : g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedGenre === g
                      ? 'bg-cineverse-red text-white shadow-glow-red'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Rating & Era Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Minimum Rating */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block">
                Minimum Rating
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { label: 'Any', value: undefined },
                  { label: '7.5+ ★', value: 7.5 },
                  { label: '8.0+ ★', value: 8.0 },
                  { label: '8.3+ ★', value: 8.3 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setMinRating(item.value)}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                      minRating === item.value
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Decade / Era */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block">
                Release Era
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { label: 'All Time', value: '' },
                  { label: '2020s', value: '2020s' },
                  { label: '2010s', value: '2010s' },
                  { label: '2000s', value: '2000s' },
                  { label: 'Classics', value: 'classics' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setSelectedDecade(item.value)}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                      selectedDecade === item.value
                        ? 'bg-cineverse-red text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-sm text-neutral-400">
          <span>
            Showing <strong className="text-white">{movies.length}</strong> title{movies.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-20 text-neutral-500">
            <div className="w-8 h-8 border-2 border-cineverse-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Filtering movies...
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <p className="text-lg font-semibold text-neutral-300">No movies match your search</p>
            <p className="text-sm text-neutral-500">Try tweaking your search keywords or resetting your filters.</p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
