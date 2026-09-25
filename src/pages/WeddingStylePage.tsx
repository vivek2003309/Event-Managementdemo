import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { STYLE_ARCHETYPES } from '../data/styleArchetypes';
import { StyleArchetype } from '../types';
import { Check, Sparkles } from 'lucide-react';

export const WeddingStylePage: React.FC<{ onOpenLetTalk: () => void }> = ({ onOpenLetTalk }) => {
  const { addToast } = useToast();
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('royal-heritage');

  const archetype: StyleArchetype =
    STYLE_ARCHETYPES.find((a) => a.id === selectedArchetypeId) || STYLE_ARCHETYPES[0];

  return (
    <div className="w-full pt-12 pb-24">
      <Section variant="ivory" spacing="md">
        <PageContainer>
          <SectionHeading
            kicker="Curatorial Diagnostic"
            title="Discover Your Wedding Aesthetic"
            subtitle="Explore our 4 hallmark aesthetic archetypes. Harmonize antique palace grandeur, minimalist architecture, or whimsical botanical glasshouses."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {STYLE_ARCHETYPES.map((arch) => {
              const isSelected = arch.id === selectedArchetypeId;
              return (
                <div
                  key={arch.id}
                  onClick={() => setSelectedArchetypeId(arch.id)}
                  className={`p-6 rounded-[8px] border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#C6A66B] shadow-md ring-1 ring-[#C6A66B]'
                      : 'bg-white border-[#EAE5DC] hover:border-[#C6A66B]/50'
                  }`}
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-[16px] mb-4 ${
                        isSelected ? 'bg-[#C6A66B] text-white' : 'bg-[#F0EEE8] text-[#171717]'
                      }`}
                    >
                      {arch.code}
                    </div>
                    <h3 className="font-serif text-[22px] text-[#171717] font-normal mb-1">
                      {arch.name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-[#C6A66B] block mb-3">
                      {arch.tagline}
                    </span>
                    <p className="text-[13px] text-[#77736D] leading-relaxed mb-6 font-light">
                      {arch.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EAE5DC]">
                    <span className="text-[10px] uppercase tracking-wider text-[#77736D] block mb-2">
                      Core Palette
                    </span>
                    <div className="flex items-center gap-2">
                      {arch.palette.map((swatch) => (
                        <div
                          key={swatch.name}
                          className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: swatch.hex }}
                          title={swatch.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded Archetype Deep Dive */}
          <div className="bg-white p-8 sm:p-12 rounded-[12px] border border-[#EAE5DC] shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE5DC] pb-6 mb-6">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C6A66B]">
                  Active Archetype Specification
                </span>
                <h2 className="font-serif text-[32px] text-[#171717] font-normal mt-1">
                  Archetype {archetype.code}: {archetype.name}
                </h2>
              </div>
              <Button
                variant="accent"
                size="md"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Moodboard Saved',
                    message: `${archetype.name} specification attached to consultation request.`,
                  });
                  onOpenLetTalk();
                }}
              >
                Inquire With This Moodboard →
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#171717] mb-3">
                  Signature Materials &amp; Textures
                </h4>
                <ul className="space-y-2 text-[14px] text-[#77736D]">
                  {archetype.materials.map((mat, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#171717] mb-3">
                  Recommended Enclaves &amp; Venues
                </h4>
                <ul className="space-y-2 text-[14px] text-[#77736D]">
                  {archetype.recommendedVenues.map((ven, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
                      <span>{ven}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
};
