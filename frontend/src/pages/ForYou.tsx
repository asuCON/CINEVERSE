import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Zap, Heart, RefreshCw } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { Movie, RecommendationItem } from '../types/movie';
import { api } from '../services/api';
import { PICKED_FOR_YOU_MOVIES, FigmaMovie } from '../data/figmaCatalog';

interface ForYouProps {
  onSelectMovie: (movie: Movie | FigmaMovie) => void;
}

export const ForYou: React.FC<ForYouProps> = ({ onSelectMovie }) => {
  const [activeMood, setActiveMood] = useState<'mindBlown' | 'cozy' | 'edgeOfSeat' | 'bigFeelings'>('mindBlown');
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const tasteTags = ['Mind-bending', 'Atmospheric', 'Unexpected endings', 'Character-driven'];

  const fetchRecommendations = async () => {
    try {
      setRefreshing(true);
      const res = await api.getForYou('default_user', 18);
      setRecommendations(res || []);
    } catch (err) {
      console.error('Error fetching ML recommendations:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Filter recommendations based on active mood
  const filteredRecommendations = recommendations.filter((item) => {
    const genres = (item.movie.genres || []).map((g) => g.toLowerCase());
    if (activeMood === 'mindBlown') {
      return genres.some((g) => g.includes('sci') || g.includes('myster') || g.includes('fantasy'));
    }
    if (activeMood === 'cozy') {
      return genres.some((g) => g.includes('anim') || g.includes('drama') || g.includes('family'));
    }
    if (activeMood === 'edgeOfSeat') {
      return genres.some((g) => g.includes('action') || g.includes('thrill') || g.includes('crime'));
    }
    if (activeMood === 'bigFeelings') {
      return genres.some((g) => g.includes('drama') || g.includes('hist') || g.includes('music'));
    }
    return true;
  });

  const displayList =
    filteredRecommendations.length > 0
      ? filteredRecommendations.map((r) => ({
          ...r.movie,
          match_percentage: r.match_percentage,
          badgeText: `${r.match_percentage}% Match`
        }))
      : recommendations.length > 0
      ? recommendations.map((r) => ({
          ...r.movie,
          match_percentage: r.match_percentage,
          badgeText: `${r.match_percentage}% Match`
        }))
      : PICKED_FOR_YOU_MOVIES;

  return (
    <div className="min-h-screen bg-[#07080B] text-[#F5F2F0] pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F2F0] tracking-tight">
              Your taste. Your universe.
            </h1>
            <p className="text-sm text-[#94969F]">
              Cineverse learns from what you love — and helps you find what you didn’t know you needed.
            </p>
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#17181E] hover:bg-[#242834] text-xs font-semibold text-[#F5F2F0] border border-[#232630] transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#E60914]' : ''}`} />
            <span>Recalculate Taste</span>
          </button>
        </div>

        {/* YOUR TASTE PROFILE Card matching Recommendations.png */}
        <div className="bg-[#101116] border border-[#17181E] rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="text-[11px] uppercase font-bold tracking-wider text-[#E60914]">
            YOUR TASTE PROFILE
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#F5F2F0] leading-snug max-w-3xl">
            You gravitate toward smart sci-fi, atmospheric mysteries, and stories with a twist.
          </h2>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {tasteTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-xs font-medium bg-[#17181E] text-[#94969F] border border-[#232630]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Made for your mood section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-[#F5F2F0]">Made for your mood</h3>
            <p className="text-xs text-[#94969F]">Choose a mood to tune your recommendations</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Card 1: Mind blown */}
            <div
              onClick={() => setActiveMood('mindBlown')}
              className={`p-6 rounded-card transition-all cursor-pointer space-y-3 ${
                activeMood === 'mindBlown'
                  ? 'bg-[#3E2B58] border border-[#5A3F7E] text-white shadow-lg'
                  : 'bg-[#1A1F26] border border-[#262C36] text-[#94969F] hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5 text-[#F5B048]" />
              <div className="font-bold text-sm text-[#F5F2F0]">Mind blown</div>
            </div>

            {/* Card 2: Cozy night */}
            <div
              onClick={() => setActiveMood('cozy')}
              className={`p-6 rounded-card transition-all cursor-pointer space-y-3 ${
                activeMood === 'cozy'
                  ? 'bg-[#3E2B58] border border-[#5A3F7E] text-white shadow-lg'
                  : 'bg-[#1A1F26] border border-[#262C36] text-[#94969F] hover:text-white'
              }`}
            >
              <Moon className="w-5 h-5" />
              <div className="font-bold text-sm text-[#F5F2F0]">Cozy night</div>
            </div>

            {/* Card 3: Edge of seat */}
            <div
              onClick={() => setActiveMood('edgeOfSeat')}
              className={`p-6 rounded-card transition-all cursor-pointer space-y-3 ${
                activeMood === 'edgeOfSeat'
                  ? 'bg-[#70121D] border border-[#8C1625] text-white shadow-lg'
                  : 'bg-[#1A1F26] border border-[#262C36] text-[#94969F] hover:text-white'
              }`}
            >
              <Zap className="w-5 h-5 text-[#F5B048]" />
              <div className="font-bold text-sm text-[#F5F2F0]">Edge of seat</div>
            </div>

            {/* Card 4: Big feelings */}
            <div
              onClick={() => setActiveMood('bigFeelings')}
              className={`p-6 rounded-card transition-all cursor-pointer space-y-3 ${
                activeMood === 'bigFeelings'
                  ? 'bg-[#70121D] border border-[#8C1625] text-white shadow-lg'
                  : 'bg-[#1A1F26] border border-[#262C36] text-[#94969F] hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5 text-[#E60914]" />
              <div className="font-bold text-sm text-[#F5F2F0]">Big feelings</div>
            </div>
          </div>
        </div>

        {/* Recommended for you Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-[#F5F2F0]">Recommended for you</h3>
            <p className="text-xs text-[#94969F]">Ranked by similarity to your preferences</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayList.slice(0, 12).map((movie) => (
              <MovieCard
                key={movie.id}
                item={movie}
                onClick={() => onSelectMovie(movie as Movie)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
