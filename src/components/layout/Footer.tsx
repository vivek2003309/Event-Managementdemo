import React from 'react';
import { Link } from '../../lib/router';
import { ArrowRight, Instagram, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const whatsappUrl = 'https://wa.me/919871211995?text=Hello%20The%20Wedding%20Dreams,%20I%20would%20like%20to%20inquire%20about%20your%20bespoke%20event%20planning%20services.';
  const mapsUrl = 'https://www.google.com/maps/dir//Ground+Floor,+The+Wedding+Dreams+by+Varun+Rathor,+1%2F202%2F35,Sadar+Bazar+Road,+Road,+Piru+Vihar,+Sadar+Bazaar,+Delhi+Cantonment,+New+Delhi,+Delhi+110010/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x390d1bf38a125f05:0xfd970fea30b8de89?sa=X&ved=1t:57443&ictx=111';

  return (
    <footer className="w-full bg-[#171717] text-[#F8F5EF] pt-20 pb-28 sm:pb-32 border-t border-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/10">
          {/* Column 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-[24px] tracking-[0.16em] uppercase text-[#F8F5EF] font-normal block">
                The Wedding Dreams by Varun Rathor
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#C6A66B] font-medium block mt-0.5">
                Couture &amp; Scenography
              </span>
            </Link>
            <p className="text-[13px] text-[#F8F5EF]/70 leading-relaxed font-light max-w-sm">
              Architectural rigor, curated romance, and sensory scenography for bespoke private celebrations across heritage and coastal estates.
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

          {/* Column 3: Curatorial Planning Tools & Legal Governance (2 cols) */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <h5 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] pb-1">
              Tools &amp; Governance
            </h5>
            <ul className="flex flex-col space-y-2 text-[12px] text-[#F8F5EF]/80">
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
              <li className="pt-2 border-t border-white/10 text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-semibold">
                Legal &amp; Compliance
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#C6A66B] transition-colors">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#C6A66B] transition-colors">
                  Terms of Curation
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#C6A66B] transition-colors">
                  Retainer &amp; Cancellation
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[#C6A66B] transition-colors">
                  Cookie Notice
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
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#F8F5EF] hover:text-[#C6A66B] transition-colors group"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span className="font-medium">Mobile / WhatsApp:</span>
                <span className="text-[#C6A66B]">+91 9871211995</span>
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 text-[#F8F5EF] hover:text-[#C6A66B] transition-colors"
              >
                <span className="text-[#C6A66B] font-medium shrink-0">Studio Address:</span>
                <span className="text-white/80 hover:underline">Ground Floor, 1/202/35, Sadar Bazar Road, Piru Vihar, Sadar Bazaar, Delhi Cantonment, New Delhi, Delhi 110010</span>
              </a>

              <a
                href="mailto:inquiries@theweddingdreams.com"
                className="inline-flex items-center gap-2 text-[#F8F5EF] hover:text-[#C6A66B] transition-colors"
              >
                <span className="text-[#C6A66B] font-medium shrink-0">Grievance Desk:</span>
                <span className="text-white/80 hover:underline">inquiries@theweddingdreams.com</span>
              </a>

              <a
                href="https://event-managementdemo.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#F8F5EF] hover:text-[#C6A66B] transition-colors"
              >
                <span className="text-[#C6A66B] font-medium shrink-0">Official Portal:</span>
                <span className="text-white/80 hover:underline">event-managementdemo.vercel.app</span>
              </a>

              <a
                href="https://www.instagram.com/theweddingdreamsbyvarunrathor/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#F8F5EF] hover:text-[#C6A66B] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Instagram: @theweddingdreamsbyvarunrathor</span>
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
          <div className="text-center md:text-left flex flex-col sm:flex-row sm:items-center gap-3">
            <span>
              Copyright &copy; 2025 The Wedding Dreams. All Rights Reserved.
            </span>
          </div>
          <div className="relative z-20 flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2 text-[11px] text-[#F8F5EF]/70 px-4 sm:px-12 md:px-28">
            <Link href="/privacy-policy" className="cursor-pointer hover:text-[#C6A66B] transition-colors">
              Privacy Policy (DPDP Act)
            </Link>
            <span className="text-[#F8F5EF]/30">&bull;</span>
            <Link href="/terms" className="cursor-pointer hover:text-[#C6A66B] transition-colors">
              Terms of Curation
            </Link>
            <span className="text-[#F8F5EF]/30">&bull;</span>
            <Link href="/refund-policy" className="cursor-pointer hover:text-[#C6A66B] transition-colors">
              Retainer Policy
            </Link>
            <span className="text-[#F8F5EF]/30">&bull;</span>
            <Link href="/cookies" className="cursor-pointer hover:text-[#C6A66B] transition-colors">
              Cookie Notice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
