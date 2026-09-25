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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAO9K4Dvf27O8nypOBYd8-pCMEu62tj8d-5SGfrTgaBBiiPFHH-XBYnW6ObW6QEN5zgtQp57aUthu01d5ce_sPmdcVintgs1Mx9Y3Gux5cnagGmw-jmJfBgeEbdbNwoYVke_Y5H8ucpVbX1PoCBM2b1TcjMg2c0cXoRIGAsE50jmfDjvRamBJJrPhGZQeg6uJLATJ-3kRBTMfZ8XOreFYQrPadz3iUUXZ6uKzcObr0dQKFersBWJ95rJw',
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBhge8KvvXvS3pkva0XciQzvyeNkFN0-apl31gHV6MyvZqnmrnKtVpO2DITVltm58ZtQG9TyKKqqg7exfmNQGk-GrQDRHSO8h87-h7LRaYUE4vomedzyLvy27AHZyVwGzi4qa-0Oah5H44FS1ddXvAdDmLhdb8yPujVjhoCp6Cq4KxsRMIbZy9RDRBPheyTkzeBOIXINpnG--tFEFs-SDCa2DhadBeg8pOX1TkF4yA1JWplsUdXll2g3g',
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAv5SC-EO1lONTNVfELECWtq4QGFYhX6_-XDL-rFAJVIPcbaQTGe8aXfG5-f4V0eAY28svau5KHFsyUXsO-f1EutPHsnVoMCkEE9C7GWID196Yj9xk8BjILzzu4lh1wCJqYiGaysjEDCNUi5Wt-yxPx8E55YQuc4JeBasQiSckOugLcUHMdctGbWHgEPzPSM0Ovi8OTanmvNNfz5hlEpXVezYv4YZem40r_0VOvzcfD6lcGyIx30mb-iw',
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAACmvYEOvWXLlGazBNLRDMoF7GdSB5_K4gVvAUHiP5QknA6ZgYgTyqH71HKse-ykqtB0EOnah6ofRBWzR8GPhpjT1QZnrPNteFwK1ne_0DT0vY6QerHKBdPvu51duXsOrHmUZF5tx98nZF9yGJ0M3dkLU6o_L1GkUdvt9p-4j127pKglfZdquyh-HWil-DYIhWupipk8gCQuBEX5Sl7WxKevyF0jBC9zybdle7fWWRICMtuVwNYbIvEA',
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBDpJzn4ENc7lEVMmDTyXr7Lru6l6OScs1prUsFKJ3ZRewGgy3eQawCwwc-SYs8rUNLjLdlfITVtMJzl4x__wyvcnH69L_Pn6hmUMbZOyZ50M_ozxBYcJFO4jRyZ95pVknd8SjJSRhchc0UHMAC2Bh30g-5j7EkhcOVsLStuJDgagZTULk1CiDdTgL6VMe330YoH8ZYSX5EVPTF17trt7w3niccs6l2UOzULOewFG0RmdnNbf8y81sw1Q',
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB22DLIvYuUsAJGkaxzdbGRw9xG6TCG6Ns_VVeCbJKNjm-6mjv1fqe2eLkHBlFu6KiVoCVV--RT8oCx_B_S86E3d9m_HOf-ItJZJleDoOhQcMMrq1nAJI8kWA7Zp1_rNzJQ8PNUdBndgywUxtwJbfDjO23ttbCXNqFK16uiodsOv46eA0uF56FhrhCwmLGR0u3dhWKYlSxW__CKez2CjmbP_UENxUs0U5TNyV5L2Cxaf8q47jzXFLJoQg',
    venues: ['JW Marriott Mussoorie Walnut Grove', 'Welcomhotel The Savoy', 'Rokeby Manor'],
    guestCapacityRange: { min: 80, max: 350 },
    bestSeasons: ['March – June', 'September – November'],
    logisticsHighlight: 'Mountain road pilot escorts, indoor heated glasshouse pavilions, bonfire sundowners.',
  },
];
