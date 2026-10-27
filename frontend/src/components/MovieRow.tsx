import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, RecommendationItem } from '../types/movie';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  items: (Movie | RecommendationItem)[];
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  subtitle,
  icon,
  items
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative px-4 md:px-12 my-8 group">
      {/* Row Header */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-cineverse-red">{icon}</span>}
          <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <span className="text-xs text-neutral-400 font-normal hidden sm:inline">
              — {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm rounded-r"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
        >
          {items.map((item, idx) => {
            const isReco = 'movie' in item;
            const movie = isReco ? (item as RecommendationItem).movie : (item as Movie);
            const matchPct = isReco ? (item as RecommendationItem).match_percentage : undefined;
            const reason = isReco ? (item as RecommendationItem).reason : undefined;

            return (
              <MovieCard
                key={`${movie.id}-${idx}`}
                movie={movie}
                matchPercentage={matchPct}
                badgeText={reason}
              />
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm rounded-l"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
};
