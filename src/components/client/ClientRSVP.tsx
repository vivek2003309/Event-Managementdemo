import React, { useState } from 'react';
import { RSVPDocument, WeddingDocument } from '../../types/firebase';
import { FirestoreService } from '../../services/firestoreService';
import { useToast } from '../ui/Toast';
import {
  Heart,
  CheckCircle2,
  XCircle,
  Copy,
  Share2,
  Users,
  Utensils,
  Building,
  Car,
  Sparkles,
  Send,
  Calendar,
  MapPin,
} from 'lucide-react';

interface ClientRSVPProps {
  wedding: WeddingDocument;
  onRSVPSubmitted?: (rsvp: RSVPDocument) => void;
}

export const ClientRSVP: React.FC<ClientRSVPProps> = ({ wedding, onRSVPSubmitted }) => {
  const { addToast } = useToast();

  const [decision, setDecision] = useState<'yes' | 'no' | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [foodPreference, setFoodPreference] = useState('Vegetarian');
  const [hotelRequirement, setHotelRequirement] = useState('Yes');
  const [travelRequirement, setTravelRequirement] = useState('Airport Pickup Required');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Sample confirmed RSVPs
  const [recentRSVPs, setRecentRSVPs] = useState<RSVPDocument[]>([
    {
      weddingId: wedding.id || 'w-1',
      guestName: 'Kunal & Natasha Oberoi',
      attending: true,
      guestsCount: 2,
      dietary: 'Vegetarian',
      submittedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    },
    {
      weddingId: wedding.id || 'w-1',
      guestName: 'Anil Ambani & Family',
      attending: true,
      guestsCount: 4,
      dietary: 'Jain Catering',
      submittedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
    {
      weddingId: wedding.id || 'w-1',
      guestName: 'Vikram & Ritu Singhal',
      attending: false,
      guestsCount: 0,
      submittedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
  ]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/rsvp/${wedding.clientName.toLowerCase()}-${wedding.partnerName.toLowerCase()}`;
    navigator.clipboard.writeText(link);
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: 'Private RSVP sanctuary URL copied to clipboard.',
    });
  };

  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !decision) return;

    setIsSubmitting(true);
    try {
      const payload: Omit<RSVPDocument, 'id' | 'submittedAt'> = {
        weddingId: wedding.id || 'w-1',
        guestName: guestName.trim(),
        phone: guestPhone.trim(),
        attending: decision === 'yes',
        guestsCount: decision === 'yes' ? guestsCount : 0,
        dietary: foodPreference,
        songRequest: specialNotes,
      };

      const docId = await FirestoreService.submitRSVP(payload);
      const newRSVP: RSVPDocument = {
        id: docId,
        ...payload,
        submittedAt: new Date().toISOString(),
      };

      setRecentRSVPs([newRSVP, ...recentRSVPs]);
      setSubmittedSuccess(true);
      if (onRSVPSubmitted) onRSVPSubmitted(newRSVP);

      addToast({
        type: 'success',
        title: 'RSVP Received',
        message: `Response logged into master ledger for ${guestName}.`,
      });
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not record RSVP to Firestore.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. BRANDED ROYAL RSVP SUITE */}
      <div className="bg-[#FAF8F5] border border-[#C6A66B]/40 rounded-[12px] p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#C6A66B]/20 via-[#C6A66B] to-[#C6A66B]/20" />

        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EAE5DC] text-[10px] uppercase tracking-[0.25em] text-[#8C6D37] font-semibold">
            <Sparkles className="w-3 h-3 text-[#C6A66B]" />
            <span>Solemn Invitation &amp; Response</span>
          </div>

          <h2 className="font-serif text-[34px] sm:text-[44px] text-[#171717] font-normal leading-tight">
            {wedding.clientName} &amp; {wedding.partnerName}
          </h2>

          <div className="flex items-center justify-center gap-3 text-[12px] text-[#77736D] pb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
              {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#C6A66B]" />
              {wedding.location}
            </span>
          </div>

          <p className="font-serif italic text-[20px] text-[#171717] font-light">
            "Are you joining us?"
          </p>

          <p className="text-[13px] text-[#77736D] font-light leading-relaxed">
            Your presence will grace our royal celebrations across Udaipur's palaces. Please confirm your attendance below.
          </p>

          {/* ATTENDANCE BUTTONS */}
          {!submittedSuccess && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDecision('yes')}
                className={`w-full sm:w-auto px-6 py-3 rounded-[4px] text-[12px] uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  decision === 'yes'
                    ? 'bg-[#171717] text-[#F8F5EF] shadow-md ring-2 ring-[#C6A66B]'
                    : 'bg-white text-[#171717] border border-[#D6CEBE] hover:border-[#171717]'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${decision === 'yes' ? 'text-[#C6A66B]' : 'text-emerald-700'}`} />
                <span>Yes, I'll be there</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('no')}
                className={`w-full sm:w-auto px-6 py-3 rounded-[4px] text-[12px] uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  decision === 'no'
                    ? 'bg-rose-950 text-white shadow-md ring-2 ring-rose-400'
                    : 'bg-white text-[#77736D] border border-[#D6CEBE] hover:border-[#171717]'
                }`}
              >
                <XCircle className={`w-4 h-4 ${decision === 'no' ? 'text-white' : 'text-rose-600'}`} />
                <span>Sorry, can't make it</span>
              </button>
            </div>
          )}

          {/* FORM CONTAINER */}
          {decision && !submittedSuccess && (
            <form
              onSubmit={handleSubmitRSVP}
              className="mt-6 p-6 bg-white rounded-[10px] border border-[#EAE5DC] text-left space-y-4 shadow-sm animate-in fade-in duration-200"
            >
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Full Name / Couple Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Raghav & Sunita Singhal"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[13px] p-2.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Phone / WhatsApp (for airport greeting)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98200 12345"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[13px] p-2.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              {decision === 'yes' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                        Number of Attending Guests
                      </label>
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Number(e.target.value))}
                        className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[13px] p-2.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                      >
                        <option value={1}>1 Guest (Solo)</option>
                        <option value={2}>2 Guests (Couple)</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests (Family)</option>
                        <option value={5}>5+ Guests</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                        Food Preference
                      </label>
                      <select
                        value={foodPreference}
                        onChange={(e) => setFoodPreference(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[13px] p-2.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                      >
                        <option value="Vegetarian">Pure Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian &amp; Royal Mughlai</option>
                        <option value="Jain">Pure Jain Catering</option>
                        <option value="Vegan">Vegan &amp; Gluten-Free</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                        Hotel Accommodation Requirement
                      </label>
                      <select
                        value={hotelRequirement}
                        onChange={(e) => setHotelRequirement(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[13px] p-2.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                      >
                        <option value="Yes">Yes &bull; Palace Suite Required</option>
                        <option value="No">No &bull; Self-Arranged Accommodation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                        Travel &amp; Airport Concierge
                      </label>
                      <select
                        value={travelRequirement}
                        onChange={(e) => setTravelRequirement(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[13px] p-2.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                      >
                        <option value="Airport Pickup Required">Airport Pickup &bull; Chauffeur</option>
                        <option value="Local Transit Only">Local Palace Shuttles Only</option>
                        <option value="Self Drive">Self Drive / Own Transport</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Wishes &amp; Song Request for Sangeet Night
                </label>
                <input
                  type="text"
                  placeholder="e.g. Can't wait! Play Bole Chudiyan during sangeet..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[13px] p-2.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#171717] text-[#F8F5EF] text-[12px] font-medium uppercase tracking-[0.16em] rounded-[4px] hover:bg-[#C6A66B] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C6A66B]" />
                  <span>{isSubmitting ? 'Transmitting Response...' : 'Transmit RSVP to Master Ledger'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Success Card */}
          {submittedSuccess && (
            <div className="mt-6 p-6 bg-white rounded-[10px] border border-emerald-300 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-serif text-[22px] text-[#171717]">
                Thank You, {guestName}!
              </h3>
              <p className="text-[13px] text-[#77736D] font-light max-w-md mx-auto">
                Your response has been engraved into the royal wedding roster. Our hospitality directorship team will coordinate your suite and transit details.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmittedSuccess(false);
                  setDecision(null);
                  setGuestName('');
                }}
                className="text-[11px] text-[#8C6D37] uppercase font-semibold underline hover:opacity-80 pt-2 cursor-pointer"
              >
                Submit another response
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. SHAREABLE LINK & REAL-TIME RSVP TELEMETRY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Shareable Link Card */}
        <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-3">
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D37] block">
            Shareable Guest RSVP Link
          </span>
          <p className="text-[12px] text-[#77736D] font-light">
            Distribute via WhatsApp or print as QR code on physical cards.
          </p>
          <div className="p-2.5 rounded-[4px] bg-[#FAF8F5] border border-[#EAE5DC] text-[11px] font-mono text-[#171717] truncate select-all">
            {typeof window !== 'undefined'
              ? `${window.location.origin}/rsvp/${wedding.clientName.toLowerCase()}`
              : 'https://theweddingdreams.com/rsvp'}
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full py-2 bg-[#171717] text-[#F8F5EF] text-[11px] uppercase tracking-wider font-semibold rounded-[4px] hover:bg-[#C6A66B] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Copy Invitation Link</span>
          </button>
        </div>

        {/* Real-time Tally */}
        <div className="md:col-span-2 bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-3">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#8C6D37]">
              Live RSVP Roster Log ({recentRSVPs.length} Recorded)
            </span>
            <span className="text-[11px] text-[#77736D]">Syncs with Firestore</span>
          </div>

          <div className="space-y-2">
            {recentRSVPs.map((r, i) => (
              <div
                key={r.id || i}
                className="p-3 rounded-[6px] bg-[#FAF8F5] border border-[#EAE5DC] flex items-center justify-between text-[12px]"
              >
                <div className="space-y-0.5">
                  <strong className="text-[#171717] font-medium block">{r.guestName}</strong>
                  <span className="text-[11px] text-[#77736D]">
                    {r.attending ? `Party of ${r.guestsCount} &bull; ${r.dietary || 'Standard'}` : 'Unable to attend'}
                  </span>
                </div>

                <span
                  className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[2px] border ${
                    r.attending
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {r.attending ? 'Attending' : 'Declined'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
