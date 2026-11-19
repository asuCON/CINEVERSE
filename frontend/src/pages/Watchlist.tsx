import React, { useState, useEffect } from 'react';
import { Play, ChevronDown, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { CineArt } from '../components/CineArt';
import { Movie, WatchlistItem } from '../types/movie';
import { api } from '../services/api';
import { PICKED_FOR_YOU_MOVIES, FigmaMovie } from '../data/figmaCatalog';

interface WatchlistProps {
  onSelectMovie: (movie: Movie | FigmaMovie) => void;
}

export const Watchlist: React.FC<WatchlistProps> = ({ onSelectMovie }) => {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'wantToWatch' | 'watched'>('all');

  const loadWatchlist = async () => {
    try {
      const res = await api.getWatchlist();
      setWatchlistItems(res || []);
    } catch (err) {
      console.error('Error loading watchlist:', err);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleToggleWatched = async (movieId: number) => {
    try {
      await api.toggleWatched(movieId);
      setWatchlistItems((prev) =>
        prev.map((item) =>
          item.movie_id === movieId ? { ...item, is_watched: !item.is_watched } : item
        )
      );
    } catch (err) {
      console.error('Failed to toggle watched:', err);
    }
  };

  const handleRemove = async (movieId: number) => {
    try {
      await api.removeFromWatchlist(movieId);
      setWatchlistItems((prev) => prev.filter((item) => item.movie_id !== movieId));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  const filteredItems = watchlistItems.filter((item) => {
    if (activeFilter === 'wantToWatch') return !item.is_watched;
    if (activeFilter === 'watched') return item.is_watched;
    return true;
  });

  // If user hasn't added anything to database yet, show the curated collection items so UI is populated
  const displayItems =
    watchlistItems.length > 0
      ? filteredItems
      : PICKED_FOR_YOU_MOVIES.map((m, idx) => ({
          id: idx + 1,
          movie_id: Number(idx + 1),
          is_watched: idx % 2 === 1,
          created_at: new Date().toISOString(),
          movie: {
            id: Number(idx + 1),
            title: m.title,
            genres: [m.genre],
            release_year: Number(m.year) || 2025,
            vote_average: m.rating,
            vote_count: 1000,
            popularity: 80,
            overview: m.tagline,
            poster_path: '',
            backdrop_path: '',
            release_date: '2025-01-01',
            theme: m.theme
          } as Movie
        }));

  return (
    <div className="min-h-screen bg-[#07080B] text-[#F5F2F0] pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F2F0] tracking-tight">
            Your watchlist.
          </h1>
          <p className="text-sm text-[#94969F]">
            Save the stories you want to come back to.
          </p>
        </div>

        {/* Filters and Sort Row matching 05 - Watchlist.png */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#E60914] text-[#F5F2F0]'
                  : 'bg-[#17181E] text-[#94969F] hover:text-[#F5F2F0] border border-[#232630]'
              }`}
            >
              All saved ({watchlistItems.length || PICKED_FOR_YOU_MOVIES.length})
            </button>
            <button
              onClick={() => setActiveFilter('wantToWatch')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === 'wantToWatch'
                  ? 'bg-[#E60914] text-[#F5F2F0]'
                  : 'bg-[#17181E] text-[#94969F] hover:text-[#F5F2F0] border border-[#232630]'
              }`}
            >
              Want to watch
            </button>
            <button
              onClick={() => setActiveFilter('watched')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === 'watched'
                  ? 'bg-[#E60914] text-[#F5F2F0]'
                  : 'bg-[#17181E] text-[#94969F] hover:text-[#F5F2F0] border border-[#232630]'
              }`}
            >
              Watched
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94969F]">
              SORT BY
            </span>
            <button className="flex items-center space-x-1.5 text-[#F5F2F0] font-medium hover:text-[#E60914] transition-colors">
              <span>Recently added</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Saved for later Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#F5F2F0]">Saved for later</h3>
            <p className="text-xs text-[#94969F]">{displayItems.length} films in your collection</p>
          </div>

          {/* 3-Column Split Card Grid matching 05 - Watchlist.png */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item) => {
              const movie = item.movie;
              const poster = movie.backdrop_path || movie.poster_path;
              const genre = movie.genres?.slice(0, 2).join(' / ') || 'Cinema';

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 bg-[#101116] p-3.5 rounded-card border border-[#17181E] hover:border-[#2C2F3C] transition-all group"
                >
                  {/* Left Thumbnail Graphic Artwork */}
                  <div
                    onClick={() => onSelectMovie(movie)}
                    className="w-36 aspect-[16/10] rounded-card overflow-hidden flex-none cursor-pointer border border-[#17181E] group-hover:border-[#2C2E38] transition-colors"
                  >
                    <CineArt
                      theme={movie.theme || 'crimson'}
                      posterUrl={poster}
                      altText={movie.title}
                    />
                  </div>

                  {/* Right Metadata & Action */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#94969F]">
                        Cineverse Original
                      </span>
                      {watchlistItems.length > 0 && (
                        <button
                          onClick={() => handleRemove(movie.id)}
                          className="text-[#94969F] hover:text-[#E60914] transition-colors p-0.5"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h4
                      onClick={() => onSelectMovie(movie)}
                      className="font-bold text-sm uppercase tracking-wide text-[#F5F2F0] truncate cursor-pointer hover:text-[#E60914] transition-colors"
                    >
                      {movie.title}
                    </h4>

                    <div className="text-xs text-[#94969F]">
                      {genre} • {movie.release_year}
                    </div>

                    <div className="text-xs text-[#94969F] pt-0.5">
                      Recommended for your taste
                    </div>

                    {/* Bottom Controls */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => onSelectMovie(movie)}
                        className="flex items-center space-x-1.5 bg-[#17181E] hover:bg-[#232630] text-[#F5F2F0] rounded-full px-3 py-1 text-xs font-semibold transition-all border border-[#232630]"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>View details</span>
                      </button>

                      {watchlistItems.length > 0 && (
                        <button
                          onClick={() => handleToggleWatched(movie.id)}
                          className={`flex items-center space-x-1 text-[11px] font-medium transition-colors ${
                            item.is_watched ? 'text-emerald-400' : 'text-[#94969F] hover:text-[#F5F2F0]'
                          }`}
                        >
                          {item.is_watched ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                          <span>{item.is_watched ? 'Watched' : 'Mark watched'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
