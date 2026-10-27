import React, { useEffect, useState } from 'react';
import { X, Play, Plus, Check, Star, Sparkles } from 'lucide-react';
import { Movie, RecommendationItem } from '../types/movie';
import { useWatchlist } from '../context/WatchlistContext';
import { StarRating } from './StarRating';
import { api } from '../services/api';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const { isInWatchlist, toggleWatchlist, ratings, rateMovie } = useWatchlist();
  const [similarMovies, setSimilarMovies] = useState<RecommendationItem[]>([]);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const inList = isInWatchlist(movie.id);
  const currentRating = ratings[movie.id] || 0;

  useEffect(() => {
    let isMounted = true;
    setLoadingSimilar(true);
    setIsPlayingTrailer(false);

    api.getSimilarMovies(movie.id, 6)
      .then((items) => {
        if (isMounted) setSimilarMovies(items);
      })
      .catch((err) => console.error('Failed to load similar movies:', err))
      .finally(() => {
        if (isMounted) setLoadingSimilar(false);
      });

    // Disable body scroll when modal is active
    document.body.style.overflow = 'hidden';
    return () => {
      isMounted = false;
      document.body.style.overflow = 'auto';
    };
  }, [movie.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-4xl bg-cineverse-card rounded-xl overflow-hidden shadow-modal border border-neutral-800 text-white my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-neutral-300 hover:text-white border border-neutral-700/80 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Header (Trailer or Backdrop) */}
        <div className="relative aspect-video w-full bg-neutral-950 flex-none overflow-hidden max-h-[380px]">
          {isPlayingTrailer && movie.trailer_youtube_key ? (
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailer_youtube_key}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <>
              <img
                src={movie.backdrop_path || movie.poster_path}
                alt={movie.title}
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cineverse-card via-cineverse-card/40 to-transparent" />

              {/* Title & Play overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight drop-shadow-md">
                    {movie.title}
                  </h2>
                  <div className="flex items-center space-x-3 text-sm text-neutral-300 mt-2 font-medium">
                    <span className="text-emerald-400 font-bold">
                      {Math.round(movie.vote_average * 10)}% Match
                    </span>
                    <span>{movie.release_year}</span>
                    <span className="flex items-center space-x-1 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()} votes)</span>
                    </span>
                  </div>
                </div>

                {movie.trailer_youtube_key && (
                  <button
                    onClick={() => setIsPlayingTrailer(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold text-sm shadow-xl transition-all transform hover:scale-105"
                  >
                    <Play className="w-5 h-5 fill-black" />
                    <span>Play Trailer</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Controls Bar: Watchlist & Your Rating */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleWatchlist(movie)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-semibold text-sm transition-all border ${
                  inList
                    ? 'bg-cineverse-red border-cineverse-red text-white'
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-500 text-white'
                }`}
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{inList ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

            {/* Interactive Rating Component */}
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
                Rate this film:
              </span>
              <StarRating
                size="md"
                initialRating={currentRating}
                onRate={(val) => rateMovie(movie.id, val)}
              />
              {currentRating > 0 && (
                <span className="text-xs font-semibold text-amber-400">
                  {currentRating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Overview & Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-sm uppercase tracking-wider text-neutral-400 font-bold">
                Synopsis
              </h4>
              <p className="text-neutral-200 leading-relaxed text-sm md:text-base">
                {movie.overview}
              </p>

              {/* Keywords Pills */}
              {movie.keywords && movie.keywords.length > 0 && (
                <div className="pt-2">
                  <h5 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                    Keywords
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.keywords.map((k) => (
                      <span
                        key={k}
                        className="px-2.5 py-1 rounded-full text-xs bg-neutral-900 text-neutral-300 border border-neutral-800"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Side Details */}
            <div className="space-y-4 text-xs sm:text-sm bg-neutral-900/50 p-4 rounded-lg border border-neutral-800/80">
              {movie.director && (
                <div>
                  <span className="text-neutral-500 block font-medium">Director</span>
                  <span className="text-neutral-200 font-semibold">{movie.director}</span>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span className="text-neutral-500 block font-medium">Top Cast</span>
                  <span className="text-neutral-200">{movie.cast.join(', ')}</span>
                </div>
              )}

              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <span className="text-neutral-500 block font-medium">Genres</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {movie.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-xs"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* More Like This (ML Recommender) */}
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-4 h-4 text-cineverse-red" />
              <h4 className="text-base font-bold text-white uppercase tracking-wider">
                More Like This <span className="text-xs font-normal text-neutral-400 capitalize">(Powered by ML Similarity)</span>
              </h4>
            </div>

            {loadingSimilar ? (
              <div className="text-center py-8 text-neutral-500 text-sm">
                Calculating cosine similarity...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {similarMovies.map((item) => (
                  <div
                    key={item.movie.id}
                    onClick={() => {
                      // Switch current movie modal to this similar movie
                      setIsPlayingTrailer(false);
                      setSimilarMovies([]);
                    }}
                    className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 hover:border-cineverse-red/60 transition-all cursor-pointer group"
                  >
                    <img
                      src={item.movie.backdrop_path || item.movie.poster_path}
                      alt={item.movie.title}
                      className="w-full aspect-video object-cover rounded mb-2 group-hover:scale-[1.02] transition-transform"
                    />
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-emerald-400 font-semibold">
                        {item.match_percentage}% Match
                      </span>
                      <span className="text-neutral-400">{item.movie.release_year}</span>
                    </div>
                    <div className="text-sm font-semibold truncate group-hover:text-cineverse-red transition-colors">
                      {item.movie.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
