/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AtelierDataContext
 * Centralized Unified Data Layer & State Management for:
 * - Leads & Consultations Pipeline ('crm_leads' & 'wedding_inquiries')
 * - Managed Wedding Commissions ('managed_weddings' & 'wedding_managed_projects')
 * - Luxury Guest Directory ('atelier_guests')
 * - Purveyor & Vendor Directory ('atelier_vendors')
 * 
 * Provides instantaneous React state updates, persistent localStorage writes,
 * cross-tab synchronization listeners, and visual feedback toasts.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/ui/Toast';
import {
  ManagedWedding,
  WeddingMilestone,
  INITIAL_WEDDINGS,
  DEFAULT_PLANNING_CHECKLIST,
} from '../components/admin/mockWeddings';
import {
  AtelierGuest,
  AtelierVendor,
  INITIAL_ATELIER_GUESTS,
  INITIAL_ATELIER_VENDORS,
} from '../data/seedAtelierData';
import { LeadDocument, LeadStatus } from '../types/firebase';

export interface AtelierLead extends LeadDocument {
  fullName?: string;
  partnerName?: string;
  destination?: string;
  eventDate?: string;
  guestCount?: number;
  budgetEnvelope?: string;
  vision?: string;
  contact?: string;
}

export const INITIAL_LEADS: AtelierLead[] = [
  {
    id: 'lead-001',
    name: 'Ananya Singhania',
    fullName: 'Ananya Singhania',
    partnerName: 'Kabir Oberoi',
    email: 'ananya.singhania@luxuryweddings.in',
    phone: '+91 98201 12345',
    weddingDate: '2026-11-18',
    eventDate: '2026-11-18',
    location: 'Udaipur, Rajasthan (Taj Lake Palace)',
    destination: 'Udaipur, Rajasthan (Taj Lake Palace)',
    guestCount: 350,
    budget: '₹3 Cr – ₹7 Cr',
    budgetEnvelope: '₹3 Cr – ₹7 Cr',
    status: 'new',
    source: "Let's Talk Consultation Modal",
    notes: 'Desire a 3-day royal palace celebration with sunset floating mandap and Sufi acoustic evening.',
    vision: 'Desire a 3-day royal palace celebration with sunset floating mandap and Sufi acoustic evening.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'lead-002',
    name: 'Rohan Mehra',
    fullName: 'Rohan Mehra',
    partnerName: 'Simran Bajaj',
    email: 'rohan.mehra@atelierweddings.co',
    phone: '+91 98110 54321',
    weddingDate: '2027-01-24',
    eventDate: '2027-01-24',
    location: 'South Goa Coast (Cliffside Estate)',
    destination: 'South Goa Coast (Cliffside Estate)',
    guestCount: 200,
    budget: '₹1 Cr – ₹3 Cr',
    budgetEnvelope: '₹1 Cr – ₹3 Cr',
    status: 'contacted',
    source: "Let's Talk Consultation Modal",
    notes: 'Bespoke coastal wedding with candlelit beachfront dinner and bohemian sangeet scenography.',
    vision: 'Bespoke coastal wedding with candlelit beachfront dinner and bohemian sangeet scenography.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'lead-003',
    name: 'Dev Dixit',
    fullName: 'Dev Dixit',
    partnerName: 'Tara Sharma',
    email: 'tara.dev@dixitcelebrations.com',
    phone: '+44 7700 900123',
    weddingDate: '2026-12-05',
    eventDate: '2026-12-05',
    location: 'Jaipur, Rajasthan (Rambagh Palace)',
    destination: 'Jaipur, Rajasthan (Rambagh Palace)',
    guestCount: 500,
    budget: '₹7 Cr+ (Ultra Luxury)',
    budgetEnvelope: '₹7 Cr+ (Ultra Luxury)',
    status: 'won',
    source: "Let's Talk Consultation Modal",
    notes: 'Directorial royal heritage celebration across 3 palaces with drone symphony.',
    vision: 'Directorial royal heritage celebration across 3 palaces with drone symphony.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

interface AtelierDataContextType {
  // Leads
  leads: AtelierLead[];
  addLead: (lead: Partial<AtelierLead>) => AtelierLead;
  updateLead: (id: string, updates: Partial<AtelierLead>) => void;
  updateLeadStatus: (id: string, status: LeadStatus | string) => void;
  deleteLead: (id: string, name?: string) => void;
  convertLeadToWedding: (lead: AtelierLead) => ManagedWedding;

  // Weddings
  weddings: ManagedWedding[];
  addWedding: (wedding: Partial<ManagedWedding>) => ManagedWedding;
  updateWedding: (id: string, updates: Partial<ManagedWedding>) => void;
  updateWeddingMilestone: (
    weddingId: string,
    milestoneId: string,
    status: string,
    progress: number
  ) => void;
  deleteWedding: (id: string, name?: string) => void;
  clearMockWeddings: () => void;

  // Guests
  guests: AtelierGuest[];
  addGuest: (guest: Omit<AtelierGuest, 'id' | 'createdAt'>) => AtelierGuest;
  updateGuest: (id: string, updates: Partial<AtelierGuest>) => void;
  deleteGuest: (id: string, name?: string) => void;

  // Vendors
  vendors: AtelierVendor[];
  addVendor: (vendor: Omit<AtelierVendor, 'id' | 'createdAt'>) => AtelierVendor;
  updateVendor: (id: string, updates: Partial<AtelierVendor>) => void;
  deleteVendor: (id: string, businessName?: string) => void;

  // Global Sync
  refreshAllData: () => void;
}

const AtelierDataContext = createContext<AtelierDataContextType | undefined>(undefined);

export const AtelierDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();

  // 1. STATE INITIALIZATION (from localStorage with safe defaults)
  const [leads, setLeads] = useState<AtelierLead[]>(() => {
    try {
      const stored = localStorage.getItem('crm_leads') || localStorage.getItem('wedding_inquiries');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading leads from storage:', e);
    }
    return INITIAL_LEADS;
  });

  const [weddings, setWeddings] = useState<ManagedWedding[]>(() => {
    try {
      const stored =
        localStorage.getItem('managed_weddings') || localStorage.getItem('wedding_managed_projects');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            ...item,
            checklist:
              item.checklist && item.checklist.length > 0
                ? item.checklist
                : JSON.parse(JSON.stringify(DEFAULT_PLANNING_CHECKLIST)),
          }));
        }
      }
    } catch (e) {
      console.error('Error loading weddings from storage:', e);
    }
    return INITIAL_WEDDINGS;
  });

  const [guests, setGuests] = useState<AtelierGuest[]>(() => {
    try {
      const stored = localStorage.getItem('atelier_guests');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading guests from storage:', e);
    }
    return INITIAL_ATELIER_GUESTS;
  });

  const [vendors, setVendors] = useState<AtelierVendor[]>(() => {
    try {
      const stored = localStorage.getItem('atelier_vendors');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading vendors from storage:', e);
    }
    return INITIAL_ATELIER_VENDORS;
  });

  // Keep localStorage seeded if initial was empty
  useEffect(() => {
    if (!localStorage.getItem('crm_leads')) {
      localStorage.setItem('crm_leads', JSON.stringify(leads));
      localStorage.setItem('wedding_inquiries', JSON.stringify(leads));
    }
    if (!localStorage.getItem('managed_weddings')) {
      localStorage.setItem('managed_weddings', JSON.stringify(weddings));
      localStorage.setItem('wedding_managed_projects', JSON.stringify(weddings));
    }
    if (!localStorage.getItem('atelier_guests')) {
      localStorage.setItem('atelier_guests', JSON.stringify(guests));
    }
    if (!localStorage.getItem('atelier_vendors')) {
      localStorage.setItem('atelier_vendors', JSON.stringify(vendors));
    }
  }, []);

  // 2. GLOBAL SYNCHRONIZATION LISTENER
  const refreshAllData = useCallback(() => {
    try {
      const storedLeads = localStorage.getItem('crm_leads') || localStorage.getItem('wedding_inquiries');
      if (storedLeads) setLeads(JSON.parse(storedLeads));

      const storedWeddings =
        localStorage.getItem('managed_weddings') || localStorage.getItem('wedding_managed_projects');
      if (storedWeddings) setWeddings(JSON.parse(storedWeddings));

      const storedGuests = localStorage.getItem('atelier_guests');
      if (storedGuests) setGuests(JSON.parse(storedGuests));

      const storedVendors = localStorage.getItem('atelier_vendors');
      if (storedVendors) setVendors(JSON.parse(storedVendors));
    } catch (err) {
      console.error('Failed to sync atelier data:', err);
    }
  }, []);

  useEffect(() => {
    const handleSync = () => refreshAllData();
    window.addEventListener('crm_leads_updated', handleSync);
    window.addEventListener('wedding_inquiries_updated', handleSync);
    window.addEventListener('managed_weddings_updated', handleSync);
    window.addEventListener('atelier_guests_updated', handleSync);
    window.addEventListener('atelier_vendors_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('crm_leads_updated', handleSync);
      window.removeEventListener('wedding_inquiries_updated', handleSync);
      window.removeEventListener('managed_weddings_updated', handleSync);
      window.removeEventListener('atelier_guests_updated', handleSync);
      window.removeEventListener('atelier_vendors_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [refreshAllData]);

  // 3. LEADS CRUD OPERATIONS
  const addLead = useCallback(
    (leadData: Partial<AtelierLead>): AtelierLead => {
      const clientName = leadData.fullName || leadData.name || 'Esteemed Client';
      const newLead: AtelierLead = {
        id: leadData.id || `lead-${Date.now()}`,
        name: clientName,
        fullName: clientName,
        partnerName: leadData.partnerName || 'Not Available',
        email: leadData.email || '',
        phone: leadData.phone || '',
        weddingDate: leadData.weddingDate || leadData.eventDate || '',
        eventDate: leadData.eventDate || leadData.weddingDate || '',
        location: leadData.location || leadData.destination || 'Selected Destination',
        destination: leadData.destination || leadData.location || 'Selected Destination',
        guestCount: Number(leadData.guestCount) || 200,
        budget: String(leadData.budget || leadData.budgetEnvelope || 'Bespoke'),
        budgetEnvelope: String(leadData.budgetEnvelope || leadData.budget || 'Bespoke'),
        status: (leadData.status as LeadStatus) || 'new',
        source: leadData.source || "Let's Talk Consultation Modal",
        notes: leadData.notes || leadData.vision || '',
        vision: leadData.vision || leadData.notes || '',
        createdAt: leadData.createdAt || new Date().toISOString(),
      };

      setLeads((prev) => {
        const next = [newLead, ...prev.filter((l) => l.id !== newLead.id)];
        localStorage.setItem('crm_leads', JSON.stringify(next));
        localStorage.setItem('wedding_inquiries', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('crm_leads_updated', { detail: newLead }));
      window.dispatchEvent(new CustomEvent('wedding_inquiries_updated', { detail: newLead }));

      addToast({
        type: 'success',
        title: 'Consultation Registered',
        message: `Inquiry registered for ${newLead.name}.`,
      });

      return newLead;
    },
    [addToast]
  );

  const updateLead = useCallback(
    (id: string, updates: Partial<AtelierLead>) => {
      setLeads((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
        localStorage.setItem('crm_leads', JSON.stringify(next));
        localStorage.setItem('wedding_inquiries', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('crm_leads_updated', { detail: { id, updates } }));
      window.dispatchEvent(new CustomEvent('wedding_inquiries_updated', { detail: { id, updates } }));

      addToast({
        type: 'success',
        title: 'Lead Updated',
        message: 'Lead record has been synchronized.',
      });
    },
    [addToast]
  );

  const updateLeadStatus = useCallback(
    (id: string, status: LeadStatus | string) => {
      const normalizedStatus = status.toLowerCase();
      let crmStatus: LeadStatus = 'new';
      if (normalizedStatus.includes('contact')) crmStatus = 'contacted';
      else if (normalizedStatus.includes('qualif')) crmStatus = 'qualified';
      else if (normalizedStatus.includes('prop')) crmStatus = 'proposal';
      else if (normalizedStatus.includes('won') || normalizedStatus.includes('book')) crmStatus = 'won';
      else if (normalizedStatus.includes('lost')) crmStatus = 'lost';
      else if (normalizedStatus.includes('arch')) crmStatus = 'archived';

      setLeads((prev) => {
        const next = prev.map((item) =>
          item.id === id ? { ...item, status: crmStatus } : item
        );
        localStorage.setItem('crm_leads', JSON.stringify(next));
        localStorage.setItem('wedding_inquiries', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('crm_leads_updated', { detail: { id, status: crmStatus } }));
      window.dispatchEvent(new CustomEvent('wedding_inquiries_updated', { detail: { id, status: crmStatus } }));

      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Lead marked as ${status}.`,
      });
    },
    [addToast]
  );

  const deleteLead = useCallback(
    (id: string, _name?: string) => {
      setLeads((prev) => {
        const next = prev.filter((item) => item.id !== id);
        localStorage.setItem('crm_leads', JSON.stringify(next));
        localStorage.setItem('wedding_inquiries', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('crm_leads_updated', { detail: { id } }));
      window.dispatchEvent(new CustomEvent('wedding_inquiries_updated', { detail: { id } }));

      addToast({
        type: 'info',
        title: 'Lead Deleted',
        message: 'Record permanently removed',
      });
    },
    [addToast]
  );

  // 4. WEDDINGS CRUD OPERATIONS & CONVERSION
  const convertLeadToWedding = useCallback(
    (lead: AtelierLead): ManagedWedding => {
      const clientName = lead.fullName || lead.name || 'Esteemed Client';
      const partnerName =
        lead.partnerName && lead.partnerName.trim() !== ''
          ? lead.partnerName.trim()
          : 'Not Available';

      const destination = lead.destination || lead.location || 'Selected Destination';
      const weddingDate = lead.weddingDate || lead.eventDate || 'TBD';
      const guestCount = lead.guestCount || '250';
      const budget = lead.budget || lead.budgetEnvelope || 'Bespoke';

      const newWedding: ManagedWedding = {
        id: `wed-${Date.now()}`,
        clientName,
        partnerName,
        weddingDate,
        date: weddingDate,
        location: destination,
        destination,
        guestCount,
        budget,
        budgetAllocation: budget,
        aesthetic: (lead as any).aesthetic || 'Bespoke Directorial Commission',
        status: 'planning',
        notes: lead.notes || lead.vision || 'Commission converted directly from lead inquiry.',
        sourceLeadId: lead.id,
        createdAt: new Date().toISOString(),
        checklist: JSON.parse(JSON.stringify(DEFAULT_PLANNING_CHECKLIST)),
      };

      // Update weddings list
      setWeddings((prev) => {
        const next = [newWedding, ...prev.filter((w) => w.sourceLeadId !== lead.id)];
        localStorage.setItem('managed_weddings', JSON.stringify(next));
        localStorage.setItem('wedding_managed_projects', JSON.stringify(next));
        return next;
      });

      // Update lead status to 'won' / 'Booked'
      setLeads((prev) => {
        const next = prev.map((l) => (l.id === lead.id ? { ...l, status: 'won' as LeadStatus } : l));
        localStorage.setItem('crm_leads', JSON.stringify(next));
        localStorage.setItem('wedding_inquiries', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('managed_weddings_updated', { detail: newWedding }));
      window.dispatchEvent(new CustomEvent('crm_leads_updated'));
      window.dispatchEvent(new CustomEvent('wedding_inquiries_updated'));

      addToast({
        type: 'success',
        title: 'Commissioned into Weddings',
        message: `Project successfully commissioned into Weddings Management for ${clientName}.`,
      });

      return newWedding;
    },
    [addToast]
  );

  const addWedding = useCallback(
    (weddingData: Partial<ManagedWedding>): ManagedWedding => {
      const newWedding: ManagedWedding = {
        id: weddingData.id || `wed-${Date.now()}`,
        clientName: weddingData.clientName || 'Esteemed Client',
        partnerName:
          weddingData.partnerName && weddingData.partnerName.trim() !== ''
            ? weddingData.partnerName.trim()
            : 'Not Available',
        weddingDate: weddingData.weddingDate || weddingData.date || 'TBD',
        date: weddingData.weddingDate || weddingData.date || 'TBD',
        location: weddingData.location || weddingData.destination || 'Selected Palace',
        destination: weddingData.destination || weddingData.location || 'Selected Palace',
        guestCount: weddingData.guestCount || 300,
        budget: weddingData.budget || '₹3 Cr – ₹7 Cr',
        budgetAllocation: weddingData.budgetAllocation || weddingData.budget || '₹3 Cr – ₹7 Cr',
        aesthetic: weddingData.aesthetic || 'Royal Heritage & Candlelit Scenography',
        status: weddingData.status || 'planning',
        notes: weddingData.notes || '',
        sourceLeadId: weddingData.sourceLeadId,
        createdAt: weddingData.createdAt || new Date().toISOString(),
        checklist:
          weddingData.checklist && weddingData.checklist.length > 0
            ? weddingData.checklist
            : JSON.parse(JSON.stringify(DEFAULT_PLANNING_CHECKLIST)),
      };

      setWeddings((prev) => {
        const next = [newWedding, ...prev];
        localStorage.setItem('managed_weddings', JSON.stringify(next));
        localStorage.setItem('wedding_managed_projects', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('managed_weddings_updated', { detail: newWedding }));

      addToast({
        type: 'success',
        title: 'Wedding Project Created',
        message: `Commission opened for ${newWedding.clientName}.`,
      });

      return newWedding;
    },
    [addToast]
  );

  const updateWedding = useCallback(
    (id: string, updates: Partial<ManagedWedding>) => {
      setWeddings((prev) => {
        const next = prev.map((w) => (w.id === id ? { ...w, ...updates } : w));
        localStorage.setItem('managed_weddings', JSON.stringify(next));
        localStorage.setItem('wedding_managed_projects', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('managed_weddings_updated', { detail: { id, updates } }));

      addToast({
        type: 'success',
        title: 'Wedding Updated',
        message: 'Commission details synchronized.',
      });
    },
    [addToast]
  );

  const updateWeddingMilestone = useCallback(
    (weddingId: string, milestoneId: string, status: string, progress: number) => {
      const safeProg = Math.min(100, Math.max(0, progress));
      setWeddings((prev) => {
        const next = prev.map((w) => {
          if (w.id === weddingId) {
            const currentChecklist = w.checklist || DEFAULT_PLANNING_CHECKLIST;
            const updatedChecklist = currentChecklist.map((m) =>
              m.id === milestoneId ? { ...m, status, progress: safeProg } : m
            );
            return { ...w, checklist: updatedChecklist };
          }
          return w;
        });

        localStorage.setItem('managed_weddings', JSON.stringify(next));
        localStorage.setItem('wedding_managed_projects', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('managed_weddings_updated'));
    },
    []
  );

  const deleteWedding = useCallback(
    (id: string, _name?: string) => {
      setWeddings((prev) => {
        const next = prev.filter((w) => w.id !== id);
        localStorage.setItem('managed_weddings', JSON.stringify(next));
        localStorage.setItem('wedding_managed_projects', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('managed_weddings_updated', { detail: { id } }));

      addToast({
        type: 'info',
        title: 'Project Deleted',
        message: 'Record permanently removed',
      });
    },
    [addToast]
  );

  const clearMockWeddings = useCallback(() => {
    setWeddings((prev) => {
      const realOnly = prev.filter((w) => w.sourceLeadId || !w.id.startsWith('wed-00'));
      localStorage.setItem('managed_weddings', JSON.stringify(realOnly));
      localStorage.setItem('wedding_managed_projects', JSON.stringify(realOnly));
      return realOnly;
    });

    window.dispatchEvent(new CustomEvent('managed_weddings_updated'));

    addToast({
      type: 'success',
      title: 'Sample Data Cleared',
      message: 'Only real commissioned projects remain active.',
    });
  }, [addToast]);

  // 5. GUESTS CRUD OPERATIONS
  const addGuest = useCallback(
    (guestData: Omit<AtelierGuest, 'id' | 'createdAt'>): AtelierGuest => {
      const newGuest: AtelierGuest = {
        ...guestData,
        id: `gst-${Date.now()}`,
        name: guestData.name.trim(),
        groupSize: Number(guestData.groupSize) || 1,
        createdAt: new Date().toISOString(),
      };

      setGuests((prev) => {
        const next = [newGuest, ...prev];
        localStorage.setItem('atelier_guests', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('atelier_guests_updated', { detail: newGuest }));

      addToast({
        type: 'success',
        title: 'Guest Registered',
        message: `${newGuest.name} added to the royal registry.`,
      });

      return newGuest;
    },
    [addToast]
  );

  const updateGuest = useCallback(
    (id: string, updates: Partial<AtelierGuest>) => {
      setGuests((prev) => {
        const next = prev.map((g) => (g.id === id ? { ...g, ...updates } : g));
        localStorage.setItem('atelier_guests', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('atelier_guests_updated', { detail: { id, updates } }));

      addToast({
        type: 'success',
        title: 'Guest Updated',
        message: 'Guest preferences and RSVP updated.',
      });
    },
    [addToast]
  );

  const deleteGuest = useCallback(
    (id: string, _name?: string) => {
      setGuests((prev) => {
        const next = prev.filter((g) => g.id !== id);
        localStorage.setItem('atelier_guests', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('atelier_guests_updated', { detail: { id } }));

      addToast({
        type: 'info',
        title: 'Guest Removed',
        message: 'Record permanently removed',
      });
    },
    [addToast]
  );

  // 6. VENDORS CRUD OPERATIONS
  const addVendor = useCallback(
    (vendorData: Omit<AtelierVendor, 'id' | 'createdAt'>): AtelierVendor => {
      const newVendor: AtelierVendor = {
        ...vendorData,
        id: `vnd-${Date.now()}`,
        businessName: vendorData.businessName.trim(),
        createdAt: new Date().toISOString(),
      };

      setVendors((prev) => {
        const next = [newVendor, ...prev];
        localStorage.setItem('atelier_vendors', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('atelier_vendors_updated', { detail: newVendor }));

      addToast({
        type: 'success',
        title: 'Vendor Contracted',
        message: `${newVendor.businessName} assigned to production directory.`,
      });

      return newVendor;
    },
    [addToast]
  );

  const updateVendor = useCallback(
    (id: string, updates: Partial<AtelierVendor>) => {
      setVendors((prev) => {
        const next = prev.map((v) => (v.id === id ? { ...v, ...updates } : v));
        localStorage.setItem('atelier_vendors', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('atelier_vendors_updated', { detail: { id, updates } }));

      addToast({
        type: 'success',
        title: 'Vendor Updated',
        message: 'Vendor terms and production scope synchronized.',
      });
    },
    [addToast]
  );

  const deleteVendor = useCallback(
    (id: string, _businessName?: string) => {
      setVendors((prev) => {
        const next = prev.filter((v) => v.id !== id);
        localStorage.setItem('atelier_vendors', JSON.stringify(next));
        return next;
      });

      window.dispatchEvent(new CustomEvent('atelier_vendors_updated', { detail: { id } }));

      addToast({
        type: 'info',
        title: 'Vendor Removed',
        message: 'Record permanently removed',
      });
    },
    [addToast]
  );

  const value: AtelierDataContextType = {
    leads,
    addLead,
    updateLead,
    updateLeadStatus,
    deleteLead,
    convertLeadToWedding,

    weddings,
    addWedding,
    updateWedding,
    updateWeddingMilestone,
    deleteWedding,
    clearMockWeddings,

    guests,
    addGuest,
    updateGuest,
    deleteGuest,

    vendors,
    addVendor,
    updateVendor,
    deleteVendor,

    refreshAllData,
  };

  return <AtelierDataContext.Provider value={value}>{children}</AtelierDataContext.Provider>;
};

export const useAtelierData = () => {
  const context = useContext(AtelierDataContext);
  if (!context) {
    throw new Error('useAtelierData must be used within an AtelierDataProvider');
  }
  return context;
};
