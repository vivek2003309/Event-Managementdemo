import { Destination } from '../types';

export const DESTINATIONS_DATA: Destination[] = [
  {
    id: 'udaipur',
    slug: 'udaipur-lake-palaces',
    name: 'Udaipur',
    region: 'Rajasthan',
    country: 'India',
    tagline: 'The Venice of the East • Floating Palaces & Serene Waterways',
    description:
      'Ancient Mewar royalty cradled by the tranquil Aravalli mountains and reflective waters of Lake Pichola. Majestic white marble palaces accessible only by bespoke wooden boat escorts.',
    heroImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85',
    venues: ['Taj Lake Palace', 'Jagmandir Island Palace', 'The Leela Palace Udaipur', 'Oberoi Udaivilas'],
    guestCapacityRange: { min: 80, max: 600 },
    bestSeasons: ['October – March', 'November High Season'],
    logisticsHighlight: 'Dedicated private water fleet and municipal sound waivers until 01:00 AM.',
  },
  {
    id: 'jaipur',
    slug: 'jaipur-royal-mansions',
    name: 'Jaipur',
    region: 'Rajasthan',
    country: 'India',
    tagline: 'The Pink City • Fortresses, Polished Terracotta & Regal Courtyards',
    description:
      'Imposing ramparts, Mughal garden courtyards, and palatial polo grounds. Jaipur blends high aristocratic heritage with state-of-the-art production logistics.',
    heroImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=85',
    venues: ['Rambagh Palace', 'Jai Mahal Palace', 'Fairmont Jaipur', 'Samode Palace'],
    guestCapacityRange: { min: 150, max: 1200 },
    bestSeasons: ['October – February'],
    logisticsHighlight: 'Ample runway access for chartered aircraft and bespoke equestrian processions.',
  },
  {
    id: 'goa',
    slug: 'goa-coastal-estates',
    name: 'Goa',
    region: 'South Goa Coast',
    country: 'India',
    tagline: 'Quiet Coastal Luxury • Secluded Bays & Portuguese Sanctuaries',
    description:
      'Far from commercial beaches, our curated South Goa enclaves offer dramatic rocky promontories, private coves, and 400-year-old restored Indo-Portuguese villas.',
    heroImage:
      'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=1920&q=85',
    venues: ['Cabo Serai Sanctuary', 'The Leela Goa', 'Alila Diwa', 'Ahilya by the Sea'],
    guestCapacityRange: { min: 60, max: 400 },
    bestSeasons: ['November – April'],
    logisticsHighlight: 'Barefoot sunset vows, cliffside acoustic zoning, and all-night open-air lounges.',
  },
  {
    id: 'lake-como',
    slug: 'lake-como-italian-villas',
    name: 'Lake Como',
    region: 'Lombardy',
    country: 'Italy',
    tagline: 'European Splendor • Renaissance Terraces & Riva Speedboats',
    description:
      'Sublime cypress terraces, Neoclassical balustrades, and private Riva boat entries across Europe’s most storied alpine waters.',
    heroImage:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1920&q=85',
    venues: ['Villa d’Este', 'Villa Balbianello', 'Villa Pizzo', 'Grand Hotel Tremezzo'],
    guestCapacityRange: { min: 40, max: 250 },
    bestSeasons: ['May – October'],
    logisticsHighlight: 'Full EU cross-border guest concierge, private helicopter transfers from Milan.',
  },
  {
    id: 'jodhpur',
    slug: 'jodhpur-fortress-bastions',
    name: 'Jodhpur',
    region: 'Rajasthan',
    country: 'India',
    tagline: 'The Sun City • Golden Sandstone & Imposing Citadels',
    description:
      'Colossal medieval fortifications towering over indigo-painted old city quarters. Royal banquets orchestrated under high-vaulted stone arches lit by brass torchieres.',
    heroImage:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=85',
    venues: ['Umaid Bhawan Palace', 'Mehrangarh Fort Baradari', 'Rohet Garh', 'RAAS Jodhpur'],
    guestCapacityRange: { min: 100, max: 800 },
    bestSeasons: ['October – March'],
    logisticsHighlight: 'Direct access to royal family archives and private historical fort grounds.',
  },
  {
    id: 'mussoorie',
    slug: 'mussoorie-himalayan-sanctuaries',
    name: 'Mussoorie',
    region: 'Uttarakhand',
    country: 'India',
    tagline: 'Himalayan Heights • Pine Forest Mist & Alpine Grandeur',
    description:
      'Perched high in the Garhwal Himalayas with unobstructed vistas of snow-capped peaks, crisp mountain air, and heritage colonial estate manors.',
    heroImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    venues: ['JW Marriott Mussoorie Walnut Grove', 'Welcomhotel The Savoy', 'Rokeby Manor'],
    guestCapacityRange: { min: 80, max: 350 },
    bestSeasons: ['March – June', 'September – November'],
    logisticsHighlight: 'Mountain road pilot escorts, indoor heated glasshouse pavilions, bonfire sundowners.',
  },
];
