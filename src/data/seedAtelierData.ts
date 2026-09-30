/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Seed Data & Types for Atelier Guests & Vendors
 */

export interface AtelierGuest {
  id: string;
  name: string;
  groupSize: number;
  phone?: string;
  email?: string;
  weddingId: string;
  weddingName: string;
  rsvpStatus: 'Confirmed' | 'Pending' | 'Declined';
  dietPreference: string;
  roomAllocation: string;
  transportNeeded: boolean;
  notes?: string;
  createdAt: string;
}

export interface AtelierVendor {
  id: string;
  businessName: string;
  category:
    | 'Palace & Venue'
    | 'Floral & Scenography'
    | 'Gastronomy & Catering'
    | 'Cinematography'
    | 'Sound & Pyro'
    | 'Couture Styling'
    | string;
  contactPerson: string;
  phone: string;
  email?: string;
  contractedAmount: number | string;
  weddingId: string;
  weddingName: string;
  status: 'Draft' | 'Contracted' | 'Paid in Full';
  notes?: string;
  createdAt: string;
}

export const INITIAL_ATELIER_GUESTS: AtelierGuest[] = [
  {
    id: 'gst-001',
    name: 'Rohit Sharma',
    groupSize: 3,
    phone: '+91 98200 11442',
    email: 'rohit.sharma@heritage.in',
    weddingId: 'wed-001',
    weddingName: 'Aman Singhania',
    rsvpStatus: 'Confirmed',
    dietPreference: 'Vegetarian (Royal Mewari)',
    roomAllocation: 'Lake View Royal Suite 204',
    transportNeeded: true,
    notes: 'Requires chauffeur pickup from Maharana Pratap Airport (UDR).',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'gst-002',
    name: 'Dr. Siddharth Sen & Family',
    groupSize: 2,
    phone: '+91 98110 88231',
    email: 'siddharth.sen@medglobal.org',
    weddingId: 'wed-001',
    weddingName: 'Aman Singhania',
    rsvpStatus: 'Confirmed',
    dietPreference: 'Continental & Gluten Free',
    roomAllocation: 'Jagmandir Island Pavillion 12',
    transportNeeded: true,
    notes: 'Arriving via private charter; speedboat transfer to Taj Lake Palace.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: 'gst-003',
    name: 'Ananya Deshmukh',
    groupSize: 1,
    phone: '+91 99401 55670',
    email: 'ananya.d@atelierfashion.com',
    weddingId: 'wed-002',
    weddingName: 'Rohan Mehra & Simran Bajaj',
    rsvpStatus: 'Confirmed',
    dietPreference: 'Vegan',
    roomAllocation: 'Cliffside Villa 06',
    transportNeeded: true,
    notes: 'Direct transfer from Goa Dabolim Airport (GOI) to South Coast estate.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: 'gst-004',
    name: 'Vikramaditya & Gayatri Rao',
    groupSize: 2,
    phone: '+91 94440 33819',
    email: 'vikram.rao@estates.co.in',
    weddingId: 'wed-002',
    weddingName: 'Rohan Mehra & Simran Bajaj',
    rsvpStatus: 'Pending',
    dietPreference: 'No Seafood / Jain Options',
    roomAllocation: 'Palm Promenade Suite 14',
    transportNeeded: false,
    notes: 'Self-driving from private residence in North Goa.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'gst-005',
    name: 'Manish Malhotra Associates',
    groupSize: 4,
    phone: '+91 98210 77490',
    email: 'trousseau@coutureteam.com',
    weddingId: 'wed-003',
    weddingName: 'Dev Dixit & Tara Sharma',
    rsvpStatus: 'Confirmed',
    dietPreference: 'Gourmet High Tea & Vegan',
    roomAllocation: 'Rambagh Palace Rajput Wing 310-312',
    transportNeeded: true,
    notes: 'Heavy couture cargo van + luxury Mercedes-Maybach transfer from JAI.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'gst-006',
    name: 'Kabir & Tarini Sethi',
    groupSize: 2,
    phone: '+91 98101 22904',
    email: 'kabir.sethi@delhiclub.org',
    weddingId: 'wed-003',
    weddingName: 'Dev Dixit & Tara Sharma',
    rsvpStatus: 'Declined',
    dietPreference: 'Standard',
    roomAllocation: 'Not Allocated',
    transportNeeded: false,
    notes: 'Sent ancestral blessings; unable to attend in-person.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

export const INITIAL_ATELIER_VENDORS: AtelierVendor[] = [
  {
    id: 'vnd-001',
    businessName: 'The Leela Palace Udaipur',
    category: 'Palace & Venue',
    contactPerson: 'Aditya Rajawat (Head of Banquets)',
    phone: '+91 294 670 1234',
    email: 'banquets.lakeudaipur@theleela.com',
    contractedAmount: '₹3,50,00,000',
    weddingId: 'wed-001',
    weddingName: 'Aman Singhania',
    status: 'Contracted',
    notes: 'Full palace buyout inclusive of 80 lake-view suites and jetty charter.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'vnd-002',
    businessName: 'House of Scenography Mumbai',
    category: 'Floral & Scenography',
    contactPerson: 'Devendra Varma (Creative Director)',
    phone: '+91 98200 90123',
    email: 'dev@scenographyindia.com',
    contractedAmount: '₹1,20,00,000',
    weddingId: 'wed-001',
    weddingName: 'Aman Singhania',
    status: 'Contracted',
    notes: 'Floating water mandap, 100,000 Dutch mogra strings, and hand-cut brass lanterns.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(),
  },
  {
    id: 'vnd-003',
    businessName: 'Couture Culinary Purveyors',
    category: 'Gastronomy & Catering',
    contactPerson: 'Chef Sanjeev Kapur & Team',
    phone: '+91 98111 44556',
    email: 'concierge@coutureculinary.in',
    contractedAmount: '₹85,00,000',
    weddingId: 'wed-002',
    weddingName: 'Rohan Mehra & Simran Bajaj',
    status: 'Paid in Full',
    notes: 'Michelin-guest curated coastal seafood degustation & royal vegetarian banquets.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'vnd-004',
    businessName: 'The Royal Reel Cinematography',
    category: 'Cinematography',
    contactPerson: 'Arjun Somani',
    phone: '+91 98450 78912',
    email: 'arjun@royalreels.studio',
    contractedAmount: '₹45,00,000',
    weddingId: 'wed-002',
    weddingName: 'Rohan Mehra & Simran Bajaj',
    status: 'Contracted',
    notes: '8-camera ARRI cinema package, FPV drone acrobatics, and 48-hour teaser delivery.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: 'vnd-005',
    businessName: 'Acoustic Symphony & Royal Pyro',
    category: 'Sound & Pyro',
    contactPerson: 'DJ Chetas & Symphony Brass',
    phone: '+91 98202 33441',
    email: 'bookings@acousticsymphony.com',
    contractedAmount: '₹60,00,000',
    weddingId: 'wed-003',
    weddingName: 'Dev Dixit & Tara Sharma',
    status: 'Draft',
    notes: 'Sangeet stage audio architecture and eco-friendly aerial spark cascades.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    id: 'vnd-006',
    businessName: 'Tarun Tahiliani Atelier Draping',
    category: 'Couture Styling',
    contactPerson: 'Meera Chawla',
    phone: '+91 98100 11987',
    email: 'trousseau@taruntahiliani.com',
    contractedAmount: '₹30,00,000',
    weddingId: 'wed-003',
    weddingName: 'Dev Dixit & Tara Sharma',
    status: 'Paid in Full',
    notes: 'Bridal entourage styling suite and on-site master tailors for all functions.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];
