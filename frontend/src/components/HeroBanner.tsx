import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { FigmaMovie } from '../data/figmaCatalog';

interface HeroBannerProps {
  movie: Movie | FigmaMovie;
  onWatchTrailer: () => void;
  onDetails: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onWatchTrailer,
  onDetails
}) => {
  const m = movie as Partial<Movie & FigmaMovie>;
  const title = m.title || '';
  const year = m.release_year || m.year || 2026;
  const genre =
    m.genre ||
    (Array.isArray(m.genres) && m.genres.length > 0
      ? m.genres.slice(0, 2).join(' / ')
      : 'Sci-Fi / Adventure');
  const duration = m.runtime || m.duration || '2h 14m';
  const tagline =
    m.tagline ||
    (m.overview ? (m.overview.slice(0, 120) + (m.overview.length > 120 ? '...' : '')) : '') ||
    'At the edge of the known universe, the biggest mystery is what we leave behind.';

  const backdropUrl = m.backdrop_path;

  return (
    <div className="relative w-full bg-[#5C040B] overflow-hidden min-h-[460px] md:min-h-[520px] flex items-center">
      {/* Background TMDB Photo (if available) with dark overlay */}
      {backdropUrl && (
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover filter brightness-[0.4] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#5C040B]/90 via-[#5C040B]/60 to-transparent" />
        </div>
      )}

      {/* Right Side Signature Geometric Illustration (from Figma Desktop.png) */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 overflow-hidden pointer-events-none flex items-center justify-end">
        {/* Outer Dark Purple Arc */}
        <div className="absolute -right-24 md:-right-10 top-1/2 -translate-y-1/2 w-[420px] sm:w-[540px] md:w-[620px] h-[420px] sm:h-[540px] md:h-[620px] rounded-full bg-[#352345] opacity-80" />

        {/* Large Cine Red Circle */}
        <div className="absolute right-6 sm:right-16 md:right-28 top-1/2 -translate-y-1/2 w-[300px] sm:w-[380px] md:w-[440px] h-[300px] sm:h-[380px] md:h-[440px] rounded-full bg-[#E60914] opacity-90" />

        {/* Spotlight Moon */}
        <div className="absolute right-24 sm:right-36 md:right-52 top-[38%] w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-[#F5B048] shadow-2xl" />
      </div>

      {/* Bottom fade into Void Black */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#07080B] to-transparent pointer-events-none" />

      {/* Hero Content Left */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 w-full">
        <div className="max-w-xl space-y-4">
          {/* Eyebrow */}
          <div className="text-xs uppercase font-extrabold tracking-widest text-[#F5B048]">
            CINEVERSE ORIGINAL
          </div>

          {/* Huge Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F2F0] uppercase tracking-tight font-sans leading-[1.05]">
            {title}
          </h1>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-[#F5F2F0]/90 leading-relaxed font-normal pt-1 line-clamp-2">
            {tagline}
          </p>

          {/* Metadata */}
          <div className="text-xs sm:text-sm text-[#94969F] font-medium pt-1">
            {year} • {genre} • {duration} • 4K
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-3">
            <button
              onClick={onWatchTrailer}
              className="flex items-center space-x-2 bg-[#E60914] hover:bg-[#ff1f2d] text-[#F5F2F0] rounded-full px-6 py-2.5 text-sm font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch trailer</span>
            </button>

            <button
              onClick={onDetails}
              className="flex items-center space-x-2 bg-[#17181E] hover:bg-[#22242c] text-[#F5F2F0] rounded-full px-6 py-2.5 text-sm font-semibold transition-all border border-[#252834]"
            >
              <Info className="w-4 h-4 text-[#94969F]" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
