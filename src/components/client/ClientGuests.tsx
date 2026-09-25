import React, { useState, useMemo } from 'react';
import { GuestDocument, RSVPStatus } from '../../types/firebase';
import { FirestoreService } from '../../services/firestoreService';
import { useToast } from '../ui/Toast';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  Car,
  Utensils,
  Filter,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface ClientGuestsProps {
  guests: GuestDocument[];
  userId: string;
  weddingId: string;
  onGuestsChanged: (guests: GuestDocument[]) => void;
}

const RSVP_BADGE: Record<
  RSVPStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  attending: { label: 'Attending', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  declined: { label: 'Declined', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
};

export const ClientGuests: React.FC<ClientGuestsProps> = ({
  guests,
  userId,
  weddingId,
  onGuestsChanged,
}) => {
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [functionFilter, setFunctionFilter] = useState<string>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestDocument | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formFunction, setFormFunction] = useState('All Functions');
  const [formRSVP, setFormRSVP] = useState<RSVPStatus>('pending');
  const [formHotel, setFormHotel] = useState(false);
  const [formTransport, setFormTransport] = useState(false);
  const [formFood, setFormFood] = useState('Vegetarian');

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        (g.phone && g.phone.includes(q)) ||
        (g.functionName && g.functionName.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || g.rsvpStatus === statusFilter;
      const matchesFunction = functionFilter === 'all' || g.functionName === functionFilter;

      return matchesSearch && matchesStatus && matchesFunction;
    });
  }, [guests, searchQuery, statusFilter, functionFilter]);

  const openAddModal = () => {
    setEditingGuest(null);
    setFormName('');
    setFormPhone('');
    setFormFunction('All Functions');
    setFormRSVP('pending');
    setFormHotel(false);
    setFormTransport(false);
    setFormFood('Vegetarian');
    setIsModalOpen(true);
  };

  const openEditModal = (guest: GuestDocument) => {
    setEditingGuest(guest);
    setFormName(guest.name);
    setFormPhone(guest.phone || '');
    setFormFunction(guest.functionName || 'All Functions');
    setFormRSVP(guest.rsvpStatus || 'pending');
    setFormHotel(Boolean(guest.hotelRequired));
    setFormTransport(Boolean(guest.transportRequired));
    setFormFood(guest.foodPreference || 'Vegetarian');
    setIsModalOpen(true);
  };

  const handleSaveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingGuest && editingGuest.id) {
      // Update
      try {
        const updates: Partial<GuestDocument> = {
          name: formName.trim(),
          phone: formPhone.trim(),
          functionName: formFunction,
          rsvpStatus: formRSVP,
          hotelRequired: formHotel,
          transportRequired: formTransport,
          foodPreference: formFood,
        };
        await FirestoreService.updateGuest(editingGuest.id, updates);
        const updatedList = guests.map((g) =>
          g.id === editingGuest.id ? { ...g, ...updates } : g
        );
        onGuestsChanged(updatedList);
        setIsModalOpen(false);
        addToast({
          type: 'success',
          title: 'Guest Updated',
          message: `${formName} updated successfully.`,
        });
      } catch (err) {
        addToast({ type: 'error', title: 'Error', message: 'Could not update guest.' });
      }
    } else {
      // Create
      try {
        const payload: Omit<GuestDocument, 'id' | 'createdAt'> = {
          userId,
          weddingId,
          name: formName.trim(),
          phone: formPhone.trim(),
          functionName: formFunction,
          rsvpStatus: formRSVP,
          hotelRequired: formHotel,
          transportRequired: formTransport,
          foodPreference: formFood,
        };
        const newId = await FirestoreService.addGuest(payload);
        const newDoc: GuestDocument = {
          id: newId,
          ...payload,
          createdAt: new Date().toISOString(),
        };
        onGuestsChanged([...guests, newDoc]);
        setIsModalOpen(false);
        addToast({
          type: 'success',
          title: 'Guest Added',
          message: `${formName} added to the invitation roster.`,
        });
      } catch (err) {
        addToast({ type: 'error', title: 'Error', message: 'Could not add guest.' });
      }
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!window.confirm('Remove this guest from the invitation roster?')) return;
    try {
      await FirestoreService.deleteGuest(guestId);
      const updated = guests.filter((g) => g.id !== guestId);
      onGuestsChanged(updated);
      addToast({
        type: 'info',
        title: 'Guest Removed',
        message: 'Guest removed from Firestore.',
      });
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Could not delete guest.' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs">
        <div>
          <h2 className="font-serif text-[22px] text-[#171717]">
            Guest Roster &amp; Concierge Hospitality
          </h2>
          <p className="text-[12px] text-[#77736D] font-light">
            Manage ceremonial invitations, royal palace hotel requirements, and dietary preferences
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#C6A66B]" />
          <span>Add Guest</span>
        </button>
      </div>

      {/* Toolbar: Search, Filters */}
      <div className="bg-white p-4 rounded-[10px] border border-[#EAE5DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77736D]" />
          <input
            type="text"
            placeholder="Search by name, phone, function..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] pl-9 pr-3 py-1.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D6CEBE] py-1.5 px-2.5 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B]"
          >
            <option value="all">All RSVP Statuses ({guests.length})</option>
            <option value="attending">Attending</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>

          <select
            value={functionFilter}
            onChange={(e) => setFunctionFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D6CEBE] py-1.5 px-2.5 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B]"
          >
            <option value="all">All Functions</option>
            <option value="All Functions">All Functions</option>
            <option value="Sangeet & Wedding">Sangeet &amp; Wedding</option>
            <option value="Reception">Reception Only</option>
          </select>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-[10px] border border-[#EAE5DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EAE5DC] text-[10px] uppercase tracking-[0.14em] text-[#77736D] font-semibold">
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Function</th>
                <th className="py-3 px-4">RSVP Status</th>
                <th className="py-3 px-4">Hotel Req.</th>
                <th className="py-3 px-4">Transport Req.</th>
                <th className="py-3 px-4">Food Preference</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F2EEE6]">
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => {
                  const badge = RSVP_BADGE[guest.rsvpStatus] || RSVP_BADGE.pending;
                  return (
                    <tr key={guest.id || guest.name} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3 px-4 font-serif font-medium text-[#171717]">
                        {guest.name}
                      </td>

                      <td className="py-3 px-4 text-[#77736D] font-mono text-[12px]">
                        {guest.phone || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-[2px] bg-[#FAF8F5] border border-[#EAE5DC] text-[11px] text-[#55524E]">
                          {guest.functionName || 'All Functions'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[2px] border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[12px]">
                        {guest.hotelRequired ? (
                          <span className="text-emerald-800 font-medium flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-[#C6A66B]" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-[#9C968C]">No</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[12px]">
                        {guest.transportRequired ? (
                          <span className="text-emerald-800 font-medium flex items-center gap-1">
                            <Car className="w-3.5 h-3.5 text-[#C6A66B]" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-[#9C968C]">No</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[12px]">
                        <span className="text-[#171717] font-medium">
                          {guest.foodPreference || 'Vegetarian'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(guest)}
                            className="p-1.5 text-[#77736D] hover:text-[#171717] hover:bg-black/5 rounded-[4px] transition-colors"
                            title="Edit Guest"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {guest.id && (
                            <button
                              onClick={() => handleDeleteGuest(guest.id!)}
                              className="p-1.5 text-[#77736D] hover:text-rose-600 hover:bg-rose-50 rounded-[4px] transition-colors"
                              title="Delete Guest"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#77736D] text-[13px]">
                    No guests matched your query. Add your first guest above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
        >
          <div className="bg-white w-full max-w-lg rounded-[12px] shadow-2xl border border-[#EAE5DC] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#FAF8F5] border-b border-[#EAE5DC] flex items-center justify-between">
              <h3 className="font-serif text-[18px] text-[#171717]">
                {editingGuest ? 'Edit Guest Information' : 'Add Guest to Roster'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#77736D] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Full Name / Couple
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sameer & Gayatri Kapoor"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 00000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Assigned Ceremonies
                  </label>
                  <select
                    value={formFunction}
                    onChange={(e) => setFormFunction(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  >
                    <option value="All Functions">All Functions (3 Days)</option>
                    <option value="Sangeet & Wedding">Sangeet &amp; Wedding</option>
                    <option value="Reception">Reception Gala</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={formRSVP}
                    onChange={(e) => setFormRSVP(e.target.value as RSVPStatus)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  >
                    <option value="attending">Attending</option>
                    <option value="pending">Pending</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Food Preference
                  </label>
                  <select
                    value={formFood}
                    onChange={(e) => setFormFood(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  >
                    <option value="Vegetarian">Pure Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Jain">Jain Catering</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-[12px] text-[#171717] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHotel}
                    onChange={(e) => setFormHotel(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C6A66B] focus:ring-0 cursor-pointer"
                  />
                  <span>Hotel Room Required</span>
                </label>

                <label className="flex items-center gap-2 text-[12px] text-[#171717] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formTransport}
                    onChange={(e) => setFormTransport(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C6A66B] focus:ring-0 cursor-pointer"
                  />
                  <span>Airport Transport Required</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D6CEBE] rounded-[4px] text-[11px] uppercase tracking-wider text-[#77736D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#171717] text-[#F8F5EF] rounded-[4px] text-[11px] uppercase tracking-wider font-semibold hover:bg-[#C6A66B] transition-colors"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
