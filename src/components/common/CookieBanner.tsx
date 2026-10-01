import React, { useState, useEffect } from 'react';
import { useRouter } from '../../lib/router';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const { navigate } = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const acknowledged = localStorage.getItem('cookie_consent_ack');
      if (!acknowledged) {
        // Small delayed entrance for smooth luxury feel
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Fallback for strict browser private modes
      setIsVisible(true);
    }
  }, []);

  const handleAcknowledge = () => {
    try {
      localStorage.setItem('cookie_consent_ack', 'true');
    } catch (e) {}
    setIsVisible(false);
  };

  const handleNavigatePolicy = () => {
    navigate('/cookies');
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Discretion Notice"
      className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-[#171717] text-[#F8F5EF] border-t border-[#C5A059]/40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] animate-slide-up"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 px-2 sm:px-4">
        {/* Notice Message */}
        <div className="flex items-center gap-3 text-[12px] sm:text-[13px] text-[#F8F5EF]/90 font-light leading-snug">
          <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 hidden md:block" />
          <p>
            We respect your discretion. We use strictly essential session data to maintain concierge interactions. By browsing, you acknowledge our policies.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          <button
            onClick={handleNavigatePolicy}
            className="px-3.5 py-1.5 rounded-[4px] border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059]/10 text-[11px] uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer"
          >
            Policy
          </button>
          <button
            onClick={handleAcknowledge}
            className="px-4 py-1.5 rounded-[4px] bg-[#C5A059] hover:bg-[#b08d4a] text-[#171717] text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors cursor-pointer shadow-sm"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
