/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Managed Weddings Mock State & Types
 * Pre-seeded test commissions without hardcoded dummy names like 'Priya'.
 * If partner name was not provided, defaults strictly to "Not Available".
 */

export interface WeddingMilestone {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed' | string;
  progress: number; // 0 - 100
}

export interface ManagedWedding {
  id: string;
  clientName: string;
  partnerName: string; // If not provided: "Not Available"
  weddingDate: string;
  date?: string;
  location: string;
  destination?: string;
  guestCount: number | string;
  budget: number | string;
  budgetAllocation?: number | string;
  aesthetic?: string;
  status: 'planning' | 'in_progress' | 'confirmed' | 'completed' | 'archived' | string;
  notes?: string;
  sourceLeadId?: string;
  createdAt: string;
  checklist: WeddingMilestone[];
}

export const DEFAULT_PLANNING_CHECKLIST: WeddingMilestone[] = [
  { id: '1', title: 'Venue Booking & Permitting', status: 'In Progress', progress: 40 },
  { id: '2', title: 'Couture Decor & Scenography', status: 'Pending', progress: 0 },
  { id: '3', title: 'Gastronomy & Menu Tasting', status: 'Pending', progress: 0 },
  { id: '4', title: 'Cinematography & Sound Blueprint', status: 'Pending', progress: 0 },
  { id: '5', title: 'Final Run-down & Logistics', status: 'Pending', progress: 0 },
];

export const INITIAL_WEDDINGS: ManagedWedding[] = [
  {
    id: 'wed-001',
    clientName: 'Aman Singhania',
    partnerName: 'Not Available',
    weddingDate: '2026-11-20',
    date: '2026-11-20',
    location: 'Udaipur, Rajasthan (Taj Lake Palace)',
    destination: 'Udaipur, Rajasthan (Taj Lake Palace)',
    guestCount: 350,
    budget: '₹3 Cr – ₹7 Cr',
    budgetAllocation: '₹3 Cr – ₹7 Cr',
    aesthetic: 'Royal Mewar Heritage & Floating Mandap',
    status: 'planning',
    notes: 'Directorial commission. Partner coordinates pending submission.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    checklist: [
      { id: '1', title: 'Venue Booking & Permitting', status: 'Completed', progress: 100 },
      { id: '2', title: 'Couture Decor & Scenography', status: 'In Progress', progress: 50 },
      { id: '3', title: 'Gastronomy & Menu Tasting', status: 'Pending', progress: 0 },
      { id: '4', title: 'Cinematography & Sound Blueprint', status: 'Pending', progress: 0 },
      { id: '5', title: 'Final Run-down & Logistics', status: 'Pending', progress: 0 },
    ],
  },
  {
    id: 'wed-002',
    clientName: 'Rohan Mehra',
    partnerName: 'Simran Bajaj',
    weddingDate: '2027-01-24',
    date: '2027-01-24',
    location: 'South Goa Coast (Cliffside Estate)',
    destination: 'South Goa Coast (Cliffside Estate)',
    guestCount: 200,
    budget: '₹1 Cr – ₹3 Cr',
    budgetAllocation: '₹1 Cr – ₹3 Cr',
    aesthetic: 'Candlelit Coastal & Sunset Scenography',
    status: 'confirmed',
    notes: 'Multi-day beachfront celebration with curated acoustics.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    checklist: [
      { id: '1', title: 'Venue Booking & Permitting', status: 'Completed', progress: 100 },
      { id: '2', title: 'Couture Decor & Scenography', status: 'Completed', progress: 100 },
      { id: '3', title: 'Gastronomy & Menu Tasting', status: 'In Progress', progress: 60 },
      { id: '4', title: 'Cinematography & Sound Blueprint', status: 'In Progress', progress: 30 },
      { id: '5', title: 'Final Run-down & Logistics', status: 'Pending', progress: 0 },
    ],
  },
  {
    id: 'wed-003',
    clientName: 'Dev Dixit',
    partnerName: 'Tara Sharma',
    weddingDate: '2026-12-05',
    date: '2026-12-05',
    location: 'Jaipur, Rajasthan (Rambagh Palace)',
    destination: 'Jaipur, Rajasthan (Rambagh Palace)',
    guestCount: 500,
    budget: '₹7 Cr+ (Ultra Luxury)',
    budgetAllocation: '₹7 Cr+ (Ultra Luxury)',
    aesthetic: 'Imperial Rajputana Grandeur & Drone Symphony',
    status: 'planning',
    notes: 'Royal fort takeover with international guest transfers.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    checklist: [
      { id: '1', title: 'Venue Booking & Permitting', status: 'In Progress', progress: 40 },
      { id: '2', title: 'Couture Decor & Scenography', status: 'Pending', progress: 0 },
      { id: '3', title: 'Gastronomy & Menu Tasting', status: 'Pending', progress: 0 },
      { id: '4', title: 'Cinematography & Sound Blueprint', status: 'Pending', progress: 0 },
      { id: '5', title: 'Final Run-down & Logistics', status: 'Pending', progress: 0 },
    ],
  },
];
