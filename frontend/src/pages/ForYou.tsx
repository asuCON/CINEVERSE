import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Star, Info, Bookmark, ThumbsUp } from 'lucide-react';
import { RecommendationItem } from '../types/movie';
import { api } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import { MovieCard } from '../components/MovieCard';

export const ForYou: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { ratings, watchlist } = useWatchlist();

  const ratedCount = Object.keys(ratings).length;
  const watchlistCount = watchlist.length;

  const fetchRecommendations = async () => {
    try {
      setRefreshing(true);
      const data = await api.getForYou('default_user', 18);
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [ratedCount, watchlistCount]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white pt-24 px-4 md:px-12 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ML Feature Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center space-x-2 text-cineverse-red mb-2">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="text-xs uppercase font-extrabold tracking-widest bg-cineverse-red/20 px-2 py-0.5 rounded border border-cineverse-red/40">
                Machine Learning Recommendation Engine
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Curated For You
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base mt-1 max-w-2xl">
              Cineverse analyzes the synopsis, genres, directors, and actors of the films you save and rate, weighting your preference profile using TF-IDF feature vectors and Cosine Similarity.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={fetchRecommendations}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-cineverse-card border border-neutral-700 hover:border-cineverse-red text-neutral-200 hover:text-white transition-all text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cineverse-red' : ''}`} />
              <span>{refreshing ? 'Recalculating...' : 'Refresh ML Feed'}</span>
            </button>
          </div>
        </div>

        {/* User Interaction Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-cineverse-card/60 border border-neutral-800/80 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-amber-400/30" />
            </div>
            <div>
              <div className="text-2xl font-black">{ratedCount}</div>
              <div className="text-xs text-neutral-400">Movies Rated by You</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cineverse-card/60 border border-neutral-800/80 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-cineverse-red/10 border border-cineverse-red/30 flex items-center justify-center text-cineverse-red">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black">{watchlistCount}</div>
              <div className="text-xs text-neutral-400">Titles in Watchlist</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cineverse-card/60 border border-neutral-800/80 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black">{recommendations.length}</div>
              <div className="text-xs text-neutral-400">Personalized Matches Generated</div>
            </div>
          </div>
        </div>

        {/* Explainability Callout */}
        {ratedCount === 0 && watchlistCount === 0 && (
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 text-sm text-neutral-300">
            <Info className="w-5 h-5 text-cineverse-red flex-none mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Cold Start Mode:</strong>
              Rate a few films or add titles like <span className="text-cineverse-red font-semibold">Interstellar</span> or <span className="text-cineverse-red font-semibold">Inception</span> to your watchlist to teach Cineverse your cinematic taste!
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        {loading ? (
          <div className="text-center py-20 text-neutral-500">
            <div className="w-8 h-8 border-2 border-cineverse-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Computing personalized recommendations...
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            No recommendations found. Rate a few movies on Discover to start!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recommendations.map((item, idx) => (
              <MovieCard
                key={`${item.movie.id}-${idx}`}
                movie={item.movie}
                matchPercentage={item.match_percentage}
                badgeText={item.reason}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
