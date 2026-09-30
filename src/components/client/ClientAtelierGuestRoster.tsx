/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ClientAtelierGuestRoster Component
 * Client Sanctuary Guest Roster & RSVP Management.
 * Allows the couple to view their wedding's guests, add attendees, update RSVPs,
 * and mark VIP airport transport fleet needs.
 * Synchronized with "atelier_guests".
 */

import React, { useState, useMemo, useEffect } from 'react';
import { AtelierGuest } from '../../data/seedAtelierData';
import { useToast } from '../ui/Toast';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit3,
  Car,
  Plane,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Phone,
  Mail,
  Home,
  Utensils,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ClientAtelierGuestRosterProps {
  weddingId: string;
  weddingName: string;
  guests: AtelierGuest[];
  onGuestsUpdated: (updatedGuests: AtelierGuest[]) => void;
}

const STORAGE_KEY = 'atelier_guests';

export const ClientAtelierGuestRoster: React.FC<ClientAtelierGuestRosterProps> = ({
  weddingId,
  weddingName,
  guests,
  onGuestsUpdated,
}) => {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [transportOnly, setTransportOnly] = useState(false);
  const [rsvpFilter, setRsvpFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<AtelierGuest | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formGroupSize, setFormGroupSize] = useState(1);
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRsvp, setFormRsvp] = useState<'Confirmed' | 'Pending' | 'Declined'>('Confirmed');
  const [formDiet, setFormDiet] = useState('Vegetarian');
  const [formRoom, setFormRoom] = useState('Royal Heritage Suite');
  const [formTransport, setFormTransport] = useState(true);
  const [formNotes, setFormNotes] = useState('');

  // Persist helper
  const saveGuestChanges = (updatedWeddingGuests: AtelierGuest[]) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allGuests: AtelierGuest[] = stored ? JSON.parse(stored) : [];
      // Keep other weddings' guests and update this wedding's guests
      const otherGuests = allGuests.filter(
        (g) => g.weddingId !== weddingId && !g.weddingName.includes(weddingName.split(' ')[0])
      );
      const newAllGuests = [...updatedWeddingGuests, ...otherGuests];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAllGuests));
      window.dispatchEvent(new CustomEvent('atelier_guests_updated'));
      onGuestsUpdated(updatedWeddingGuests);
    } catch (e) {
      console.error(e);
      onGuestsUpdated(updatedWeddingGuests);
    }
  };

  const handleOpenAdd = () => {
    setEditingGuest(null);
    setFormName('');
    setFormGroupSize(1);
    setFormPhone('');
    setFormEmail('');
    setFormRsvp('Confirmed');
    setFormDiet('Vegetarian (Royal Mewari)');
    setFormRoom('Lake View Suite');
    setFormTransport(true);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guest: AtelierGuest) => {
    setEditingGuest(guest);
    setFormName(guest.name);
    setFormGroupSize(guest.groupSize || 1);
    setFormPhone(guest.phone || '');
    setFormEmail(guest.email || '');
    setFormRsvp(guest.rsvpStatus);
    setFormDiet(guest.dietPreference || '');
    setFormRoom(guest.roomAllocation || '');
    setFormTransport(guest.transportNeeded);
    setFormNotes(guest.notes || '');
    setIsModalOpen(true);
  };

  const handleDelete = (guestId: string, _name: string) => {
    const next = guests.filter((g) => g.id !== guestId);
    saveGuestChanges(next);
    addToast({
      type: 'info',
      title: 'Guest Removed',
      message: 'Record permanently removed',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingGuest) {
      const next = guests.map((g) =>
        g.id === editingGuest.id
          ? {
              ...g,
              name: formName.trim(),
              groupSize: Number(formGroupSize) || 1,
              phone: formPhone.trim(),
              email: formEmail.trim(),
              rsvpStatus: formRsvp,
              dietPreference: formDiet.trim(),
              roomAllocation: formRoom.trim(),
              transportNeeded: formTransport,
              notes: formNotes.trim(),
            }
          : g
      );
      saveGuestChanges(next);
      addToast({
        type: 'success',
        title: 'Guest Updated',
        message: `Preferences saved for ${formName}.`,
      });
    } else {
      const newGuest: AtelierGuest = {
        id: `gst-${Date.now()}`,
        name: formName.trim(),
        groupSize: Number(formGroupSize) || 1,
        phone: formPhone.trim(),
        email: formEmail.trim(),
        weddingId,
        weddingName,
        rsvpStatus: formRsvp,
        dietPreference: formDiet.trim(),
        roomAllocation: formRoom.trim(),
        transportNeeded: formTransport,
        notes: formNotes.trim(),
        createdAt: new Date().toISOString(),
      };
      saveGuestChanges([newGuest, ...guests]);
      addToast({
        type: 'success',
        title: 'Guest Registered',
        message: `${formName} added to your celebration roster.`,
      });
    }

    setIsModalOpen(false);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [transportOnly, rsvpFilter, searchQuery]);

  // Filter (Optimized with useMemo)
  const filtered = useMemo(() => {
    const list = guests.filter((g) => {
      if (transportOnly && !g.transportNeeded) return false;
      if (rsvpFilter !== 'all' && g.rsvpStatus !== rsvpFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          g.name.toLowerCase().includes(q) ||
          (g.phone && g.phone.includes(q)) ||
          (g.roomAllocation && g.roomAllocation.toLowerCase().includes(q))
        );
      }
      return true;
    });

    return [...list].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [guests, transportOnly, rsvpFilter, searchQuery]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const transportCount = useMemo(() => guests.filter((g) => g.transportNeeded).length, [guests]);
  const confirmedCount = useMemo(() => guests.filter((g) => g.rsvpStatus === 'Confirmed').length, [guests]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-[12px] p-5 sm:p-6 border border-[#C6A66B]/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#C6A66B]">
              Royal Nuptial Registry
            </span>
            <span className="text-white/20">&bull;</span>
            <span className="text-[11px] text-white/70">
              {guests.length} Dignitaries Invited
            </span>
          </div>
          <h2 className="font-serif text-[22px] sm:text-[26px] font-normal text-white mt-0.5">
            Your Guest Roster &amp; VIP Travel
          </h2>
          <p className="text-[12px] text-stone-300 font-light mt-0.5 max-w-xl">
            Manage your personal invitations, dietary selections, palace suite keys, and chauffeur airport transfers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-[4px] bg-[#C6A66B] hover:bg-[#b5955a] text-black font-semibold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Guest</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-[8px] border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#77736D] block">
              Invited Dignitaries
            </span>
            <span className="font-serif text-[22px] text-[#171717] mt-0.5 block">
              {guests.length}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#FAF8F5] text-[#8C6D37] flex items-center justify-center border border-[#EAE5DC]">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#77736D] block">
              Confirmed Attendance
            </span>
            <span className="font-serif text-[22px] text-emerald-800 mt-0.5 block">
              {confirmedCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-[8px] border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#77736D] block">
              Airport Chauffeurs Required
            </span>
            <span className="font-serif text-[22px] text-[#8C6D37] mt-0.5 block">
              {transportCount} Guests
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-amber-50 text-[#C6A66B] flex items-center justify-center border border-amber-200">
            <Plane className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[8px] border border-[#EAE5DC] p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77736D]" />
          <input
            type="text"
            placeholder="Search by name, suite, phone..."
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

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={rsvpFilter}
            onChange={(e) => setRsvpFilter(e.target.value)}
            className="bg-white border border-[#D6CEBE] text-[11px] py-1 px-2.5 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
          >
            <option value="all">All RSVP ({guests.length})</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
          </select>

          {/* Transport filter button */}
          <button
            onClick={() => setTransportOnly(!transportOnly)}
            className={`px-3 py-1 text-[11px] font-medium rounded-[4px] transition-all cursor-pointer flex items-center gap-1.5 border ${
              transportOnly
                ? 'bg-[#171717] text-[#C6A66B] border-[#171717] shadow-xs'
                : 'bg-[#FAF8F5] text-[#55524E] border-[#D6CEBE] hover:bg-[#F2EEE6]'
            }`}
          >
            <Car className={`w-3.5 h-3.5 ${transportOnly ? 'text-[#C6A66B]' : 'text-[#8C6D37]'}`} />
            <span>Transport Needed Only ({transportCount})</span>
          </button>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-[10px] border border-[#EAE5DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#EAE5DC] bg-[#FAF8F5] text-[10px] uppercase tracking-[0.12em] text-[#77736D] font-semibold">
                <th className="py-3 px-4">Guest Name &amp; Party</th>
                <th className="py-3 px-4">RSVP Status</th>
                <th className="py-3 px-4">Dietary Selection</th>
                <th className="py-3 px-4">Suite Allocation</th>
                <th className="py-3 px-4">VIP Fleet Transfer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F2EEE6]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                      <Users className="w-8 h-8 text-[#C6A66B] mx-auto stroke-[1.5]" />
                      <h4 className="font-serif text-[16px] text-[#171717]">No Guests Listed</h4>
                      <p className="text-[12px] text-[#77736D] font-light">
                        {searchQuery || transportOnly
                          ? 'No guests match the current filter parameters.'
                          : 'Click "+ Add Guest" above to register your first wedding attendee.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((g) => (
                  <tr key={g.id} className="hover:bg-[#FCFBF8] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#171717]">
                      <div className="flex items-center gap-1.5">
                        <span>{g.name}</span>
                        {g.groupSize > 1 && (
                          <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] border border-[#EAE5DC] text-[10px] font-mono text-[#8C6D37]">
                            +{g.groupSize - 1}
                          </span>
                        )}
                      </div>
                      {g.phone && (
                        <span className="text-[11px] text-[#77736D] block font-mono mt-0.5">
                          {g.phone}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {g.rsvpStatus === 'Confirmed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Confirmed
                        </span>
                      )}
                      {g.rsvpStatus === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-[#C5A059]" />
                          Pending
                        </span>
                      )}
                      {g.rsvpStatus === 'Declined' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Declined
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#55524E]">
                      <div className="flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-[#8C6D37]" />
                        <span>{g.dietPreference || 'Standard Menu'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#55524E]">
                      <div className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-[#C6A66B]" />
                        <span>{g.roomAllocation || 'Palace Suite'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {g.transportNeeded ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#171717] text-[#C6A66B] border border-[#C6A66B]/30 shadow-2xs">
                          <Plane className="w-3 h-3 text-[#C6A66B]" />
                          Luxury Chauffeur Transfer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF8F5] text-[#9C968C] border border-[#EAE5DC]">
                          Self / Not Required
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleOpenEdit(g);
                          }}
                          className="p-1.5 rounded-[3px] text-[#77736D] hover:text-[#171717] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                          title="Edit Preferences"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(g.id, g.name);
                          }}
                          className="p-1.5 rounded-[3px] text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove Guest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination Controls */}
        <div className="p-3 border-t border-[#EAE5DC] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#77736D]">
          <span>
            Displaying {filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} attendees ({guests.length} total)
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
            VIP Guest Directory
          </span>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-md w-full rounded-[10px] border border-[#EAE5DC] shadow-2xl overflow-hidden animate-fade-in my-8">
            <div className="p-4 bg-[#171717] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-semibold block">
                  {editingGuest ? 'Update Guest Dossier' : 'Add Celebration Dignitary'}
                </span>
                <h3 className="font-serif text-lg font-normal">
                  {editingGuest ? editingGuest.name : 'New Guest Registration'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-white/70 hover:text-white rounded-[4px] hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sameer Kapoor"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Party Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formGroupSize}
                    onChange={(e) => setFormGroupSize(Number(e.target.value))}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 11223"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    RSVP Status
                  </label>
                  <select
                    value={formRsvp}
                    onChange={(e) =>
                      setFormRsvp(e.target.value as 'Confirmed' | 'Pending' | 'Declined')
                    }
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Dietary Selection
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian / Vegan"
                    value={formDiet}
                    onChange={(e) => setFormDiet(e.target.value)}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Suite Allocation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Lake Pavilion"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Airport / Chauffeur Transport Toggle */}
              <div className="p-3 bg-[#FAF8F5] rounded-[6px] border border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#171717] block text-[12px]">
                    Requires Airport / Intercity Chauffeur
                  </span>
                  <span className="text-[10px] text-[#77736D] block">
                    Direct Mercedes transfer from arrival airport or railway terminal
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formTransport}
                    onChange={(e) => setFormTransport(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#171717]" />
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-[4px] bg-[#FAF8F5] text-[#77736D] text-[11px] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[4px] bg-[#171717] hover:bg-[#C6A66B] text-white text-[11px] font-medium uppercase tracking-wider transition-colors shadow-xs"
                >
                  {editingGuest ? 'Save Preferences' : 'Add Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
