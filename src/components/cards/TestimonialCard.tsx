import React from 'react';
import { Testimonial } from '../../types';
import { Quote, Play, MapPin } from 'lucide-react';

export interface TestimonialCardProps {
  testimonial: Testimonial;
  onPlayVideo?: (testimonial: Testimonial) => void;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  onPlayVideo,
  className = '',
}) => {
  return (
    <div
      className={`bg-white p-7 sm:p-8 rounded-[8px] border border-[#EAE5DC] shadow-[0_4px_24px_-6px_rgba(23,23,23,0.04)] hover:shadow-[0_16px_36px_-10px_rgba(23,23,23,0.08)] hover:border-[#D6CEBE] transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Badges / Icons */}
        <div className="flex items-center justify-between mb-5">
          <Quote className="w-8 h-8 text-[#C6A66B]/50 stroke-[1.5]" />
          {testimonial.publicationBadge && (
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A66B] bg-[#F9F5EB] px-2.5 py-1 rounded-[4px] border border-[#E4C284]/40">
              {testimonial.publicationBadge}
            </span>
          )}
        </div>

        {/* Client Quote */}
        <p className="font-serif text-[18px] sm:text-[20px] text-[#171717] font-normal leading-relaxed italic">
          “{testimonial.quote.replace(/^“|”$/g, '')}”
        </p>

        {/* Narrative Snippet */}
        <p className="text-[13px] text-[#77736D] mt-3.5 leading-relaxed font-light">
          {testimonial.storySnippet}
        </p>

        {/* Optional Video Thumbnail */}
        {testimonial.videoThumbnail && (
          <div
            onClick={() => onPlayVideo && onPlayVideo(testimonial)}
            className="mt-5 relative w-full h-36 rounded-[6px] overflow-hidden bg-cover bg-center group cursor-pointer border border-[#EAE5DC]"
            style={{ backgroundImage: `url(${testimonial.videoThumbnail})` }}
          >
            <div className="absolute inset-0 bg-[#171717]/40 group-hover:bg-[#171717]/25 transition-colors flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/90 text-[#171717] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5 text-[#C6A66B]" />
              </div>
            </div>
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-white font-medium uppercase tracking-wider">
              <span>Celebration Film Teaser</span>
              <span className="text-[#E4C284]">{testimonial.venue}</span>
            </div>
          </div>
        )}
      </div>

      {/* Couple Name, Location, Event Type */}
      <div className="mt-6 pt-5 border-t border-[#EAE5DC]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-serif text-[18px] text-[#171717] font-medium leading-tight">
            {testimonial.coupleName}
          </h4>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#77736D] mt-1">
            <span className="text-[#C6A66B] uppercase tracking-[0.14em] font-medium">
              {testimonial.celebrationType}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C6A66B]" />
              {testimonial.location || testimonial.destination}
            </span>
          </div>
        </div>

        <span className="text-[11px] text-[#9C968C] tabular-nums font-mono self-start sm:self-auto">
          {testimonial.year}
        </span>
      </div>
    </div>
  );
};
