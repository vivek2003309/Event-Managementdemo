/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AdminInquiriesTable Component
 * Real-time synchronized inquiries & consultation requests table.
 * Automatically loads from localStorage key "wedding_inquiries" and Firestore "inquiries",
 * with live update listeners, status management ('New', 'Contacted', 'Booked', 'Archived'),
 * and deletion capabilities for test entries.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useToast } from '../ui/Toast';
import { ManagedWedding, INITIAL_WEDDINGS, DEFAULT_PLANNING_CHECKLIST } from './mockWeddings';
import {
  Search,
  Filter,
  RefreshCw,
  Trash2,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronDown,
  User,
  Check,
  Eye,
  X,
  FileSpreadsheet,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface WeddingInquiry {
  id: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Booked' | 'Archived' | string;
  name?: string;
  fullName?: string;
  partnerName?: string;
  phone?: string;
  email?: string;
  contact?: string;
  weddingDate?: string;
  eventDate?: string;
  date?: string;
  destination?: string;
  budget?: string;
  budgetEnvelope?: string;
  guests?: string;
  guestCount?: string;
  notes?: string;
  vision?: string;
  source?: string;
}

const INITIAL_SAMPLE_INQUIRIES: WeddingInquiry[] = [
  {
    id: 'sample-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    status: 'New',
    name: 'Ananya Singhania',
    fullName: 'Ananya Singhania',
    partnerName: 'Kabir Oberoi',
    phone: '+91 98201 12345',
    email: 'ananya.singhania@luxuryweddings.in',
    contact: '+91 98201 12345 • ananya.singhania@luxuryweddings.in',
    weddingDate: '2026-11-18',
    eventDate: '2026-11-18',
    date: '2026-11-18',
    destination: 'Udaipur, Rajasthan (Lake Palace Takeover)',
    budget: '₹3 Cr – ₹7 Cr',
    budgetEnvelope: '₹3 Cr – ₹7 Cr',
    guests: '350',
    guestCount: '350',
    notes: 'Desire a 3-day royal palace celebration with sunset floating mandap and Sufi acoustic evening.',
    vision: 'Desire a 3-day royal palace celebration with sunset floating mandap and Sufi acoustic evening.',
    source: "Let's Talk Consultation Modal",
  },
  {
    id: 'sample-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
    status: 'Contacted',
    name: 'Rohan Mehra',
    fullName: 'Rohan Mehra',
    partnerName: 'Simran Bajaj',
    phone: '+91 98110 54321',
    email: 'rohan.mehra@atelierweddings.co',
    contact: '+91 98110 54321 • rohan.mehra@atelierweddings.co',
    weddingDate: '2027-01-24',
    eventDate: '2027-01-24',
    date: '2027-01-24',
    destination: 'South Goa Coast (Cliffside Estate)',
    budget: '₹1 Cr – ₹3 Cr',
    budgetEnvelope: '₹1 Cr – ₹3 Cr',
    guests: '200',
    guestCount: '200',
    notes: 'Bespoke coastal wedding with candlelit beachfront dinner and bohemian sangeet scenography.',
    vision: 'Bespoke coastal wedding with candlelit beachfront dinner and bohemian sangeet scenography.',
    source: "Let's Talk Consultation Modal",
  },
  {
    id: 'sample-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: 'Booked',
    name: 'Tara & Dev Dixit',
    fullName: 'Tara Sharma',
    partnerName: 'Dev Dixit',
    phone: '+44 7700 900123',
    email: 'tara.dev@dixitcelebrations.com',
    contact: '+44 7700 900123 • tara.dev@dixitcelebrations.com',
    weddingDate: '2026-12-05',
    eventDate: '2026-12-05',
    date: '2026-12-05',
    destination: 'Jaipur, Rajasthan (Rambagh Heritage)',
    budget: '₹7 Cr+ (Ultra Luxury)',
    budgetEnvelope: '₹7 Cr+',
    guests: '500',
    guestCount: '500',
    notes: 'Full heritage fort directorship, international guest transfers, and bespoke couture banqueting.',
    vision: 'Full heritage fort directorship, international guest transfers, and bespoke couture banqueting.',
    source: "Let's Talk Consultation Modal",
  }
];

export const AdminInquiriesTable: React.FC = () => {
  const { addToast } = useToast();
  const [inquiries, setInquiries] = useState<WeddingInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Booked' | 'Archived'>('All');
  
  // Detailed modal preview
  const [selectedInquiry, setSelectedInquiry] = useState<WeddingInquiry | null>(null);

  // Load inquiries from localStorage & Firestore
  const loadInquiries = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    
    try {
      // 1. Fetch from localStorage
      const localDataRaw = localStorage.getItem('wedding_inquiries');
      let localList: WeddingInquiry[] = [];
      
      if (localDataRaw) {
        try {
          localList = JSON.parse(localDataRaw);
        } catch (e) {
          console.error('Error parsing localStorage wedding_inquiries:', e);
        }
      } else {
        // Seed default sample test inquiries on first boot so admin is never empty
        localList = INITIAL_SAMPLE_INQUIRIES;
        localStorage.setItem('wedding_inquiries', JSON.stringify(localList));
      }

      // 2. Fetch from Firestore if available
      let firestoreList: WeddingInquiry[] = [];
      try {
        if (db) {
          const snap = await getDocs(collection(db, 'inquiries'));
          snap.forEach((docSnap) => {
            const data = docSnap.data();
            firestoreList.push({
              id: docSnap.id,
              createdAt: data.createdAt || new Date().toISOString(),
              status: data.status || 'New',
              name: data.name || data.fullName,
              fullName: data.fullName || data.name,
              partnerName: data.partnerName,
              phone: data.phone,
              email: data.email,
              contact: data.contact || `${data.phone || ''} • ${data.email || ''}`,
              weddingDate: data.weddingDate || data.eventDate || data.date,
              eventDate: data.eventDate || data.weddingDate,
              date: data.date || data.weddingDate,
              destination: data.destination,
              budget: data.budget || data.budgetEnvelope,
              budgetEnvelope: data.budgetEnvelope || data.budget,
              guests: data.guests || data.guestCount,
              guestCount: data.guestCount || data.guests,
              notes: data.notes || data.vision,
              vision: data.vision || data.notes,
              source: data.source || 'Firestore Inquiries Collection',
            });
          });
        }
      } catch (firestoreErr) {
        // Firestore offline / rules notice handled gracefully
        console.warn('Firestore sync note:', firestoreErr);
      }

      // 3. Merge & Deduplicate (prefer newest by id or createdAt)
      const mergedMap = new Map<string, WeddingInquiry>();
      
      // Add local items
      localList.forEach((item) => {
        mergedMap.set(item.id, item);
      });
      
      // Add firestore items
      firestoreList.forEach((item) => {
        mergedMap.set(item.id, item);
      });

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setInquiries(merged);
      setLastRefreshed(new Date());

      if (isManualRefresh) {
        addToast({
          type: 'success',
          title: 'Inquiries Synchronized',
          message: `Loaded ${merged.length} consultation inquiries.`,
        });
      }
    } catch (err) {
      console.error('Error loading inquiries:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast]);

  // Initial load & Event Listeners for real-time live sync
  useEffect(() => {
    loadInquiries();

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'wedding_inquiries' || !e.key) {
        loadInquiries();
      }
    };

    const handleCustomUpdate = (e: Event) => {
      loadInquiries();
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('wedding_inquiries_updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('wedding_inquiries_updated', handleCustomUpdate);
    };
  }, [loadInquiries]);

  // Status Change Handler
  const handleStatusChange = (id: string, newStatus: string) => {
    const updated = inquiries.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setInquiries(updated);
    localStorage.setItem('wedding_inquiries', JSON.stringify(updated));
    localStorage.setItem('crm_leads', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wedding_inquiries_updated', { detail: { id, status: newStatus } }));
    window.dispatchEvent(new CustomEvent('crm_leads_updated', { detail: { id, status: newStatus } }));

    addToast({
      type: 'success',
      title: 'Status Updated',
      message: `Inquiry status changed to "${newStatus}".`,
    });
  };

  // Delete / Archive Lead Handler
  const handleDelete = (id: string, _name?: string) => {
    setInquiries((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('wedding_inquiries', JSON.stringify(updated));
      localStorage.setItem('crm_leads', JSON.stringify(updated));
      return updated;
    });

    window.dispatchEvent(new CustomEvent('wedding_inquiries_updated', { detail: { id } }));
    window.dispatchEvent(new CustomEvent('crm_leads_updated', { detail: { id } }));

    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }

    addToast({
      type: 'info',
      title: 'Lead Deleted',
      message: 'Record permanently removed',
    });
  };

  // Convert Inbound Lead/Inquiry directly into Managed Wedding
  const handleConvertToWedding = (item: WeddingInquiry) => {
    const clientName = item.fullName || item.name || 'Esteemed Client';
    const partnerName =
      item.partnerName && item.partnerName.trim() !== ''
        ? item.partnerName.trim()
        : 'Not Available';

    const destination = item.destination || 'Selected Destination';
    const dateVal = item.weddingDate || item.eventDate || item.date || 'TBD';
    const guestsVal = item.guestCount || item.guests || '250';
    const budgetVal = item.budget || item.budgetEnvelope || 'Bespoke';

    const newWedding: ManagedWedding = {
      id: `wed-${Date.now()}`,
      clientName,
      partnerName,
      weddingDate: dateVal,
      date: dateVal,
      location: destination,
      destination: destination,
      guestCount: guestsVal,
      budget: budgetVal,
      budgetAllocation: budgetVal,
      aesthetic: 'Bespoke Directorial Commission',
      status: 'planning',
      notes: item.notes || item.vision || 'Commission converted directly from inbound inquiry brief.',
      sourceLeadId: item.id,
      createdAt: new Date().toISOString(),
      checklist: JSON.parse(JSON.stringify(DEFAULT_PLANNING_CHECKLIST)),
    };

    // Save/append to managed_weddings & wedding_managed_projects in localStorage
    try {
      const existingRaw = localStorage.getItem('managed_weddings') || localStorage.getItem('wedding_managed_projects');
      const existing: ManagedWedding[] = existingRaw ? JSON.parse(existingRaw) : INITIAL_WEDDINGS;
      const updated = [newWedding, ...existing.filter((w) => w.sourceLeadId !== item.id)];
      localStorage.setItem('managed_weddings', JSON.stringify(updated));
      localStorage.setItem('wedding_managed_projects', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('managed_weddings_updated', { detail: newWedding }));
    } catch (e) {
      console.error('Failed to save converted wedding:', e);
    }

    // Automatically update inquiry status to 'Booked'
    handleStatusChange(item.id, 'Booked');

    addToast({
      type: 'success',
      title: 'Commissioned into Weddings',
      message: 'Project successfully commissioned into Weddings Management',
    });
  };

  // Quick Seed Test Inquiry (for rapid verification in dev/admin)
  const handleQuickAddTest = () => {
    const testNames = ['Aarav & Meera Kapoor', 'Pooja Hegde & Samrat', 'Natasha & Vikram Singhal'];
    const testCities = ['Udaipur, Rajasthan', 'Jaipur, Rajasthan', 'South Goa Coast'];
    const chosenName = testNames[Math.floor(Math.random() * testNames.length)];
    const chosenCity = testCities[Math.floor(Math.random() * testCities.length)];

    const testItem: WeddingInquiry = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'New',
      name: chosenName,
      fullName: chosenName,
      partnerName: 'Partner Name',
      phone: '+91 99000 88776',
      email: `test.${Date.now()}@theweddingdreams.com`,
      contact: `+91 99000 88776 • test.${Date.now()}@theweddingdreams.com`,
      weddingDate: '2026-12-25',
      eventDate: '2026-12-25',
      date: '2026-12-25',
      destination: chosenCity,
      budget: '₹3 Cr – ₹7 Cr',
      budgetEnvelope: '₹3 Cr – ₹7 Cr',
      guests: '300',
      guestCount: '300',
      notes: 'Generated test inquiry submission from Admin Panel quick action.',
      vision: 'Generated test inquiry submission from Admin Panel quick action.',
      source: "Admin Quick Test",
    };

    const updated = [testItem, ...inquiries];
    setInquiries(updated);
    localStorage.setItem('wedding_inquiries', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wedding_inquiries_updated', { detail: testItem }));

    addToast({
      type: 'success',
      title: 'Test Inquiry Created',
      message: `Simulated live submission for ${chosenName}.`,
    });
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Filtered & Sorted Inquiries (Optimized with useMemo)
  const filteredInquiries = useMemo(() => {
    const list = inquiries.filter((item) => {
      const matchesStatus =
        statusFilter === 'All' ||
        item.status?.toLowerCase() === statusFilter.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesStatus;

      const nameStr = (item.name || item.fullName || '').toLowerCase();
      const partnerStr = (item.partnerName || '').toLowerCase();
      const emailStr = (item.email || '').toLowerCase();
      const phoneStr = (item.phone || '').toLowerCase();
      const destStr = (item.destination || '').toLowerCase();
      const budgetStr = (item.budget || item.budgetEnvelope || '').toLowerCase();

      const matchesSearch =
        nameStr.includes(query) ||
        partnerStr.includes(query) ||
        emailStr.includes(query) ||
        phoneStr.includes(query) ||
        destStr.includes(query) ||
        budgetStr.includes(query);

      return matchesStatus && matchesSearch;
    });

    return [...list].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [inquiries, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredInquiries.length / pageSize) || 1;
  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInquiries.slice(start, start + pageSize);
  }, [filteredInquiries, currentPage, pageSize]);

  // Metric counts
  const counts = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status?.toLowerCase() === 'new').length,
    contacted: inquiries.filter((i) => i.status?.toLowerCase() === 'contacted').length,
    booked: inquiries.filter((i) => i.status?.toLowerCase() === 'booked').length,
    archived: inquiries.filter((i) => i.status?.toLowerCase() === 'archived').length,
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'new') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          New
        </span>
      );
    }
    if (s === 'contacted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Contacted
        </span>
      );
    }
    if (s === 'booked') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
          <Sparkles className="w-3 h-3 text-[#C5A059]" />
          Booked
        </span>
      );
    }
    if (s === 'archived') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
          Archived
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
        {status}
      </span>
    );
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;

      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setStatusFilter('All')}
          className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
            statusFilter === 'All'
              ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
              : 'bg-white text-[#171717] border-[#EAE5DC] hover:border-[#C6A66B]'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider block opacity-75">All Inquiries</span>
          <span className="font-serif text-xl sm:text-2xl font-normal">{counts.total}</span>
        </button>

        <button
          onClick={() => setStatusFilter('New')}
          className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
            statusFilter === 'New'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
              : 'bg-white text-emerald-800 border-emerald-200 hover:border-emerald-400'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider block opacity-75">New Leads</span>
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-xl sm:text-2xl font-normal">{counts.new}</span>
            {counts.new > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('Contacted')}
          className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
            statusFilter === 'Contacted'
              ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
              : 'bg-white text-blue-800 border-blue-200 hover:border-blue-400'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider block opacity-75">Contacted</span>
          <span className="font-serif text-xl sm:text-2xl font-normal">{counts.contacted}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Booked')}
          className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer ${
            statusFilter === 'Booked'
              ? 'bg-[#8C6D37] text-white border-[#8C6D37] shadow-sm'
              : 'bg-white text-[#8C6D37] border-[#EAE5DC] hover:border-[#C6A66B]'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider block opacity-75">Booked</span>
          <span className="font-serif text-xl sm:text-2xl font-normal">{counts.booked}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Archived')}
          className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            statusFilter === 'Archived'
              ? 'bg-neutral-800 text-white border-neutral-800 shadow-sm'
              : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider block opacity-75">Archived</span>
          <span className="font-serif text-xl sm:text-2xl font-normal">{counts.archived}</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[10px] border border-[#EAE5DC] shadow-xs overflow-hidden">
        {/* Table Controls Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE5DC] bg-[#FAF8F5] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Title & Live Status Indicator */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-[18px] sm:text-[20px] text-[#171717] font-normal">
                Directorial Inquiries &amp; Consultations
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-[11px] text-[#77736D] mt-0.5">
              Submissions from the &quot;Let&apos;s Talk&quot; Consultation modal appear here instantly.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77736D]" />
              <input
                type="text"
                placeholder="Search name, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#D6CEBE] text-[12px] pl-8 pr-7 py-1.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#77736D] hover:text-[#171717]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Test Button */}
            <button
              onClick={handleQuickAddTest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#FAF8F5] hover:bg-[#F2EEE6] text-[#8C6D37] border border-[#D6CEBE] text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer"
              title="Inject a test consultation inquiry into localStorage"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>+ Test Lead</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => loadInquiries(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#171717] hover:bg-[#C6A66B] text-white text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#EAE5DC] bg-[#FAF8F5] text-[10px] uppercase tracking-[0.12em] text-[#77736D] font-semibold">
                <th className="py-3 px-4">Name / Couple</th>
                <th className="py-3 px-4">Contact Coordinates</th>
                <th className="py-3 px-4">Wedding Date</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Budget Envelope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F2EEE6]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-28 mb-1" /><div className="h-3 bg-[#FAF8F5] rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-3 bg-[#F2EEE6] rounded w-32 mb-1" /><div className="h-3 bg-[#FAF8F5] rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-3 bg-[#F2EEE6] rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-3 bg-[#F2EEE6] rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-5 bg-[#F2EEE6] rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-3 bg-[#F2EEE6] rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-6 bg-[#F2EEE6] rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] text-[#C6A66B] flex items-center justify-center mx-auto">
                        <AlertCircle className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <h4 className="font-serif text-[16px] text-[#171717]">No Inquiries Found</h4>
                      <p className="text-[12px] text-[#77736D] font-light">
                        {searchQuery || statusFilter !== 'All'
                          ? 'Try clearing your search query or status filter.'
                          : 'No consultation submissions yet. Open the "Let\'s Talk" modal on any page to submit a live inquiry.'}
                      </p>
                      <button
                        onClick={handleQuickAddTest}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#171717] text-white text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Inject Sample Inquiry</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedInquiries.map((item) => {
                  const clientName = item.fullName || item.name || 'Unnamed Client';
                  const eventDateFormatted = item.weddingDate || item.eventDate || item.date || 'TBD';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FCFBF8] transition-colors group"
                    >
                      {/* Name Column */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#171717]">
                          {clientName}
                        </div>
                        {item.partnerName && (
                          <div className="text-[11px] text-[#8C6D37] flex items-center gap-1">
                            <span>&amp;</span>
                            <span>{item.partnerName}</span>
                          </div>
                        )}
                        {item.guests && (
                          <span className="text-[10px] text-[#77736D] block">
                            ~{item.guests} Guests
                          </span>
                        )}
                      </td>

                      {/* Contact Coordinates */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {item.phone && (
                          <a
                            href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}
                            className="flex items-center gap-1 text-[#171717] hover:text-[#C6A66B] transition-colors"
                          >
                            <Phone className="w-3 h-3 text-[#C6A66B] shrink-0" />
                            <span>{item.phone}</span>
                          </a>
                        )}
                        {item.email && (
                          <a
                            href={`mailto:${item.email}`}
                            className="flex items-center gap-1 text-[#77736D] hover:text-[#171717] transition-colors truncate max-w-[180px]"
                            title={item.email}
                          >
                            <Mail className="w-3 h-3 text-[#77736D] shrink-0" />
                            <span className="truncate">{item.email}</span>
                          </a>
                        )}
                      </td>

                      {/* Wedding Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-[#171717] whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
                          <span>{eventDateFormatted}</span>
                        </div>
                      </td>

                      {/* Destination */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-[#171717]">
                          <MapPin className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
                          <span className="truncate max-w-[150px]" title={item.destination}>
                            {item.destination || 'Unspecified'}
                          </span>
                        </div>
                      </td>

                      {/* Budget Envelope */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-[3px] bg-[#FAF8F5] border border-[#EAE5DC] text-[11px] font-medium text-[#8C6D37] whitespace-nowrap">
                          {item.budget || item.budgetEnvelope || 'Bespoke'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[#77736D]">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-[#9C968C]" />
                          <span>{formatTimestamp(item.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Convert to Managed Wedding Action Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConvertToWedding(item);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[3px] bg-[#171717] hover:bg-[#C6A66B] text-white text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                            title="Convert to Managed Wedding project"
                          >
                            <Sparkles className="w-3 h-3 text-[#C6A66B]" />
                            <span>Convert to Wedding</span>
                          </button>

                          {/* Quick Status Selector */}
                          <select
                            value={item.status || 'New'}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusChange(item.id, e.target.value);
                            }}
                            className="bg-white border border-[#D6CEBE] text-[11px] py-1 px-2 rounded-[3px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Booked">Booked</option>
                            <option value="Archived / Lost">Archived / Lost</option>
                            <option value="Lost">Mark as Lost</option>
                            <option value="Archived">Archived</option>
                          </select>

                          {/* View details */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInquiry(item);
                            }}
                            className="p-1 rounded-[3px] text-[#77736D] hover:text-[#171717] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                            title="View Full Inquiry Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete test entry */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(item.id, clientName);
                            }}
                            className="p-1 rounded-[3px] text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Lead / Test Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Bar & Pagination Controls */}
        <div className="p-3 border-t border-[#EAE5DC] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#77736D]">
          <span>
            Displaying {filteredInquiries.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredInquiries.length)} of {filteredInquiries.length} inquiries ({inquiries.length} total)
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-[3px] border border-[#D6CEBE] bg-white text-[#171717] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F5] cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-2 text-[#171717]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-[3px] border border-[#D6CEBE] bg-white text-[#171717] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F5] cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <span className="font-mono text-[10px]">
            Last Synced: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Inquiry Detail Dossier Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-[10px] border border-[#EAE5DC] shadow-xl overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 bg-[#171717] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-semibold block">
                  Client Inquiry Dossier &bull; ID: {selectedInquiry.id.slice(-6)}
                </span>
                <h3 className="font-serif text-lg font-normal">
                  {selectedInquiry.fullName || selectedInquiry.name}
                  {selectedInquiry.partnerName && ` & ${selectedInquiry.partnerName}`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-white/70 hover:text-white rounded-[4px] hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-3.5 rounded-[6px] border border-[#EAE5DC]">
                <div>
                  <span className="text-[#77736D] text-[10px] uppercase tracking-wider block">Status</span>
                  <div className="mt-1">{getStatusBadge(selectedInquiry.status)}</div>
                </div>
                <div>
                  <span className="text-[#77736D] text-[10px] uppercase tracking-wider block">Submitted</span>
                  <span className="font-medium text-[#171717] mt-1 block">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[#77736D] text-[10px] uppercase tracking-wider block">Destination</span>
                  <span className="font-medium text-[#171717] mt-1 block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C6A66B]" />
                    {selectedInquiry.destination || 'Not Specified'}
                  </span>
                </div>
                <div>
                  <span className="text-[#77736D] text-[10px] uppercase tracking-wider block">Wedding Date</span>
                  <span className="font-medium text-[#171717] mt-1 block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#C6A66B]" />
                    {selectedInquiry.weddingDate || selectedInquiry.eventDate || 'Tentative'}
                  </span>
                </div>
                <div>
                  <span className="text-[#77736D] text-[10px] uppercase tracking-wider block">Budget Envelope</span>
                  <span className="font-semibold text-[#8C6D37] mt-1 block">
                    {selectedInquiry.budget || selectedInquiry.budgetEnvelope || 'Bespoke'}
                  </span>
                </div>
                <div>
                  <span className="text-[#77736D] text-[10px] uppercase tracking-wider block">Guest Count</span>
                  <span className="font-medium text-[#171717] mt-1 block">
                    {selectedInquiry.guests || selectedInquiry.guestCount || 'Under 200'}
                  </span>
                </div>
              </div>

              {/* Direct Contact Coordinates */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#77736D] font-semibold block">
                  Direct Coordinates
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  {selectedInquiry.phone && (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="flex-1 py-2 px-3 rounded-[4px] bg-[#FAF8F5] border border-[#EAE5DC] text-[#171717] hover:border-[#C6A66B] flex items-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C6A66B]" />
                      <span>{selectedInquiry.phone}</span>
                    </a>
                  )}
                  {selectedInquiry.email && (
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="flex-1 py-2 px-3 rounded-[4px] bg-[#FAF8F5] border border-[#EAE5DC] text-[#171717] hover:border-[#C6A66B] flex items-center gap-2 truncate"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
                      <span className="truncate">{selectedInquiry.email}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Celebration Notes & Vision */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#77736D] font-semibold block mb-1">
                  Vision &amp; Specific Ceremonies
                </span>
                <div className="bg-[#FAF8F5] p-3 rounded-[6px] border border-[#EAE5DC] text-[#55524E] leading-relaxed">
                  {selectedInquiry.notes || selectedInquiry.vision || 'No additional vision notes provided in brief.'}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-[#EAE5DC] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#77736D]">Update Status:</span>
                <select
                  value={selectedInquiry.status || 'New'}
                  onChange={(e) => {
                    handleStatusChange(selectedInquiry.id, e.target.value);
                    setSelectedInquiry({ ...selectedInquiry, status: e.target.value });
                  }}
                  className="bg-white border border-[#D6CEBE] text-[11px] py-1 px-2.5 rounded-[4px] text-[#171717]"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Booked">Booked</option>
                  <option value="Lost">Mark as Lost</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleConvertToWedding(selectedInquiry);
                    setSelectedInquiry(null);
                  }}
                  className="px-3 py-1.5 rounded-[4px] bg-[#171717] text-white hover:bg-[#C6A66B] text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
                  <span>Convert to Managed Wedding</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(selectedInquiry.id, selectedInquiry.name);
                  }}
                  className="px-3 py-1.5 rounded-[4px] text-rose-600 hover:bg-rose-50 border border-rose-200 text-[11px] font-medium cursor-pointer"
                >
                  Delete Entry
                </button>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-3 py-1.5 rounded-[4px] bg-neutral-200 text-neutral-800 hover:bg-neutral-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
