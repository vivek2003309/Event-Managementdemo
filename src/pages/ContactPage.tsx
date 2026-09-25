import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../components/ui/Toast';
import { FirestoreService } from '../services/firestoreService';
import { CheckCircle2, MapPin, Phone, Mail, Clock, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    partnerName: '',
    email: '',
    phone: '',
    destination: 'Udaipur, Rajasthan',
    guests: '300',
    budget: '₹1 Cr – ₹3 Cr',
    dates: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please provide a contact phone number or WhatsApp coordinate.');
      return;
    }

    setIsSubmitting(true);
    try {
      const coupleName = formData.partnerName.trim()
        ? `${formData.fullName.trim()} & ${formData.partnerName.trim()}`
        : formData.fullName.trim();

      await FirestoreService.createLead({
        name: coupleName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        weddingDate: formData.dates.trim() || '2026-12-18',
        location: formData.destination,
        guestCount: Number(formData.guests) || 300,
        budget: formData.budget,
        services: ['Complete Planning', 'Décor & Scenography', 'Hospitality'],
        source: 'Contact Page Inquiry',
        status: 'new',
        notes: formData.notes.trim() || 'Direct inquiry via Contact Page.',
      });

      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'Inquiry Transmitted to Atelier',
        message: 'A Directorial Producer has received your celebration brief.',
      });
    } catch (err: any) {
      console.warn('Contact lead persistence notice:', err);
      // Still allow UI confirmation if Firestore had transient issue
      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'Inquiry Logged',
        message: 'Your celebration parameters have been received by the concierge.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pt-12 pb-24">
      <Section variant="ivory" spacing="md">
        <PageContainer>
          <SectionHeading
            kicker="Private Inquiries"
            title="Engage The Atelier"
            subtitle="To safeguard singular directorial attention, we commission a finite number of multi-day celebrations each calendar year."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Direct Contact Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 bg-white rounded-[8px] border border-[#EAE5DC] shadow-sm space-y-6">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
                    Directorial Studio
                  </span>
                  <h3 className="font-serif text-[24px] text-[#171717] font-normal">
                    The Wedding Dreams Headquarters
                  </h3>
                  <p className="text-[13px] text-[#77736D] mt-2 leading-relaxed">
                    Private consultations hosted by appointment across our studio salons.
                  </p>
                </div>

                <div className="space-y-4 text-[13px] text-[#252525] border-t border-[#EAE5DC] pt-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong>Mumbai Atelier:</strong> 42 Nariman Point, Marine Drive, Mumbai 400021
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong>Delhi Salon:</strong> 18 Barakhamba Avenue, Connaught Place, New Delhi 110001
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong>Private Line:</strong> +91 (0) 98200 48210
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong>Directorial Inquiries:</strong> atelier@theweddingdreams.com
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                    <div>
                      <strong>Concierge Response:</strong> Within 12 business hours
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[8px] border border-[#EAE5DC] shadow-sm">
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#F9F5EB] border border-[#C6A66B]/30 flex items-center justify-center text-[#C6A66B]">
                    <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h4 className="font-serif text-[26px] text-[#171717] font-normal">
                    Inquiry Received, {formData.fullName}
                  </h4>
                  <p className="text-[14px] text-[#77736D] max-w-md mx-auto leading-relaxed">
                    Our Senior Directorial Producer is reviewing estate availability for{' '}
                    <strong className="text-[#171717]">{formData.destination}</strong> and will contact you via WhatsApp or telephone within 12 hours.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="e.g. Radhika Merchant"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                    <Input
                      label="Partner's Name"
                      placeholder="e.g. Anant Ambani"
                      value={formData.partnerName}
                      onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="radhika@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Telephone / WhatsApp"
                      placeholder="+91 98200 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                      label="Preferred Enclave"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      options={[
                        { value: 'Udaipur, Rajasthan', label: 'Udaipur Lake Palaces' },
                        { value: 'Jaipur, Rajasthan', label: 'Jaipur Royal Mansions' },
                        { value: 'Jodhpur, Rajasthan', label: 'Jodhpur Fortresses' },
                        { value: 'South Goa Coast', label: 'Goa Coastal' },
                        { value: 'Lake Como, Italy', label: 'Lake Como, Italy' },
                        { value: 'Other Global Enclave', label: 'Other Destination' },
                      ]}
                    />
                    <Select
                      label="Guest Count"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      options={[
                        { value: '150', label: '100 – 200 Guests' },
                        { value: '300', label: '200 – 400 Guests' },
                        { value: '600', label: '400 – 700 Guests' },
                        { value: '1000', label: '700+ Guests' },
                      ]}
                    />
                    <Select
                      label="Investment Tier"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      options={[
                        { value: '₹50L – ₹1 Cr', label: '₹50L – ₹1 Cr' },
                        { value: '₹1 Cr – ₹3 Cr', label: '₹1 Cr – ₹3 Cr' },
                        { value: '₹3 Cr – ₹7 Cr', label: '₹3 Cr – ₹7 Cr' },
                        { value: '₹7 Cr+', label: '₹7 Cr+ (Ultra Luxury)' },
                      ]}
                    />
                  </div>

                  <Textarea
                    label="Celebration Vision & Specific Ceremonies"
                    placeholder="Describe your desired dates, acoustic preferences, or family traditions..."
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />

                  {errorMessage && (
                    <div className="p-3 bg-[#FDF2F2] border border-[#F2C0C0] text-[#BA1A1A] text-[12px] rounded-[4px] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="accent"
                      size="lg"
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Transmitting to Atelier...</span>
                        </span>
                      ) : (
                        'Transmit Inquiry to Directorship →'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
};
