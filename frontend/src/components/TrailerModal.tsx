import React from 'react';
import { X } from 'lucide-react';

interface TrailerModalProps {
  title: string;
  youtubeKey?: string;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  title,
  youtubeKey,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-[#101116] rounded-2xl overflow-hidden shadow-2xl border border-[#232630] text-[#F5F2F0]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#17181E]">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#E60914]">
              Official Trailer
            </div>
            <h3 className="text-lg font-bold uppercase text-[#F5F2F0]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#17181E] hover:bg-[#252834] text-[#94969F] hover:text-[#F5F2F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          {youtubeKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
              <p className="text-base font-semibold text-[#F5F2F0]">
                Trailer preview unavailable for this title
              </p>
              <p className="text-xs text-[#94969F] max-w-sm">
                No official YouTube trailer key was provided by TMDB.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
