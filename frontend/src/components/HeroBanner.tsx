import React from 'react';
import { Play, Plus, Check, Info, Star } from 'lucide-react';
import { Movie } from '../types/movie';
import { useWatchlist } from '../context/WatchlistContext';

interface HeroBannerProps {
  movie: Movie | null;
  onPlayTrailer: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movie, onPlayTrailer }) => {
  const { isInWatchlist, toggleWatchlist, openMovieModal } = useWatchlist();

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);

  return (
    <div className="relative w-full h-[72vh] md:h-[82vh] overflow-hidden">
      {/* Background Backdrop Image */}
      <img
        src={movie.backdrop_path || movie.poster_path}
        alt={movie.title}
        className="w-full h-full object-cover object-center filter brightness-[0.85]"
      />

      {/* Cinematic Vignette Gradients */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/50 to-transparent w-full md:w-3/4" />

      {/* Billboard Hero Content */}
      <div className="absolute bottom-12 md:bottom-20 left-4 md:left-12 max-w-2xl z-20 space-y-4">
        {/* Badges */}
        <div className="flex items-center space-x-3 text-sm">
          <span className="px-2 py-0.5 rounded bg-cineverse-red font-bold text-xs uppercase tracking-wider text-white shadow-md">
            Featured
          </span>
          <span className="text-emerald-400 font-semibold text-sm">
            {movie.vote_average ? `${Math.round(movie.vote_average * 10)}% Match` : '98% Match'}
          </span>
          <span className="text-neutral-300 font-medium">{movie.release_year}</span>
          <div className="flex items-center space-x-1 text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="text-neutral-200 font-semibold">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg uppercase font-sans">
          {movie.title}
        </h1>

        {/* Overview */}
        <p className="text-sm md:text-base text-neutral-300 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-xl drop-shadow">
          {movie.overview}
        </p>

        {/* Director & Genres */}
        <div className="text-xs text-neutral-400 flex items-center space-x-3">
          {movie.director && <span>Directed by <strong className="text-neutral-200">{movie.director}</strong></span>}
          <span>•</span>
          <span>{movie.genres?.join(', ')}</span>
        </div>

        {/* Hero Actions */}
        <div className="flex items-center space-x-4 pt-2">
          {movie.trailer_youtube_key && (
            <button
              onClick={onPlayTrailer}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-md bg-white hover:bg-neutral-200 text-black font-bold text-sm md:text-base transition-all shadow-lg hover:scale-105"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Watch Trailer</span>
            </button>
          )}

          <button
            onClick={() => toggleWatchlist(movie)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-md font-semibold text-sm md:text-base transition-all backdrop-blur-md border ${
              inList
                ? 'bg-neutral-800/80 border-cineverse-red text-cineverse-red'
                : 'bg-neutral-800/60 border-neutral-600 hover:bg-neutral-700/80 text-white'
            }`}
          >
            {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <span>{inList ? 'In Watchlist' : 'Watchlist'}</span>
          </button>

          <button
            onClick={() => openMovieModal(movie)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-md bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-700 text-neutral-200 font-medium text-sm transition-all"
            title="Full Details"
          >
            <Info className="w-5 h-5" />
            <span className="hidden sm:inline">Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
