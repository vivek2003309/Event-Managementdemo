import React from 'react';
import { ScheduleEvent } from '../../types/firebase';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Shirt,
  Info,
} from 'lucide-react';

const MASTER_EVENTS: ScheduleEvent[] = [
  {
    id: 'ev-1',
    day: 'Day 1 &bull; Thursday',
    date: 'December 16, 2026',
    title: 'The Royal Welcome & Mehfil-e-Mehendi',
    time: '4:00 PM – 10:00 PM',
    location: 'Palace Waterfront Lawns & Poolside Amphitheatre',
    attire: 'Regal Pastels, Handloom Chanderi & Floral Jewels',
    description:
      'Chauffeur greetings at Udaipur Airport followed by traditional Manganiyar folk melodies, live lac-bangle craftsmen, artisanal chaat streets, and henna artistry overlooking Lake Pichola.',
  },
  {
    id: 'ev-2',
    day: 'Day 2 &bull; Friday (Morning)',
    date: 'December 17, 2026',
    title: 'Haldi Royale & Phoolon Ki Holi',
    time: '11:00 AM – 2:30 PM',
    location: 'Historic Marble Courtyards & Stepwells',
    attire: 'Haldi Ochre, Marigold Yellow & Breezy Kurtas',
    description:
      'Sacred turmeric rituals followed by organic marigold petal showers, dhol-tasha beats, and an exquisite royal Rajasthani thali feast.',
  },
  {
    id: 'ev-3',
    day: 'Day 2 &bull; Friday (Evening)',
    date: 'December 17, 2026',
    title: 'Celestial Sangeet Night & Royal Gala Dinner',
    time: '7:30 PM Onwards',
    location: 'Grand Crystal Ballroom & Terrace Balcony',
    attire: 'Jewel-Toned Designer Lehengas, Tuxedos & Velvet Bandhgalas',
    description:
      'Choreographed family performances, international live sufi orchestra, celebrity DJ showcase, and a midnight continental gastronomy spread.',
  },
  {
    id: 'ev-4',
    day: 'Day 3 &bull; Saturday (Afternoon)',
    date: 'December 18, 2026',
    title: 'The Royal Vintage Boat Baraat & Welcome of the Groom',
    time: '3:30 PM – 5:30 PM',
    location: 'Lake Pichola to Jagmandir Island Palace Pier',
    attire: 'Royal Ivory, Champagne Gold & Custom Turbans (Safas)',
    description:
      'Regal flotilla of vintage brass boats across Lake Pichola accompanied by royal fanfare, vintage carriages, and traditional Mewari guard of honor.',
  },
  {
    id: 'ev-5',
    day: 'Day 3 &bull; Saturday (Sunset & Night)',
    date: 'December 18, 2026',
    title: 'Sacred Vedic Mandap Vows & Royal Reception Gala',
    time: '6:00 PM Onwards',
    location: 'Jagmandir Island Palace Central Courtyard',
    attire: 'Couture Royal Heritage Bridal Ensemble',
    description:
      'Seven sacred vows under a 10,000-candle floating floral pavilion, followed by private fireworks over the water, champagne toast, and formal seated banquet.',
  },
];

export const ClientSchedule: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs">
        <h2 className="font-serif text-[22px] text-[#171717]">
          Master 3-Day Ceremonial Run-of-Show
        </h2>
        <p className="text-[12px] text-[#77736D] font-light">
          Minute-by-minute protocol orchestrated by The Wedding Dreams directorship team
        </p>
      </div>

      {/* Timeline Events */}
      <div className="space-y-5">
        {MASTER_EVENTS.map((event, idx) => (
          <div
            key={event.id}
            className="bg-white p-6 rounded-[10px] border border-[#EAE5DC] shadow-xs hover:border-[#C6A66B] transition-colors relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3 text-[11px]">
                  <span
                    className="font-semibold uppercase tracking-wider text-[#8C6D37]"
                    dangerouslySetInnerHTML={{ __html: event.day }}
                  />
                  <span>&bull;</span>
                  <span className="text-[#77736D]">{event.date}</span>
                  <span>&bull;</span>
                  <span className="font-mono text-[#171717] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EAE5DC]">
                    {event.time}
                  </span>
                </div>

                <h3 className="font-serif text-[20px] text-[#171717] font-medium leading-snug">
                  {event.title}
                </h3>

                <p className="text-[13px] text-[#55524E] font-light leading-relaxed pt-1">
                  {event.description}
                </p>
              </div>

              {/* Badges Box */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-[6px] border border-[#EAE5DC] space-y-2 text-[12px] min-w-[260px]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#77736D] block">
                      Venue Sanctuary
                    </span>
                    <span className="text-[#171717] font-medium">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1 border-t border-[#F2EEE6]">
                  <Shirt className="w-3.5 h-3.5 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#77736D] block">
                      Dress Code Attire
                    </span>
                    <span className="text-[#8C6D37] italic">{event.attire}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
