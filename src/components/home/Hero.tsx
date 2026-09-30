/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Hero Component
 * Full-viewport luxury hero section with heritage ambient video,
 * subtle dark gradient overlay, and choreographed entrance animation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../../lib/router';
import { ArrowRight, ArrowDown } from 'lucide-react';

export interface HeroProps {
  onOpenLetTalk?: () => void;
  isHeroRevealed?: boolean;
  preloaderComplete?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenLetTalk,
  isHeroRevealed,
  preloaderComplete,
}) => {
  const { navigate } = useRouter();

  // Active entrance animation state - defaults to true so hero content is immediately visible
  const [isRevealed, setIsRevealed] = useState<boolean>(true);

  useEffect(() => {
    const handleComplete = () => {
      setIsRevealed(true);
    };

    window.addEventListener('preloaderFinished', handleComplete);
    window.addEventListener('atelier-preloader-exit', handleComplete);

    if (preloaderComplete || isHeroRevealed) {
      handleComplete();
    }

    return () => {
      window.removeEventListener('preloaderFinished', handleComplete);
      window.removeEventListener('atelier-preloader-exit', handleComplete);
    };
  }, [preloaderComplete, isHeroRevealed]);

  const handleExploreScroll = () => {
    const el = document.getElementById('brand-story') || document.getElementById('our-work-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/our-work');
    }
  };

  // Ref to ensure seamless autoplay even on strict mobile browsers
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented or video loading issue:", String(error));
        });
      }
    }
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[100svh] max-h-[100vh] overflow-hidden flex flex-col justify-between bg-black">
      {/* 1. Full-screen background local video with full-height/width cover */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        style={{ minHeight: '100%', minWidth: '100%' }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* 2. Gradient Overlay Coverage */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none bg-gradient-to-b from-black/50 via-black/30 to-black/80" />

      {/* 3. Foreground Hero Content (z-20) */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between items-center px-4 sm:px-6 pt-20 sm:pt-24 pb-4 sm:pb-6 text-center max-w-5xl mx-auto">
        {/* Top/Center Content Group */}
        <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-center items-center my-auto">
          {/* Badge: text-[10px] md:text-xs py-1 px-3 mb-2 tracking-[0.2em] */}
          <div
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 mb-2 rounded-[4px] bg-black/50 backdrop-blur-md border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-all duration-700 ease-out transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[#C5A059] tracking-[0.2em] text-[10px] md:text-xs uppercase font-medium drop-shadow-xs">
              COUTURE WEDDINGS &bull; GLOBAL DESTINATION DIRECTION
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          </div>

          {/* Headline: text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif mb-2 leading-tight */}
          <h1
            className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-2 leading-tight tracking-tight drop-shadow-[0_6px_32px_rgba(0,0,0,0.9)] text-balance transition-all duration-1000 delay-150 ease-out transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
          >
            Your Story.{' '}
            <span className="italic font-light text-[#F8F5EF] block sm:inline">
              Beautifully Celebrated.
            </span>
          </h1>

          {/* Subtext paragraph: text-xs md:text-sm line-clamp-2 md:line-clamp-none max-w-lg mx-auto mb-4 text-stone-300 */}
          <p
            className={`text-xs md:text-sm text-stone-300 max-w-lg mx-auto mb-4 font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] line-clamp-2 md:line-clamp-none transition-all duration-700 delay-300 ease-out transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
            }`}
          >
            From intimate celebrations to grand destination weddings, we design and manage
            unforgettable experiences around your story.
          </p>

          {/* CTA Buttons: compact on mobile (py-2.5 px-5 text-xs sm:text-sm flex-row gap-3) */}
          <div
            className={`flex flex-row gap-3 items-center justify-center transition-all duration-700 delay-300 ease-out transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                if (onOpenLetTalk) {
                  onOpenLetTalk();
                } else {
                  navigate('/plan-my-wedding');
                }
              }}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#C5A059] hover:bg-[#b38e47] text-black font-semibold tracking-wider sm:tracking-widest uppercase text-xs sm:text-sm py-2.5 px-5 rounded-[4px] shadow-[0_8px_24px_rgba(197,160,89,0.35)] hover:scale-[1.02] transition-all cursor-pointer ring-1 ring-[#C5A059]/60"
            >
              <span>PLAN MY WEDDING</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/our-work')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 text-white hover:text-[#C5A059] border border-white/30 backdrop-blur-md font-medium tracking-wider sm:tracking-widest uppercase text-xs sm:text-sm py-2.5 px-5 rounded-[4px] transition-all cursor-pointer"
            >
              <span>EXPLORE ARCHIVES</span>
              <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Stats: py-2 px-3 text-xs w-full max-w-xl mx-auto */}
        <div
          className={`w-full max-w-xl flex flex-col items-center gap-2 mt-auto transform origin-bottom transition-all duration-700 delay-500 ease-out ${
            isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="w-full bg-black/65 backdrop-blur-md rounded-[8px] py-2 px-3 border border-[#C5A059]/35 shadow-[0_8px_32px_rgba(0,0,0,0.65)] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="flex flex-col items-center justify-center">
              <span
                className="text-[#E5D0A1] font-serif text-sm sm:text-xl font-light tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                15+
              </span>
              <span className="text-[8px] sm:text-[10px] text-neutral-300 uppercase tracking-widest font-light mt-0.5">
                Years Couture
              </span>
            </div>

            <div className="flex flex-col items-center justify-center border-x border-white/15 px-1 sm:px-2">
              <span
                className="text-[#E5D0A1] font-serif text-sm sm:text-xl font-light tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                350+
              </span>
              <span className="text-[8px] sm:text-[10px] text-neutral-300 uppercase tracking-widest font-light mt-0.5">
                Celebrations
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span
                className="text-[#E5D0A1] font-serif text-sm sm:text-xl font-light tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                25+
              </span>
              <span className="text-[8px] sm:text-[10px] text-neutral-300 uppercase tracking-widest font-light mt-0.5">
                Destinations
              </span>
            </div>
          </div>

          {/* "SCROLL TO EXPERIENCE" Indicator */}
          <button
            type="button"
            onClick={handleExploreScroll}
            className="inline-flex flex-col items-center gap-0.5 cursor-pointer text-neutral-300 hover:text-[#C5A059] transition-colors group focus:outline-hidden pb-1"
            aria-label="Scroll to experience"
          >
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-light text-neutral-300 group-hover:text-[#C5A059] transition-colors">
              SCROLL TO EXPERIENCE
            </span>
            <ArrowDown className="w-3 h-3 text-[#C5A059] animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};

export { Hero as CinematicHero };
export type { HeroProps as CinematicHeroProps };
