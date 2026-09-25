import React, { useState } from 'react';
import { MessageSquare, X, ArrowRight, Phone } from 'lucide-react';

export const FloatingWhatsAppCTA: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '919820048210';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    'Namaste. I would like to inquire about wedding planning with The Wedding Dreams.'
  )}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start pointer-events-auto">
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="mb-3 w-72 sm:w-80 bg-[#171717] text-[#F8F5EF] p-4 rounded-[8px] border border-[#C6A66B]/40 shadow-[0_16px_40px_rgba(0,0,0,0.4)] animate-slide-up">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C6A66B]">
                WhatsApp Concierge
              </span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              aria-label="Close tooltip"
              className="text-white/60 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[12px] text-white/80 mt-2.5 leading-relaxed font-light">
            Connect directly with our curatorial directors for palace availability, guest logistics, and private proposals.
          </p>
          <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-[#C6A66B]">
            <span>Direct: +91 (0) 98200 48210</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium hover:underline text-white"
            >
              Chat Now <ArrowRight className="w-3 h-3 text-[#C6A66B]" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        aria-label="Chat with The Wedding Dreams on WhatsApp"
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#171717] hover:bg-[#202020] text-[#F8F5EF] rounded-[6px] border border-[#C6A66B]/60 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      >
        {/* WhatsApp Icon with green status dot */}
        <div className="relative flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.17C10.57 20.17 9.13 19.77 7.87 19.02L7.56 18.84L4.44 19.66L5.27 16.62L5.07 16.3C4.24 14.98 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.69 12.05 3.69C14.25 3.69 16.31 4.55 17.87 6.11C19.42 7.67 20.28 9.73 20.28 11.92C20.28 16.47 16.59 20.17 12.05 20.17ZM16.57 14.39C16.32 14.26 15.11 13.67 14.88 13.59C14.66 13.51 14.5 13.47 14.33 13.72C14.17 13.97 13.7 14.55 13.56 14.71C13.42 14.87 13.27 14.89 13.03 14.77C12.79 14.65 11.99 14.39 11.04 13.54C10.3 12.88 9.8 12.07 9.66 11.83C9.52 11.59 9.65 11.45 9.77 11.33C9.88 11.22 10.02 11.04 10.14 10.9C10.26 10.76 10.3 10.66 10.38 10.5C10.46 10.34 10.42 10.2 10.36 10.08C10.3 9.96 9.82 8.78 9.62 8.3C9.43 7.83 9.23 7.9 9.08 7.89C8.93 7.88 8.77 7.88 8.61 7.88C8.45 7.88 8.18 7.94 7.96 8.18C7.74 8.42 7.12 9 7.12 10.22C7.12 11.44 8.01 12.62 8.13 12.78C8.25 12.94 9.87 15.44 12.35 16.51C12.94 16.77 13.4 16.92 13.76 17.03C14.35 17.22 14.89 17.19 15.31 17.13C15.78 17.06 16.76 16.54 16.96 15.97C17.17 15.4 17.17 14.91 17.1 14.79C17.04 14.67 16.89 14.52 16.57 14.39Z" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C6A66B] ring-2 ring-[#171717]" />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[11px] uppercase tracking-[0.16em] text-white font-medium group-hover:text-[#C6A66B] transition-colors">
            WhatsApp Concierge
          </span>
          <span className="text-[9px] text-[#C6A66B] uppercase tracking-[0.2em] font-light hidden sm:inline">
            Direct Atelier 24/7
          </span>
        </div>
      </a>
    </div>
  );
};
