/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LuxuryEditorialPreloader Component
 * Bespoke editorial studio intro inspired by high-fashion intros (Vogue & Architectural Digest)
 * for 'The Wedding Dreams' atelier.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAnimation } from '../../context/AnimationContext';

const MONTAGE_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', // Grand royal palace / venue
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', // Bridal veil / heirloom jewelry
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', // Champagne tower / crystal
  'https://images.unsplash.com/photo-1545232979-fbf6e4b85c9a?auto=format&fit=crop&w=1200&q=85', // Candle-lit opulent floral banquet
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85', // Romantic couple setup
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', // Cinematic celebration
];

interface LuxuryEditorialPreloaderProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const LuxuryEditorialPreloader: React.FC<LuxuryEditorialPreloaderProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const { setIntroCompleted } = useAnimation();
  const [progress, setProgress] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const exitTriggeredRef = useRef(false);

  // Scroll-Lock During Preloader (Prevent Scroll Bleed)
  useEffect(() => {
    if (!isFinished || forceShow) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100vh';
      document.documentElement.style.touchAction = 'none';
      window.scrollTo(0, 0);

      const preventScroll = (e: Event) => {
        e.preventDefault();
      };
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });

      return () => {
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
      };
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.body.style.touchAction = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';
      document.documentElement.style.touchAction = 'auto';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [isFinished, forceShow]);

  // Clean up styles on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.body.style.touchAction = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';
      document.documentElement.style.touchAction = 'auto';
    };
  }, []);

  // Preload montage imagery on mount to prevent any flicker during rapid swapping
  // Clear any stale flag so initial page load matches replay experience deliberately
  useEffect(() => {
    try {
      sessionStorage.removeItem('hasSeenPreloader');
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('atelier-preloader-start'));

    MONTAGE_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Fail-safe timer
    const failsafeTimer = setTimeout(() => {
      document.body.classList.add('preloader-finished');
      document.body.classList.add('preloader-done');
    }, 2200);

    return () => clearTimeout(failsafeTimer);
  }, []);

  // Listen for Replay requests from footer or anywhere in app
  useEffect(() => {
    const handleReplay = () => {
      try {
        sessionStorage.removeItem('hasSeenPreloader');
      } catch (e) {}
      exitTriggeredRef.current = false;
      setIsFinished(false);
      setIsExiting(false);
      setProgress(0);
      setImageIndex(0);
      window.dispatchEvent(new CustomEvent('atelier-preloader-start'));
    };

    window.addEventListener('replay-atelier-preloader', handleReplay);
    return () => window.removeEventListener('replay-atelier-preloader', handleReplay);
  }, []);

  // Guarantee deliberate 3.2-second sequence on both initial load and replay
  useEffect(() => {
    if (isFinished) return;

    exitTriggeredRef.current = false;
    const totalDuration = 3200; // Deliberate duration: exactly 3.2 seconds
    const startTime = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
      setProgress(pct);

      if (pct >= 100 && !exitTriggeredRef.current) {
        exitTriggeredRef.current = true;
        clearInterval(progressTimer);

        document.body.classList.add('preloader-done');
        document.body.classList.add('preloader-finished');
        window.dispatchEvent(new CustomEvent('preloader-finished'));
        window.dispatchEvent(new CustomEvent('atelier-preloader-exit'));

        // Begin smooth 700ms slide/fade upward curtain transition
        setIsExiting(true);

        setTimeout(() => {
          try {
            sessionStorage.setItem('hasSeenPreloader', 'true');
          } catch (e) {}
          setIsFinished(true);
          setIntroCompleted(true);
          document.body.classList.add('preloader-done');
          document.body.classList.add('preloader-finished');
          window.dispatchEvent(new CustomEvent('preloader-finished'));
          window.dispatchEvent(new CustomEvent('preloaderFinished'));
          if (onComplete) onComplete();
        }, 700); // 700ms exit curtain animation
      }
    }, 25);

    // Swap images at a deliberate cadence of ~360ms matching counter acceleration
    const imageTimer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % MONTAGE_IMAGES.length);
    }, 360);

    return () => {
      clearInterval(progressTimer);
      clearInterval(imageTimer);
    };
  }, [isFinished, onComplete, setIntroCompleted]);

  const handleSkip = () => {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;

    setProgress(100);
    document.body.classList.add('preloader-done');
    document.body.classList.add('preloader-finished');
    window.dispatchEvent(new CustomEvent('preloader-finished'));
    window.dispatchEvent(new CustomEvent('atelier-preloader-exit'));
    setIsExiting(true);

    setTimeout(() => {
      try {
        sessionStorage.setItem('hasSeenPreloader', 'true');
      } catch (e) {}
      setIsFinished(true);
      setIntroCompleted(true);
      document.body.classList.add('preloader-done');
      document.body.classList.add('preloader-finished');
      window.dispatchEvent(new CustomEvent('preloader-finished'));
      window.dispatchEvent(new CustomEvent('preloaderFinished'));
      if (onComplete) onComplete();
    }, 700);
  };

  if (isFinished && !forceShow) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#F9F6F0] text-neutral-900 px-6 py-8 sm:p-12 select-none transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isExiting ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Top Split Header */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs tracking-[0.25em] font-serif uppercase">
        <div className="flex items-center gap-2 text-neutral-900">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
          <span>THE WEDDING DREAMS</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="font-mono tabular-nums tracking-widest text-neutral-800 font-semibold">
            {progress < 10 ? `0${progress}` : progress}%
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer underline underline-offset-4"
          >
            Skip Intro
          </button>
        </div>
      </div>

      {/* Center Refined Vertical Portrait Container */}
      <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-[6px] overflow-hidden shadow-2xl bg-neutral-200 border border-[#E5DFD3] my-auto">
        {MONTAGE_IMAGES.map((url, idx) => (
          <div
            key={url}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-300 ease-out ${
              idx === imageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}

        {/* Subtle Luxury Vignette / Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Bottom Footer Caption */}
      <div className="w-full max-w-4xl flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-sans">
        <span>Couture Scenography</span>
        <span>Udaipur &bull; Jaipur &bull; Lake Como</span>
      </div>
    </div>
  );
};
