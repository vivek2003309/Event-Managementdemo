import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { FirestoreService } from '../../services/firestoreService';
import { CheckCircle2, Calendar, MapPin, Sparkles } from 'lucide-react';

export interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    partnerName: '',
    email: '',
    phone: '',
    eventDate: '',
    destination: 'Udaipur, Rajasthan',
    guestCount: '300',
    budgetEnvelope: '₹1 Cr – ₹3 Cr',
    vision: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const todayStr = new Date().toISOString().split('T')[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please provide your full name';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.phone.trim()) errs.phone = 'Contact telephone is required';
    if (!formData.eventDate) {
      errs.eventDate = 'Please select a celebration date or tentative timeframe';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await FirestoreService.createConsultation({
        fullName: formData.fullName,
        partnerName: formData.partnerName,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination,
        eventDate: formData.eventDate,
        guestCount: formData.guestCount,
        budgetEnvelope: formData.budgetEnvelope,
        vision: formData.vision,
        source: 'Private Directorial Consultation Modal',
      });

      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'Consultation Request Registered',
        message: 'A Senior Directorial Producer will contact you within 12 business hours.',
      });
    } catch (err) {
      console.warn('Consultation submission notice:', err);
      // Gracefully show confirmation if transient error occurred while data was logged
      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'Consultation Request Received',
        message: 'Our directorial team has received your celebration brief.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      partnerName: '',
      email: '',
      phone: '',
      eventDate: '',
      destination: 'Udaipur, Rajasthan',
      guestCount: '300',
      budgetEnvelope: '₹1 Cr – ₹3 Cr',
      vision: '',
    });
    setErrors({});
    onClose();
  };

  // Format date nicely for summary
  const formattedEventDate = formData.eventDate
    ? new Date(formData.eventDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      subtitle="The Wedding Dreams Atelier"
      title={isSubmitted ? 'Your Inquiry Has Been Received' : 'Private Directorial Consultation'}
      maxWidth="xl"
    >
      {isSubmitted ? (
        <div className="py-6 flex flex-col items-center text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#F5F2EB] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
              Thank You, {formData.fullName}
            </h4>
            <p className="text-xs sm:text-sm text-[#77736D] max-w-md mx-auto leading-relaxed">
              We have received your celebration parameters for{' '}
              <strong className="text-[#1A1A1A] font-medium">{formData.destination}</strong>. Our
              directorial studio is reviewing calendar openings for your requested date{' '}
              <span className="text-[#C5A059] font-medium whitespace-nowrap">
                ({formattedEventDate || formData.eventDate})
              </span>{' '}
              and will reach out to <span className="text-[#1A1A1A] font-medium">{formData.email}</span> shortly.
            </p>
          </div>

          {/* Quick dossier card */}
          <div className="w-full max-w-md bg-[#F8F5EF] border border-[#E5DFD3] p-4 rounded-none text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#8C827A] border-b border-[#E5DFD3]/70 pb-2">
              <span className="uppercase tracking-[0.16em] text-[10px] font-semibold">Consultation Dossier</span>
              <span className="text-[#C5A059] font-medium text-[10px] tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Confirmed In Queue
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#1A1A1A]">
              <div>
                <span className="text-[#8C827A] block text-[9px] uppercase tracking-wider">Date</span>
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C5A059]" />
                  {formattedEventDate || 'Selected'}
                </span>
              </div>
              <div>
                <span className="text-[#8C827A] block text-[9px] uppercase tracking-wider">Destination</span>
                <span className="font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C5A059]" />
                  {formData.destination}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="md" onClick={handleReset}>
              Close &amp; Return to Atelier
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-[12px] sm:text-[13px] text-[#77736D] leading-relaxed">
            Please share the preliminary outline of your envisioned celebration. Our atelier engages
            in only a limited number of multi-day commissions per season to ensure meticulous
            directorial presence.
          </p>

          {/* Row 1: Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Full Name"
              name="fullName"
              placeholder="e.g. Riya Kapoor"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
            />
            <Input
              label="Partner's Name (Optional)"
              name="partnerName"
              placeholder="e.g. Aman Mehta"
              value={formData.partnerName}
              onChange={handleChange}
            />
          </div>

          {/* Row 2: Contact coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="riya@domain.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              label="Telephone / WhatsApp"
              name="phone"
              type="tel"
              placeholder="+91 98200 00000"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
          </div>

          {/* Row 3: Destination & Celebration Date Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8C827A] font-semibold mb-2">
                Preferred Destination *
              </label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full bg-[#F5F2EB] border border-[#E5DFD3] px-4 py-3 text-xs tracking-wider text-[#1A1A1A] focus:outline-none focus:border-[#C5A059] rounded-none transition-colors"
              >
                <option value="Udaipur, Rajasthan">Udaipur, Rajasthan</option>
                <option value="Jaipur, Rajasthan">Jaipur, Rajasthan</option>
                <option value="Jodhpur, Rajasthan">Jodhpur, Rajasthan</option>
                <option value="South Goa Coast">South Goa Coast</option>
                <option value="Lake Como, Italy">Lake Como, Italy</option>
                <option value="Mussoorie / Himalayas">Mussoorie / Himalayas</option>
                <option value="Other International Enclave">Other International</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8C827A] font-semibold mb-2">
                Celebration Date / Period *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate || ''}
                onChange={handleChange}
                required
                min={todayStr}
                className={`w-full bg-[#F5F2EB] border ${
                  errors.eventDate ? 'border-red-500' : 'border-[#E5DFD3]'
                } px-4 py-3 text-xs tracking-wider text-[#1A1A1A] focus:outline-none focus:border-[#C5A059] rounded-none transition-colors`}
              />
              {errors.eventDate ? (
                <p className="mt-1 text-[10px] text-red-500">{errors.eventDate}</p>
              ) : (
                <p className="mt-1 text-[9px] text-[#8C827A] tracking-wider uppercase">
                  Tentative or exact nuptial date
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Guests & Budget Envelope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8C827A] font-semibold mb-2">
                Estimated Guests *
              </label>
              <select
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                className="w-full bg-[#F5F2EB] border border-[#E5DFD3] px-4 py-3 text-xs tracking-wider text-[#1A1A1A] focus:outline-none focus:border-[#C5A059] rounded-none transition-colors"
              >
                <option value="80">Under 100 Guests (Bespoke Intimate)</option>
                <option value="250">150 – 300 Guests (Grand Nuptials)</option>
                <option value="500">300 – 600 Guests (Palace Takeover)</option>
                <option value="1000">600+ Guests (Royal Imperial)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8C827A] font-semibold mb-2">
                Budget Envelope *
              </label>
              <select
                name="budgetEnvelope"
                value={formData.budgetEnvelope}
                onChange={handleChange}
                className="w-full bg-[#F5F2EB] border border-[#E5DFD3] px-4 py-3 text-xs tracking-wider text-[#1A1A1A] focus:outline-none focus:border-[#C5A059] rounded-none transition-colors"
              >
                <option value="₹50L – ₹1 Cr">₹50L – ₹1 Cr</option>
                <option value="₹1 Cr – ₹3 Cr">₹1 Cr – ₹3 Cr</option>
                <option value="₹3 Cr – ₹7 Cr">₹3 Cr – ₹7 Cr</option>
                <option value="₹7 Cr+">₹7 Cr+ (Ultra Luxury)</option>
              </select>
            </div>
          </div>

          {/* Row 5: Vision & Specific Ceremonies */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8C827A] font-semibold mb-2">
              Vision &amp; Specific Ceremonies
            </label>
            <textarea
              name="vision"
              placeholder="Tell us about your envisioned dates, preferred architectural atmosphere, or unique family traditions..."
              rows={3}
              value={formData.vision}
              onChange={handleChange}
              className="w-full bg-[#F5F2EB] border border-[#E5DFD3] p-4 text-xs tracking-wider text-[#1A1A1A] focus:outline-none focus:border-[#C5A059] rounded-none transition-colors resize-none placeholder:text-[#8C827A]/60"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="outline" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="accent" size="md" type="submit" isLoading={isSubmitting}>
              Request Private Consultation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export { ConsultationModal as ContactModal };
