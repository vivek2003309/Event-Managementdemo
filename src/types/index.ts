/**
 * The Wedding Dreams — TypeScript Data Models & Types
 * Premium wedding planning, destination weddings, and couture scenography.
 */

export type CurrencyINR = number;

export type CelebrationFormat = 
  | 'full-wedding'
  | 'engagement-roka'
  | 'reception-sangeet'
  | 'destination-enclave'
  | 'intimate-heritage'
  | 'after-party';

export type WeddingSeason = 
  | 'Winter 2025'
  | 'Spring 2026'
  | 'Autumn / Winter 2026'
  | 'Spring 2027';

export type StyleArchetypeId = 
  | 'royal-heritage'
  | 'modern-minimalist'
  | 'contemporary-glamour'
  | 'botanical-whimsical';

export interface StyleArchetype {
  id: StyleArchetypeId;
  code: 'A' | 'B' | 'C' | 'D';
  name: string;
  tagline: string;
  description: string;
  palette: Array<{ name: string; hex: string }>;
  recommendedVenues: string[];
  materials: string[];
}

export interface Wedding {
  id: string;
  slug: string;
  title: string;
  couple: {
    partner1: string;
    partner2: string;
  };
  subtitle: string;
  destination: string;
  venue: string;
  guestCount: number;
  durationDays: number;
  functionsCount?: number;
  season: string;
  year: number;
  format: CelebrationFormat;
  weddingStyle?: string;
  vision?: string;
  concept?: string;
  execution?: string;
  excerpt: string;
  story: string;
  heroImage: string;
  galleryImages: string[];
  quote?: {
    text: string;
    author: string;
  };
  servicesIncluded: string[];
  pressFeatures?: string[];
  eventType?: string;
  category?: 'Weddings' | 'Destination' | 'Sangeet' | 'Reception' | 'Engagement';
  tags?: string[];
}

export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface Service {
  id: string;
  slug: string;
  number: string; // e.g. "01", "02"
  title: string;
  shortDescription: string;
  fullDescription: string;
  heroImage: string;
  iconName: string;
  inclusions: string[];
  planningProcess: ServiceProcessStep[];
  idealFor: string;
  featuredQuote?: string;
  relatedPortfolioSlugs?: string[];
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string;
  country: string;
  tagline: string;
  description: string;
  heroImage: string;
  venues: string[];
  guestCapacityRange: {
    min: number;
    max: number;
  };
  bestSeasons: string[];
  logisticsHighlight: string;
}

export interface Testimonial {
  id: string;
  coupleName: string;
  celebrationType: string;
  destination: string;
  location?: string;
  venue: string;
  year: number;
  quote: string;
  storySnippet: string;
  image?: string;
  videoThumbnail?: string;
  videoUrl?: string;
  publicationBadge?: string; // e.g. "Featured in Vogue Weddings"
}

export interface Lead {
  id: string;
  fullName: string;
  partnerName?: string;
  email: string;
  phone: string;
  weddingDate?: string;
  guestCount: number;
  budgetRange: string;
  destinationPreference: string;
  celebrationFormat: CelebrationFormat;
  notes?: string;
  status: 'new' | 'contacted' | 'consultation_scheduled' | 'proposal_sent' | 'contract_signed';
  createdAt: string;
}

export interface BudgetItem {
  category: string;
  percentage: number;
  amount: CurrencyINR;
  colorHex: string;
  description: string;
}

export interface WeddingPlan {
  id: string;
  format: CelebrationFormat;
  destinationStyle: 'palace' | 'beach' | 'city' | 'global';
  season: WeddingSeason;
  guestCount: number;
  totalBudgetINR: CurrencyINR;
  selectedCeremonies: string[];
  breakdown: BudgetItem[];
  archetypeId?: StyleArchetypeId;
  createdAt: string;
}

export interface Guest {
  id: string;
  weddingId: string;
  firstName: string;
  lastName: string;
  relationship: 'Bride Family' | 'Groom Family' | 'VIP' | 'Colleague' | 'Friend';
  partySize: number;
  rsvpStatus: 'Attending' | 'Declined' | 'Pending';
  dietRestrictions?: string;
  tableAssignment?: string;
  hotelAccommodation?: string;
}

export interface Vendor {
  id: string;
  category: 'Catering' | 'Florals & Mandap' | 'Sound & Light' | 'Cinema' | 'Artists & Entertainment' | 'Styling & Couture';
  name: string;
  leadContact: string;
  phone: string;
  email: string;
  status: 'Vetted & Preferred' | 'Shortlisted' | 'Contracted';
  feeTier: 'Haute Couture' | 'Premier Luxury' | 'Curated Artisanal';
  notes?: string;
}

export interface NavigationItem {
  label: string;
  path: string;
  isExternal?: boolean;
}
