import React from 'react';
import { Star } from 'lucide-react';
import { CineArt, ArtTheme } from './CineArt';
import { Movie } from '../types/movie';

export interface CardItem {
  id: string | number;
  title: string;
  genre?: string;
  genres?: string[];
  year?: number | string;
  release_year?: number;
  theme?: ArtTheme | string;
  posterUrl?: string;
  poster_path?: string;
  backdrop_path?: string;
  tagline?: string;
  vote_average?: number;
  match_percentage?: number;
  badgeText?: string;
}

interface MovieCardProps {
  item?: CardItem | Movie;
  movie?: Movie;
  matchPercentage?: number;
  badgeText?: string;
  onClick?: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  item: rawItem,
  movie,
  matchPercentage,
  badgeText,
  onClick
}) => {
  const item = rawItem || movie;
  if (!item) return null;
  const title = item.title;
  const genre =
    item.genre ||
    (Array.isArray(item.genres) && item.genres.length > 0
      ? item.genres.slice(0, 2).join(' / ')
      : 'Cinema');

  const year = item.year || item.release_year;
  const posterUrl = item.backdrop_path || item.poster_path || item.posterUrl;
  const rating = item.vote_average;
  const match = matchPercentage || item.match_percentage;
  const badge = badgeText || item.badgeText;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer select-none flex-none w-full transition-transform duration-200 hover:-translate-y-1.5"
    >
      {/* 16:10 Landscape Graphic Artwork or TMDB Backdrop/Poster */}
      <div className="relative aspect-[16/10] w-full rounded-card overflow-hidden shadow-lg border border-[#17181E] group-hover:border-[#2C2F3C] transition-colors bg-[#101116]">
        <CineArt
          theme={item.theme || 'crimson'}
          posterUrl={posterUrl}
          altText={title}
        />

        {/* Rating or Match Badge */}
        <div className="absolute top-2 right-2 z-10 flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-[#07080B]/80 border border-[#232630] text-[11px] font-semibold text-[#F5F2F0] backdrop-blur-sm">
          {match ? (
            <span className="text-emerald-400 font-bold">{match}% Match</span>
          ) : rating && rating > 0 ? (
            <>
              <Star className="w-3 h-3 fill-[#F5B048] text-[#F5B048]" />
              <span>{rating.toFixed(1)}</span>
            </>
          ) : null}
        </div>

        {badge && (
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#E60914]/90 text-[10px] font-bold text-white uppercase tracking-wider shadow">
            {badge}
          </div>
        )}
      </div>

      {/* Meta underneath matching Figma */}
      <div className="mt-2.5 space-y-0.5">
        <div className="text-[10px] uppercase font-bold tracking-wider text-[#94969F]">
          Cineverse Original
        </div>
        <h4 className="text-sm font-bold uppercase tracking-wide text-[#F5F2F0] truncate group-hover:text-[#E60914] transition-colors">
          {title}
        </h4>
        <div className="text-xs text-[#94969F] truncate">
          {genre} {year ? `• ${year}` : ''}
        </div>
      </div>
    </div>
  );
};
