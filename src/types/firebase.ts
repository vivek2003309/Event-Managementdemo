/**
 * Firebase Firestore Data Models & Types
 * The Wedding Dreams — Architectural Nuptial Operating System
 */

export type UserRole = 'client' | 'admin';

export interface UserProfile {
  uid: string;
  name?: string | null;
  displayName: string | null;
  email: string;
  photoURL?: string | null;
  role: UserRole;
  phone?: string | null;
  phoneNumber?: string | null;
  authProvider?: 'google' | 'password' | 'phone' | string;
  lastLogin?: any;
  createdAt: any;
  updatedAt?: any;
}


export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'won'
  | 'lost'
  | 'archived';

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  author?: string;
}

export interface LeadDocument {
  id?: string;
  name: string;
  email: string;
  phone: string;
  weddingDate?: string;
  location?: string;
  guestCount?: number;
  budget?: string;
  services?: string[];
  source?: string;
  status: LeadStatus;
  notes?: string;
  notesList?: LeadNote[];
  followUpDate?: string;
  intentScore?: 'high' | 'medium' | 'low';
  planId?: string;
  aiSummary?: string;
  createdAt: string;
  updatedAt?: string;
}


export type WeddingStatus = 'planning' | 'active' | 'completed' | 'archived';

export interface WeddingDocument {
  id?: string;
  userId: string;
  clientName: string;
  partnerName: string;
  weddingDate: string;
  location: string;
  guestCount: number;
  budget: number;
  aesthetic?: string;
  status: WeddingStatus;
  createdAt: string;
  updatedAt: string;
}

export type WeddingPlanStatus = 'draft' | 'submitted' | 'reviewed' | 'contracted';

export interface WeddingPlanDocument {
  id?: string;
  userId: string;
  weddingId?: string;
  planNumber: string;
  celebrationType: string;
  targetDate: string;
  isDateFlexible: boolean;
  location: string;
  guestCount: number;
  budgetRange: string;
  selectedFunctions: string[];
  selectedServices: string[];
  status: WeddingPlanStatus;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  createdAt: string;
}

export interface BudgetAllocationItem {
  id: string;
  name: string;
  categoryKey: string;
  amountINR: number;
  percentage: number;
  color: string;
  description: string;
  estimatedCostPerGuest?: number;
}

export interface BudgetDocument {
  id?: string;
  userId: string;
  weddingId?: string;
  targetBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
  location: string;
  guestCount: number;
  allocations: BudgetAllocationItem[];
  createdAt: string;
  updatedAt: string;
}

export type RSVPStatus = 'pending' | 'attending' | 'declined';

export interface GuestDocument {
  id?: string;
  userId: string;
  weddingId: string;
  name: string;
  email?: string;
  phone?: string;
  relationship?: string;
  functionName?: string; // e.g. 'All Functions', 'Sangeet & Wedding', 'Reception Only'
  rsvpStatus: RSVPStatus;
  hotelRequired?: boolean;
  transportRequired?: boolean;
  foodPreference?: 'Vegetarian' | 'Non-Vegetarian' | 'Jain' | 'Vegan' | string;
  dietary?: string;
  tableAssignment?: string;
  plusOne?: boolean;
  ceremonyAccess?: string[];
  createdAt: string;
}

export interface TravelEntry {
  id: string;
  userId: string;
  guestName: string;
  arrivalDate: string;
  arrivalTime?: string;
  departureDate: string;
  departureTime?: string;
  hotel: string;
  roomNumber?: string;
  airportPickup: boolean;
  flightNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface ClientDocumentEntry {
  id: string;
  userId: string;
  title: string;
  category: 'Contract' | 'Moodboard' | 'Invoice' | 'Floorplan' | 'Run-of-Show' | 'Permit';
  fileType: string;
  size: string;
  uploadDate: string;
  url?: string;
  status: 'verified' | 'pending' | 'draft';
}

export interface ScheduleEvent {
  id: string;
  day: string;
  date: string;
  title: string;
  time: string;
  location: string;
  attire: string;
  description: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string;
}


export type VendorStatus = 'shortlisted' | 'contacted' | 'contracted' | 'paid';

export interface VendorDocument {
  id?: string;
  userId: string;
  weddingId: string;
  category: string;
  businessName: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  contractedAmount?: number;
  status: VendorStatus;
  notes?: string;
  createdAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface TaskDocument {
  id?: string;
  userId: string;
  weddingId: string;
  title: string;
  category: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
}

export interface MessageDocument {
  id?: string;
  userId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
}

export interface RSVPDocument {
  id?: string;
  weddingId: string;
  guestName: string;
  email?: string;
  phone?: string;
  attending: boolean;
  guestsCount: number;
  ceremonialEvents?: string[];
  dietary?: string;
  songRequest?: string;
  submittedAt: string;
}
