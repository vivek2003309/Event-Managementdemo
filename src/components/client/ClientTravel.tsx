import React, { useState } from 'react';
import { TravelEntry } from '../../types/firebase';
import { useToast } from '../ui/Toast';
import {
  Plane,
  Car,
  Building,
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Users,
  MapPin,
  X,
} from 'lucide-react';

interface ClientTravelProps {
  userId: string;
}

const INITIAL_TRAVEL: TravelEntry[] = [
  {
    id: 'tr-1',
    userId: 'u1',
    guestName: 'Rahul & Priya (Bride & Groom)',
    arrivalDate: '2026-12-14',
    arrivalTime: '11:30 AM',
    departureDate: '2026-12-20',
    departureTime: '4:00 PM',
    hotel: 'The Leela Palace Udaipur',
    roomNumber: 'Maharaja Royal Presidential Suite 101',
    airportPickup: true,
    flightNumber: '6E-2415 (DEL-UDR)',
    notes: 'Luggage assistance for 8 bridal trousseau trunks. Chauffeur assigned.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tr-2',
    userId: 'u1',
    guestName: 'Kapoor Family (Immediate Groom)',
    arrivalDate: '2026-12-15',
    arrivalTime: '2:15 PM',
    departureDate: '2026-12-19',
    departureTime: '12:00 PM',
    hotel: 'Taj Lake Palace Udaipur',
    roomNumber: 'Lake View Luxury Suites (4 Rooms)',
    airportPickup: true,
    flightNumber: 'AI-471 (BOM-UDR)',
    notes: 'Two luxury Mercedes Sprinter vans reserved at Maharana Pratap Airport.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tr-3',
    userId: 'u1',
    guestName: 'Singhania Family (Immediate Bride)',
    arrivalDate: '2026-12-15',
    arrivalTime: '1:45 PM',
    departureDate: '2026-12-19',
    departureTime: '1:00 PM',
    hotel: 'The Oberoi Udaivilas',
    roomNumber: 'Kohinoor Villa & Premier Suites',
    airportPickup: true,
    flightNumber: 'UK-921 (DEL-UDR)',
    notes: 'Traditional Mewari rose garland greeting arranged at arrivals gate.',
    createdAt: new Date().toISOString(),
  },
];

export const ClientTravel: React.FC<ClientTravelProps> = ({ userId }) => {
  const { addToast } = useToast();
  const storageKey = `twd_client_travel_${userId}`;

  const [entries, setEntries] = useState<TravelEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`twd_client_travel_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TRAVEL;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync to storage
  const updateEntriesAndStorage = (newEntries: TravelEntry[]) => {
    setEntries(newEntries);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newEntries));
    } catch (e) {}
  };

  // Form
  const [guestName, setGuestName] = useState('');
  const [arrivalDate, setArrivalDate] = useState('2026-12-16');
  const [arrivalTime, setArrivalTime] = useState('12:00 PM');
  const [departureDate, setDepartureDate] = useState('2026-12-19');
  const [hotel, setHotel] = useState('The Leela Palace Udaipur');
  const [roomNumber, setRoomNumber] = useState('Palace Heritage Room');
  const [airportPickup, setAirportPickup] = useState(true);
  const [flightNumber, setFlightNumber] = useState('');

  const handleAddTravel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newEntry: TravelEntry = {
      id: `tr-${Date.now()}`,
      userId,
      guestName: guestName.trim(),
      arrivalDate,
      arrivalTime,
      departureDate,
      hotel,
      roomNumber,
      airportPickup,
      flightNumber,
      createdAt: new Date().toISOString(),
    };

    updateEntriesAndStorage([newEntry, ...entries]);
    setIsModalOpen(false);
    setGuestName('');
    addToast({
      type: 'success',
      title: 'Itinerary Logged',
      message: `Travel coordination entry added for ${guestName}.`,
    });
  };

  const handleDelete = (id: string) => {
    updateEntriesAndStorage(entries.filter((e) => e.id !== id));
    addToast({ type: 'info', title: 'Removed', message: 'Travel entry deleted.' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs">
        <div>
          <h2 className="font-serif text-[22px] text-[#171717]">
            Guest Travel, Transit &amp; Hotel Allocation
          </h2>
          <p className="text-[12px] text-[#77736D] font-light">
            Flight schedules, airport chauffeur coordination, and luxury palace suite rooming lists
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#C6A66B]" />
          <span>Add Travel Entry</span>
        </button>
      </div>

      {/* Travel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-4 hover:border-[#C6A66B] transition-colors relative"
          >
            <div className="flex items-start justify-between gap-2 border-b border-[#F2EEE6] pb-3">
              <div>
                <h3 className="font-serif text-[17px] text-[#171717] font-medium">
                  {entry.guestName}
                </h3>
                {entry.flightNumber && (
                  <span className="text-[11px] text-[#8C6D37] font-mono flex items-center gap-1 mt-0.5">
                    <Plane className="w-3 h-3" />
                    Flight: {entry.flightNumber}
                  </span>
                )}
              </div>

              <span
                className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-[2px] border ${
                  entry.airportPickup
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {entry.airportPickup ? 'Chauffeur Picked' : 'Self Transit'}
              </span>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-2 gap-2 text-[12px] bg-[#FAF8F5] p-3 rounded-[6px] border border-[#EAE5DC]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#77736D] block">
                  Arrival
                </span>
                <span className="font-medium text-[#171717] block">{entry.arrivalDate}</span>
                <span className="text-[11px] text-[#77736D]">{entry.arrivalTime || 'TBD'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-[#77736D] block">
                  Departure
                </span>
                <span className="font-medium text-[#171717] block">{entry.departureDate}</span>
                <span className="text-[11px] text-[#77736D]">{entry.departureTime || 'TBD'}</span>
              </div>
            </div>

            {/* Hotel & Room */}
            <div className="space-y-1 text-[12px]">
              <div className="flex items-center gap-1.5 text-[#171717] font-medium">
                <Building className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>{entry.hotel}</span>
              </div>
              {entry.roomNumber && (
                <div className="text-[11px] text-[#77736D] pl-5 font-mono">
                  Room: {entry.roomNumber}
                </div>
              )}
            </div>

            {entry.notes && (
              <p className="text-[11px] text-[#77736D] italic border-t border-[#F2EEE6] pt-2">
                "{entry.notes}"
              </p>
            )}

            <div className="flex justify-end pt-2 border-t border-[#F2EEE6]">
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-[11px] text-[#9C968C] hover:text-rose-600 transition-colors cursor-pointer"
              >
                Delete Entry
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-[12px] shadow-2xl border border-[#EAE5DC] overflow-hidden">
            <div className="p-5 bg-[#FAF8F5] border-b border-[#EAE5DC] flex items-center justify-between">
              <h3 className="font-serif text-[18px] text-[#171717]">Add Travel Coordination</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#77736D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTravel} className="p-5 space-y-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Guest / Family Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verma Family (4 Guests)"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Arrival Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2:30 PM"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Hotel Property
                  </label>
                  <input
                    type="text"
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Room / Suite
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Suite 305"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Flight / Transit Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6E-204"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px]"
                />
              </div>

              <label className="flex items-center gap-2 text-[12px] text-[#171717] pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={airportPickup}
                  onChange={(e) => setAirportPickup(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C6A66B]"
                />
                <span>Airport Pickup Chauffeur Required</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-[4px] text-[11px] uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#171717] text-white rounded-[4px] text-[11px] uppercase tracking-wider font-semibold hover:bg-[#C6A66B]"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
