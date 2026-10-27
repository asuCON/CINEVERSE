import React, { useState, useEffect } from 'react';
import { Film, Sparkles, Bookmark, Search } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

interface NavbarProps {
  activeTab: 'home' | 'foryou' | 'watchlist' | 'search';
  setActiveTab: (tab: 'home' | 'foryou' | 'watchlist' | 'search') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 md:px-12 py-4 ${
        isScrolled
          ? 'bg-[#0B0B0B]/95 backdrop-blur-md border-b border-neutral-800/60 shadow-xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-cineverse-red flex items-center justify-center shadow-glow-red group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-widest text-white uppercase font-sans">
              Cine<span className="text-cineverse-red">verse</span>
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className={`transition-colors hover:text-white ${
                activeTab === 'home' ? 'text-white font-semibold' : 'text-neutral-400'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('foryou')}
              className={`flex items-center space-x-1.5 transition-colors hover:text-white ${
                activeTab === 'foryou' ? 'text-cineverse-red font-semibold' : 'text-neutral-400'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cineverse-red" />
              <span>For You</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-cineverse-red/20 text-cineverse-red border border-cineverse-red/40">
                ML
              </span>
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center space-x-1.5 transition-colors hover:text-white ${
                activeTab === 'watchlist' ? 'text-white font-semibold' : 'text-neutral-400'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-xs bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {watchlist.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm transition-all ${
              activeTab === 'search'
                ? 'border-cineverse-red text-white bg-cineverse-red/10'
                : 'border-neutral-800 text-neutral-300 hover:border-neutral-600 bg-neutral-900/60'
            }`}
          >
            <Search className="w-4 h-4 text-neutral-400" />
            <span className="hidden sm:inline">Search & Filters</span>
          </button>
        </div>
      </div>
    </header>
  );
};
