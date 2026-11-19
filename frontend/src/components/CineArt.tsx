import React, { useState } from 'react';

export type ArtTheme = 'purple' | 'crimson' | 'navy' | 'darkRed' | 'bronze' | 'slate' | 'deepNavy';

interface CineArtProps {
  theme?: ArtTheme | string;
  className?: string;
  posterUrl?: string;
  altText?: string;
}

const themeStyles: Record<string, { bg: string; circle: string; outerArc?: string }> = {
  purple: {
    bg: '#251F33',
    circle: '#5C040B',
    outerArc: '#372A4E'
  },
  crimson: {
    bg: '#450B12',
    circle: '#6A0B14'
  },
  navy: {
    bg: '#172738',
    circle: '#5C040B'
  },
  darkRed: {
    bg: '#3A080E',
    circle: '#5C040B'
  },
  bronze: {
    bg: '#341A12',
    circle: '#5C040B'
  },
  slate: {
    bg: '#1B2129',
    circle: '#5C040B'
  },
  deepNavy: {
    bg: '#111A24',
    circle: '#5C040B'
  }
};

export const CineArt: React.FC<CineArtProps> = ({
  theme = 'crimson',
  className = '',
  posterUrl,
  altText = 'Artwork'
}) => {
  const [imgError, setImgError] = useState(false);

  if (posterUrl && !imgError) {
    return (
      <div className={`relative w-full h-full overflow-hidden rounded-card ${className}`}>
        <img
          src={posterUrl}
          alt={altText}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle dark gradient overlay to blend with Figma dark aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080B]/80 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  const selected = themeStyles[theme] || themeStyles.crimson;

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-card select-none ${className}`}
      style={{ backgroundColor: selected.bg }}
    >
      {/* Optional Outer Arc */}
      {selected.outerArc && (
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none opacity-80"
          style={{ backgroundColor: selected.outerArc }}
        />
      )}

      {/* Primary Crimson Orbit Circle */}
      <div
        className="absolute -right-6 top-1/2 -translate-y-1/2 w-32 sm:w-36 h-32 sm:h-36 rounded-full pointer-events-none transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: selected.circle }}
      />

      {/* Spotlight Moon / Star */}
      <div className="absolute right-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F5B048] shadow-md pointer-events-none transition-transform duration-300 group-hover:scale-110" />
    </div>
  );
};
