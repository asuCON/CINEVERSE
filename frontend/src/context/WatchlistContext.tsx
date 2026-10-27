import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Movie, WatchlistItem, UserRatingItem } from '../types/movie';
import { api } from '../services/api';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  ratings: Record<number, number>; // movieId -> rating
  isInWatchlist: (movieId: number) => boolean;
  toggleWatchlist: (movie: Movie) => Promise<void>;
  toggleWatched: (movieId: number) => Promise<void>;
  rateMovie: (movieId: number, rating: number) => Promise<void>;
  selectedMovie: Movie | null;
  openMovieModal: (movie: Movie) => void;
  closeMovieModal: () => void;
  refreshData: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const refreshData = useCallback(async () => {
    try {
      const [wlData, ratingsData] = await Promise.all([
        api.getWatchlist(),
        api.getUserRatings()
      ]);
      setWatchlist(wlData);
      
      const ratingMap: Record<number, number> = {};
      ratingsData.forEach((item: UserRatingItem) => {
        ratingMap[item.movie_id] = item.rating;
      });
      setRatings(ratingMap);
    } catch (err) {
      console.error('Error refreshing user interactions:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(item => item.movie_id === movieId);
  };

  const toggleWatchlist = async (movie: Movie) => {
    try {
      if (isInWatchlist(movie.id)) {
        await api.removeFromWatchlist(movie.id);
        setWatchlist(prev => prev.filter(item => item.movie_id !== movie.id));
      } else {
        await api.addToWatchlist(movie.id);
        // Optimistic update
        setWatchlist(prev => [
          {
            id: Date.now(),
            movie_id: movie.id,
            is_watched: false,
            created_at: new Date().toISOString(),
            movie
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
      refreshData();
    }
  };

  const toggleWatched = async (movieId: number) => {
    try {
      const res = await api.toggleWatched(movieId);
      setWatchlist(prev =>
        prev.map(item =>
          item.movie_id === movieId ? { ...item, is_watched: res.is_watched } : item
        )
      );
    } catch (err) {
      console.error('Error toggling watched status:', err);
    }
  };

  const rateMovie = async (movieId: number, rating: number) => {
    try {
      setRatings(prev => ({ ...prev, [movieId]: rating }));
      await api.submitRating(movieId, rating);
    } catch (err) {
      console.error('Error rating movie:', err);
      refreshData();
    }
  };

  const openMovieModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeMovieModal = () => {
    setSelectedMovie(null);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        ratings,
        isInWatchlist,
        toggleWatchlist,
        toggleWatched,
        rateMovie,
        selectedMovie,
        openMovieModal,
        closeMovieModal,
        refreshData
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
