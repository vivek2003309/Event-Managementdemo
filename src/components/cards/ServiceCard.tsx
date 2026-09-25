import React from 'react';
import { Service } from '../../types';
import {
  Landmark,
  Flower2,
  Compass,
  UtensilsCrossed,
  Music,
  Camera,
  ArrowRight,
} from 'lucide-react';

export interface ServiceCardProps {
  service: Service;
  onExplore?: (service: Service) => void;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onExplore, className = '' }) => {
  // Map icon name to Lucide icon
  const renderIcon = (name: string) => {
    switch (name) {
      case 'account_balance':
        return <Landmark className="w-6 h-6 text-[#C6A66B]" strokeWidth={1.5} />;
      case 'local_florist':
        return <Flower2 className="w-6 h-6 text-[#C6A66B]" strokeWidth={1.5} />;
      case 'travel_explore':
        return <Compass className="w-6 h-6 text-[#C6A66B]" strokeWidth={1.5} />;
      case 'restaurant':
        return <UtensilsCrossed className="w-6 h-6 text-[#C6A66B]" strokeWidth={1.5} />;
      case 'music_note':
        return <Music className="w-6 h-6 text-[#C6A66B]" strokeWidth={1.5} />;
      case 'photo_camera':
        return <Camera className="w-6 h-6 text-[#C6A66B]" strokeWidth={1.5} />;
      default:
        return <Landmark className="w-6 h-6 text-[#C6A66B]" strokeWidth={1.5} />;
    }
  };

  return (
    <div
      className={`bg-white p-8 rounded-[8px] border border-[#EAE5DC] shadow-[0_4px_20px_-4px_rgba(23,23,23,0.03)] hover:shadow-[0_16px_36px_-10px_rgba(23,23,23,0.06)] hover:border-[#D6CEBE] transition-all duration-300 flex flex-col justify-between group ${className}`}
    >
      <div>
        {/* Top bar with index number and icon */}
        <div className="flex items-start justify-between">
          <span className="font-serif text-[42px] font-light text-[#EAE5DC] group-hover:text-[#C6A66B]/50 transition-colors select-none leading-none">
            {service.number}
          </span>
          <div className="p-2.5 rounded-[4px] bg-[#F8F5EF] border border-[#EAE5DC]">
            {renderIcon(service.iconName)}
          </div>
        </div>

        {/* Content */}
        <div className="my-6">
          <h3 className="font-serif text-[24px] text-[#171717] font-normal tracking-tight group-hover:text-[#C6A66B] transition-colors">
            {service.title}
          </h3>
          <p className="text-[14px] text-[#77736D] mt-2.5 leading-relaxed font-light">
            {service.shortDescription}
          </p>
        </div>
      </div>

      {/* Action link */}
      <button
        onClick={() => onExplore && onExplore(service)}
        className="pt-4 border-t border-[#EAE5DC]/70 text-[11px] font-medium uppercase tracking-[0.16em] text-[#C6A66B] flex items-center group-hover:text-[#171717] transition-colors cursor-pointer"
      >
        <span>Explore Capability</span>
        <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
};
