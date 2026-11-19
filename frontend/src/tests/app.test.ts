import { describe, it, expect } from 'vitest';
import { HERO_FEATURED_MOVIE, PICKED_FOR_YOU_MOVIES, SEARCH_EXTRA_MOVIES } from '../data/figmaCatalog';
import { api } from '../services/api';

describe('Cineverse Frontend Catalog', () => {
  it('loads hero featured movie with correct Figma specifications', () => {
    expect(HERO_FEATURED_MOVIE).toBeDefined();
    expect(HERO_FEATURED_MOVIE.title).toBe('THE LAST FRONTIER');
    expect(HERO_FEATURED_MOVIE.year).toBe(2026);
    expect(HERO_FEATURED_MOVIE.genre).toContain('Sci-Fi');
    expect(HERO_FEATURED_MOVIE.quality).toBe('4K');
    expect(HERO_FEATURED_MOVIE.rating).toBeGreaterThan(8.0);
  });

  it('contains curated recommendations with complete metadata', () => {
    expect(PICKED_FOR_YOU_MOVIES.length).toBeGreaterThan(0);
    for (const movie of PICKED_FOR_YOU_MOVIES) {
      expect(movie.id).toBeTruthy();
      expect(movie.title).toBeTruthy();
      expect(movie.genre).toBeTruthy();
      expect(movie.synopsis).toBeTruthy();
      expect(movie.theme).toBeTruthy();
    }
  });

  it('contains valid search fallback movies', () => {
    expect(SEARCH_EXTRA_MOVIES.length).toBeGreaterThan(0);
    const titles = SEARCH_EXTRA_MOVIES.map(m => m.title);
    expect(titles).toContain('THE SIGNAL');
  });

  it('exposes API methods for movie and recommendation queries', () => {
    expect(typeof api.getMovies).toBe('function');
    expect(typeof api.getFeaturedMovie).toBe('function');
    expect(typeof api.getSimilarMovies).toBe('function');
    expect(typeof api.getForYou).toBe('function');
    expect(typeof api.getWatchlist).toBe('function');
  });
});
