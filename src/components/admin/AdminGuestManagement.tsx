/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AdminGuestManagement Component
 * Full CRUD Luxury Guest Directory for Atelier Directors.
 * Features: Wedding filter, "Transport Required Only" toggle, Name/Email/Phone search,
 * RSVP tracking, Room allocation, and Add/Edit Guest modal.
 * Persists in localStorage under key "atelier_guests".
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AtelierGuest, INITIAL_ATELIER_GUESTS } from '../../data/seedAtelierData';
import { ManagedWedding, INITIAL_WEDDINGS } from './mockWeddings';
import { useToast } from '../ui/Toast';
import {
  Users,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Car,
  Plane,
  Heart,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Phone,
  Mail,
  Home,
  Utensils,
  Sparkles,
  RefreshCw,
  Building,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const STORAGE_KEY = 'atelier_guests';
const WEDDINGS_STORAGE_KEY = 'managed_weddings';

export const AdminGuestManagement: React.FC = () => {
  const { addToast } = useToast();
  const [guests, setGuests] = useState<AtelierGuest[]>([]);
  const [weddings, setWeddings] = useState<ManagedWedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [selectedWeddingFilter, setSelectedWeddingFilter] = useState<string>('all');
  const [transportOnly, setTransportOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rsvpFilter, setRsvpFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<AtelierGuest | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    groupSize: 1,
    phone: '',
    email: '',
    weddingId: '',
    rsvpStatus: 'Confirmed' as 'Confirmed' | 'Pending' | 'Declined',
    dietPreference: 'Vegetarian (Royal Mewari)',
    roomAllocation: 'Palace Suite',
    transportNeeded: true,
    notes: '',
  });

  // Load weddings from localStorage
  const loadWeddingsList = useCallback(() => {
    try {
      const stored = localStorage.getItem(WEDDINGS_STORAGE_KEY) || localStorage.getItem('wedding_managed_projects');
      if (stored) {
        setWeddings(JSON.parse(stored));
      } else {
        setWeddings(INITIAL_WEDDINGS);
      }
    } catch {
      setWeddings(INITIAL_WEDDINGS);
    }
  }, []);

  // Load guests from localStorage
  const loadGuests = useCallback((isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setGuests(JSON.parse(stored));
      } else {
        setGuests(INITIAL_ATELIER_GUESTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ATELIER_GUESTS));
      }

      if (isManual) {
        addToast({
          type: 'success',
          title: 'Guest Roster Synced',
          message: 'Guest directory synchronized successfully.',
        });
      }
    } catch (e) {
      console.error('Failed to load atelier guests:', e);
      setGuests(INITIAL_ATELIER_GUESTS);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadWeddingsList();
    loadGuests();

    const handleSync = () => {
      loadGuests();
      loadWeddingsList();
    };

    window.addEventListener('atelier_guests_updated', handleSync);
    window.addEventListener('managed_weddings_updated', loadWeddingsList);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('atelier_guests_updated', handleSync);
      window.removeEventListener('managed_weddings_updated', loadWeddingsList);
      window.removeEventListener('storage', handleSync);
    };
  }, [loadGuests, loadWeddingsList]);

  // Persist helper
  const saveGuests = (updatedList: AtelierGuest[]) => {
    setGuests(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent('atelier_guests_updated'));
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const defaultWedId = weddings[0]?.id || 'wed-001';
    setEditingGuest(null);
    setFormData({
      name: '',
      groupSize: 1,
      phone: '',
      email: '',
      weddingId: defaultWedId,
      rsvpStatus: 'Confirmed',
      dietPreference: 'Vegetarian (Royal Mewari)',
      roomAllocation: 'Palace Suite',
      transportNeeded: true,
      notes: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (guest: AtelierGuest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      groupSize: guest.groupSize || 1,
      phone: guest.phone || '',
      email: guest.email || '',
      weddingId: guest.weddingId,
      rsvpStatus: guest.rsvpStatus,
      dietPreference: guest.dietPreference || '',
      roomAllocation: guest.roomAllocation || '',
      transportNeeded: guest.transportNeeded,
      notes: guest.notes || '',
    });
    setIsModalOpen(true);
  };

  // Delete Guest
  const handleDeleteGuest = (idOrGuest: string | AtelierGuest) => {
    const guestId = typeof idOrGuest === 'string' ? idOrGuest : idOrGuest.id;
    if (!guestId) return;

    setGuests((prev) => {
      const updated = prev.filter((g) => g.id !== guestId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    window.dispatchEvent(new CustomEvent('atelier_guests_updated', { detail: { id: guestId } }));

    addToast({
      type: 'info',
      title: 'Guest Removed',
      message: 'Record permanently removed',
    });
  };

  // Save Add/Edit
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter guest name.');
      return;
    }

    const assignedWedding = weddings.find((w) => w.id === formData.weddingId);
    const weddingName = assignedWedding
      ? `${assignedWedding.clientName}${assignedWedding.partnerName && assignedWedding.partnerName !== 'Not Available' ? ' & ' + assignedWedding.partnerName : ''}`
      : 'Bespoke Wedding Project';

    if (editingGuest) {
      // Update
      const updatedList = guests.map((g) =>
        g.id === editingGuest.id
          ? {
              ...g,
              name: formData.name.trim(),
              groupSize: Number(formData.groupSize) || 1,
              phone: formData.phone.trim(),
              email: formData.email.trim(),
              weddingId: formData.weddingId,
              weddingName,
              rsvpStatus: formData.rsvpStatus,
              dietPreference: formData.dietPreference.trim(),
              roomAllocation: formData.roomAllocation.trim(),
              transportNeeded: formData.transportNeeded,
              notes: formData.notes.trim(),
            }
          : g
      );
      saveGuests(updatedList);
      addToast({
        type: 'success',
        title: 'Guest Updated',
        message: `Preferences updated for ${formData.name}.`,
      });
    } else {
      // Create
      const newGuest: AtelierGuest = {
        id: `gst-${Date.now()}`,
        name: formData.name.trim(),
        groupSize: Number(formData.groupSize) || 1,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        weddingId: formData.weddingId,
        weddingName,
        rsvpStatus: formData.rsvpStatus,
        dietPreference: formData.dietPreference.trim(),
        roomAllocation: formData.roomAllocation.trim(),
        transportNeeded: formData.transportNeeded,
        notes: formData.notes.trim(),
        createdAt: new Date().toISOString(),
      };
      saveGuests([newGuest, ...guests]);
      addToast({
        type: 'success',
        title: 'Guest Registered',
        message: `${formData.name} added to the royal guest list.`,
      });
    }

    setIsModalOpen(false);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedWeddingFilter, transportOnly, searchQuery, rsvpFilter]);

  // Filtered & Sorted Guests (Optimized with useMemo)
  const filteredGuests = useMemo(() => {
    const list = guests.filter((guest) => {
      // Wedding Project filter
      if (selectedWeddingFilter !== 'all' && guest.weddingId !== selectedWeddingFilter) {
        return false;
      }

      // Transport Filter
      if (transportOnly && !guest.transportNeeded) {
        return false;
      }

      // RSVP Filter
      if (rsvpFilter !== 'all' && guest.rsvpStatus !== rsvpFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (guest.name || '').toLowerCase().includes(q);
        const matchesPhone = (guest.phone || '').toLowerCase().includes(q);
        const matchesEmail = (guest.email || '').toLowerCase().includes(q);
        const matchesDiet = (guest.dietPreference || '').toLowerCase().includes(q);
        const matchesRoom = (guest.roomAllocation || '').toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesEmail || matchesDiet || matchesRoom;
      }

      return true;
    });

    return [...list].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [guests, selectedWeddingFilter, transportOnly, rsvpFilter, searchQuery]);

  const totalPages = Math.ceil(filteredGuests.length / pageSize) || 1;
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredGuests.slice(start, start + pageSize);
  }, [filteredGuests, currentPage, pageSize]);

  // Derived counts
  const totalCount = guests.length;
  const transportCount = guests.filter((g) => g.transportNeeded).length;
  const confirmedCount = guests.filter((g) => g.rsvpStatus === 'Confirmed').length;

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-[10px] border border-[#EAE5DC] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[18px] sm:text-[22px] text-[#171717] font-normal">
              Atelier Luxury Guest Directory ({totalCount})
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FAF8F5] text-[#8C6D37] border border-[#EAE5DC]">
              Directorial Concierge
            </span>
          </div>
          <p className="text-[12px] text-[#77736D] mt-0.5 font-light">
            Centralized invitation registry, suite allocations, dietary purveying, and VIP airport transfer fleet management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Guest Button */}
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 rounded-[4px] bg-[#171717] hover:bg-[#C6A66B] text-white text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Guest</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={() => loadGuests(true)}
            disabled={isRefreshing}
            className="p-2 rounded-[4px] bg-[#FAF8F5] hover:bg-[#F2EEE6] text-[#77736D] border border-[#D6CEBE] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Roster"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-[8px] border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#77736D] block">
              Total Dignitaries &amp; Guests
            </span>
            <span className="font-serif text-[20px] text-[#171717] mt-0.5 block">
              {totalCount}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#8C6D37] flex items-center justify-center border border-[#EAE5DC]">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[8px] border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#77736D] block">
              Confirmed RSVPs
            </span>
            <span className="font-serif text-[20px] text-emerald-800 mt-0.5 block">
              {confirmedCount}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[8px] border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#77736D] block">
              Chauffeur / Airport Transfers
            </span>
            <span className="font-serif text-[20px] text-[#8C6D37] mt-0.5 block">
              {transportCount} Guests
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-50 text-[#C6A66B] flex items-center justify-center border border-amber-200">
            <Plane className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Controls (Requirement 1) */}
      <div className="bg-white rounded-[8px] border border-[#EAE5DC] p-3 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77736D]" />
          <input
            type="text"
            placeholder="Search by name, phone, email, suite..."
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

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Wedding Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold">
              Project:
            </span>
            <select
              value={selectedWeddingFilter}
              onChange={(e) => setSelectedWeddingFilter(e.target.value)}
              className="bg-white border border-[#D6CEBE] text-[11px] py-1 px-2.5 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
            >
              <option value="all">All Celebrations ({totalCount})</option>
              {weddings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.clientName}
                  {w.partnerName && w.partnerName !== 'Not Available' ? ` & ${w.partnerName}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* RSVP Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold">
              RSVP:
            </span>
            <select
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value)}
              className="bg-white border border-[#D6CEBE] text-[11px] py-1 px-2 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
            >
              <option value="all">All</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          {/* Transport Required Only Quick-Filter Toggle (Requirement 1) */}
          <button
            onClick={() => setTransportOnly(!transportOnly)}
            className={`px-3 py-1 text-[11px] font-medium rounded-[4px] transition-all cursor-pointer flex items-center gap-1.5 border ${
              transportOnly
                ? 'bg-[#171717] text-[#C6A66B] border-[#171717] shadow-xs'
                : 'bg-[#FAF8F5] text-[#55524E] border-[#D6CEBE] hover:bg-[#F2EEE6]'
            }`}
          >
            <Car className={`w-3.5 h-3.5 ${transportOnly ? 'text-[#C6A66B]' : 'text-[#8C6D37]'}`} />
            <span>Transport Required Only ({transportCount})</span>
          </button>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-[10px] border border-[#EAE5DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#EAE5DC] bg-[#FAF8F5] text-[10px] uppercase tracking-[0.12em] text-[#77736D] font-semibold">
                <th className="py-3 px-4">Guest Name &amp; Party Size</th>
                <th className="py-3 px-4">Assigned Wedding</th>
                <th className="py-3 px-4">RSVP Status</th>
                <th className="py-3 px-4">Diet / Preference</th>
                <th className="py-3 px-4">Room &amp; Suite Allocation</th>
                <th className="py-3 px-4">Airport / Fleet Transfer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F2EEE6]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] text-[#C6A66B] flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <h4 className="font-serif text-[18px] text-[#171717]">No Guests Match Filter</h4>
                      <p className="text-[12px] text-[#77736D] font-light">
                        {searchQuery || transportOnly || rsvpFilter !== 'all' || selectedWeddingFilter !== 'all'
                          ? 'Try resetting the transport filter or search query.'
                          : 'No guests currently registered. Click "+ Add Guest" to register celebration attendees.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedGuests.map((guest) => {
                  return (
                    <tr key={guest.id} className="hover:bg-[#FCFBF8] transition-colors group">
                      {/* Name & Group Size */}
                      <td className="py-3.5 px-4 font-medium text-[#171717]">
                        <div className="flex items-center gap-1.5">
                          <span>{guest.name}</span>
                          {guest.groupSize > 1 && (
                            <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] border border-[#EAE5DC] text-[10px] font-mono text-[#8C6D37]">
                              +{guest.groupSize - 1}
                            </span>
                          )}
                        </div>
                        {(guest.phone || guest.email) && (
                          <div className="text-[11px] text-[#77736D] flex items-center gap-2 mt-0.5">
                            {guest.phone && <span>{guest.phone}</span>}
                            {guest.phone && guest.email && <span>&bull;</span>}
                            {guest.email && <span className="font-mono">{guest.email}</span>}
                          </div>
                        )}
                      </td>

                      {/* Assigned Wedding */}
                      <td className="py-3.5 px-4 text-[#55524E]">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
                          <span className="truncate max-w-[160px]" title={guest.weddingName}>
                            {guest.weddingName}
                          </span>
                        </div>
                      </td>

                      {/* RSVP Status */}
                      <td className="py-3.5 px-4">
                        {guest.rsvpStatus === 'Confirmed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Confirmed
                          </span>
                        )}
                        {guest.rsvpStatus === 'Pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-[#C5A059]" />
                            Pending
                          </span>
                        )}
                        {guest.rsvpStatus === 'Declined' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Declined
                          </span>
                        )}
                      </td>

                      {/* Diet Preference */}
                      <td className="py-3.5 px-4 text-[#55524E]">
                        <div className="flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-[#8C6D37] shrink-0" />
                          <span className="truncate max-w-[140px]" title={guest.dietPreference}>
                            {guest.dietPreference || 'Standard Menu'}
                          </span>
                        </div>
                      </td>

                      {/* Room / Suite Allocation */}
                      <td className="py-3.5 px-4 text-[#55524E]">
                        <div className="flex items-center gap-1.5">
                          <Home className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
                          <span className="truncate max-w-[150px]" title={guest.roomAllocation}>
                            {guest.roomAllocation || 'Unassigned Suite'}
                          </span>
                        </div>
                      </td>

                      {/* Transport Badge (Requirement 1: Gold Luxury or Muted) */}
                      <td className="py-3.5 px-4">
                        {guest.transportNeeded ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#171717] text-[#C6A66B] border border-[#C6A66B]/40 shadow-xs">
                            <Plane className="w-3 h-3 text-[#C6A66B]" />
                            Luxury Airport Transfer
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF8F5] text-[#9C968C] border border-[#EAE5DC]">
                            Self / Not Required
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(guest);
                            }}
                            className="p-1.5 rounded-[3px] text-[#77736D] hover:text-[#171717] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                            title="Edit Guest Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteGuest(guest);
                            }}
                            className="p-1.5 rounded-[3px] text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Guest"
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

        {/* Footer info & Pagination Controls */}
        <div className="p-3 border-t border-[#EAE5DC] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#77736D]">
          <span>
            Displaying {filteredGuests.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredGuests.length)} of {filteredGuests.length} guests ({totalCount} total)
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
            Storage: Local Storage (atelier_guests)
          </span>
        </div>
      </div>

      {/* Add / Edit Guest Modal (Requirement 1) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-md w-full rounded-[10px] border border-[#EAE5DC] shadow-2xl overflow-hidden animate-fade-in my-8">
            <div className="p-4 bg-[#171717] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-semibold block">
                  {editingGuest ? 'Update Guest Profile' : 'Register Dignitary Guest'}
                </span>
                <h3 className="font-serif text-lg font-normal">
                  {editingGuest ? editingGuest.name : 'New Celebration Guest'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-white/70 hover:text-white rounded-[4px] hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4 text-xs">
              {/* Name & Group Size */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Guest / Lead Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Group Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.groupSize}
                    onChange={(e) => setFormData({ ...formData, groupSize: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Contact Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 11223"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="guest@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Assigned Wedding */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                  Assigned Wedding Celebration
                </label>
                <select
                  value={formData.weddingId}
                  onChange={(e) => setFormData({ ...formData, weddingId: e.target.value })}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                >
                  {weddings.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.clientName}
                      {w.partnerName && w.partnerName !== 'Not Available' ? ` & ${w.partnerName}` : ''} ({w.location || w.destination})
                    </option>
                  ))}
                </select>
              </div>

              {/* RSVP & Diet */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    RSVP Status
                  </label>
                  <select
                    value={formData.rsvpStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rsvpStatus: e.target.value as 'Confirmed' | 'Pending' | 'Declined',
                      })
                    }
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Dietary Preference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Jain / Vegan"
                    value={formData.dietPreference}
                    onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value })}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Room / Suite Allocation */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                  Room / Suite Allocation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lake View Royal Suite 204"
                  value={formData.roomAllocation}
                  onChange={(e) => setFormData({ ...formData, roomAllocation: e.target.value })}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              {/* Airport / Chauffeur Transport Toggle (Requirement 1) */}
              <div className="p-3 bg-[#FAF8F5] rounded-[6px] border border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#171717] block text-[12px]">
                    Requires Airport / Intercity Transport
                  </span>
                  <span className="text-[10px] text-[#77736D] block">
                    Fleet dispatch inclusive of luxury Mercedes chauffeur or airport escort
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.transportNeeded}
                    onChange={(e) =>
                      setFormData({ ...formData, transportNeeded: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#171717]" />
                </label>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                  Flight Coordinates &amp; Concierge Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Arrival terminal, flight number, baggage requirements..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-[4px] bg-[#FAF8F5] text-[#77736D] hover:text-[#171717] text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[4px] bg-[#171717] hover:bg-[#C6A66B] text-white text-[11px] font-medium uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  {editingGuest ? 'Save Changes' : 'Register Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
