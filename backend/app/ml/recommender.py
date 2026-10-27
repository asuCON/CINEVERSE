import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any, Optional

class MovieRecommender:
    def __init__(self):
        self.movies_df: Optional[pd.DataFrame] = None
        self.tfidf_matrix = None
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.cosine_sim = None
        self.movie_id_to_idx: Dict[int, int] = {}
        self.idx_to_movie_id: Dict[int, int] = {}

    def _create_soup(self, row: pd.Series) -> str:
        """Create a combined metadata representation for content-based similarity."""
        parts = []
        
        # Title repeated for higher weight in matching
        title = str(row.get('title', ''))
        parts.append(f"{title} {title}")
        
        # Overview / synopsis
        overview = str(row.get('overview', ''))
        parts.append(overview)
        
        # Genres
        genres = row.get('genres', [])
        if isinstance(genres, list):
            parts.append(" ".join([str(g).replace(" ", "") for g in genres] * 2))
        elif isinstance(genres, str):
            parts.append(genres)
            
        # Director
        director = str(row.get('director', ''))
        if director and director != 'None':
            parts.append(f"{director.replace(' ', '')} {director.replace(' ', '')}")
            
        # Cast
        cast = row.get('cast', [])
        if isinstance(cast, list):
            parts.append(" ".join([str(actor).replace(" ", "") for actor in cast[:4]]))
            
        # Keywords
        keywords = row.get('keywords', [])
        if isinstance(keywords, list):
            parts.append(" ".join([str(k).replace(" ", "") for k in keywords]))

        return " ".join(parts).lower()

    def fit(self, movies_list: List[Dict[str, Any]]) -> bool:
        """Fit the recommendation model using an array of movie records."""
        if not movies_list:
            return False

        df = pd.DataFrame(movies_list)
        df['id'] = df['id'].astype(int)
        
        # Ensure required columns exist
        for col in ['title', 'overview', 'genres', 'director', 'cast', 'keywords']:
            if col not in df.columns:
                df[col] = ""

        # Build feature text soup
        df['soup'] = df.apply(self._create_soup, axis=1)

        # Fit TF-IDF Vectorizer
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            min_df=1,
            max_features=8000,
            ngram_range=(1, 2)
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(df['soup'])

        # Compute Cosine Similarity Matrix
        self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
        
        self.movies_df = df
        self.movie_id_to_idx = {movie_id: idx for idx, movie_id in enumerate(df['id'])}
        self.idx_to_movie_id = {idx: movie_id for idx, movie_id in enumerate(df['id'])}
        return True

    def get_similar_movies(self, movie_id: int, top_n: int = 10) -> List[Dict[str, Any]]:
        """Return top N most similar movies to a given movie ID."""
        if self.cosine_sim is None or movie_id not in self.movie_id_to_idx:
            return []

        idx = self.movie_id_to_idx[movie_id]
        sim_scores = list(enumerate(self.cosine_sim[idx]))
        
        # Sort by similarity descending
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Exclude the movie itself (index 0)
        sim_scores = sim_scores[1:top_n + 1]
        
        results = []
        for sim_idx, score in sim_scores:
            m_id = self.idx_to_movie_id[sim_idx]
            results.append({
                "movie_id": m_id,
                "similarity_score": round(float(score), 4),
                "match_percentage": int(round(float(score) * 100))
            })
        return results

    def get_personalized_recommendations(
        self,
        user_ratings: Dict[int, float],
        watchlist_ids: List[int],
        top_n: int = 15
    ) -> List[Dict[str, Any]]:
        """
        Generate personalized recommendations using user ratings and watchlist items.
        Ratings >= 4.0 strongly boost associated genres/features.
        Watchlist items indicate interest (+1.0 weight).
        Ratings <= 2.0 negatively penalize corresponding feature vectors.
        """
        if self.tfidf_matrix is None or self.movies_df is None:
            return []

        rated_or_watched = set(user_ratings.keys()).union(set(watchlist_ids))
        
        # Initialize user preference vector
        user_profile = np.zeros(self.tfidf_matrix.shape[1])
        weight_sum = 0.0

        # Incorporate ratings
        for movie_id, rating in user_ratings.items():
            if movie_id in self.movie_id_to_idx:
                idx = self.movie_id_to_idx[movie_id]
                # Center around neutral rating 2.5 (-2.0 for 0.5 stars, +2.5 for 5.0 stars)
                weight = float(rating) - 2.5
                movie_vector = self.tfidf_matrix[idx].toarray()[0]
                user_profile += movie_vector * weight
                weight_sum += abs(weight)

        # Incorporate watchlist (positive intent)
        for movie_id in watchlist_ids:
            if movie_id in self.movie_id_to_idx:
                idx = self.movie_id_to_idx[movie_id]
                movie_vector = self.tfidf_matrix[idx].toarray()[0]
                user_profile += movie_vector * 1.5
                weight_sum += 1.5

        # Cold-start fallback: if no interactions yet, return highest rated / popular titles
        if weight_sum == 0.0 or np.all(user_profile == 0):
            popular = self.movies_df.sort_values(by=['vote_average', 'popularity'], ascending=[False, False])
            cold_start = popular.head(top_n)
            return [
                {
                    "movie_id": int(row['id']),
                    "score": round(float(row.get('vote_average', 7.5)) / 10.0, 3),
                    "match_percentage": 90,
                    "reason": "Popular on Cineverse"
                }
                for _, row in cold_start.iterrows()
            ]

        # Reshape for cosine similarity calculation
        user_profile = user_profile.reshape(1, -1)
        sim_scores = cosine_similarity(user_profile, self.tfidf_matrix)[0]

        # Rank all movies
        ranked_indices = np.argsort(sim_scores)[::-1]

        recommendations = []
        for idx in ranked_indices:
            movie_id = self.idx_to_movie_id[idx]
            if movie_id in rated_or_watched:
                continue  # Skip already interacted movies

            score = float(sim_scores[idx])
            if score <= 0.01:
                continue

            match_pct = min(99, max(60, int(score * 120)))
            recommendations.append({
                "movie_id": movie_id,
                "score": round(score, 4),
                "match_percentage": match_pct,
                "reason": f"Top Match for You ({match_pct}%)"
            })

            if len(recommendations) >= top_n:
                break

        return recommendations

# Global singleton recommender instance
recommender = MovieRecommender()
