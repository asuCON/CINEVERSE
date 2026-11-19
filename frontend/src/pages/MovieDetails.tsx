import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Star, ArrowLeft } from 'lucide-react';
import { CineArt } from '../components/CineArt';
import { MovieCard } from '../components/MovieCard';
import { StarRating } from '../components/StarRating';
import { Movie, RecommendationItem } from '../types/movie';
import { FigmaMovie, SEARCH_EXTRA_MOVIES, PICKED_FOR_YOU_MOVIES } from '../data/figmaCatalog';
import { api } from '../services/api';

interface MovieDetailsProps {
  movie: Movie | FigmaMovie;
  onBack: () => void;
  onSelectMovie: (movie: Movie | FigmaMovie) => void;
  onWatchTrailer: (movie: Movie | FigmaMovie) => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  onBack,
  onSelectMovie,
  onWatchTrailer
}) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [similarMovies, setSimilarMovies] = useState<RecommendationItem[]>([]);
  const [userRating, setUserRating] = useState<number>(0);

  const m = movie as Partial<Movie & FigmaMovie>;
  const title = m.title || '';
  const year = m.release_year || m.year || 2025;
  const duration = m.runtime || m.duration || '2h 14m';
  const genre =
    m.genre ||
    (Array.isArray(m.genres) && m.genres.length > 0
      ? m.genres.slice(0, 2).join(' / ')
      : 'Sci-Fi');
  const ratingScore = m.vote_average !== undefined ? m.vote_average.toFixed(1) : m.rating !== undefined ? m.rating.toFixed(1) : '8.7';
  const synopsis = m.overview || m.synopsis || m.tagline || 'An extraordinary cinematic exploration.';
  const backdropUrl = m.backdrop_path;
  const posterUrl = m.poster_path;

  // Fetch similar movies & user interactions if movie.id is available
  useEffect(() => {
    let isMounted = true;
    if (typeof movie.id === 'number') {
      Promise.allSettled([
        api.getSimilarMovies(movie.id, 4),
        api.getWatchlist(),
        api.getUserRatings()
      ]).then(([simRes, wlRes, rateRes]) => {
        if (!isMounted) return;
        if (simRes.status === 'fulfilled' && simRes.value?.length) {
          setSimilarMovies(simRes.value);
        }
        if (wlRes.status === 'fulfilled' && wlRes.value) {
          const exists = wlRes.value.some((item) => item.movie_id === movie.id);
          setInWatchlist(exists);
        }
        if (rateRes.status === 'fulfilled' && rateRes.value) {
          const userRate = rateRes.value.find((item) => item.movie_id === movie.id);
          if (userRate) setUserRating(userRate.rating);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [movie.id]);

  const handleToggleWatchlist = async () => {
    if (typeof movie.id === 'number') {
      try {
        if (inWatchlist) {
          await api.removeFromWatchlist(movie.id);
          setInWatchlist(false);
        } else {
          await api.addToWatchlist(movie.id);
          setInWatchlist(true);
        }
      } catch (err) {
        console.error('Watchlist toggle error:', err);
      }
    } else {
      setInWatchlist(!inWatchlist);
    }
  };

  const handleRate = async (stars: number) => {
    setUserRating(stars);
    if (typeof movie.id === 'number') {
      try {
        await api.submitRating(movie.id, stars);
      } catch (err) {
        console.error('Submit rating error:', err);
      }
    }
  };

  // Display similar movies from ML or Figma mockups
  const displaySimilar =
    similarMovies.length > 0
      ? similarMovies.map((r) => ({
          ...r.movie,
          match_percentage: r.match_percentage,
          badgeText: `${r.match_percentage}% Match`
        }))
      : [
          SEARCH_EXTRA_MOVIES[0],
          PICKED_FOR_YOU_MOVIES[3],
          PICKED_FOR_YOU_MOVIES[5],
          SEARCH_EXTRA_MOVIES[2]
        ];

  return (
    <div className="min-h-screen bg-[#07080B] text-[#F5F2F0] pb-24">
      {/* Top Banner matching 03 - Movie Details.png */}
      <div className="relative w-full bg-[#5C040B] overflow-hidden min-h-[440px] md:min-h-[480px]">
        {/* Real TMDB backdrop image if available */}
        {backdropUrl && (
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover filter brightness-[0.35] contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#5C040B]/95 via-[#5C040B]/60 to-transparent" />
          </div>
        )}

        {/* Right Side Signature Geometric Illustration */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 overflow-hidden pointer-events-none flex items-center justify-end">
          <div className="absolute -right-24 md:-right-10 top-1/2 -translate-y-1/2 w-[440px] sm:w-[560px] md:w-[640px] h-[440px] sm:h-[560px] md:h-[640px] rounded-full bg-[#352345] opacity-80" />
          <div className="absolute right-6 sm:right-16 md:right-28 top-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[460px] h-[300px] sm:h-[400px] md:h-[460px] rounded-full bg-[#E60914] opacity-90" />
          <div className="absolute right-24 sm:right-36 md:right-52 top-[38%] w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-[#F5B048] shadow-2xl" />
        </div>

        {/* Bottom fade into Void Black */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#07080B] to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10 w-full">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs text-[#94969F] hover:text-[#F5F2F0] transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to discovery</span>
          </button>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Left Movie Poster Art Preview from Figma */}
            <div className="w-48 sm:w-56 flex-none space-y-2">
              <div className="aspect-[16/10] w-full rounded-card overflow-hidden shadow-2xl border border-[#17181E] bg-[#101116]">
                <CineArt
                  theme={movie.theme}
                  posterUrl={posterUrl || backdropUrl}
                  altText={title}
                />
              </div>
              <div className="space-y-0.5 pt-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#94969F]">
                  Cineverse Original
                </div>
                <div className="text-sm font-bold uppercase tracking-wide text-[#F5F2F0]">
                  {title}
                </div>
                <div className="text-xs text-[#94969F] uppercase truncate">
                  {genre}
                </div>
              </div>
            </div>

            {/* Right Detailed Info from Figma */}
            <div className="flex-1 max-w-2xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#E60914]">
                CINEVERSE PICK / {genre.toUpperCase()}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#F5F2F0] uppercase tracking-tight font-sans">
                {title}
              </h1>

              {/* Meta line */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#F5F2F0] font-medium">
                <span>{year}</span>
                <span>•</span>
                <span>{duration}</span>
                <span>•</span>
                <span>{genre}</span>
                <span>•</span>
                <span>4K Ultra HD</span>
              </div>

              {/* Rating Pill & User Rating */}
              <div className="flex items-center space-x-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#17181E] border border-[#232630] text-xs font-semibold text-[#F5F2F0]">
                  <Star className="w-3.5 h-3.5 fill-[#F5B048] text-[#F5B048]" />
                  <span>{ratingScore} / 10</span>
                </div>

                <div className="flex items-center space-x-2 bg-[#17181E]/80 px-3 py-1 rounded-full border border-[#232630]">
                  <span className="text-[11px] text-[#94969F]">Rate:</span>
                  <StarRating size="sm" initialRating={userRating} onRate={handleRate} />
                </div>
              </div>

              {/* Synopsis */}
              <p className="text-sm sm:text-base text-[#F5F2F0]/90 leading-relaxed font-normal pt-1 max-w-xl">
                {synopsis}
              </p>

              {/* Director & Cast (if available) */}
              {(movie.director || (movie.cast && movie.cast.length > 0)) && (
                <div className="text-xs text-[#94969F] space-y-1 pt-1">
                  {movie.director && (
                    <div>
                      <span className="text-[#F5F2F0] font-semibold">Director: </span>
                      {movie.director}
                    </div>
                  )}
                  {movie.cast && movie.cast.length > 0 && (
                    <div>
                      <span className="text-[#F5F2F0] font-semibold">Cast: </span>
                      {movie.cast.slice(0, 4).join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => onWatchTrailer(movie)}
                  className="flex items-center space-x-2 bg-[#E60914] hover:bg-[#ff1f2d] text-[#F5F2F0] rounded-full px-6 py-2.5 text-sm font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch trailer</span>
                </button>

                <button
                  onClick={handleToggleWatchlist}
                  className="flex items-center space-x-2 bg-[#17181E] hover:bg-[#22242c] text-[#F5F2F0] rounded-full px-6 py-2.5 text-sm font-semibold transition-all border border-[#252834]"
                >
                  {inWatchlist ? <Check className="w-4 h-4 text-[#E60914]" /> : <Plus className="w-4 h-4" />}
                  <span>{inWatchlist ? 'In watchlist' : 'My watchlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Because you liked [Movie] Section matching 03 - Movie Details.png */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 space-y-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F5F2F0] tracking-tight">
            Because you liked {title}
          </h3>
          <p className="text-xs text-[#94969F] mt-0.5">
            These picks share its atmosphere, themes, and pacing • Powered by ML Cosine Similarity
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {displaySimilar.map((item) => (
            <MovieCard
              key={item.id}
              item={item}
              onClick={() => onSelectMovie(item as Movie)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
