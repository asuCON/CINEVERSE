import React from 'react';
import { Plus, Check, Info, Star } from 'lucide-react';
import { Movie } from '../types/movie';
import { useWatchlist } from '../context/WatchlistContext';
import { StarRating } from './StarRating';

interface MovieCardProps {
  movie: Movie;
  matchPercentage?: number;
  badgeText?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  matchPercentage,
  badgeText
}) => {
  const { isInWatchlist, toggleWatchlist, openMovieModal, ratings, rateMovie } = useWatchlist();
  const inList = isInWatchlist(movie.id);
  const userRating = ratings[movie.id] || 0;

  return (
    <div
      onClick={() => openMovieModal(movie)}
      className="group relative flex-none w-[170px] sm:w-[210px] md:w-[240px] cursor-pointer rounded-lg overflow-hidden bg-cineverse-card transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/80 border border-neutral-800/50 hover:border-neutral-700"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">
        <img
          src={movie.poster_path}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback placeholder if image fails
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Match Percentage or Custom Badge */}
        {(matchPercentage || badgeText) && (
          <div className="absolute top-2 left-2 z-10 flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-md backdrop-blur-sm">
            <span>{badgeText || `${matchPercentage}% Match`}</span>
          </div>
        )}

        {/* TMDB Rating Badge */}
        <div className="absolute top-2 right-2 z-10 flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/75 border border-white/10 text-amber-400 text-xs font-medium backdrop-blur-sm">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie);
            }}
            className={`p-2 rounded-full border transition-all ${
              inList
                ? 'bg-cineverse-red border-cineverse-red text-white'
                : 'bg-black/80 border-white/30 text-white hover:border-white hover:scale-110'
            }`}
            title={inList ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openMovieModal(movie);
            }}
            className="p-2 rounded-full bg-black/80 border border-white/30 text-white hover:border-white hover:scale-110 transition-all"
            title="More Information"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Meta */}
      <div className="p-3">
        <h4 className="text-sm font-semibold text-neutral-100 truncate group-hover:text-cineverse-red transition-colors">
          {movie.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-neutral-400 mt-1">
          <span>{movie.release_year}</span>
          <span className="truncate max-w-[120px] text-right">
            {movie.genres?.slice(0, 2).join(' • ')}
          </span>
        </div>

        {/* User Rating status */}
        <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-medium">Your rating:</span>
          <StarRating
            size="sm"
            initialRating={userRating}
            onRate={(score) => rateMovie(movie.id, score)}
          />
        </div>
      </div>
    </div>
  );
};
