import React, { useState, useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { Button } from '../components/ui/Button';
import { Link, useRouter } from '../lib/router';
import { WEDDINGS_DATA } from '../data/weddings';
import { Wedding } from '../types';
import {
  MapPin,
  Users,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  RefreshCw,
  Info,
} from 'lucide-react';

export const OurWorkPage: React.FC<{ onOpenLetTalk: () => void }> = ({ onOpenLetTalk }) => {
  const { navigate } = useRouter();

  // Multi-dimensional filters
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('All');
  const [destinationFilter, setDestinationFilter] = useState<string>('All');
  const [styleFilter, setStyleFilter] = useState<string>('All');

  // Filter options
  const eventTypeOptions = ['All', 'Weddings', 'Destination', 'Sangeet', 'Reception', 'Engagement'];
  const destinationOptions = ['All', 'Udaipur', 'Jaipur', 'Goa', 'Delhi NCR'];
  const styleOptions = [
    'All',
    'Royal Heritage',
    'Coastal Luxury',
    'Modern Minimalist',
    'Mirror Glamour',
    'Black-Tie Gala',
  ];

  // Filtered dataset
  const filteredWeddings = useMemo(() => {
    return WEDDINGS_DATA.filter((w) => {
      // Event type check
      if (eventTypeFilter !== 'All') {
        const matchesEvent =
          w.tags?.includes(eventTypeFilter) ||
          w.category === eventTypeFilter ||
          w.eventType?.toLowerCase().includes(eventTypeFilter.toLowerCase());
        if (!matchesEvent) return false;
      }

      // Destination check
      if (destinationFilter !== 'All') {
        if (!w.destination.toLowerCase().includes(destinationFilter.toLowerCase())) {
          return false;
        }
      }

      // Wedding style check
      if (styleFilter !== 'All') {
        const styleText = (w.weddingStyle || '').toLowerCase();
        const search = styleFilter.toLowerCase();
        if (!styleText.includes(search)) {
          // Alternative check for coastal / royal
          if (search.includes('coastal') && !styleText.includes('coastal')) return false;
          if (search.includes('heritage') && !styleText.includes('heritage')) return false;
          if (search.includes('minimalist') && !styleText.includes('minimalist')) return false;
        }
      }

      return true;
    });
  }, [eventTypeFilter, destinationFilter, styleFilter]);

  const hasActiveFilters =
    eventTypeFilter !== 'All' || destinationFilter !== 'All' || styleFilter !== 'All';

  const resetFilters = () => {
    setEventTypeFilter('All');
    setDestinationFilter('All');
    setStyleFilter('All');
  };

  return (
    <div className="w-full flex flex-col">
      {/* =========================================================================
          HERO BANNER
         ========================================================================= */}
      <section className="relative w-full bg-[#171717] text-white py-24 sm:py-32 overflow-hidden border-b border-[#252525]">
        {/* Atmospheric Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('/service.hero-bg.jpg'), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        {/* Subtle Ambient Radial Lighting & Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/80 via-[#171717]/70 to-[#171717] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(198,166,107,0.2)_0%,transparent_60%)] pointer-events-none" />

        <PageContainer>
          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-white/10 backdrop-blur-md mb-6 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
              <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] text-[#F8F5EF]">
                Private Archival Vault &bull; Curated Celebrations
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
            </div>

            <h1 className="font-serif text-[42px] sm:text-[60px] lg:text-[72px] font-normal leading-[1.06] text-white tracking-tight">
              Selected Case Studies
            </h1>

            <p className="text-[15px] sm:text-[18px] text-white/80 mt-5 font-light leading-relaxed max-w-2xl">
              An intimate retrospective into multi-day celebrations executed across royal palaces,
              coastal enclaves, and private botanical conservatories.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Realistic sample data watermark badge */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#EAE5DC] py-2.5 px-4 text-center">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-[11px] text-[#77736D]">
          <Info className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
          <span>
            <strong>Curated Atelier Showcase:</strong> The celebrations presented below are realistic
            architectural sample case studies representing our creative direction, planning
            methodology, and scenography standards.
          </span>
        </div>
      </div>

      {/* =========================================================================
          MULTI-DIMENSIONAL FILTER CONTROLS
          - Event Type
          - Destination
          - Wedding Style
         ========================================================================= */}
      <div className="sticky top-20 z-30 w-full bg-[#F8F5EF]/95 backdrop-blur-md border-b border-[#EAE5DC] py-5 shadow-xs">
        <PageContainer>
          <div className="flex flex-col space-y-4">
            {/* Filter Row 1: Event Type */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#77736D] sm:w-28 shrink-0">
                Event Type:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {eventTypeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setEventTypeFilter(opt)}
                    className={`px-3.5 py-1.5 rounded-[4px] text-[11px] font-medium uppercase tracking-[0.14em] whitespace-nowrap transition-all cursor-pointer ${
                      eventTypeFilter === opt
                        ? 'bg-[#171717] text-white shadow-xs'
                        : 'bg-white border border-[#EAE5DC] text-[#77736D] hover:border-[#C6A66B] hover:text-[#171717]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Row 2: Destination & Style Combined */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EAE5DC]/60">
              <div className="flex flex-wrap items-center gap-4 text-[12px]">
                {/* Destination Dropdown / Chips */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#77736D]">
                    Destination:
                  </span>
                  <div className="flex items-center gap-1">
                    {destinationOptions.map((dest) => (
                      <button
                        key={dest}
                        onClick={() => setDestinationFilter(dest)}
                        className={`px-2.5 py-1 rounded-[3px] text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                          destinationFilter === dest
                            ? 'bg-[#C6A66B] text-white font-medium'
                            : 'bg-transparent text-[#77736D] hover:text-[#171717]'
                        }`}
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-[#EAE5DC] hidden md:inline">|</span>

                {/* Wedding Style Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#77736D]">
                    Style:
                  </span>
                  <select
                    value={styleFilter}
                    onChange={(e) => setStyleFilter(e.target.value)}
                    className="bg-white border border-[#EAE5DC] rounded-[4px] px-3 py-1 text-[12px] text-[#252525] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                  >
                    {styleOptions.map((st) => (
                      <option key={st} value={st}>
                        {st === 'All' ? 'All Wedding Styles' : st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reset Action */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#C6A66B] hover:text-[#171717] font-medium transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </PageContainer>
      </div>

      {/* =========================================================================
          RESPONSIVE EDITORIAL GALLERY
         ========================================================================= */}
      <Section variant="ivory" spacing="lg">
        <PageContainer>
          {filteredWeddings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[10px] border border-[#EAE5DC] p-10 max-w-xl mx-auto">
              <span className="font-serif text-[28px] text-[#171717]">No Celebrations Found</span>
              <p className="text-[14px] text-[#77736D] mt-2 font-light">
                No archived case studies match your active filter criteria.
              </p>
              <Button variant="accent" size="sm" className="mt-6" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWeddings.map((wedding) => (
                <article
                  key={wedding.id}
                  onClick={() => navigate(`/our-work/${wedding.slug}`)}
                  className="group bg-white rounded-[8px] overflow-hidden border border-[#EAE5DC] shadow-[0_4px_20px_-4px_rgba(23,23,23,0.04)] hover:shadow-[0_20px_45px_-10px_rgba(23,23,23,0.12)] hover:border-[#D6CEBE] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Visual Asset Container with Zoom & Badge */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-[#171717]">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url(${wedding.heroImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Event Type & Location Badges */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                        <span className="bg-[#171717]/85 backdrop-blur-md px-2.5 py-1 rounded-[3px] text-white text-[10px] font-medium tracking-[0.16em] uppercase border border-white/10">
                          {wedding.eventType || 'Celebration'}
                        </span>
                        <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-[3px] text-[#C6A66B] text-[10px] font-medium tracking-[0.14em] uppercase">
                          {wedding.functionsCount || wedding.durationDays + 1} Functions
                        </span>
                      </div>

                      {/* Bottom Image Overlay */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                        <span className="text-[11px] text-[#F8F5EF]/80 uppercase tracking-widest font-light block">
                          {wedding.destination}
                        </span>
                      </div>
                    </div>

                    {/* Editorial Content */}
                    <div className="p-6 sm:p-7">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1.5">
                        {wedding.weddingStyle || wedding.subtitle}
                      </span>

                      <h3 className="font-serif text-[26px] sm:text-[28px] text-[#171717] font-normal leading-tight group-hover:text-[#C6A66B] transition-colors">
                        {wedding.title}
                      </h3>

                      <p className="text-[13px] text-[#77736D] mt-2.5 leading-relaxed font-light line-clamp-3">
                        {wedding.excerpt}
                      </p>

                      {/* Metadata Row */}
                      <div className="mt-5 pt-4 border-t border-[#EAE5DC] flex items-center justify-between text-[11px] text-[#77736D]">
                        <span className="flex items-center gap-1 truncate max-w-[65%]">
                          <MapPin className="w-3 h-3 text-[#C6A66B] shrink-0" />
                          <span className="truncate">{wedding.venue}</span>
                        </span>
                        <span className="font-medium text-[#171717]">
                          {wedding.guestCount} Guests
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: View Detailed Case Study */}
                  <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-[#EAE5DC]/80 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-[#C6A66B] group-hover:text-[#171717] transition-colors">
                    <span>Explore Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* =========================================================================
              BOTTOM CTA
              "Planning something of your own?" -> Button: "Create My Wedding Plan"
             ========================================================================= */}
          <div className="mt-28 p-10 sm:p-16 bg-[#171717] rounded-[12px] text-white text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,166,107,0.18)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C6A66B] block mb-3">
                Commence Your Vision
              </span>

              <h2 className="font-serif text-[34px] sm:text-[48px] text-white font-normal leading-tight">
                Planning something of your own?
              </h2>

              <p className="text-[14px] sm:text-[16px] text-white/80 mt-4 font-light leading-relaxed">
                Whether you desire a floating palace takeover in Lake Pichola or a cliffside
                sanctuary in South Goa, our directorship begins with your personal narrative.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => navigate('/plan-my-wedding')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create My Wedding Plan
                </Button>

                <button
                  type="button"
                  onClick={onOpenLetTalk}
                  className="px-8 py-4 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all duration-300 uppercase tracking-widest text-xs font-medium rounded-[4px] cursor-pointer inline-flex items-center justify-center select-none shadow-xs"
                >
                  Talk To Our Team
                </button>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
};
