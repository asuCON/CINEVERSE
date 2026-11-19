import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../types/movie';
import { api } from '../services/api';
import { FigmaMovie } from '../data/figmaCatalog';

interface SearchPageProps {
  onSelectMovie: (movie: Movie | FigmaMovie) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onSelectMovie,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activePopularTag, setActivePopularTag] = useState<string>('thriller');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const genres = ['All', 'Action', 'Drama', 'Science Fiction', 'Thriller', 'Comedy', 'Animation', 'Adventure'];
  const popularSearches = ['Space & time', 'Slow-burn thrillers', 'Feel-good', 'Plot twists'];

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);

    const debounce = setTimeout(() => {
      const searchParam = searchQuery.trim() || (activePopularTag ? activePopularTag.split(' ')[0] : undefined);
      const genreParam = selectedGenre !== 'All' ? selectedGenre : undefined;

      api.getMovies({
        search: searchParam,
        genre: genreParam,
        limit: 30
      })
        .then((res) => {
          if (!isCurrent) return;
          setMovies(res.items || []);
          setTotalCount(res.total || res.items?.length || 0);
        })
        .catch((err) => {
          console.error('Search error:', err);
          if (isCurrent) setMovies([]);
        })
        .finally(() => {
          if (isCurrent) setLoading(false);
        });
    }, 250);

    return () => {
      isCurrent = false;
      clearTimeout(debounce);
    };
  }, [searchQuery, selectedGenre, activePopularTag]);

  const displayQuery = searchQuery.trim() || activePopularTag || selectedGenre;

  return (
    <div className="min-h-screen bg-[#07080B] text-[#F5F2F0] pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F2F0] tracking-tight">
            Find your next favorite.
          </h1>
          <p className="text-sm text-[#94969F]">
            Search by title, mood, genre, or the feeling you're chasing.
          </p>
        </div>

        {/* Large Figma Search Bar Input */}
        <div className="relative max-w-4xl">
          <div className="relative flex items-center bg-[#17181E] border border-[#232630] rounded-full p-2 pl-5 focus-within:border-[#E60914] transition-colors">
            <Search className="w-5 h-5 text-[#94969F] mr-3 flex-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePopularTag) setActivePopularTag('');
              }}
              placeholder='Try “mind-bending sci-fi” or a movie you love…'
              className="bg-transparent text-sm sm:text-base text-[#F5F2F0] placeholder-[#94969F] w-full focus:outline-none"
            />
            <button
              type="button"
              className="bg-[#E60914] hover:bg-[#ff1f2d] text-[#F5F2F0] font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all flex-none flex items-center space-x-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
            </button>
          </div>
        </div>

        {/* BROWSE BY GENRE */}
        <div className="space-y-3">
          <div className="text-[11px] uppercase font-bold tracking-wider text-[#94969F]">
            BROWSE BY GENRE
          </div>
          <div className="flex flex-wrap gap-2.5">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGenre(g);
                  if (searchQuery) setSearchQuery('');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedGenre === g
                    ? 'bg-[#E60914] text-[#F5F2F0]'
                    : 'bg-[#17181E] text-[#94969F] hover:text-[#F5F2F0] border border-[#232630]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-[#F5F2F0]">Popular searches</h3>
            <p className="text-xs text-[#94969F]">A little inspiration to get you started</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularSearches.map((item) => (
              <div
                key={item}
                onClick={() => {
                  setActivePopularTag(item);
                  setSearchQuery(item);
                }}
                className={`p-4 rounded-card border transition-all cursor-pointer font-medium text-xs sm:text-sm ${
                  activePopularTag === item
                    ? 'bg-[#17181E] border-[#E60914] text-[#F5F2F0]'
                    : 'bg-[#17181E] border-[#232630] text-[#F5F2F0] hover:border-[#333845]'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Results Section matching Figma */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#F5F2F0]">
                Results for "{displayQuery}"
              </h3>
              <p className="text-xs text-[#94969F]">
                {loading ? 'Searching TMDB catalog...' : `${totalCount || movies.length} titles • Sorted by relevance`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#94969F] flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#E60914]" />
              <span className="text-xs">Finding matches in TMDB catalog...</span>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-[#101116] rounded-2xl border border-[#17181E] p-8">
              <p className="text-base font-semibold text-[#F5F2F0]">No titles found</p>
              <p className="text-xs text-[#94969F]">Try searching for directors like "Christopher Nolan", or titles like "Interstellar", "Dune", "Batman".</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  item={movie}
                  onClick={() => onSelectMovie(movie)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
