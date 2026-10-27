import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Circle, Trash2, Star, Film } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { StarRating } from '../components/StarRating';

export const Watchlist: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { watchlist, toggleWatchlist, toggleWatched, openMovieModal, ratings, rateMovie } = useWatchlist();
  const [filter, setFilter] = useState<'all' | 'unwatched' | 'watched'>('all');

  const filteredItems = watchlist.filter((item) => {
    if (filter === 'unwatched') return !item.is_watched;
    if (filter === 'watched') return item.is_watched;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white pt-24 px-4 md:px-12 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight flex items-center space-x-3">
              <Bookmark className="w-8 h-8 text-cineverse-red" />
              <span>My Watchlist</span>
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Keep track of movies you want to see. Your watchlist helps refine your ML recommendations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                filter === 'all' ? 'bg-cineverse-red text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({watchlist.length})
            </button>
            <button
              onClick={() => setFilter('unwatched')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                filter === 'unwatched' ? 'bg-cineverse-red text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Want to Watch ({watchlist.filter(i => !i.is_watched).length})
            </button>
            <button
              onClick={() => setFilter('watched')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                filter === 'watched' ? 'bg-cineverse-red text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Watched ({watchlist.filter(i => i.is_watched).length})
            </button>
          </div>
        </div>

        {/* Watchlist Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-300">
              {filter === 'all'
                ? 'Your watchlist is empty'
                : `No movies marked as ${filter}`}
            </h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              Explore films on Discover and click the "+" button to save movies you want to see.
            </p>
            <button
              onClick={onNavigateHome}
              className="px-6 py-2.5 rounded-md bg-cineverse-red hover:bg-cineverse-crimson text-white font-bold text-sm shadow-glow-red transition-all"
            >
              Browse Discover
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const movie = item.movie;
              const userRating = ratings[movie.id] || 0;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl bg-cineverse-card border border-neutral-800/80 hover:border-neutral-700 transition-all group"
                >
                  {/* Poster Thumbnail */}
                  <div
                    onClick={() => openMovieModal(movie)}
                    className="relative w-24 aspect-[2/3] rounded-lg overflow-hidden flex-none cursor-pointer bg-neutral-900"
                  >
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Info & Actions */}
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => openMovieModal(movie)}
                          className="font-bold text-white text-base truncate cursor-pointer hover:text-cineverse-red transition-colors"
                        >
                          {movie.title}
                        </h4>
                        <button
                          onClick={() => toggleWatchlist(movie)}
                          className="text-neutral-500 hover:text-rose-500 p-1 transition-colors"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-neutral-400 mt-1">
                        <span>{movie.release_year}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </span>
                      </div>

                      <div className="text-xs text-neutral-400 mt-1 line-clamp-1">
                        {movie.genres?.join(', ')}
                      </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="space-y-2 pt-2 border-t border-neutral-800/60">
                      {/* Watched Toggle */}
                      <button
                        onClick={() => toggleWatched(movie.id)}
                        className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                          item.is_watched
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                        }`}
                      >
                        {item.is_watched ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Watched</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5" />
                            <span>Mark as Watched</span>
                          </>
                        )}
                      </button>

                      {/* Interactive Rating */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-neutral-500 font-medium">Rating:</span>
                        <StarRating
                          size="sm"
                          initialRating={userRating}
                          onRate={(val) => rateMovie(movie.id, val)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
