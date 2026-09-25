import React from 'react';
import { Link } from '../../lib/router';
import { ArrowRight, Instagram, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const whatsappUrl = 'https://wa.me/919820048210?text=Namaste%2C%20I%20would%20like%20to%20inquire%20about%20wedding%20planning%20with%20The%20Wedding%20Dreams.';

  return (
    <footer className="w-full bg-[#171717] text-[#F8F5EF] pt-20 pb-12 border-t border-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/10">
          {/* Column 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-[24px] tracking-[0.16em] uppercase text-[#F8F5EF] font-normal block">
                The Wedding Dreams
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#C6A66B] font-medium block mt-0.5">
                Couture &amp; Scenography
              </span>
            </Link>
            <p className="text-[13px] text-[#F8F5EF]/70 leading-relaxed font-light max-w-sm">
              Architectural rigor, curated romance, and sensory scenography. Featured in{' '}
              <em className="font-serif italic text-[#C6A66B]">Vogue Weddings</em> and{' '}
              <em className="font-serif italic text-[#C6A66B]">Architectural Digest</em> as the
              benchmark in bespoke high-fashion Indian and destination nuptials.
            </p>
            <div className="pt-2 flex items-center gap-4 text-[12px] text-[#C6A66B]">
              <span className="uppercase tracking-[0.2em] font-medium text-[10px]">
                Udaipur • Jaipur • Goa • Global
              </span>
            </div>
          </div>

          {/* Column 2: Studio Navigation (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h5 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] pb-1">
              Studio &amp; Work
            </h5>
            <ul className="flex flex-col space-y-2.5 text-[13px] text-[#F8F5EF]/80">
              <li>
                <Link href="/services" className="hover:text-[#C6A66B] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/our-work" className="hover:text-[#C6A66B] transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-[#C6A66B] transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C6A66B] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C6A66B] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Curatorial Planning Tools (2 cols) */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <h5 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] pb-1">
              Planning Tools
            </h5>
            <ul className="flex flex-col space-y-2.5 text-[13px] text-[#F8F5EF]/80">
              <li>
                <Link href="/plan-my-wedding" className="hover:text-[#C6A66B] transition-colors">
                  Plan My Wedding
                </Link>
              </li>
              <li>
                <Link href="/wedding-style" className="hover:text-[#C6A66B] transition-colors">
                  Wedding Style Quiz
                </Link>
              </li>
              <li>
                <Link href="/budget-planner" className="hover:text-[#C6A66B] transition-colors">
                  Budget Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Private Consultation & Direct Contact (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h5 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] pb-1">
              Connect With Atelier
            </h5>
            <p className="text-[13px] text-[#F8F5EF]/70 leading-relaxed font-light">
              Engage our directorial studio for multi-day nuptials and bespoke estates.
            </p>
            <div className="flex flex-col space-y-2 pt-1 text-[13px]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#F8F5EF] hover:text-[#C6A66B] transition-colors group"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span className="font-medium">WhatsApp:</span>
                <span className="text-[#C6A66B]">+91 (0) 98200 48210</span>
              </a>

              <a
                href="https://instagram.com/theweddingdreams"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#F8F5EF] hover:text-[#C6A66B] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Instagram: @theweddingdreams</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-wider text-[#C6A66B] hover:text-white pt-2 transition-colors"
              >
                <span>Request Private Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#F8F5EF]/60 tracking-wider">
          <div className="text-center md:text-left">
            <span>
              Copyright &copy; 2025 The Wedding Dreams. All Rights Reserved. Luxury Wedding &amp; Destination Event Management.
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-[#F8F5EF] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#F8F5EF]/30">&bull;</span>
            <Link href="/terms" className="hover:text-[#F8F5EF] transition-colors">
              Terms of Curation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
