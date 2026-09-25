import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { DestinationCard } from '../components/cards/DestinationCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { DESTINATIONS_DATA } from '../data/destinations';
import { Destination } from '../types';
import { MapPin, Users, Calendar, Sparkles } from 'lucide-react';

export const DestinationsPage: React.FC<{ onOpenLetTalk: () => void }> = ({ onOpenLetTalk }) => {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const filtered = DESTINATIONS_DATA.filter((d) => {
    if (filterRegion === 'all') return true;
    if (filterRegion === 'rajasthan') return d.region.includes('Rajasthan');
    if (filterRegion === 'coastal') return d.region.includes('Goa');
    if (filterRegion === 'international') return d.country !== 'India';
    return true;
  });

  return (
    <div className="w-full pt-12 pb-24">
      <Section variant="ivory" spacing="md">
        <PageContainer>
          <SectionHeading
            kicker="Curated Enclaves"
            title="Destination Sanctuaries"
            subtitle="Iconic heritage palaces, secluded coastal cliffs, and alpine estates across India and Europe."
          />

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { id: 'all', label: 'All Enclaves' },
              { id: 'rajasthan', label: 'Rajasthan Heritage' },
              { id: 'coastal', label: 'Goa Coastal' },
              { id: 'international', label: 'International & Europe' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterRegion(tab.id)}
                className={`px-5 py-2 rounded-[4px] text-[11px] font-medium uppercase tracking-[0.14em] transition-all cursor-pointer ${
                  filterRegion === tab.id
                    ? 'bg-[#171717] text-white shadow-sm'
                    : 'bg-white border border-[#EAE5DC] text-[#252525] hover:border-[#C6A66B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onSelect={(d) => setSelectedDest(d)}
              />
            ))}
          </div>
        </PageContainer>
      </Section>

      {/* Destination Detail Modal */}
      {selectedDest && (
        <Modal
          isOpen={!!selectedDest}
          onClose={() => setSelectedDest(null)}
          title={`${selectedDest.name} Enclave`}
          subtitle={`${selectedDest.region}, ${selectedDest.country}`}
          maxWidth="2xl"
          footer={
            <Button
              variant="accent"
              size="md"
              onClick={() => {
                setSelectedDest(null);
                onOpenLetTalk();
              }}
            >
              Inquire About {selectedDest.name}
            </Button>
          }
        >
          <div className="space-y-4">
            <div
              className="w-full h-64 rounded-[6px] bg-cover bg-center"
              style={{ backgroundImage: `url(${selectedDest.heroImage})` }}
            />

            <p className="text-[14px] text-[#252525] leading-relaxed">
              {selectedDest.description}
            </p>

            <div className="p-4 bg-[#F9F5EB] rounded-[6px] border border-[#E4C284]/40 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C6A66B] block">
                Directorial Logistics Note
              </span>
              <p className="text-[13px] text-[#252525]">
                {selectedDest.logisticsHighlight}
              </p>
            </div>

            <div>
              <h5 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#171717] mb-2">
                Preferred Estates &amp; Venues
              </h5>
              <div className="grid grid-cols-2 gap-2 text-[13px] text-[#77736D]">
                {selectedDest.venues.map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
