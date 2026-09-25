import React from 'react';
import { Destination } from '../../types';
import { ImageCard } from './ImageCard';
import { Compass, Users, Calendar, ArrowRight } from 'lucide-react';

export interface DestinationCardProps {
  destination: Destination;
  onSelect?: (destination: Destination) => void;
  className?: string;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
  className = '',
}) => {
  return (
    <div
      className={`group bg-white rounded-[8px] overflow-hidden border border-[#EAE5DC] shadow-[0_4px_24px_-6px_rgba(23,23,23,0.03)] hover:shadow-[0_16px_40px_-10px_rgba(23,23,23,0.08)] hover:border-[#D6CEBE] transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      <div>
        <ImageCard
          src={destination.heroImage}
          alt={`${destination.name}, ${destination.region}`}
          aspectRatio="16/10"
          badge={
            <div className="bg-[#171717]/80 backdrop-blur-md px-3 py-1 rounded-[4px] text-white text-[11px] font-medium tracking-[0.16em] uppercase">
              {destination.country}
            </div>
          }
        />
        <div className="p-7">
          <span className="text-[11px] font-medium text-[#C6A66B] uppercase tracking-[0.2em] block mb-1">
            {destination.region}
          </span>
          <h3 className="font-serif text-[28px] text-[#171717] font-normal leading-tight group-hover:text-[#C6A66B] transition-colors">
            {destination.name}
          </h3>
          <p className="text-[13px] text-[#77736D] mt-2.5 leading-relaxed font-light line-clamp-3">
            {destination.description}
          </p>

          <div className="mt-5 pt-4 border-t border-[#EAE5DC]/80 space-y-2 text-[12px] text-[#77736D]">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>
                Capacity: {destination.guestCapacityRange.min} – {destination.guestCapacityRange.max} Guests
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>Best Season: {destination.bestSeasons.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-7 pb-7 pt-2 flex items-center justify-between">
        <span className="text-[11px] text-[#9C968C] uppercase tracking-wider">
          {destination.venues.length} Curated Venues
        </span>
        <button
          onClick={() => onSelect && onSelect(destination)}
          className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C6A66B] hover:text-[#171717] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Explore Enclave</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
