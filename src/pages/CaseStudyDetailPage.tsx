import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Button } from '../components/ui/Button';
import { Link, useRouter } from '../lib/router';
import { WEDDINGS_DATA } from '../data/weddings';
import { Modal } from '../components/ui/Modal';
import { SEOHead } from '../components/seo/SEOHead';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Users,
  Calendar,
  Layers,
  Sparkles,
  Quote,
  CheckCircle2,
  Maximize2,
  Share2,
} from 'lucide-react';

export interface CaseStudyDetailPageProps {
  slug: string;
  onOpenLetTalk: () => void;
}

export const CaseStudyDetailPage: React.FC<CaseStudyDetailPageProps> = ({ slug, onOpenLetTalk }) => {
  const { navigate } = useRouter();
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  // Find wedding by slug or fallback
  const wedding =
    WEDDINGS_DATA.find((w) => w.slug === slug || w.id === slug) || WEDDINGS_DATA[0];

  const allImages = [wedding.heroImage, ...(wedding.galleryImages || [])];

  return (
    <div className="w-full flex flex-col">
      <SEOHead
        title={`${wedding.title} — ${wedding.subtitle} at ${wedding.venue}`}
        description={`${wedding.excerpt} Coordinated by The Wedding Dreams across ${wedding.destination}.`}
        canonicalUrl={`https://theweddingdreams.com/our-work/${wedding.slug}`}
        ogImage={wedding.heroImage}
        ogType="article"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Our Work', url: '/our-work' },
          { name: wedding.title, url: `/our-work/${wedding.slug}` },
        ]}
        schemaMarkup={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: `${wedding.title} Celebration`,
          description: wedding.excerpt,
          startDate: `${wedding.year}-11-15T16:00:00+05:30`,
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: wedding.venue,
            address: {
              '@type': 'PostalAddress',
              addressLocality: wedding.destination,
              addressCountry: 'India',
            },
          },
          image: wedding.heroImage,
          organizer: {
            '@type': 'EventPlanningService',
            name: 'The Wedding Dreams',
            url: 'https://theweddingdreams.com',
          },
        }}
      />
      {/* =========================================================================
          1. HERO IMAGE & BREADCRUMB
         ========================================================================= */}
      <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex items-end justify-center overflow-hidden bg-[#171717] text-white">
        {/* Cinematic Hero Background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${wedding.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/50 to-[#171717]/70" />

        {/* Hero Overlay Content */}
        <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[12px] text-white/70 mb-6">
            <Link href="/our-work" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Our Work</span>
            </Link>
            <span>/</span>
            <span className="text-[#C6A66B] uppercase tracking-wider font-medium">
              {wedding.title} Case Study
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-white/10 backdrop-blur-md mb-4 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#F8F5EF]">
              {wedding.eventType || 'Editorial Nuptials'} &bull; {wedding.season} {wedding.year}
            </span>
          </div>

          {/* 2. Couple / Event Name */}
          <h1 className="font-serif text-[42px] sm:text-[62px] lg:text-[76px] font-normal leading-[1.06] text-white tracking-tight">
            {wedding.title}
          </h1>

          <p className="font-serif text-[20px] sm:text-[24px] italic text-[#C6A66B] mt-2 font-light">
            {wedding.subtitle}
          </p>

          {/* Meta Overview Strip: 3. Location, 4. Guest Count, 5. Number of Functions, 6. Wedding Style */}
          <div className="w-full mt-10 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6 text-white">
            {/* 3. Location */}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-medium">
                Location
              </span>
              <span className="font-serif text-[18px] sm:text-[20px] text-white mt-1 leading-snug">
                {wedding.destination}
              </span>
              <span className="text-[12px] text-white/70">{wedding.venue}</span>
            </div>

            {/* 4. Guest Count */}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-medium">
                Guest Count
              </span>
              <span className="font-serif text-[18px] sm:text-[20px] text-white mt-1 leading-snug">
                {wedding.guestCount} Guests
              </span>
              <span className="text-[12px] text-white/70">International &amp; Domestic</span>
            </div>

            {/* 5. Number of Functions */}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-medium">
                Number of Functions
              </span>
              <span className="font-serif text-[18px] sm:text-[20px] text-white mt-1 leading-snug">
                {wedding.functionsCount || wedding.durationDays + 1} Ceremonies
              </span>
              <span className="text-[12px] text-white/70">{wedding.durationDays} Days Residency</span>
            </div>

            {/* 6. Wedding Style */}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-medium">
                Wedding Style
              </span>
              <span className="font-serif text-[18px] sm:text-[20px] text-white mt-1 leading-snug">
                {wedding.weddingStyle || 'Couture Scenography'}
              </span>
              <span className="text-[12px] text-white/70">Haute Curated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Realistic sample data watermark badge */}
      <div className="w-full bg-[#FCFAF6] border-b border-[#EAE5DC] py-2 px-4 text-center">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#77736D] font-medium">
          Editorial Benchmark Showcase &bull; Conceptual Case Study &amp; Scenography Blueprint
        </span>
      </div>

      {/* =========================================================================
          7. THE VISION, 8. THE CONCEPT, 9. THE EXECUTION
         ========================================================================= */}
      <Section variant="ivory" spacing="lg">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Main Narrative Column (8 cols) */}
            <div className="lg:col-span-8 space-y-14">
              {/* 7. The Vision */}
              <div className="bg-white p-8 sm:p-10 rounded-[10px] border border-[#EAE5DC] shadow-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-6 h-px bg-[#C6A66B]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B]">
                    Part 01
                  </span>
                </div>
                <h2 className="font-serif text-[28px] sm:text-[34px] text-[#171717] font-normal">
                  The Vision
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#252525] mt-4 leading-relaxed font-light">
                  {wedding.vision || wedding.excerpt}
                </p>
              </div>

              {/* 8. The Concept */}
              <div className="bg-white p-8 sm:p-10 rounded-[10px] border border-[#EAE5DC] shadow-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-6 h-px bg-[#C6A66B]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B]">
                    Part 02
                  </span>
                </div>
                <h2 className="font-serif text-[28px] sm:text-[34px] text-[#171717] font-normal">
                  The Concept
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#252525] mt-4 leading-relaxed font-light">
                  {wedding.concept || wedding.story}
                </p>
              </div>

              {/* 9. The Execution */}
              <div className="bg-white p-8 sm:p-10 rounded-[10px] border border-[#EAE5DC] shadow-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-6 h-px bg-[#C6A66B]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B]">
                    Part 03
                  </span>
                </div>
                <h2 className="font-serif text-[28px] sm:text-[34px] text-[#171717] font-normal">
                  The Execution
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#252525] mt-4 leading-relaxed font-light">
                  {wedding.execution || wedding.story}
                </p>

                {wedding.quote && (
                  <div className="mt-8 p-6 bg-[#F9F5EB] rounded-[6px] border border-[#E4C284]/40">
                    <Quote className="w-6 h-6 text-[#C6A66B] mb-2 stroke-[1.5]" />
                    <p className="font-serif text-[18px] sm:text-[20px] italic text-[#171717] leading-relaxed">
                      {wedding.quote.text}
                    </p>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-[#C6A66B] font-sans font-medium mt-3 not-italic">
                      &mdash; {wedding.quote.author}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: 11. Services Provided & Press (4 cols) */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
              {/* 11. Services Provided */}
              <div className="bg-white p-7 sm:p-8 rounded-[10px] border border-[#EAE5DC] shadow-xs">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] block mb-2">
                  Atelier Directorship
                </span>
                <h3 className="font-serif text-[22px] text-[#171717] font-normal mb-5">
                  Services Provided
                </h3>

                <ul className="space-y-3 text-[13px] text-[#252525]">
                  {wedding.servicesIncluded.map((srv, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                      <span>{srv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Press Features */}
              {wedding.pressFeatures && wedding.pressFeatures.length > 0 && (
                <div className="bg-[#FAF8F5] p-6 rounded-[8px] border border-[#EAE5DC]">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77736D] block mb-2">
                    Editorial Recognition
                  </span>
                  <div className="space-y-1.5">
                    {wedding.pressFeatures.map((press, i) => (
                      <div key={i} className="font-serif text-[15px] italic text-[#171717]">
                        &bull; {press}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Inquiry Box */}
              <div className="bg-[#171717] p-7 rounded-[10px] text-white space-y-4">
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#C6A66B] block">
                  Replicate This Standard
                </span>
                <h4 className="font-serif text-[20px] text-white font-normal leading-snug">
                  Envisioning a similar celebration in {wedding.destination}?
                </h4>
                <p className="text-[12px] text-white/70 leading-relaxed font-light">
                  Our producers can verify property availability, runway access, and logistical
                  feasibility for your prospective dates.
                </p>
                <Button
                  variant="accent"
                  size="md"
                  className="w-full"
                  onClick={onOpenLetTalk}
                >
                  Consult On This Venue Style
                </Button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              10. IMAGE / VIDEO GALLERY
             ========================================================================= */}
          <div className="mt-24 pt-16 border-t border-[#EAE5DC]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C6A66B] block mb-1">
                  Archival Scenography
                </span>
                <h3 className="font-serif text-[32px] sm:text-[42px] text-[#171717] font-normal">
                  Celebration Gallery &amp; Film Stills
                </h3>
              </div>
              <span className="text-[12px] text-[#77736D]">
                Click any image to view in fine-art fullscreen
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allImages.map((imgSrc, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedGalleryImage(imgSrc)}
                  className="group relative h-72 rounded-[8px] overflow-hidden bg-cover bg-center cursor-pointer border border-[#EAE5DC] shadow-xs hover:shadow-lg transition-all"
                  style={{ backgroundImage: `url(${imgSrc})` }}
                >
                  <div className="absolute inset-0 bg-[#171717]/30 group-hover:bg-[#171717]/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-[#171717] flex items-center justify-center shadow-lg">
                      <Maximize2 className="w-4 h-4 text-[#C6A66B]" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-[10px] uppercase tracking-wider text-white font-medium bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-[3px] self-start inline-block">
                    Frame 0{i + 1} &bull; {wedding.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              12. FINAL CTA
              Heading: "Planning something of your own?"
              Button: "Create My Wedding Plan"
             ========================================================================= */}
          <div className="mt-28 p-10 sm:p-16 bg-[#171717] rounded-[12px] text-white text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,166,107,0.18)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C6A66B] block mb-3">
                Commence Your Vision
              </span>

              <h3 className="font-serif text-[34px] sm:text-[48px] text-white font-normal leading-tight">
                Planning something of your own?
              </h3>

              <p className="text-[14px] sm:text-[16px] text-white/80 mt-4 font-light leading-relaxed">
                Receive an algorithmic starting plan, curated property allocations, and preliminary
                ceremonial run-of-show calibrated to your guest count and aesthetic desires.
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

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={onOpenLetTalk}
                >
                  Schedule Directorial Call
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* Lightbox Modal */}
      {selectedGalleryImage && (
        <Modal
          isOpen={!!selectedGalleryImage}
          onClose={() => setSelectedGalleryImage(null)}
          title={wedding.title}
          subtitle={`${wedding.destination} • Fine Art Still`}
          maxWidth="4xl"
        >
          <div className="relative w-full aspect-[16/10] rounded-[6px] overflow-hidden bg-black flex items-center justify-center">
            <img
              src={selectedGalleryImage}
              alt={wedding.title}
              className="w-full h-full object-contain"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
