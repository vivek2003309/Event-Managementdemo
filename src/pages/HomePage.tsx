import React, { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { Button } from '../components/ui/Button';
import { ServiceCard } from '../components/cards/ServiceCard';
import { PortfolioCard } from '../components/cards/PortfolioCard';
import { DestinationCard } from '../components/cards/DestinationCard';
import { TestimonialCard } from '../components/cards/TestimonialCard';
import { Modal } from '../components/ui/Modal';
import { SERVICES_DATA } from '../data/services';
import { WEDDINGS_DATA } from '../data/weddings';
import { DESTINATIONS_DATA } from '../data/destinations';
import { TESTIMONIALS_DATA } from '../data/testimonials';
import { STYLE_ARCHETYPES } from '../data/styleArchetypes';
import { Service, Wedding, Destination, Testimonial } from '../types';
import { SEOHead } from '../components/seo/SEOHead';
import { CinematicHero } from '../components/home/CinematicHero';
import { Reveal, RevealStagger } from '../components/ui/Reveal';
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  BookOpen,
  Calendar,
  Compass,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  Award,
  Users,
  Building,
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
  Camera,
  MapPin,
} from 'lucide-react';

export interface HomePageProps {
  onOpenLetTalk: () => void;
  preloaderComplete?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenLetTalk, preloaderComplete }) => {
  const { navigate } = useRouter();

  // Modal states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null);
  const [selectedVideoTestimonial, setSelectedVideoTestimonial] = useState<Testimonial | null>(null);

  // Hero reveal choreography coordinated with luxury preloader
  const [isHeroRevealed, setIsHeroRevealed] = useState<boolean>(() => {
    return !!preloaderComplete;
  });

  useEffect(() => {
    const handlePreloaderExit = () => {
      setIsHeroRevealed(true);
    };

    const handlePreloaderStart = () => {
      setIsHeroRevealed(false);
    };

    window.addEventListener('preloaderFinished', handlePreloaderExit);
    window.addEventListener('atelier-preloader-exit', handlePreloaderExit);
    window.addEventListener('atelier-preloader-start', handlePreloaderStart);

    if (preloaderComplete) {
      setIsHeroRevealed(true);
    }

    return () => {
      window.removeEventListener('preloaderFinished', handlePreloaderExit);
      window.removeEventListener('atelier-preloader-exit', handlePreloaderExit);
      window.removeEventListener('atelier-preloader-start', handlePreloaderStart);
    };
  }, [preloaderComplete]);

  // Portfolio filter state: All | Weddings | Destination | Sangeet | Reception | Engagement
  const [portfolioFilter, setPortfolioFilter] = useState<string>('All');

  // Filtered portfolio
  const filteredWeddings = WEDDINGS_DATA.filter((w) => {
    if (portfolioFilter === 'All') return true;
    if (portfolioFilter === 'Weddings') return w.tags?.includes('Weddings') || w.category === 'Weddings';
    if (portfolioFilter === 'Destination') return w.tags?.includes('Destination') || w.category === 'Destination';
    if (portfolioFilter === 'Sangeet') return w.tags?.includes('Sangeet') || w.category === 'Sangeet';
    if (portfolioFilter === 'Reception') return w.tags?.includes('Reception') || w.category === 'Reception';
    if (portfolioFilter === 'Engagement') return w.tags?.includes('Engagement') || w.category === 'Engagement';
    return true;
  });

  // Top 3 Destinations for Homepage: Udaipur, Jaipur, Goa
  const featuredDestinations = DESTINATIONS_DATA.filter((d) =>
    ['udaipur', 'jaipur', 'goa'].includes(d.id)
  );

  return (
    <div className="w-full flex flex-col">
      <SEOHead
        title="The Wedding Dreams — Couture & Scenography"
        description="Couture & scenography for luxury destination weddings, heritage palace takeovers, and bespoke bridal celebrations across Udaipur, Jaipur, Goa, and Lake Como."
        canonicalUrl="https://theweddingdreams.com"
      />
      {/* =========================================================================
          2. FULLSCREEN CINEMATIC AMBIENT HERO
          Clean, high-performance fullscreen ambient video hero section
         ========================================================================= */}
      <CinematicHero
        onOpenLetTalk={onOpenLetTalk}
        isHeroRevealed={isHeroRevealed}
        preloaderComplete={preloaderComplete}
      />

      {/* =========================================================================
          3. BRAND STORY
          Two-column editorial section with image & 'Discover Our Approach' CTA
         ========================================================================= */}
      <Section variant="ivory" spacing="lg" id="brand-story">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative">
              <Reveal animation="slide-right" duration={900}>
                <div className="relative bg-white p-3 rounded-[8px] border border-[#EAE5DC] shadow-[0_16px_40px_-10px_rgba(23,23,23,0.06)]">
                  <div
                    className="w-full aspect-[4/5] rounded-[6px] bg-cover bg-center overflow-hidden"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1080&q=85')",
                    }}
                  />

                  {/* Editorial Sub-Matting Badge */}
                  <div className="absolute -bottom-5 -right-5 bg-[#171717] text-white p-5 rounded-[8px] shadow-2xl max-w-xs hidden sm:block border border-[#C6A66B]/30">
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#C6A66B] block mb-1">
                      Couture Standard
                    </span>
                    <p className="font-serif text-[17px] italic text-white leading-tight">
                      &ldquo;Where heritage grandeur meets quiet modern restraint.&rdquo;
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Typography & Brand Narrative */}
            <div className="lg:col-span-6 flex flex-col justify-center lg:pl-4">
              <Reveal animation="slide-up" delay={150} duration={900}>
                <div className="inline-flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-[1px] bg-[#C6A66B]" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C6A66B]">
                    Brand Philosophy
                  </span>
                </div>

                <h2 className="font-serif text-[34px] sm:text-[46px] font-normal leading-[1.14] text-[#171717] text-balance">
                  Every celebration should feel uniquely yours.
                </h2>

                <div className="mt-6 space-y-4 text-[14px] sm:text-[15px] text-[#77736D] leading-relaxed font-light">
                  <p>
                    At The Wedding Dreams, we believe that true luxury does not shout; it resonates. We
                    discard cookie-cutter banquet formats and commercial clutter in favor of bespoke
                    wedding scenography that honors both sacred ancestral rituals and your intimate romance.
                  </p>
                  <p>
                    Every fabric swatch, acoustic delay tower, floral scent profile, and hand-lettered
                    menu is curated under single-point directorial command. From private island takeovers
                    to historic hilltop fortresses, we craft living works of art that linger in family memory
                    for generations.
                  </p>
                </div>

                <div className="mt-8 pt-2">
                  <button
                    onClick={() => navigate('/about')}
                    className="inline-flex items-center text-[12px] font-medium uppercase tracking-[0.18em] text-[#171717] hover:text-[#C6A66B] transition-colors group cursor-pointer"
                  >
                    <span className="border-b border-[#171717] pb-0.5 group-hover:border-[#C6A66B]">
                      Discover Our Approach
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1 text-[#C6A66B]" />
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* =========================================================================
          4. CHOOSE YOUR CELEBRATION
          Heading: "What are you planning?" with 4 visual cards linking to planning
         ========================================================================= */}
      <Section variant="surface-low" spacing="lg" id="celebration-types">
        <PageContainer>
          <Reveal animation="slide-up">
            <SectionHeading
              kicker="Curated Formats"
              title="What are you planning?"
              subtitle="Explore our tailored event architectures, designed from intimate family gatherings to grand multi-day celebrations."
            />
          </Reveal>

          <RevealStagger
            staggerDelay={120}
            baseDelay={100}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Card 1: Wedding */}
            <div className="group bg-white rounded-[8px] p-6 border border-[#EAE5DC] shadow-sm hover:shadow-xl hover:border-[#D6CEBE] transition-all flex flex-col justify-between">
              <div>
                <div
                  className="h-44 w-full rounded-[6px] bg-cover bg-center mb-5 overflow-hidden"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1080&q=85')",
                  }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
                  Format 01
                </span>
                <h3 className="font-serif text-[24px] text-[#171717] font-normal">
                  Wedding
                </h3>
                <p className="text-[13px] text-[#77736D] mt-2 leading-relaxed font-light">
                  Complete end-to-end multi-day curation, ceremonial sanctums, guest concierges,
                  and bridal styling.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DC]">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/plan-my-wedding?format=full-wedding')}
                >
                  Plan Wedding &rarr;
                </Button>
              </div>
            </div>

            {/* Card 2: Engagement */}
            <div className="group bg-white rounded-[8px] p-6 border border-[#EAE5DC] shadow-sm hover:shadow-xl hover:border-[#D6CEBE] transition-all flex flex-col justify-between">
              <div>
                <div
                  className="h-44 w-full rounded-[6px] bg-cover bg-center mb-5 overflow-hidden"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1080&q=85')",
                  }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
                  Format 02
                </span>
                <h3 className="font-serif text-[24px] text-[#171717] font-normal">
                  Engagement
                </h3>
                <p className="text-[13px] text-[#77736D] mt-2 leading-relaxed font-light">
                  Ancestral Roka gatherings, bespoke Sommelier tastings, artistic floral pavilions,
                  and warm family narratives.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DC]">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/plan-my-wedding?format=engagement-roka')}
                >
                  Plan Engagement &rarr;
                </Button>
              </div>
            </div>

            {/* Card 3: Reception */}
            <div className="group bg-white rounded-[8px] p-6 border border-[#EAE5DC] shadow-sm hover:shadow-xl hover:border-[#D6CEBE] transition-all flex flex-col justify-between">
              <div>
                <div
                  className="h-44 w-full rounded-[6px] bg-cover bg-center mb-5 overflow-hidden"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1080&q=85')",
                  }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
                  Format 03
                </span>
                <h3 className="font-serif text-[24px] text-[#171717] font-normal">
                  Reception
                </h3>
                <p className="text-[13px] text-[#77736D] mt-2 leading-relaxed font-light">
                  Concert-grade acoustic staging, kinetic chandelier illumination, live orchestras,
                  and choreographed club lounges.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DC]">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/plan-my-wedding?format=reception-sangeet')}
                >
                  Plan Reception &rarr;
                </Button>
              </div>
            </div>

            {/* Card 4: Destination Wedding */}
            <div className="group bg-white rounded-[8px] p-6 border border-[#EAE5DC] shadow-sm hover:shadow-xl hover:border-[#D6CEBE] transition-all flex flex-col justify-between">
              <div>
                <div
                  className="h-44 w-full rounded-[6px] bg-cover bg-center mb-5 overflow-hidden"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1080&q=85')",
                  }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
                  Format 04
                </span>
                <h3 className="font-serif text-[24px] text-[#171717] font-normal">
                  Destination Wedding
                </h3>
                <p className="text-[13px] text-[#77736D] mt-2 leading-relaxed font-light">
                  Private palace takeovers, cliff-edge coastal retreats, private charters, and
                  multilingual guest hospitality.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DC]">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/destinations')}
                >
                  Explore Destinations &rarr;
                </Button>
              </div>
            </div>
          </RevealStagger>
        </PageContainer>
      </Section>

      {/* =========================================================================
          5. SERVICES
          Heading: "Everything Under One Roof" with 6 premium service cards
         ========================================================================= */}
      <Section variant="ivory" spacing="lg" id="services-section">
        <PageContainer>
          <Reveal animation="slide-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-6 h-[1px] bg-[#C6A66B]" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C6A66B]">
                    Our Capabilities
                  </span>
                </div>
                <h2 className="font-serif text-[36px] sm:text-[46px] font-normal text-[#171717] tracking-tight">
                  Everything Under One Roof
                </h2>
              </div>
              <p className="text-[14px] text-[#77736D] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
                Haute couture event architecture meets white-glove logistics across every discipline
                of your nuptials.
              </p>
            </div>
          </Reveal>

          <RevealStagger
            staggerDelay={100}
            baseDelay={100}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {SERVICES_DATA.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onExplore={(srv) => setSelectedService(srv)}
              />
            ))}
          </RevealStagger>
        </PageContainer>
      </Section>

      {/* =========================================================================
          6. OUR WORK
          Dark editorial portfolio section with filter chips & premium portfolio cards
         ========================================================================= */}
      <section className="w-full bg-[#171717] text-[#F8F5EF] py-24 border-t border-[#252525]" id="our-work-section">
        <PageContainer>
          <Reveal animation="slide-up">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C6A66B] block mb-2">
                Curated Portfolio
              </span>
              <h2 className="font-serif text-[38px] sm:text-[50px] font-normal text-white leading-tight">
                Our Work
              </h2>
              <p className="text-[14px] sm:text-[15px] text-white/70 mt-3 font-light leading-relaxed">
                A private retrospective of multi-day celebrations executed across royal palaces,
                clifftop estates, and modern glass pavilions.
              </p>
            </div>

            {/* Filter Chips: All, Weddings, Destination, Sangeet, Reception, Engagement */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-14">
              {['All', 'Weddings', 'Destination', 'Sangeet', 'Reception', 'Engagement'].map((chip) => {
                const active = portfolioFilter === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setPortfolioFilter(chip)}
                    className={`px-5 py-2 rounded-[4px] text-[11px] font-medium uppercase tracking-[0.16em] transition-all cursor-pointer ${
                      active
                        ? 'bg-[#C6A66B] text-white shadow-md'
                        : 'bg-white/5 border border-white/10 text-white/75 hover:border-[#C6A66B]/60 hover:text-white'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Portfolio Grid */}
          <RevealStagger
            staggerDelay={120}
            baseDelay={100}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {filteredWeddings.map((wedding) => (
              <PortfolioCard
                key={wedding.id}
                wedding={wedding}
                variant="dark"
                onViewStory={(w) => setSelectedWedding(w)}
              />
            ))}
          </RevealStagger>

          <Reveal animation="fade" delay={200} className="mt-14 text-center">
            <button
              onClick={() => navigate('/our-work')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] border border-white/20 text-white text-[11px] font-medium uppercase tracking-[0.18em] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>Explore Complete Archives</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
            </button>
          </Reveal>
        </PageContainer>
      </section>

      {/* =========================================================================
          7. DESTINATIONS
          Heading: "Celebrate Somewhere Extraordinary" with Udaipur, Jaipur, Goa
         ========================================================================= */}
      <Section variant="ivory" spacing="lg" id="destinations-section">
        <PageContainer>
          <Reveal animation="slide-up">
            <SectionHeading
              kicker="Curated Enclaves"
              title="Celebrate Somewhere Extraordinary"
              subtitle="Iconic destinations where heritage architecture and secluded landscapes frame your love story."
            />
          </Reveal>

          <RevealStagger
            staggerDelay={140}
            baseDelay={100}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {featuredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onSelect={() => navigate('/destinations')}
              />
            ))}
          </RevealStagger>

          <Reveal animation="fade" delay={200} className="mt-12 text-center">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/destinations')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All Destination Enclaves
            </Button>
          </Reveal>
        </PageContainer>
      </Section>

      {/* =========================================================================
          8. PLAN YOUR WEDDING CTA
          Visually rich split section promoting: "Turn Your Vision Into a Plan"
         ========================================================================= */}
      <Section variant="surface-low" spacing="lg" id="plan-wedding-cta">
        <PageContainer>
          <Reveal animation="slide-up" duration={850}>
            <div className="bg-white rounded-[12px] border border-[#EAE5DC] shadow-[0_20px_50px_rgba(23,23,23,0.06)] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Left Content Column (7 cols) */}
                <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className="w-6 h-[1px] bg-[#C6A66B]" />
                      <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C6A66B]">
                        Curatorial Planning
                      </span>
                    </div>

                    <h2 className="font-serif text-[34px] sm:text-[46px] font-normal text-[#171717] leading-[1.12]">
                      Turn Your Vision Into a Plan
                    </h2>

                    <p className="text-[14px] sm:text-[15px] text-[#77736D] mt-4 leading-relaxed font-light">
                      Answer a few essential questions about your celebration style, guest list, and
                      dream location, and our atelier will generate a personalized starting roadmap
                      including venue allocations, recommended seasons, and ceremony timelines.
                    </p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#EAE5DC] pt-6">
                      <div className="flex flex-col">
                        <span className="font-serif text-[22px] text-[#171717]">Step 01</span>
                        <span className="text-[12px] text-[#77736D] mt-0.5">Select destination &amp; format</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif text-[22px] text-[#171717]">Step 02</span>
                        <span className="text-[12px] text-[#77736D] mt-0.5">Calibrate guest scale</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif text-[22px] text-[#171717]">Step 03</span>
                        <span className="text-[12px] text-[#77736D] mt-0.5">Instant bespoke roadmap</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={() => navigate('/plan-my-wedding')}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Start Planning
                    </Button>

                    <button
                      onClick={onOpenLetTalk}
                      className="text-[12px] uppercase tracking-wider text-[#77736D] hover:text-[#171717] font-medium py-2 px-3 transition-colors cursor-pointer"
                    >
                      Prefer to speak first? Schedule Call
                    </button>
                  </div>
                </div>

                {/* Right Visual Frame Column (5 cols) */}
                <div
                  className="lg:col-span-5 min-h-[300px] lg:min-h-full bg-cover bg-center relative"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1080&q=85')",
                  }}
                >
                  <div className="absolute inset-0 bg-[#171717]/40 backdrop-blur-[1px] p-8 flex flex-col justify-end text-white">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-medium">
                      Atelier Standard
                    </span>
                    <p className="font-serif text-[20px] font-normal leading-snug mt-1">
                      &ldquo;The architectural roadmap brought total peace of mind months before our guests arrived.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </PageContainer>
      </Section>

      {/* =========================================================================
          9. WEDDING STYLE QUIZ PROMO
          Heading: "What's Your Dream Wedding Style?"
         ========================================================================= */}
      <Section variant="ivory" spacing="lg" id="style-quiz-promo">
        <PageContainer>
          <Reveal animation="slide-up" duration={850}>
            <div className="bg-white rounded-[12px] p-8 sm:p-12 border border-[#EAE5DC] shadow-[0_16px_40px_-10px_rgba(23,23,23,0.05)]">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C6A66B] block mb-2">
                  Visual Diagnostic
                </span>
                <h2 className="font-serif text-[32px] sm:text-[44px] text-[#171717] font-normal leading-tight">
                  What&apos;s Your Dream Wedding Style?
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#77736D] mt-3 font-light leading-relaxed">
                  Take our 60-second visual style quiz to discover your bespoke aesthetic archetype,
                  custom color palette, and curated venue recommendations.
                </p>
              </div>

              {/* Visual Archetype Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {STYLE_ARCHETYPES.map((arch) => (
                  <div
                    key={arch.id}
                    onClick={() => navigate('/wedding-style')}
                    className="group bg-[#F8F5EF] p-5 rounded-[8px] border border-[#EAE5DC] hover:border-[#C6A66B] hover:bg-[#F9F5EB] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-full bg-[#171717] text-[#C6A66B] flex items-center justify-center font-serif text-[14px] mb-3 group-hover:scale-105 transition-transform">
                        {arch.code}
                      </div>
                      <h4 className="font-serif text-[19px] text-[#171717] font-normal">
                        {arch.name}
                      </h4>
                      <p className="text-[12px] text-[#77736D] mt-1.5 leading-relaxed line-clamp-2">
                        {arch.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-4 mt-3 border-t border-[#EAE5DC]">
                      {arch.palette.map((swatch) => (
                        <div
                          key={swatch.name}
                          className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: swatch.hex }}
                          title={swatch.name}
                        />
                      ))}
                      <span className="text-[10px] text-[#77736D] ml-auto uppercase tracking-wider">
                        Palette &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => navigate('/wedding-style')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Take the Quiz
                </Button>
              </div>
            </div>
          </Reveal>
        </PageContainer>
      </Section>

      {/* =========================================================================
          10. TESTIMONIALS
          Premium testimonial section with client quote, couple name, location, event type
         ========================================================================= */}
      <Section variant="surface-low" spacing="lg" id="testimonials-section">
        <PageContainer>
          <Reveal animation="slide-up">
            <SectionHeading
              kicker="Praise & Gratitude"
              title="Voices of Our Couples"
              subtitle="Authentic reflections from families and couples who entrusted their once-in-a-lifetime milestones to our directorship."
            />
          </Reveal>

          <RevealStagger
            staggerDelay={120}
            baseDelay={100}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {TESTIMONIALS_DATA.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onPlayVideo={(t) => setSelectedVideoTestimonial(t)}
              />
            ))}
          </RevealStagger>
        </PageContainer>
      </Section>

      {/* =========================================================================
          11. WHY CHOOSE US
          Verified statistics only & 4 proof points
         ========================================================================= */}
      <Section variant="ivory" spacing="lg" id="why-choose-us">
        <PageContainer>
          <Reveal animation="slide-up">
            <SectionHeading
              kicker="Proven Distinction"
              title="Why Choose The Wedding Dreams"
              subtitle="Rigor, discretion, and directorial immersion that set the benchmark in modern Indian and destination nuptials."
            />
          </Reveal>

          <RevealStagger
            staggerDelay={100}
            baseDelay={100}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Proof Point 1 */}
            <div className="bg-white p-7 rounded-[8px] border border-[#EAE5DC] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-[6px] bg-[#F8F5EF] text-[#C6A66B] flex items-center justify-center mb-5">
                  <Award className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="font-serif text-[28px] text-[#171717] font-normal leading-none block mb-2">
                  15+ Years
                </span>
                <h4 className="font-serif text-[18px] text-[#171717] font-medium leading-snug">
                  Directorial Mastery
                </h4>
                <p className="text-[13px] text-[#77736D] mt-2.5 leading-relaxed font-light">
                  Over 350+ multi-day luxury celebrations orchestrated across heritage palaces and
                  coastal estates with zero logistics defaults.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#EAE5DC] text-[11px] text-[#C6A66B] uppercase tracking-wider font-medium">
                Verified Benchmark
              </div>
            </div>

            {/* Proof Point 2 */}
            <div className="bg-white p-7 rounded-[8px] border border-[#EAE5DC] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-[6px] bg-[#F8F5EF] text-[#C6A66B] flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="font-serif text-[28px] text-[#171717] font-normal leading-none block mb-2">
                  100% Direct
                </span>
                <h4 className="font-serif text-[18px] text-[#171717] font-medium leading-snug">
                  Atelier Control
                </h4>
                <p className="text-[13px] text-[#77736D] mt-2.5 leading-relaxed font-light">
                  Zero third-party broker markups. Single-point directorial governance across
                  culinary ateliers, florals, lighting, and sound delay systems.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#EAE5DC] text-[11px] text-[#C6A66B] uppercase tracking-wider font-medium">
                Transparent Governance
              </div>
            </div>

            {/* Proof Point 3 */}
            <div className="bg-white p-7 rounded-[8px] border border-[#EAE5DC] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-[6px] bg-[#F8F5EF] text-[#C6A66B] flex items-center justify-center mb-5">
                  <Heart className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="font-serif text-[28px] text-[#171717] font-normal leading-none block mb-2">
                  Max 12
                </span>
                <h4 className="font-serif text-[18px] text-[#171717] font-medium leading-snug">
                  Weddings Annually
                </h4>
                <p className="text-[13px] text-[#77736D] mt-2.5 leading-relaxed font-light">
                  We deliberately cap our annual production calendar so our principal directorship is
                  immersed full-time on site for your celebration.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#EAE5DC] text-[11px] text-[#C6A66B] uppercase tracking-wider font-medium">
                Curated Exclusivity
              </div>
            </div>

            {/* Proof Point 4 */}
            <div className="bg-white p-7 rounded-[8px] border border-[#EAE5DC] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-[6px] bg-[#F8F5EF] text-[#C6A66B] flex items-center justify-center mb-5">
                  <Building className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="font-serif text-[28px] text-[#171717] font-normal leading-none block mb-2">
                  24/7 VIP
                </span>
                <h4 className="font-serif text-[18px] text-[#171717] font-medium leading-snug">
                  Diplomatic Protocol
                </h4>
                <p className="text-[13px] text-[#77736D] mt-2.5 leading-relaxed font-light">
                  Bespoke air charter liaisons, municipal heritage sound clearances, round-the-clock
                  guest desks, and discreet security units.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#EAE5DC] text-[11px] text-[#C6A66B] uppercase tracking-wider font-medium">
                White-Glove Protocol
              </div>
            </div>
          </RevealStagger>
        </PageContainer>
      </Section>

      {/* =========================================================================
          12. FINAL CTA
          Dark cinematic section: "Let's Create Something Unforgettable."
         ========================================================================= */}
      <section className="relative w-full bg-[#171717] text-white py-28 overflow-hidden border-t border-[#252525]">
        {/* Subtle background ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,166,107,0.12)_0%,transparent_70%)] pointer-events-none" />

        <PageContainer>
          <Reveal animation="slide-up" duration={900}>
            <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C6A66B] block mb-3">
                Commence Your Journey
              </span>

              <h2 className="font-serif text-[40px] sm:text-[56px] lg:text-[64px] font-normal text-white leading-[1.08] text-balance">
                Let&apos;s Create Something Unforgettable.
              </h2>

              <p className="text-[15px] sm:text-[17px] text-white/80 max-w-xl mt-5 font-light leading-relaxed">
                Whether you are envisioning a historic palace takeover in Rajasthan or a private coastal
                retreat, our directors are here to bring clarity, calm, and sublime beauty to your vision.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/plan-my-wedding')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Plan My Wedding
                </Button>

                <Button
                  variant="glass"
                  size="lg"
                  className="w-full sm:w-auto text-white font-medium tracking-wider cursor-pointer"
                  onClick={onOpenLetTalk}
                >
                  Talk To Our Team
                </Button>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-8 text-[12px] text-white/60">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A66B]" />
                  Direct Atelier Response within 12 Hours
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A66B]" />
                  Complete Confidentiality &amp; NDA Standard
                </span>
              </div>
            </div>
          </Reveal>
        </PageContainer>
      </section>

      {/* =========================================================================
          MODALS
         ========================================================================= */}
      {/* Service Detail Modal */}
      {selectedService && (
        <Modal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          title={selectedService.title}
          subtitle={`Capability ${selectedService.number}`}
          maxWidth="xl"
          footer={
            <Button
              variant="accent"
              size="md"
              onClick={() => {
                setSelectedService(null);
                onOpenLetTalk();
              }}
            >
              Inquire About {selectedService.title}
            </Button>
          }
        >
          <div className="space-y-4">
            <p className="text-[15px] leading-relaxed text-[#252525]">
              {selectedService.fullDescription}
            </p>

            <div className="pt-2">
              <h5 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B] mb-2.5">
                Bespoke Inclusions &amp; Standards
              </h5>
              <ul className="space-y-2 text-[13px] text-[#77736D]">
                {selectedService.inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedService.featuredQuote && (
              <div className="p-4 bg-[#F8F5EF] rounded-[6px] border border-[#EAE5DC] italic font-serif text-[16px] text-[#171717]">
                {selectedService.featuredQuote}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Wedding Story Modal */}
      {selectedWedding && (
        <Modal
          isOpen={!!selectedWedding}
          onClose={() => setSelectedWedding(null)}
          title={selectedWedding.title}
          subtitle={`${selectedWedding.subtitle} &bull; ${selectedWedding.destination}`}
          maxWidth="2xl"
          footer={
            <Button
              variant="accent"
              size="md"
              onClick={() => {
                setSelectedWedding(null);
                onOpenLetTalk();
              }}
            >
              Plan a Wedding at {selectedWedding.venue}
            </Button>
          }
        >
          <div className="space-y-4">
            <div
              className="w-full h-72 rounded-[6px] bg-cover bg-center"
              style={{ backgroundImage: `url(${selectedWedding.heroImage})` }}
            />

            <div className="flex flex-wrap gap-4 text-[12px] text-[#77736D] pt-1 border-b border-[#EAE5DC] pb-3">
              <span>
                <strong>Venue:</strong> {selectedWedding.venue}
              </span>
              <span>&bull;</span>
              <span>
                <strong>Guest Count:</strong> {selectedWedding.guestCount} Guests
              </span>
              <span>&bull;</span>
              <span>
                <strong>Duration:</strong> {selectedWedding.durationDays} Days
              </span>
              <span>&bull;</span>
              <span>
                <strong>Season:</strong> {selectedWedding.season} {selectedWedding.year}
              </span>
            </div>

            <p className="text-[14px] text-[#252525] leading-relaxed">
              {selectedWedding.story}
            </p>

            {selectedWedding.quote && (
              <div className="p-5 bg-[#F9F5EB] rounded-[6px] border border-[#E4C284]/40 font-serif text-[17px] text-[#171717] italic">
                {selectedWedding.quote.text}
                <span className="block text-[12px] font-sans font-medium uppercase tracking-wider text-[#C6A66B] not-italic mt-2">
                  &mdash; {selectedWedding.quote.author}
                </span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Video Teaser Testimonial Modal */}
      {selectedVideoTestimonial && (
        <Modal
          isOpen={!!selectedVideoTestimonial}
          onClose={() => setSelectedVideoTestimonial(null)}
          title={`${selectedVideoTestimonial.coupleName}`}
          subtitle={`${selectedVideoTestimonial.celebrationType} &bull; ${selectedVideoTestimonial.venue}`}
          maxWidth="2xl"
          footer={
            <Button
              variant="accent"
              size="md"
              onClick={() => {
                setSelectedVideoTestimonial(null);
                onOpenLetTalk();
              }}
            >
              Inquire About This Experience
            </Button>
          }
        >
          <div className="space-y-4">
            <div
              className="relative w-full h-80 rounded-[6px] overflow-hidden bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${selectedVideoTestimonial.image || selectedVideoTestimonial.videoThumbnail})` }}
            >
              <div className="absolute inset-0 bg-[#171717]/40" />
              <div className="relative z-10 flex flex-col items-center text-center p-6 text-white">
                <div className="w-14 h-14 rounded-full bg-[#C6A66B] text-white flex items-center justify-center shadow-2xl mb-3 animate-pulse">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
                <span className="font-serif text-[22px] font-normal">
                  Cinema Reel &bull; 35mm Fine Art Motion
                </span>
                <span className="text-[12px] text-white/80 uppercase tracking-widest mt-1">
                  Private Archival Vault
                </span>
              </div>
            </div>

            <p className="font-serif text-[18px] text-[#171717] italic leading-relaxed pt-2">
              &ldquo;{selectedVideoTestimonial.quote.replace(/^“|”$/g, '')}&rdquo;
            </p>

            <div className="text-[13px] text-[#77736D] leading-relaxed">
              {selectedVideoTestimonial.storySnippet}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
