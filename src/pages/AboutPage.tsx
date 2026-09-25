import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { Button } from '../components/ui/Button';
import { TESTIMONIALS_DATA } from '../data/testimonials';
import { TestimonialCard } from '../components/cards/TestimonialCard';
import { Award, Compass, HeartHandshake, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC<{ onOpenLetTalk: () => void }> = ({ onOpenLetTalk }) => {
  return (
    <div className="w-full pt-12 pb-24">
      <Section variant="ivory" spacing="md">
        <PageContainer>
          <SectionHeading
            kicker="Atelier Pedigree"
            title="The Wedding Dreams Directorship"
            subtitle="Conceived as an antidote to commercial wedding clutter. We engineer bespoke scenography that honors both sacred rites and contemporary European sensibilities."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            <div className="lg:col-span-5">
              <div
                className="w-full aspect-[4/5] rounded-[8px] bg-cover bg-center border border-[#EAE5DC] shadow-md"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDpJzn4ENc7lEVMmDTyXr7Lru6l6OScs1prUsFKJ3ZRewGgy3eQawCwwc-SYs8rUNLjLdlfITVtMJzl4x__wyvcnH69L_Pn6hmUMbZOyZ50M_ozxBYcJFO4jRyZ95pVknd8SjJSRhchc0UHMAC2Bh30g-5j7EkhcOVsLStuJDgagZTULk1CiDdTgL6VMe330YoH8ZYSX5EVPTF17trt7w3niccs6l2UOzULOewFG0RmdnNbf8y81sw1Q')",
                }}
              />
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C6A66B]">
                Directorial Manifesto
              </span>
              <h3 className="font-serif text-[32px] sm:text-[38px] text-[#171717] font-normal leading-tight">
                Architectural rigor meets quiet modern romance.
              </h3>
              <div className="space-y-4 text-[15px] text-[#77736D] leading-relaxed font-light">
                <p>
                  Founded in 2007 by a collective of architects, scenographers, and luxury concierges,
                  The Wedding Dreams operates with single-point directorial authority. We take on only
                  12 master commissions annually across the globe.
                </p>
                <p>
                  Rather than functioning as brokers, we design and produce from the ground up:
                  commissioning custom timber mandaps, designing custom scent diffusers for palatial
                  courtyards, and engineering 360-degree delay acoustic staging so spoken vows are as
                  crisp as a private whisper.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white rounded-[6px] border border-[#EAE5DC]">
                  <span className="font-serif text-[28px] text-[#C6A66B] font-normal block">500+</span>
                  <span className="text-[12px] text-[#77736D]">Master Nuptials Designed</span>
                </div>
                <div className="p-4 bg-white rounded-[6px] border border-[#EAE5DC]">
                  <span className="font-serif text-[28px] text-[#C6A66B] font-normal block">14</span>
                  <span className="text-[12px] text-[#77736D]">Countries Worldwide</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#EAE5DC] pt-16">
            <div className="text-center mb-12">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
                Patron Praises
              </span>
              <h3 className="font-serif text-[32px] text-[#171717] font-normal">
                Reflections From Our Couples
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS_DATA.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
};
