import React, { useEffect, useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { Movie, RecommendationItem } from '../types/movie';
import { api } from '../services/api';
import { Flame, Star, Compass, Sparkles } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [forYou, setForYou] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { openMovieModal } = useWatchlist();

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const [featuredRes, moviesRes, forYouRes] = await Promise.all([
          api.getFeaturedMovie(),
          api.getMovies({ limit: 50 }),
          api.getForYou()
        ]);
        setFeatured(featuredRes);
        setAllMovies(moviesRes.items);
        setForYou(forYouRes);
      } catch (err) {
        console.error('Error loading home catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-cineverse-red border-t-transparent animate-spin" />
          <span className="text-neutral-400 font-medium tracking-wide text-sm">
            Connecting to Cineverse Recommendation Core...
          </span>
        </div>
      </div>
    );
  }

  // Filter categorizations
  const sciFiMovies = allMovies.filter(m => m.genres?.includes('Science Fiction'));
  const dramaMovies = allMovies.filter(m => m.genres?.includes('Drama'));
  const actionMovies = allMovies.filter(m => m.genres?.includes('Action') || m.genres?.includes('Thriller'));

  return (
    <div className="min-h-screen bg-[#0B0B0B] pb-20">
      {/* Cinematic Billboard */}
      <HeroBanner
        movie={featured}
        onPlayTrailer={() => featured && openMovieModal(featured)}
      />

      {/* Rows Container */}
      <div className="-mt-16 md:-mt-24 relative z-30 space-y-8">
        {/* ML Personalized Row */}
        {forYou.length > 0 && (
          <MovieRow
            title="Top Picks For You"
            subtitle="Calculated in real-time by ML recommendation engine"
            icon={<Sparkles className="w-5 h-5 text-cineverse-red" />}
            items={forYou}
          />
        )}

        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          subtitle="Most popular titles on Cineverse"
          icon={<Flame className="w-5 h-5" />}
          items={allMovies}
        />

        {/* Sci-Fi & Cyberpunk */}
        {sciFiMovies.length > 0 && (
          <MovieRow
            title="Sci-Fi & Cyberpunk Worlds"
            subtitle="Mind-bending realities, space exploration & future noir"
            icon={<Compass className="w-5 h-5" />}
            items={sciFiMovies}
          />
        )}

        {/* Critically Acclaimed */}
        <MovieRow
          title="Critically Acclaimed & Top Rated"
          subtitle="Highest voter consensus (8.0+ rating)"
          icon={<Star className="w-5 h-5 text-amber-400" />}
          items={[...allMovies].sort((a, b) => b.vote_average - a.vote_average)}
        />

        {/* Action & Thrillers */}
        {actionMovies.length > 0 && (
          <MovieRow
            title="Action & Heart-Pounding Thrillers"
            subtitle="Adrenaline, heists, and crime epics"
            items={actionMovies}
          />
        )}

        {/* Compelling Dramas */}
        {dramaMovies.length > 0 && (
          <MovieRow
            title="Deep Dramas & Human Stories"
            subtitle="Masterclass performances and character arcs"
            items={dramaMovies}
          />
        )}
      </div>
    </div>
  );
};
