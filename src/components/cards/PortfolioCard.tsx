import React from 'react';
import { Wedding } from '../../types';
import { ImageCard } from './ImageCard';
import { ArrowRight, MapPin, Tag } from 'lucide-react';

export interface PortfolioCardProps {
  wedding: Wedding;
  onViewStory?: (wedding: Wedding) => void;
  variant?: 'light' | 'dark';
  className?: string;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  wedding,
  onViewStory,
  variant = 'light',
  className = '',
}) => {
  const isDark = variant === 'dark';

  return (
    <div
      className={`group rounded-[8px] overflow-hidden transition-all duration-300 flex flex-col justify-between ${
        isDark
          ? 'bg-[#1F1F1F] border border-white/10 hover:border-[#C6A66B]/50 hover:bg-[#252525] text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)]'
          : 'bg-white border border-[#EAE5DC] hover:border-[#D6CEBE] text-[#252525] shadow-[0_4px_24px_-6px_rgba(23,23,23,0.04)] hover:shadow-[0_16px_40px_-10px_rgba(23,23,23,0.08)]'
      } ${className}`}
    >
      <div>
        {/* Visual Asset Container */}
        <div className="relative">
          <ImageCard
            src={wedding.heroImage}
            alt={`${wedding.title} — ${wedding.venue}`}
            aspectRatio="16/10"
            badge={
              <div className="bg-[#171717]/90 backdrop-blur-md px-3 py-1 rounded-[4px] text-white text-[10px] font-medium tracking-[0.16em] uppercase border border-white/15 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
                <span>{wedding.eventType || wedding.subtitle}</span>
              </div>
            }
          />
        </div>

        {/* Story Info */}
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-medium text-[#C6A66B] uppercase tracking-[0.22em] block truncate">
              {wedding.destination}
            </span>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[3px] border ${
                isDark
                  ? 'border-white/15 text-white/70 bg-white/5'
                  : 'border-[#EAE5DC] text-[#77736D] bg-[#F8F5EF]'
              }`}
            >
              {wedding.eventType || 'Celebration'}
            </span>
          </div>

          <h3
            className={`font-serif text-[26px] sm:text-[30px] font-normal leading-tight transition-colors ${
              isDark ? 'text-white group-hover:text-[#C6A66B]' : 'text-[#171717] group-hover:text-[#C6A66B]'
            }`}
          >
            {wedding.title}
          </h3>

          <p
            className={`text-[13px] sm:text-[14px] mt-2.5 leading-relaxed font-light line-clamp-2 ${
              isDark ? 'text-white/70' : 'text-[#77736D]'
            }`}
          >
            {wedding.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer: Location & Event Type / Action */}
      <div
        className={`px-6 sm:px-7 pb-6 pt-3.5 border-t flex items-center justify-between text-[12px] sm:text-[13px] ${
          isDark ? 'border-white/10 text-white/60' : 'border-[#EAE5DC]/80 text-[#77736D]'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate max-w-[55%]">
          <MapPin className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
          <span className="truncate">{wedding.venue}</span>
        </div>

        <button
          onClick={() => onViewStory && onViewStory(wedding)}
          className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C6A66B] hover:text-white transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>View Story</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
