import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Home } from './pages/Home';
import { SearchPage } from './pages/SearchPage';
import { ForYou } from './pages/ForYou';
import { Watchlist } from './pages/Watchlist';
import { MovieDetails } from './pages/MovieDetails';
import { TrailerModal } from './components/TrailerModal';
import { Movie } from './types/movie';
import { FigmaMovie, HERO_FEATURED_MOVIE } from './data/figmaCatalog';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | FigmaMovie>(HERO_FEATURED_MOVIE);
  const [trailerMovie, setTrailerMovie] = useState<Movie | FigmaMovie | null>(null);

  const handleSelectMovie = (movie: Movie | FigmaMovie) => {
    setSelectedMovie(movie);
    setActiveTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchTrailer = (movie: Movie | FigmaMovie) => {
    setTrailerMovie(movie);
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-[#F5F2F0] flex flex-col font-sans selection:bg-[#E60914] selection:text-white">
      {/* Figma Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Screen Views matching Figma Designs */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home
            onSelectMovie={handleSelectMovie}
            onWatchTrailer={handleWatchTrailer}
          />
        )}

        {activeTab === 'discover' && (
          <SearchPage
            onSelectMovie={handleSelectMovie}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'foryou' && (
          <ForYou onSelectMovie={handleSelectMovie} />
        )}

        {activeTab === 'watchlist' && (
          <Watchlist onSelectMovie={handleSelectMovie} />
        )}

        {activeTab === 'details' && (
          <MovieDetails
            movie={selectedMovie}
            onBack={() => setActiveTab('home')}
            onSelectMovie={handleSelectMovie}
            onWatchTrailer={handleWatchTrailer}
          />
        )}
      </main>

      {/* Trailer Modal (when user clicks Watch Trailer) */}
      {trailerMovie && (
        <TrailerModal
          title={trailerMovie.title}
          youtubeKey={trailerMovie.trailer_youtube_key || 'zSWdZVtXT7E'}
          onClose={() => setTrailerMovie(null)}
        />
      )}
    </div>
  );
};

export default App;
