import React from 'react';
import { Search } from 'lucide-react';

export type NavTab = 'home' | 'discover' | 'foryou' | 'watchlist' | 'details';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#07080B]/95 backdrop-blur-md px-6 md:px-12 py-3.5 border-b border-[#17181E]/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-10">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center group focus:outline-none"
          >
            <span className="w-1.5 h-5 bg-[#E60914] rounded-sm mr-2.5 inline-block" />
            <span className="text-lg font-black tracking-wider text-[#F5F2F0] uppercase font-sans">
              CINEVERSE
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className={`transition-colors hover:text-[#F5F2F0] ${
                activeTab === 'home' ? 'text-[#F5F2F0] font-semibold' : 'text-[#94969F]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`transition-colors hover:text-[#F5F2F0] ${
                activeTab === 'discover' ? 'text-[#F5F2F0] font-semibold' : 'text-[#94969F]'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('foryou')}
              className={`transition-colors hover:text-[#F5F2F0] ${
                activeTab === 'foryou' ? 'text-[#F5F2F0] font-semibold' : 'text-[#94969F]'
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`transition-colors hover:text-[#F5F2F0] ${
                activeTab === 'watchlist' ? 'text-[#F5F2F0] font-semibold' : 'text-[#94969F]'
              }`}
            >
              Watchlist
            </button>
          </nav>
        </div>

        {/* Right Search Bar & User Profile */}
        <div className="flex items-center space-x-5">
          {/* Search Pill Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-3.5 h-3.5 text-[#94969F] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (activeTab !== 'discover') setActiveTab('discover');
              }}
              placeholder="Search titles, genres..."
              className="bg-[#17181E] text-[#F5F2F0] placeholder-[#94969F] text-xs rounded-full pl-9 pr-4 py-2 w-44 sm:w-60 focus:outline-none focus:ring-1 focus:ring-[#E60914] transition-all"
            />
          </div>

          {/* Profile Avatar */}
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-[#5C040B] text-[#F5F2F0] flex items-center justify-center text-xs font-bold border border-[#6A0B14]">
              S
            </div>
            <span className="hidden sm:inline text-xs text-[#94969F] group-hover:text-[#F5F2F0] transition-colors font-medium">
              Profile
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
