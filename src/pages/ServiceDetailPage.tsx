import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Button } from '../components/ui/Button';
import { Link, useRouter } from '../lib/router';
import { SERVICES_DATA } from '../data/services';
import { WEDDINGS_DATA } from '../data/weddings';
import { SEOHead } from '../components/seo/SEOHead';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export interface ServiceDetailPageProps {
  slug: string;
  onOpenLetTalk: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, onOpenLetTalk }) => {
  const { navigate } = useRouter();

  const service = SERVICES_DATA.find((s) => s.slug === slug || s.id === slug) || SERVICES_DATA[0];

  const relatedWeddings = WEDDINGS_DATA.filter((w) =>
    service.relatedPortfolioSlugs?.includes(w.slug)
  );

  return (
    <div className="w-full flex flex-col">
      <SEOHead
        title={`${service.title} — Directorial Curation`}
        description={`${service.shortDescription} Multi-day destination execution and sensory scenography.`}
        canonicalUrl={`https://theweddingdreams.com/services/${service.slug}`}
        ogImage={service.heroImage}
        ogType="article"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: service.title, url: `/services/${service.slug}` },
        ]}
        schemaMarkup={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `${service.title} — The Wedding Dreams`,
          serviceType: service.title,
          description: service.fullDescription || service.shortDescription,
          provider: {
            '@type': 'EventPlanningService',
            name: 'The Wedding Dreams',
            url: 'https://theweddingdreams.com',
          },
          image: service.heroImage,
          areaServed: ['India', 'Italy', 'UAE', 'Worldwide'],
        }}
      />
      {/* =========================================================================
          HERO BANNER
         ========================================================================= */}
      <section className="relative w-full bg-[#171717] text-white py-20 sm:py-28 overflow-hidden border-b border-[#252525]">
        {/* Background Visual Asset with Vignette */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${service.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/80 to-[#171717]/60" />

        <PageContainer>
          <div className="relative z-10 max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[12px] text-white/60 mb-6">
              <Link href="/services" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Services</span>
              </Link>
              <span>/</span>
              <span className="text-[#C6A66B] uppercase tracking-wider font-medium">
                {service.number}. {service.title}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-white/10 backdrop-blur-md mb-4 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C6A66B]">
                Capability {service.number} &bull; Specialized Discipline
              </span>
            </div>

            <h1 className="font-serif text-[42px] sm:text-[58px] lg:text-[66px] font-normal leading-[1.08] text-white tracking-tight">
              {service.title}
            </h1>

            <p className="text-[16px] sm:text-[18px] text-white/85 mt-5 font-light leading-relaxed max-w-2xl">
              {service.shortDescription}
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

              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/15"
                onClick={onOpenLetTalk}
              >
                Inquire With Director
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* =========================================================================
          DETAILED OVERVIEW & PHILOSOPHY
         ========================================================================= */}
      <Section variant="ivory" spacing="lg">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-10">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] block mb-2">
                  Directorial Standard
                </span>
                <h2 className="font-serif text-[32px] sm:text-[40px] text-[#171717] font-normal leading-tight">
                  The Discipline of {service.title}
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#252525] mt-4 leading-relaxed font-light">
                  {service.fullDescription}
                </p>
              </div>

              {/* What is Included */}
              <div className="bg-white p-8 sm:p-10 rounded-[10px] border border-[#EAE5DC] shadow-xs">
                <h3 className="font-serif text-[24px] text-[#171717] font-normal mb-6 flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-[#C6A66B]" />
                  What Is Included in This Discipline
                </h3>

                <ul className="space-y-4 text-[14px] text-[#252525]">
                  {service.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Planning Process */}
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] block mb-1">
                    Systematic Framework
                  </span>
                  <h3 className="font-serif text-[28px] text-[#171717] font-normal">
                    The Planning Process
                  </h3>
                </div>

                <div className="space-y-4">
                  {service.planningProcess.map((proc, i) => (
                    <div
                      key={proc.step}
                      className="bg-white p-6 rounded-[8px] border border-[#EAE5DC] shadow-xs flex flex-col sm:flex-row sm:items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-[6px] bg-[#F8F5EF] text-[#C6A66B] font-mono text-[13px] font-semibold flex items-center justify-center shrink-0">
                        {proc.step.replace('Phase ', '0')}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#C6A66B] font-semibold block">
                          {proc.step}
                        </span>
                        <h4 className="font-serif text-[20px] text-[#171717] font-normal mt-0.5">
                          {proc.title}
                        </h4>
                        <p className="text-[13px] text-[#77736D] mt-1.5 leading-relaxed font-light">
                          {proc.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              {/* Highlight Card */}
              <div className="bg-white p-8 rounded-[10px] border border-[#EAE5DC] shadow-sm space-y-6">
                <div
                  className="w-full h-52 rounded-[6px] bg-cover bg-center border border-[#EAE5DC]"
                  style={{ backgroundImage: `url(${service.heroImage})` }}
                />

                {service.featuredQuote && (
                  <div className="p-5 bg-[#F9F5EB] rounded-[6px] border border-[#E4C284]/40">
                    <p className="font-serif text-[17px] italic text-[#171717] leading-snug">
                      {service.featuredQuote}
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] block mt-2 font-medium">
                      Atelier Retrospective
                    </span>
                  </div>
                )}

                <div className="space-y-3 pt-2 text-[13px]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
                    <span className="text-[#77736D]">Ideal Celebration Scale</span>
                    <span className="font-medium text-[#171717]">100 &ndash; 1,000+ Guests</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
                    <span className="text-[#77736D]">Directorial Ratio</span>
                    <span className="font-medium text-[#171717]">1:1 Dedicated Producer</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#77736D]">Lead Time Recommendation</span>
                    <span className="font-medium text-[#171717]">4 &ndash; 12 Months</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAE5DC] space-y-3">
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full"
                    onClick={() => navigate('/plan-my-wedding')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Plan My Wedding
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={onOpenLetTalk}
                  >
                    Inquire About {service.title}
                  </Button>
                </div>
              </div>

              {/* Other Services Quick Links */}
              <div className="bg-[#FAF8F5] p-6 rounded-[8px] border border-[#EAE5DC]">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#171717] mb-3">
                  Explore Other Disciplines
                </h4>
                <div className="space-y-2 text-[13px]">
                  {SERVICES_DATA.filter((s) => s.id !== service.id).map((other) => (
                    <Link
                      key={other.id}
                      href={`/services/${other.slug}`}
                      className="flex items-center justify-between py-1.5 text-[#77736D] hover:text-[#C6A66B] transition-colors"
                    >
                      <span>
                        {other.number}. {other.title}
                      </span>
                      <span>&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Case Studies */}
          {relatedWeddings.length > 0 && (
            <div className="mt-24 pt-16 border-t border-[#EAE5DC]">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] block mb-1">
                  Demonstrated Artistry
                </span>
                <h3 className="font-serif text-[32px] sm:text-[38px] text-[#171717] font-normal">
                  Celebrations Featuring {service.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedWeddings.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => navigate(`/our-work/${w.slug}`)}
                    className="group bg-white rounded-[8px] overflow-hidden border border-[#EAE5DC] hover:border-[#C6A66B] transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className="w-full h-64 bg-cover bg-center"
                        style={{ backgroundImage: `url(${w.heroImage})` }}
                      />
                      <div className="p-7">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
                          {w.destination} &bull; {w.guestCount} Guests
                        </span>
                        <h4 className="font-serif text-[26px] text-[#171717] font-normal group-hover:text-[#C6A66B] transition-colors">
                          {w.title}
                        </h4>
                        <p className="text-[13px] text-[#77736D] mt-2 leading-relaxed line-clamp-2">
                          {w.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-7 pb-6 pt-3 border-t border-[#EAE5DC] flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-[#C6A66B]">
                      <span>View Full Case Study</span>
                      <span>&rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </PageContainer>
      </Section>
    </div>
  );
};
