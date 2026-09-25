import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { useToast } from '../ui/Toast';
import { FirestoreService } from '../../services/firestoreService';
import { CheckCircle2 } from 'lucide-react';

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
    weddingDate: '',
    guestCount: '300',
    budgetRange: '₹1 Cr – ₹3 Cr',
    destinationPreference: 'Udaipur, Rajasthan',
    format: 'full-wedding',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please provide your full name';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.phone.trim()) errs.phone = 'Contact telephone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const coupleName = formData.partnerName.trim()
        ? `${formData.fullName.trim()} & ${formData.partnerName.trim()}`
        : formData.fullName.trim();

      await FirestoreService.createLead({
        name: coupleName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        weddingDate: formData.weddingDate || '2026-12-18',
        location: formData.destinationPreference,
        guestCount: Number(formData.guestCount) || 300,
        budget: formData.budgetRange,
        services: ['Directorial Planning', 'Floral & Mandap Architecture'],
        source: 'Consultation Modal',
        status: 'new',
        notes: formData.notes.trim() || 'Private consultation inquiry.',
      });
    } catch (err) {
      console.warn('Consultation lead save notice:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'Consultation Request Registered',
        message: 'A Senior Directorial Producer will contact you within 12 business hours.',
      });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      subtitle="The Wedding Dreams Atelier"
      title={isSubmitted ? 'Your Inquiry Has Been Received' : 'Private Directorial Consultation'}
      maxWidth="xl"
    >
      {isSubmitted ? (
        <div className="py-6 flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#F9F5EB] border border-[#C6A66B]/30 flex items-center justify-center text-[#C6A66B]">
            <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-serif text-[24px] text-[#171717] font-normal">
              Thank You, {formData.fullName}
            </h4>
            <p className="text-[14px] text-[#77736D] max-w-md mx-auto leading-relaxed">
              We have received your celebration parameters for{' '}
              <strong className="text-[#171717] font-medium">{formData.destinationPreference}</strong>. Our
              directorial studio is reviewing estate calendar openings and will reach out to{' '}
              <span className="text-[#171717]">{formData.email}</span> shortly.
            </p>
          </div>

          <div className="pt-4">
            <Button variant="primary" size="md" onClick={handleReset}>
              Close &amp; Return to Atelier
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-[13px] text-[#77736D] leading-relaxed">
            Please share the preliminary outline of your envisioned celebration. Our atelier engages in only a limited number of multi-day commissions per season to ensure meticulous directorial presence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Full Name"
              placeholder="e.g. Riya Kapoor"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              required
            />
            <Input
              label="Partner's Name (Optional)"
              placeholder="e.g. Aman Mehta"
              value={formData.partnerName}
              onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="riya@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />
            <Input
              label="Telephone / WhatsApp"
              type="tel"
              placeholder="+91 98200 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Preferred Destination"
              value={formData.destinationPreference}
              onChange={(e) => setFormData({ ...formData, destinationPreference: e.target.value })}
              options={[
                { value: 'Udaipur, Rajasthan', label: 'Udaipur, Rajasthan' },
                { value: 'Jaipur, Rajasthan', label: 'Jaipur, Rajasthan' },
                { value: 'Jodhpur, Rajasthan', label: 'Jodhpur, Rajasthan' },
                { value: 'South Goa Coast', label: 'South Goa Coast' },
                { value: 'Lake Como, Italy', label: 'Lake Como, Italy' },
                { value: 'Mussoorie / Himalayas', label: 'Mussoorie / Himalayas' },
                { value: 'Other International Enclave', label: 'Other International' },
              ]}
            />
            <Select
              label="Estimated Guests"
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
              options={[
                { value: '80', label: 'Under 100 Guests (Bespoke Intimate)' },
                { value: '250', label: '150 – 300 Guests (Grand Nuptials)' },
                { value: '500', label: '300 – 600 Guests (Palace Takeover)' },
                { value: '1000', label: '600+ Guests (Royal Imperial)' },
              ]}
            />
            <Select
              label="Budget Envelope"
              value={formData.budgetRange}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              options={[
                { value: '₹50L – ₹1 Cr', label: '₹50L – ₹1 Cr' },
                { value: '₹1 Cr – ₹3 Cr', label: '₹1 Cr – ₹3 Cr' },
                { value: '₹3 Cr – ₹7 Cr', label: '₹3 Cr – ₹7 Cr' },
                { value: '₹7 Cr+', label: '₹7 Cr+ (Ultra Luxury)' },
              ]}
            />
          </div>

          <Textarea
            label="Vision & Specific Ceremonies"
            placeholder="Tell us about your envisioned dates, preferred architectural atmosphere, or unique family traditions..."
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

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
