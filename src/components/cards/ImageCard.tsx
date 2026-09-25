import React, { useState } from 'react';
import { ImageOff, Sparkles } from 'lucide-react';

export interface ImageCardProps {
  src: string;
  alt: string;
  aspectRatio?: '16/9' | '4/5' | '4/3' | '1/1' | '16/10';
  matted?: boolean; // Fine art gallery matting with subtle interior border
  className?: string;
  overlay?: React.ReactNode;
  badge?: React.ReactNode;
  priority?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  matted = false,
  className = '',
  overlay,
  badge,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClasses = {
    '16/9': 'aspect-[16/9]',
    '4/5': 'aspect-[4/5]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '16/10': 'aspect-[16/10]',
  };

  return (
    <div
      className={`relative overflow-hidden group select-none ${
        matted ? 'p-2 sm:p-2.5 bg-white border border-[#EAE5DC] rounded-[8px] shadow-sm' : 'rounded-[8px]'
      } ${className}`}
    >
      <div className={`relative w-full ${aspectClasses[aspectRatio]} overflow-hidden rounded-[6px] bg-[#F0EEE8]`}>
        {/* Loading skeleton placeholder */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#F0EEE8] via-[#EAE5DC] to-[#F0EEE8] animate-pulse" />
        )}

        {/* Resilient Fallback Container (Zero-Broken-Image Policy) */}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#171717] to-[#252525] text-[#F8F5EF]">
            <Sparkles className="w-8 h-8 text-[#C6A66B] mb-2 opacity-80" />
            <span className="font-serif text-[18px] text-[#F8F5EF] font-normal">{alt}</span>
            <span className="text-[11px] text-[#C6A66B] uppercase tracking-[0.2em] mt-1">
              The Wedding Dreams Atelier
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Optional Badge */}
        {badge && (
          <div className="absolute top-3.5 left-3.5 z-10">
            {badge}
          </div>
        )}

        {/* Optional Vignette Scrim & Overlay */}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 via-[#171717]/30 to-transparent flex flex-col justify-end p-5 text-white z-10">
            {overlay}
          </div>
        )}
      </div>
    </div>
  );
};
