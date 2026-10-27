import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  initialRating?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  onRate,
  readOnly = false,
  size = 'md'
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const current = hoverRating !== null ? hoverRating : initialRating;

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = current >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={(e) => {
              e.stopPropagation();
              if (!readOnly && onRate) {
                onRate(star);
              }
            }}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(null)}
            className={`transition-transform duration-150 ${
              readOnly ? 'cursor-default' : 'hover:scale-125 cursor-pointer'
            } focus:outline-none`}
            title={readOnly ? `${initialRating} Stars` : `Rate ${star} Star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`${starSizes[size]} transition-colors ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-neutral-600 hover:text-neutral-400'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
