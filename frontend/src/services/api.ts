import { Movie, RecommendationItem, WatchlistItem, UserRatingItem } from '../types/movie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  // Movies
  async getMovies(params?: {
    genre?: string;
    search?: string;
    min_rating?: number;
    year?: number;
    limit?: number;
    skip?: number;
  }): Promise<{ total: number; items: Movie[] }> {
    const query = new URLSearchParams();
    if (params?.genre) query.append('genre', params.genre);
    if (params?.search) query.append('search', params.search);
    if (params?.min_rating !== undefined) query.append('min_rating', params.min_rating.toString());
    if (params?.year) query.append('year', params.year.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.skip) query.append('skip', params.skip.toString());

    const res = await fetch(`${API_BASE_URL}/movies?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch movies');
    return res.json();
  },

  async getFeaturedMovie(): Promise<Movie> {
    const res = await fetch(`${API_BASE_URL}/movies/featured`);
    if (!res.ok) throw new Error('Failed to fetch featured movie');
    return res.json();
  },

  async getGenres(): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/movies/genres`);
    if (!res.ok) throw new Error('Failed to fetch genres');
    return res.json();
  },

  async getMovieDetail(movieId: number): Promise<Movie> {
    const res = await fetch(`${API_BASE_URL}/movies/${movieId}`);
    if (!res.ok) throw new Error('Failed to fetch movie detail');
    return res.json();
  },

  // Recommendations (ML)
  async getSimilarMovies(movieId: number, topN = 8): Promise<RecommendationItem[]> {
    const res = await fetch(`${API_BASE_URL}/recommendations/similar/${movieId}?top_n=${topN}`);
    if (!res.ok) throw new Error('Failed to fetch similar recommendations');
    return res.json();
  },

  async getForYou(userId = 'default_user', topN = 12): Promise<RecommendationItem[]> {
    const res = await fetch(`${API_BASE_URL}/recommendations/for-you?user_id=${userId}&top_n=${topN}`);
    if (!res.ok) throw new Error('Failed to fetch For You recommendations');
    return res.json();
  },

  // Watchlist
  async getWatchlist(userId = 'default_user'): Promise<WatchlistItem[]> {
    const res = await fetch(`${API_BASE_URL}/user/watchlist?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch watchlist');
    return res.json();
  },

  async addToWatchlist(movieId: number, userId = 'default_user'): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE_URL}/user/watchlist/${movieId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    if (!res.ok) throw new Error('Failed to add to watchlist');
    return res.json();
  },

  async removeFromWatchlist(movieId: number, userId = 'default_user'): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE_URL}/user/watchlist/${movieId}?user_id=${userId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to remove from watchlist');
    return res.json();
  },

  async toggleWatched(movieId: number, userId = 'default_user'): Promise<{ is_watched: boolean }> {
    const res = await fetch(`${API_BASE_URL}/user/watchlist/${movieId}/toggle-watched?user_id=${userId}`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to toggle watched status');
    return res.json();
  },

  // Ratings
  async getUserRatings(userId = 'default_user'): Promise<UserRatingItem[]> {
    const res = await fetch(`${API_BASE_URL}/user/ratings?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user ratings');
    return res.json();
  },

  async submitRating(movieId: number, rating: number, userId = 'default_user'): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/user/ratings/${movieId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, user_id: userId })
    });
    if (!res.ok) throw new Error('Failed to submit rating');
    return res.json();
  },

  async deleteRating(movieId: number, userId = 'default_user'): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/user/ratings/${movieId}?user_id=${userId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete rating');
    return res.json();
  }
};
