/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CinematicHero Component
 * Full-viewport luxury hero section with heritage ambient video,
 * subtle dark gradient overlay, and choreographed opposite-direction entrance animation
 * perfectly synchronized with the editorial preloader's completion event.
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from '../../lib/router';
import { Button } from '../ui/Button';
import { ArrowRight, ArrowDown } from 'lucide-react';

export interface CinematicHeroProps {
  onOpenLetTalk?: () => void;
  isHeroRevealed?: boolean;
  preloaderComplete?: boolean;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onOpenLetTalk,
  isHeroRevealed,
  preloaderComplete,
}) => {
  const { navigate } = useRouter();

  // Active entrance animation state - initially hidden (opacity-0) until preloader finishes
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  useEffect(() => {
    const handleComplete = () => {
      // Small 150ms delay for the curtain to lift before dramatic reveal
      setTimeout(() => setIsRevealed(true), 150);
    };

    window.addEventListener('preloaderFinished', handleComplete);
    window.addEventListener('atelier-preloader-exit', handleComplete);

    // If preloader was already completed or passed via prop
    if (preloaderComplete || isHeroRevealed) {
      handleComplete();
    }

    // Safety fallback: ensure hero content is never permanently invisible
    const safetyTimer = setTimeout(() => {
      setIsRevealed(true);
    }, 3800);

    return () => {
      window.removeEventListener('preloaderFinished', handleComplete);
      window.removeEventListener('atelier-preloader-exit', handleComplete);
      clearTimeout(safetyTimer);
    };
  }, [preloaderComplete, isHeroRevealed]);

  // Smooth scroll down to brand story section
  const handleExploreScroll = () => {
    const el = document.getElementById('brand-story') || document.getElementById('our-work-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/our-work');
    }
  };

  return (
    <section className="relative w-full h-[100dvh] min-h-[100svh] overflow-hidden bg-black">
      {/* Background Ambient Video Entrance: subtle zoom settle (scale 105 -> 100) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-frames/ezgif-frame-001.jpg"
        className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-1000 ease-out ${
          isRevealed ? 'scale-100' : 'scale-105'
        }`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src="/hero-ambient.mp4" type="video/mp4" />
      </video>

      {/* Scrim Overlay */}
      <div className="absolute inset-0 bg-black/45 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 pointer-events-none" />

      {/* Foreground Content Container: sits above video using flexbox within the fixed screen */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between items-center px-4 sm:px-6 pt-24 pb-4 text-center">
        {/* Top/Center Content Group */}
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center items-center my-auto">
          {/* Sub-badge: smooth drop down from top (y: -32px -> 0, opacity: 0 -> 1) */}
          <div
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-[4px] bg-black/50 backdrop-blur-md mb-3 sm:mb-5 border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-all duration-700 ease-out transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] animate-pulse" />
            <span className="text-[#C6A66B] tracking-[0.18em] sm:tracking-[0.25em] text-[9px] sm:text-xs uppercase font-medium drop-shadow-xs">
              COUTURE WEDDINGS &bull; GLOBAL DESTINATION DIRECTION
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] animate-pulse" />
          </div>

          {/* Headline: Elegant stagger-reveal from top (y: -40px -> 0, opacity: 0 -> 1, delay 150ms) */}
          <h1
            className={`text-2xl sm:text-4xl md:text-6xl font-serif text-white leading-snug tracking-tight drop-shadow-[0_6px_32px_rgba(0,0,0,0.9)] text-balance transition-all duration-1000 delay-150 ease-out transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
          >
            Your Story.
            <br />
            <span className="italic font-light text-[#F8F5EF] tracking-normal">
              Beautifully Celebrated.
            </span>
          </h1>

          {/* Subtitle: Fade and glide into place (y: -24px -> 0, opacity: 0 -> 1, delay 300ms) */}
          <p
            className={`text-xs sm:text-sm text-neutral-200 max-w-md mx-auto mt-2 sm:mt-3 font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] line-clamp-2 sm:line-clamp-none transition-all duration-700 delay-300 ease-out transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
            }`}
          >
            From intimate celebrations to grand destination weddings, we design and manage
            unforgettable experiences around your story.
          </p>

          {/* Dual CTAs: Fade and glide into place (y: -24px -> 0, opacity: 0 -> 1, delay 300ms) */}
          <div
            className={`flex flex-col sm:flex-row gap-2.5 sm:gap-4 mt-5 sm:mt-6 w-full sm:w-auto items-center justify-center transition-all duration-700 delay-300 ease-out transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
            }`}
          >
            <Button
              variant="accent"
              size="lg"
              className="w-full sm:w-auto shadow-[0_8px_24px_rgba(198,166,107,0.4)] ring-1 ring-[#C6A66B]/50 hover:scale-[1.02] transition-all cursor-pointer font-medium tracking-wider uppercase text-xs h-10 sm:h-11 px-5 sm:px-6"
              onClick={() => navigate('/plan-my-wedding')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              PLAN MY WEDDING
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-white font-medium tracking-wider cursor-pointer bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md uppercase text-xs hover:text-[#E5D0A1] transition-all h-10 sm:h-11 px-5 sm:px-6"
              onClick={handleExploreScroll}
              rightIcon={<ArrowDown className="w-4 h-4" />}
            >
              EXPLORE OUR WEDDINGS
            </Button>
          </div>
        </div>

        {/* Bottom Metrics / Stats Bar: Softly emerge into view (y: 16px -> 0, opacity: 0 -> 1, delay 500ms) */}
        <div
          className={`scale-90 sm:scale-100 mt-auto w-full max-w-4xl transform origin-bottom transition-all duration-700 delay-500 ease-out ${
            isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-black/65 backdrop-blur-md rounded-[8px] px-3 sm:px-6 py-2 sm:py-3 border border-[#C6A66B]/35 shadow-[0_8px_32px_rgba(0,0,0,0.65)] grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="flex flex-col items-center">
              <span
                className="text-[#E5D0A1] font-serif text-base sm:text-2xl font-light tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                15+
              </span>
              <span className="text-[9px] sm:text-xs text-neutral-300 uppercase tracking-widest font-light mt-0.5">
                Years of Couture
              </span>
            </div>

            <div className="flex flex-col items-center border-x border-white/15 px-2">
              <span
                className="text-[#E5D0A1] font-serif text-base sm:text-2xl font-light tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                350+
              </span>
              <span className="text-[9px] sm:text-xs text-neutral-300 uppercase tracking-widest font-light mt-0.5">
                Celebrations
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span
                className="text-[#E5D0A1] font-serif text-base sm:text-2xl font-light tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
              >
                25+
              </span>
              <span className="text-[9px] sm:text-xs text-neutral-300 uppercase tracking-widest font-light mt-0.5">
                Destinations
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
