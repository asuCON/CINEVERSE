import React, { useState } from 'react';
import { WatchlistProvider, useWatchlist } from './context/WatchlistContext';
import { Navbar } from './components/Navbar';
import { MovieModal } from './components/MovieModal';
import { Home } from './pages/Home';
import { ForYou } from './pages/ForYou';
import { Watchlist } from './pages/Watchlist';
import { SearchPage } from './pages/SearchPage';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'foryou' | 'watchlist' | 'search'>('home');
  const { selectedMovie, closeMovieModal } = useWatchlist();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 flex flex-col font-sans">
      {/* Top Floating Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && <Home />}
        {activeTab === 'foryou' && <ForYou />}
        {activeTab === 'watchlist' && <Watchlist onNavigateHome={() => setActiveTab('home')} />}
        {activeTab === 'search' && <SearchPage />}
      </main>

      {/* Global Interactive Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeMovieModal} />
      )}

      {/* Cinematic Footer */}
      <footer className="border-t border-neutral-900 bg-black/60 py-10 px-4 md:px-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-widest text-neutral-300">CINEVERSE</span>
            <span>•</span>
            <span>AI-Powered Movie Discovery Engine</span>
          </div>
          <div className="flex items-center space-x-6 text-neutral-400">
            <span>Powered by Scikit-Learn TF-IDF & Cosine Similarity</span>
            <span>•</span>
            <span>FastAPI & React</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <WatchlistProvider>
      <AppContent />
    </WatchlistProvider>
  );
};

export default App;
