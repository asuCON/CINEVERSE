import React, { useEffect, useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { MovieCard } from '../components/MovieCard';
import { Movie, RecommendationItem } from '../types/movie';
import { api } from '../services/api';
import { PICKED_FOR_YOU_MOVIES, HERO_FEATURED_MOVIE, FigmaMovie } from '../data/figmaCatalog';

interface HomeProps {
  onSelectMovie: (movie: Movie | FigmaMovie) => void;
  onWatchTrailer: (movie: Movie | FigmaMovie) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectMovie, onWatchTrailer }) => {
  const [featured, setFeatured] = useState<Movie | FigmaMovie>(HERO_FEATURED_MOVIE);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [feat, moviesRes, recoRes] = await Promise.allSettled([
          api.getFeaturedMovie(),
          api.getMovies({ limit: 40 }),
          api.getForYou('default_user', 6)
        ]);

        if (!isMounted) return;

        if (feat.status === 'fulfilled' && feat.value) {
          setFeatured(feat.value);
        }
        if (moviesRes.status === 'fulfilled' && moviesRes.value?.items?.length) {
          setMovies(moviesRes.value.items);
        }
        if (recoRes.status === 'fulfilled' && recoRes.value?.length) {
          setRecommendations(recoRes.value);
        }
      } catch (err) {
        console.error('Error loading TMDB catalog:', err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Display items
  const pickedList =
    recommendations.length > 0
      ? recommendations.map((r) => ({
          ...r.movie,
          match_percentage: r.match_percentage,
          badgeText: `${r.match_percentage}% Match`
        }))
      : movies.length > 0
      ? movies.slice(0, 6)
      : PICKED_FOR_YOU_MOVIES;

  const trendingList =
    movies.length > 6
      ? movies.slice(6, 18)
      : PICKED_FOR_YOU_MOVIES;

  const sciFiList = movies.filter(
    (m) => m.genres?.some((g) => g.toLowerCase().includes('sci') || g.toLowerCase().includes('fantasy'))
  );

  const actionList = movies.filter(
    (m) => m.genres?.some((g) => g.toLowerCase().includes('action') || g.toLowerCase().includes('thrill'))
  );

  return (
    <div className="min-h-screen bg-[#07080B] text-[#F5F2F0] pb-24">
      {/* Top Hero Banner */}
      <HeroBanner
        movie={featured}
        onWatchTrailer={() => onWatchTrailer(featured)}
        onDetails={() => onSelectMovie(featured)}
      />

      {/* Main Content Area matching Figma Desktop.png */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12 mt-12">
        {/* Section 1: Picked for you */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F2F0] tracking-tight">
              Picked for you
            </h2>
            <p className="text-xs text-[#94969F] mt-0.5">
              Recommendations shaped around your taste {recommendations.length > 0 ? '• ML Calibrated' : ''}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pickedList.slice(0, 6).map((movie) => (
              <MovieCard
                key={movie.id}
                item={movie}
                onClick={() => onSelectMovie(movie as Movie)}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Trending now */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F2F0] tracking-tight">
              Trending now
            </h2>
            <p className="text-xs text-[#94969F] mt-0.5">
              Stories everyone's talking about on TMDB
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingList.slice(0, 6).map((movie) => (
              <MovieCard
                key={`trending-${movie.id}`}
                item={movie}
                onClick={() => onSelectMovie(movie as Movie)}
              />
            ))}
          </div>
        </section>

        {/* Section 3: Sci-Fi & Cyberpunk Worlds (if catalog loaded) */}
        {sciFiList.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F2F0] tracking-tight">
                Sci-Fi & Cosmic Explorations
              </h2>
              <p className="text-xs text-[#94969F] mt-0.5">
                Mind-bending futures, space voyages, and other dimensions
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sciFiList.slice(0, 6).map((movie) => (
                <MovieCard
                  key={`scifi-${movie.id}`}
                  item={movie}
                  onClick={() => onSelectMovie(movie)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Action & Thrillers */}
        {actionList.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F2F0] tracking-tight">
                Action & High-Stakes Thrillers
              </h2>
              <p className="text-xs text-[#94969F] mt-0.5">
                Edge of your seat blockbusters and crime sagas
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {actionList.slice(0, 6).map((movie) => (
                <MovieCard
                  key={`action-${movie.id}`}
                  item={movie}
                  onClick={() => onSelectMovie(movie)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
