export interface Movie {
  id: number;
  tmdb_id?: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  release_year: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: string[];
  director?: string;
  cast?: string[];
  keywords?: string[];
  trailer_youtube_key?: string;
}

export interface RecommendationItem {
  movie: Movie;
  similarity_score?: number;
  match_percentage: number;
  reason: string;
}

export interface WatchlistItem {
  id: number;
  movie_id: number;
  is_watched: boolean;
  created_at: string;
  movie: Movie;
}

export interface UserRatingItem {
  id: number;
  movie_id: number;
  rating: number;
  updated_at: string;
  movie: Movie;
}
