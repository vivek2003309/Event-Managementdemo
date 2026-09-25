/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LuxuryPreloader Component
 * High-fashion editorial preloader inspired by Vogue Weddings and Architectural Digest.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const CURATION_PHASES = [
  'Architecting Timeless Memories...',
  'Curating Royal Enclaves & Palaces...',
  'Harmonizing Floral Scenography & Light...',
  'Welcome to the Atelier.',
];

interface LuxuryPreloaderProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const LuxuryPreloader: React.FC<LuxuryPreloaderProps> = ({ onComplete, forceShow = false }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !forceShow) {
      setIsFinished(true);
      if (onComplete) onComplete();
    }
  }, [forceShow, onComplete]);

  // Progress animation ticker
  useEffect(() => {
    if (isFinished) return;

    // ~2.2s total duration
    const intervalTime = 22;
    const increment = 1;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsFinished(true);
              if (onComplete) onComplete();
            }, 800); // matches curtain slide transition duration
          }, 300);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isFinished, onComplete]);

  // Cycle curation phases smoothly
  useEffect(() => {
    if (isFinished) return;
    const phaseTimer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % CURATION_PHASES.length);
    }, 600);

    return () => clearInterval(phaseTimer);
  }, [isFinished]);

  const handleSkip = () => {
    setProgress(100);
    setIsExiting(true);
    setTimeout(() => {
      setIsFinished(true);
      if (onComplete) onComplete();
    }, 800);
  };

  if (isFinished && !forceShow) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#171717] text-[#F8F5EF] px-6 py-10 sm:p-14 select-none transition-transform duration-800 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isExiting ? '-translate-y-full opacity-90' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Top Bar: Atelier Identifier & Skip Action */}
      <div className="w-full max-w-7xl flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-[#C6A66B]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] animate-pulse" />
          <span className="font-light tracking-[0.3em]">Atelier Directorship</span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="group flex items-center gap-2 text-[#F8F5EF]/70 hover:text-[#C6A66B] transition-colors cursor-pointer py-1 px-3 border border-[#C6A66B]/20 rounded-[2px] hover:border-[#C6A66B]"
        >
          <span className="tracking-[0.2em]">Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Centerpiece Wordmark & Dynamic Subtitle */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-2xl px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-[#222222] border border-[#C6A66B]/30 text-[10px] uppercase tracking-[0.3em] text-[#C6A66B] shadow-sm">
          <Sparkles className="w-3 h-3 text-[#C6A66B]" />
          <span>High-Fashion Scenography</span>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-[32px] sm:text-[48px] lg:text-[56px] font-normal tracking-[0.2em] text-[#F8F5EF] leading-tight">
            THE WEDDING DREAMS
          </h1>
          <div className="w-12 h-[1px] bg-[#C6A66B] mx-auto opacity-60" />
        </div>

        <div className="h-8 flex items-center justify-center">
          <p className="font-sans text-[12px] sm:text-[14px] text-[#C6A66B] font-light tracking-[0.22em] uppercase transition-all duration-500 animate-in fade-in slide-in-from-bottom-1">
            {CURATION_PHASES[phaseIndex]}
          </p>
        </div>
      </div>

      {/* Bottom Progress Bar & Precision Digital Counter */}
      <div className="w-full max-w-md space-y-3 pb-4">
        <div className="flex items-center justify-between text-[12px] font-mono tracking-widest text-[#C6A66B]">
          <span className="text-[10px] uppercase tracking-widest text-[#8C867B]">Loading Dossier</span>
          <span>{progress < 10 ? `0${progress}` : progress}%</span>
        </div>

        {/* Haute Couture Hairline Progress Track */}
        <div className="w-full h-[2px] bg-[#2A2A2A] rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full bg-[#C6A66B] transition-all duration-75 ease-out shadow-[0_0_12px_rgba(198,166,107,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
