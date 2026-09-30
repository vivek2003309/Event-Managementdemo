import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Button } from '../components/ui/Button';
import { Link, useRouter } from '../lib/router';
import { SERVICES_DATA } from '../data/services';
import { WEDDINGS_DATA } from '../data/weddings';
import { Service } from '../types';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const ServicesPage: React.FC<{ onOpenLetTalk: () => void }> = ({ onOpenLetTalk }) => {
  const { navigate } = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const displayedServices = SERVICES_DATA.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.id === activeCategory;
  });

  return (
    <div className="w-full flex flex-col">
      {/* =========================================================================
          HERO SECTION
          Headline: "Everything You Need. Beautifully Orchestrated."
         ========================================================================= */}
      <section className="relative w-full bg-[#171717] text-white py-24 sm:py-32 overflow-hidden border-b border-[#252525]">
        {/* Subtle Background Pattern & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,166,107,0.15)_0%,transparent_60%)] pointer-events-none" />

        <PageContainer>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-[4px] bg-white/10 backdrop-blur-md mb-6 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
              <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] text-[#F8F5EF]">
                Atelier Capabilities &bull; Six Core Disciplines
              </span>
            </div>

            <h1 className="font-serif text-[42px] sm:text-[60px] lg:text-[70px] font-normal leading-[1.08] text-white tracking-tight">
              Everything You Need.
              <br />
              <span className="italic font-light text-[#F8F5EF]">Beautifully Orchestrated.</span>
            </h1>

            <p className="text-[15px] sm:text-[18px] text-white/80 mt-6 font-light leading-relaxed max-w-2xl">
              From intimate estate vows to multi-day royal palace takeovers, our studio provides
              comprehensive directorial mastery under single-point command. No fragmented vendors, no
              compromises.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Button
                variant="accent"
                size="lg"
                onClick={() => navigate('/plan-my-wedding')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Plan My Wedding
              </Button>

              <button
                type="button"
                onClick={onOpenLetTalk}
                className="px-8 py-4 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all duration-300 uppercase tracking-widest text-xs font-medium rounded-[4px] cursor-pointer inline-flex items-center justify-center select-none shadow-xs"
              >
                Schedule Directorial Consultation
              </button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* =========================================================================
          FAST NAVIGATION ANCHOR BAR
         ========================================================================= */}
      <nav aria-label="Service categories navigation" className="sticky top-20 z-30 w-full bg-[#F8F5EF]/95 backdrop-blur-md border-b border-[#EAE5DC] py-3.5 shadow-xs">
        <PageContainer>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-[4px] text-[11px] font-medium uppercase tracking-[0.16em] whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white border border-[#EAE5DC] text-[#77736D] hover:border-[#C6A66B] hover:text-[#171717]'
              }`}
            >
              All Capabilities (6)
            </button>
            {SERVICES_DATA.map((srv) => (
              <button
                key={srv.id}
                onClick={() => setActiveCategory(srv.id)}
                className={`px-4 py-1.5 rounded-[4px] text-[11px] font-medium uppercase tracking-[0.16em] whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === srv.id
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'bg-white border border-[#EAE5DC] text-[#77736D] hover:border-[#C6A66B] hover:text-[#171717]'
                }`}
              >
                {srv.number}. {srv.title}
              </button>
            ))}
          </div>
        </PageContainer>
      </nav>

      {/* =========================================================================
          COMPREHENSIVE SERVICE CATEGORIES (EACH WITH ALL REQUIRED ITEMS)
          - Hero image
          - Short description
          - What is included
          - Planning process
          - Related portfolio
          - CTA: Plan My Wedding
         ========================================================================= */}
      <Section variant="ivory" spacing="lg">
        <PageContainer>
          <div className="space-y-24 sm:space-y-32">
            {displayedServices.map((service, index) => {
              const isEven = index % 2 === 1;
              const relatedWeddings = WEDDINGS_DATA.filter((w) =>
                service.relatedPortfolioSlugs?.includes(w.slug)
              );

              return (
                <article
                  key={service.id}
                  id={service.id}
                  className="bg-white rounded-[12px] border border-[#EAE5DC] shadow-[0_16px_40px_-10px_rgba(23,23,23,0.06)] overflow-hidden"
                >
                  {/* Top Split Header: Visual + Key Description */}
                  <div className={`grid grid-cols-1 lg:grid-cols-12 items-stretch ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Visual Asset (5 cols) */}
                    <div
                      className={`lg:col-span-5 min-h-[360px] lg:min-h-full bg-cover bg-center relative ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                      style={{ backgroundImage: `url(${service.heroImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 via-transparent to-black/20 p-8 flex flex-col justify-between text-white">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-black/60 backdrop-blur-md border border-white/20 self-start text-[11px] uppercase tracking-[0.2em] text-[#C6A66B] font-medium">
                          Capability {service.number}
                        </div>

                        {service.featuredQuote && (
                          <div className="bg-[#171717]/90 backdrop-blur-md p-5 rounded-[6px] border border-[#C6A66B]/40">
                            <p className="font-serif text-[16px] sm:text-[17px] italic text-[#F8F5EF] leading-snug">
                              {service.featuredQuote}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Overview & Detail Column (7 cols) */}
                    <div className={`lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2.5 mb-3">
                          <span className="font-mono text-[12px] text-[#C6A66B] font-medium">
                            {service.number} / 06
                          </span>
                          <span className="w-4 h-px bg-[#C6A66B]" />
                          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#77736D]">
                            Core Specialization
                          </span>
                        </div>

                        <h2 className="font-serif text-[32px] sm:text-[44px] font-normal text-[#171717] leading-tight">
                          {service.title}
                        </h2>

                        <p className="text-[15px] sm:text-[16px] text-[#252525] mt-4 leading-relaxed font-light">
                          {service.shortDescription}
                        </p>

                        <p className="text-[13px] sm:text-[14px] text-[#77736D] mt-3 leading-relaxed font-light">
                          {service.fullDescription}
                        </p>

                        {/* What is Included */}
                        <div className="mt-8 pt-6 border-t border-[#EAE5DC]">
                          <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] mb-4 flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5" />
                            What Is Included
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {service.inclusions.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-[13px] text-[#252525]">
                                <CheckCircle2 className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                                <span className="leading-snug">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="mt-8 pt-6 border-t border-[#EAE5DC] flex flex-wrap items-center justify-between gap-4">
                        <Button
                          variant="accent"
                          size="md"
                          onClick={() => navigate('/plan-my-wedding')}
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          Plan My Wedding
                        </Button>

                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.16em] text-[#171717] hover:text-[#C6A66B] transition-colors group"
                        >
                          <span>Explore Full {service.title} Detail</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#C6A66B]" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Planning Process (Timeline Steps) */}
                  <div className="bg-[#FAF8F5] p-8 sm:p-12 border-t border-[#EAE5DC]">
                    <div className="mb-6">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] block mb-1">
                        Methodology
                      </span>
                      <h4 className="font-serif text-[24px] sm:text-[28px] text-[#171717] font-normal">
                        The Planning Process for {service.title}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {service.planningProcess.map((proc) => (
                        <div
                          key={proc.step}
                          className="bg-white p-5 rounded-[6px] border border-[#EAE5DC] shadow-xs flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1.5">
                              {proc.step}
                            </span>
                            <h5 className="font-serif text-[17px] text-[#171717] font-normal leading-snug">
                              {proc.title}
                            </h5>
                            <p className="text-[12px] text-[#77736D] mt-2 leading-relaxed font-light">
                              {proc.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Portfolio Section */}
                  {relatedWeddings.length > 0 && (
                    <div className="p-8 sm:p-12 bg-white border-t border-[#EAE5DC]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] block mb-1">
                            Demonstrated Case Studies
                          </span>
                          <h4 className="font-serif text-[22px] sm:text-[26px] text-[#171717] font-normal">
                            Related Celebrations Featuring This Discipline
                          </h4>
                        </div>
                        <Link
                          href="/our-work"
                          className="text-[11px] uppercase tracking-wider text-[#C6A66B] hover:text-[#171717] font-medium"
                        >
                          View All Portfolio &rarr;
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {relatedWeddings.map((w) => (
                          <div
                            key={w.id}
                            onClick={() => navigate(`/our-work/${w.slug}`)}
                            className="group bg-[#F8F5EF] rounded-[8px] overflow-hidden border border-[#EAE5DC] hover:border-[#C6A66B] transition-all cursor-pointer flex flex-col sm:flex-row"
                          >
                            <div
                              className="sm:w-44 h-36 sm:h-auto bg-cover bg-center shrink-0"
                              style={{ backgroundImage: `url(${w.heroImage})` }}
                            />
                            <div className="p-5 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-[#C6A66B] block mb-1">
                                  {w.destination} &bull; {w.guestCount} Guests
                                </span>
                                <h5 className="font-serif text-[20px] text-[#171717] font-normal group-hover:text-[#C6A66B] transition-colors">
                                  {w.title}
                                </h5>
                                <p className="text-[12px] text-[#77736D] mt-1 line-clamp-2">
                                  {w.excerpt}
                                </p>
                              </div>
                              <span className="text-[11px] font-medium uppercase tracking-wider text-[#171717] pt-3 flex items-center gap-1 group-hover:text-[#C6A66B]">
                                View Case Study &rarr;
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Bottom Consultation Banner */}
          <div className="mt-24 p-8 sm:p-14 bg-[#171717] rounded-[12px] text-white text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(198,166,107,0.18)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C6A66B] block mb-2">
                Turnkey Directorship
              </span>
              <h3 className="font-serif text-[32px] sm:text-[44px] text-white font-normal leading-tight">
                Require a Multi-Disciplinary Proposal?
              </h3>
              <p className="text-[14px] sm:text-[15px] text-white/75 mt-3 font-light leading-relaxed">
                Connect directly with our curatorial directors. We synthesize budgeting, venue
                takeovers, decor joinery, and artist bookings into an integrated master proposal.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => navigate('/plan-my-wedding')}
                >
                  Plan My Wedding
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
