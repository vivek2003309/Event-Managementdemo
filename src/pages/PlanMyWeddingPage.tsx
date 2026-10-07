import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Slider } from '../components/ui/Slider';
import { useToast } from '../components/ui/Toast';
import {
  WeddingPlanService,
  PlanDraft,
  PreliminaryPlan,
  CelebrationType,
  LocationType,
  BudgetTier,
  WeddingFunction,
  WeddingService,
  INITIAL_DRAFT,
} from '../services/weddingPlanService';
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Save,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  User,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  MessageSquare,
  Compass,
  Building,
  Heart,
  Music,
  Camera,
  Car,
  Utensils,
  Share2,
  Printer,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

const STEP_LABELS = [
  'Celebration',
  'Date',
  'Location',
  'Guests',
  'Budget',
  'Functions',
  'Services',
  'Contact',
];

const CELEBRATION_OPTIONS: { id: CelebrationType; title: string; desc: string; icon: any }[] = [
  {
    id: 'Wedding',
    title: 'Full Wedding Celebration',
    desc: 'Traditional multi-day rituals, pheras, and grand ceremonial dinners.',
    icon: Heart,
  },
  {
    id: 'Destination Wedding',
    title: 'Destination Wedding',
    desc: 'Immersive palace takeover, seaside sanctuary, or heritage estate getaway.',
    icon: Compass,
  },
  {
    id: 'Engagement',
    title: 'Engagement & Roka',
    desc: 'Intimate rings exchange, high-tea soiree, or formal evening reception.',
    icon: Sparkles,
  },
  {
    id: 'Reception',
    title: 'Grand Reception',
    desc: 'High-production evening gala, banquet dining, and royal receiving line.',
    icon: Building,
  },
  {
    id: 'Other',
    title: 'Other Bespoke Occasion',
    desc: 'Milestone anniversary, cocktail soiree, or custom ceremonial gathering.',
    icon: HelpCircle,
  },
];

const LOCATION_OPTIONS: { id: LocationType; title: string; subtext: string; tag: string }[] = [
  {
    id: 'Delhi NCR',
    title: 'Delhi NCR',
    subtext: 'Grand sprawling farmhouses, Aerocity ballrooms, and Lutyens estates.',
    tag: 'Metropolitan Royalty',
  },
  {
    id: 'Jaipur',
    title: 'Jaipur',
    subtext: 'Rambagh, Jai Mahal, and historic hilltop fortresses illuminated by torchlight.',
    tag: 'Pink City Grandeur',
  },
  {
    id: 'Udaipur',
    title: 'Udaipur',
    subtext: 'Lake Pichola island palaces, floating flotillas, and Mewar architecture.',
    tag: 'Venice of the East',
  },
  {
    id: 'Goa',
    title: 'Goa',
    subtext: 'Private cliffside sanctuaries, beach cabanas, and sunset mandaps.',
    tag: 'Coastal Elegance',
  },
  {
    id: 'Other',
    title: 'Other Enclave',
    subtext: 'Mussoorie, Jim Corbett, Jodhpur, Kerala, or international shores.',
    tag: 'Bespoke Destination',
  },
];

const BUDGET_OPTIONS: { id: BudgetTier; title: string; label: string; idealFor: string }[] = [
  {
    id: '₹10–25L',
    title: '₹10–25 Lakhs',
    label: 'Intimate Elegance',
    idealFor: 'Boutique gatherings, singular day celebrations, and select curated services.',
  },
  {
    id: '₹25–50L',
    title: '₹25–50 Lakhs',
    label: 'Premier Luxury',
    idealFor: '2 to 3-function celebrations, premium destination resorts, and elevated florals.',
  },
  {
    id: '₹50L–₹1Cr',
    title: '₹50 Lakhs – ₹1 Crore',
    label: 'High Couture',
    idealFor: 'Full palace or resort takeover, 4+ functions, A-list entertainment, and bespoke scenography.',
  },
  {
    id: '₹1Cr+',
    title: '₹1 Crore+',
    label: 'Haute Magnificence',
    idealFor: 'Multi-day imperial palace buyout, charter aviation, international artists, and Michelin gastronomy.',
  },
];

const FUNCTION_OPTIONS: { id: WeddingFunction; title: string; desc: string }[] = [
  { id: 'Mehendi', title: 'Mehendi Soiree', desc: 'Artisanal henna high-tea, floral swing, and lively folk acoustics.' },
  { id: 'Haldi', title: 'Haldi Carnival', desc: 'Marigold water rituals, organic turmeric blends, and breezy pool revelry.' },
  { id: 'Sangeet', title: 'Grand Sangeet', desc: 'Concert-grade staging, LED choreography, celebrity DJ, and midnight banquet.' },
  { id: 'Wedding', title: 'The Pheras & Wedding', desc: 'Traditional Vedic mandap, sacred fire rituals, shehnai, and baraat arrival.' },
  { id: 'Reception', title: 'Royal Reception', desc: 'Black-tie or traditional reception dinner with receiving lines and champagne.' },
];

const SERVICE_OPTIONS: { id: WeddingService; title: string; desc: string; icon: any }[] = [
  {
    id: 'Planning',
    title: 'Planning & Management',
    desc: '360° show direction, run-of-show choreography, vendor curation, and budget governance.',
    icon: Compass,
  },
  {
    id: 'Décor',
    title: 'Décor & Scenography',
    desc: 'Spatial 3D architectural renders, floral installations, custom pavilions, and ambient lighting.',
    icon: Sparkles,
  },
  {
    id: 'Catering',
    title: 'Food & Hospitality Cuisine',
    desc: 'Master tasting sessions, royal regional banquets, craft mixology, and dessert pavilions.',
    icon: Utensils,
  },
  {
    id: 'Photography',
    title: 'Photography & Cinema',
    desc: 'Editorial portraiture, 35mm film reels, aerial drone direction, and heirloom albums.',
    icon: Camera,
  },
  {
    id: 'Entertainment',
    title: 'Entertainment & Artists',
    desc: 'Sufi midnight symphonies, Bollywood playback vocalists, and bespoke choreographers.',
    icon: Music,
  },
  {
    id: 'Hospitality',
    title: 'Guest Hospitality & RSVP',
    desc: 'Airport concierge desks, welcome gifting suites, room inventory locks, and VIP assistance.',
    icon: Building,
  },
  {
    id: 'Transportation',
    title: 'Logistics & Fleet Transport',
    desc: 'Luxury chauffeured sedans, vintage baraat convertibles, and chartered transfers.',
    icon: Car,
  },
];

export const PlanMyWeddingPage: React.FC<{ onOpenLetTalk?: () => void }> = ({ onOpenLetTalk }) => {
  const { addToast } = useToast();

  // Wizard state initialized from localStorage draft
  const [draft, setDraft] = useState<PlanDraft>(() => WeddingPlanService.getDraft());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [submittedPlan, setSubmittedPlan] = useState<PreliminaryPlan | null>(null);

  // Sync draft updates to localStorage automatically
  useEffect(() => {
    WeddingPlanService.saveDraft(draft);
  }, [draft]);

  const currentStep = draft.currentStep;

  // Validation function for current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!draft.celebrationType) {
        newErrors.celebrationType = 'Please select a celebration format.';
      }
      if (draft.celebrationType === 'Other' && !draft.celebrationOther?.trim()) {
        newErrors.celebrationOther = 'Please specify the celebration format.';
      }
    }

    if (step === 2) {
      if (!draft.weddingDate) {
        newErrors.weddingDate = 'Please select your preferred wedding date.';
      } else {
        const selected = new Date(draft.weddingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          newErrors.weddingDate = 'The celebration date must be in the future.';
        }
      }
    }

    if (step === 3) {
      if (!draft.location) {
        newErrors.location = 'Please select your celebration destination.';
      }
      if (draft.location === 'Other' && !draft.locationOther?.trim()) {
        newErrors.locationOther = 'Please enter your preferred destination or city.';
      }
    }

    if (step === 4) {
      if (!draft.guestCount || draft.guestCount < 10) {
        newErrors.guestCount = 'Guest count must be at least 10.';
      }
    }

    if (step === 5) {
      if (!draft.budget) {
        newErrors.budget = 'Please select an investment range.';
      }
    }

    if (step === 6) {
      if (!draft.functions || draft.functions.length === 0) {
        newErrors.functions = 'Please select at least one function or ceremony.';
      }
    }

    if (step === 7) {
      if (!draft.services || draft.services.length === 0) {
        newErrors.services = 'Please select at least one service category.';
      }
    }

    if (step === 8) {
      if (!draft.contact.name?.trim()) {
        newErrors.name = 'Full name is required.';
      }
      if (!draft.contact.phone?.trim()) {
        newErrors.phone = 'Phone number is required.';
      } else if (!/^[0-9+-\s()]{8,15}$/.test(draft.contact.phone.trim())) {
        newErrors.phone = 'Please provide a valid contact number (8–15 digits).';
      }
      if (!draft.contact.email?.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact.email.trim())) {
        newErrors.email = 'Please provide a valid email address.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 8) {
        setDraft((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    } else {
      addToast({
        type: 'error',
        title: 'Selection Required',
        message: 'Please address the highlighted field to proceed.',
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDraft((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleSaveProgress = () => {
    WeddingPlanService.saveDraft(draft);
    addToast({
      type: 'success',
      title: 'Progress Saved',
      message: 'Your wedding plan details are saved. You can resume anytime on this device.',
    });
  };

  const handleStepJump = (targetStep: number) => {
    if (targetStep < currentStep) {
      setDraft((prev) => ({ ...prev, currentStep: targetStep }));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // Validate current before jumping forward
      if (validateStep(currentStep)) {
        setDraft((prev) => ({ ...prev, currentStep: targetStep }));
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(8)) {
      addToast({
        type: 'error',
        title: 'Incomplete Contact Details',
        message: 'Please complete your contact details so our directors can reach out.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await WeddingPlanService.submitWeddingPlan(draft);
      setSubmittedPlan(result);
      addToast({
        type: 'success',
        title: 'Wedding Plan Created',
        message: 'Your personalized preliminary plan has been generated successfully.',
      });
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Submission Error',
        message: 'We encountered an issue generating your plan. Please retry.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDraft(INITIAL_DRAFT);
    setSubmittedPlan(null);
    WeddingPlanService.clearDraft();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const toggleFunction = (func: WeddingFunction) => {
    setDraft((prev) => {
      const exists = prev.functions.includes(func);
      const updated = exists ? prev.functions.filter((f) => f !== func) : [...prev.functions, func];
      return { ...prev, functions: updated };
    });
    if (errors.functions) setErrors((prev) => ({ ...prev, functions: '' }));
  };

  const toggleService = (srv: WeddingService) => {
    setDraft((prev) => {
      const exists = prev.services.includes(srv);
      const updated = exists ? prev.services.filter((s) => s !== srv) : [...prev.services, srv];
      return { ...prev, services: updated };
    });
    if (errors.services) setErrors((prev) => ({ ...prev, services: '' }));
  };

  // If a preliminary plan was successfully submitted, display the comprehensive output view
  if (submittedPlan) {
    return (
      <div className="w-full min-h-screen bg-[#FDFBF7] pt-24 pb-24 text-[#252525]">
        <PageContainer>
          {/* Header & Success Banner */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[4px] bg-[#C6A66B]/15 text-[#8C6D37] text-[11px] uppercase tracking-[0.2em] font-medium mb-4">
              <CheckCircle2 className="w-4 h-4 text-[#C6A66B]" />
              <span>Preliminary Plan Generated &bull; Reference {submittedPlan.id}</span>
            </div>
            <h1 className="font-serif text-[38px] sm:text-[54px] text-[#171717] font-normal leading-tight">
              Your Preliminary Wedding Blueprint
            </h1>
            <p className="text-[15px] sm:text-[17px] text-[#55524E] max-w-2xl mx-auto mt-3 font-light leading-relaxed">
              Curated for <strong className="font-medium text-[#171717]">{submittedPlan.contact.name}</strong>. Here is your strategic master timeline, estimated budget allocation, and operational priorities.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            <div className="bg-white p-4 rounded-[6px] border border-[#EAE5DC] text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#77736D] block mb-1">Celebration</span>
              <span className="font-serif text-[18px] text-[#171717] font-normal block truncate" title={submittedPlan.eventType}>
                {submittedPlan.eventType}
              </span>
            </div>
            <div className="bg-white p-4 rounded-[6px] border border-[#EAE5DC] text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#77736D] block mb-1">Target Date</span>
              <span className="font-serif text-[18px] text-[#171717] font-normal block truncate" title={submittedPlan.formattedDate}>
                {submittedPlan.formattedDate}
              </span>
            </div>
            <div className="bg-white p-4 rounded-[6px] border border-[#EAE5DC] text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#77736D] block mb-1">Destination</span>
              <span className="font-serif text-[18px] text-[#171717] font-normal block truncate" title={submittedPlan.location}>
                {submittedPlan.location}
              </span>
            </div>
            <div className="bg-white p-4 rounded-[6px] border border-[#EAE5DC] text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#77736D] block mb-1">Guest Envelope</span>
              <span className="font-serif text-[18px] text-[#C6A66B] font-normal block">
                {submittedPlan.guests} Guests
              </span>
            </div>
            <div className="bg-white p-4 rounded-[6px] border border-[#EAE5DC] text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#77736D] block mb-1">Functions</span>
              <span className="font-serif text-[18px] text-[#171717] font-normal block">
                {submittedPlan.functions.length} Events
              </span>
            </div>
            <div className="bg-white p-4 rounded-[6px] border border-[#EAE5DC] text-center shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#77736D] block mb-1">Target Envelope</span>
              <span className="font-serif text-[18px] text-[#171717] font-normal block truncate" title={submittedPlan.budget}>
                {submittedPlan.budget}
              </span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Priorities & Strategic Inclusions (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Functions & Required Services Card */}
              <div className="bg-white p-6 sm:p-8 rounded-[8px] border border-[#EAE5DC] shadow-xs">
                <h2 className="font-serif text-[24px] text-[#171717] font-normal mb-4">
                  Celebration Program &amp; Scope
                </h2>
                
                <div className="mb-6">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#77736D] block mb-2.5 font-medium">
                    Scheduled Functions ({submittedPlan.functions.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {submittedPlan.functions.map((func) => (
                      <span
                        key={func}
                        className="px-3 py-1.5 rounded-[4px] bg-[#F8F5EF] border border-[#EAE5DC] text-[13px] text-[#252525] font-medium"
                      >
                        {func}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#77736D] block mb-2.5 font-medium">
                    Requested Direction Services ({submittedPlan.requiredServices.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {submittedPlan.requiredServices.map((srv) => (
                      <span
                        key={srv}
                        className="px-3 py-1.5 rounded-[4px] bg-[#171717] text-white text-[12px] font-medium uppercase tracking-wider"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggested Planning Priorities */}
              <div className="bg-white p-6 sm:p-8 rounded-[8px] border border-[#EAE5DC] shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-serif text-[24px] text-[#171717] font-normal">
                      Suggested Planning Priorities
                    </h2>
                    <p className="text-[13px] text-[#77736D] mt-0.5">
                      Tailored milestone roadmap for {submittedPlan.location} with {submittedPlan.guests} guests.
                    </p>
                  </div>
                </div>

                <div className="space-y-6 relative before:absolute before:top-3 before:bottom-3 before:left-3 before:w-px before:bg-[#EAE5DC]">
                  {submittedPlan.suggestedPlanningPriorities.map((item, idx) => (
                    <div key={idx} className="relative pl-8">
                      <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#C6A66B] ring-4 ring-white" />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                        <span className="text-[10px] uppercase tracking-widest text-[#8C6D37] font-semibold">
                          {item.phase} &bull; {item.timing}
                        </span>
                      </div>
                      <h4 className="font-serif text-[18px] text-[#171717] font-medium leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[13px] text-[#55524E] font-light leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Indicative Budget Breakdown & CTAs (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Indicative Budget Distribution Card */}
              <div className="bg-white p-6 sm:p-8 rounded-[8px] border border-[#EAE5DC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-serif text-[22px] text-[#171717] font-normal">
                    Indicative Budget Distribution
                  </h2>
                  <span className="font-serif text-[18px] text-[#C6A66B] font-medium">
                    {submittedPlan.budget}
                  </span>
                </div>
                
                <p className="text-[12px] text-[#77736D] mb-6">
                  Calculated allocation weighting based on the scale of your selected services.
                </p>

                {/* Progress Visualizer Bar */}
                <div className="w-full h-3 rounded-[3px] overflow-hidden flex mb-6 bg-[#F6F3ED]">
                  {submittedPlan.indicativeBudgetDistribution.map((item, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${item.percentage}%`, backgroundColor: item.colorHex }}
                      title={`${item.category}: ${item.percentage}% (${item.estimatedAmountINR})`}
                      className="h-full transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </div>

                {/* Detailed Category Rows */}
                <div className="space-y-4">
                  {submittedPlan.indicativeBudgetDistribution.map((item, idx) => (
                    <div key={idx} className="pb-3 border-b border-[#F0ECE4] last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between text-[13px] font-medium mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="text-[#171717]">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#8C6D37] font-semibold">{item.percentage}%</span>
                          <span className="text-[#55524E]">({item.estimatedAmountINR})</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#77736D] pl-4 font-light leading-snug">
                        {item.notes}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mandatory Disclaimer Box */}
                <div className="mt-6 p-4 rounded-[6px] bg-[#FAF8F5] border border-[#EAE5DC] flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#8C6D37] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#66625D] leading-relaxed">
                    <strong>Notice:</strong> All projections above are strictly indicative estimates shaped by market benchmarks and do not constitute an official quotation or binding agreement. Exact costings are governed by venue contracts, dates, artist rider specs, and final culinary headcount.
                  </p>
                </div>
              </div>

              {/* Primary Call to Action Card */}
              <div className="bg-[#171717] text-white p-6 sm:p-8 rounded-[8px] shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-medium block mb-2">
                    Next Step with Our Directorship
                  </span>
                  <h3 className="font-serif text-[26px] font-normal leading-snug text-white mb-2">
                    Talk to a Wedding Expert
                  </h3>
                  <p className="text-[13px] text-white/75 font-light leading-relaxed mb-6">
                    Our lead wedding directors will review your parameters ({submittedPlan.location} &bull; {submittedPlan.guests} Guests) and arrange a private 30-minute discovery consultation.
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="accent"
                      size="lg"
                      className="w-full justify-center shadow-md cursor-pointer"
                      onClick={() => {
                        if (onOpenLetTalk) {
                          onOpenLetTalk();
                        } else {
                          window.location.href = `https://wa.me/919871211995?text=Hello%20The%20Wedding%20Dreams,%20I%20have%20generated%20my%20Wedding%20Plan%20(${submittedPlan.id})%20for%20${encodeURIComponent(submittedPlan.location)}%20and%20would%20love%20to%20schedule%20a%20private%20consultation.`;
                        }
                      }}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Talk to a Wedding Expert
                    </Button>

                    <a
                      href={`https://wa.me/919871211995?text=Hello%20The%20Wedding%20Dreams,%20I%20have%20created%20Wedding%20Plan%20${submittedPlan.id}%20on%20The%20Wedding%20Dreams.%20Please%20connect%20me%20with%20a%20director.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-[4px] bg-[#25D366] text-white text-[13px] font-medium hover:bg-[#20ba5a] transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Direct Concierge</span>
                    </a>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                    <span>Guaranteed 12h turnaround</span>
                    <span>Direct Access NDA Available</span>
                  </div>
                </div>
              </div>

              {/* Utility Actions (Print / New Plan) */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#77736D] hover:text-[#171717] font-medium cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Blueprint</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-wider text-[#8C6D37] hover:text-[#171717] font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Create Another Plan</span>
                </button>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  // Active Multi-step Wizard Render
  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] pt-24 pb-24 text-[#252525]">
      <PageContainer>
        {/* Wizard Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8C6D37] block mb-2">
            The Wedding Dreams &bull; Master Planning Suite
          </span>
          <h1 className="font-serif text-[38px] sm:text-[54px] text-[#171717] font-normal leading-tight">
            Plan My Wedding
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#55524E] max-w-xl mx-auto mt-2 font-light leading-relaxed">
            Specify your celebration parameters through eight curated steps to generate an architectural preliminary plan and strategic investment allocation.
          </p>
        </div>

        {/* Wizard Progress Stepper Indicator */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="bg-white p-4 sm:p-6 rounded-[8px] border border-[#EAE5DC] shadow-xs">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-[#8C6D37] mb-2.5">
              <span>Step 0{currentStep} of 08 &bull; {STEP_LABELS[currentStep - 1]}</span>
              <span className="text-[#77736D] font-normal lowercase">{Math.round((currentStep / 8) * 100)}% complete</span>
            </div>

            {/* Continuous Progress Bar */}
            <div className="w-full h-1.5 bg-[#EAE5DC] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[#C6A66B] transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 8) * 100}%` }}
              />
            </div>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
              {STEP_LABELS.map((label, idx) => {
                const stepNum = idx + 1;
                const isPassed = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleStepJump(stepNum)}
                    className={`py-2 px-1 text-center rounded-[4px] text-[10px] uppercase tracking-wider font-medium transition-all cursor-pointer truncate ${
                      isCurrent
                        ? 'bg-[#171717] text-white shadow-xs font-semibold'
                        : isPassed
                        ? 'bg-[#F4EFE6] text-[#8C6D37] hover:bg-[#EAE2D5]'
                        : 'bg-transparent text-[#9C968C] hover:text-[#55524E]'
                    }`}
                    title={`Step ${stepNum}: ${label}`}
                  >
                    <span className="sm:hidden">{stepNum}</span>
                    <span className="hidden sm:inline">{stepNum}. {label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Wizard Main Layout: Interactive Form (7 Cols) + Live Summary Sidebar (5 Cols) */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Step Form Container */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-[8px] border border-[#EAE5DC] shadow-xs">
            {/* Step 1: Celebration */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-1">
                    Step 01 &bull; Celebration Format
                  </span>
                  <h2 className="font-serif text-[28px] text-[#171717] font-normal leading-snug">
                    What celebration are you orchestrating?
                  </h2>
                  <p className="text-[14px] text-[#55524E] font-light mt-1">
                    Choose the primary format to calibrate logistics, venue scale, and ceremonial timeline.
                  </p>
                </div>

                <div className="space-y-3">
                  {CELEBRATION_OPTIONS.map((item) => {
                    const isSelected = draft.celebrationType === item.id;
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setDraft((prev) => ({ ...prev, celebrationType: item.id }));
                          if (errors.celebrationType) setErrors((prev) => ({ ...prev, celebrationType: '' }));
                        }}
                        className={`p-4 rounded-[6px] border transition-all cursor-pointer flex items-start gap-4 ${
                          isSelected
                            ? 'border-[#171717] bg-[#FAF8F5] shadow-xs ring-1 ring-[#171717]'
                            : 'border-[#EAE5DC] bg-white hover:border-[#C6A66B] hover:bg-[#FDFCFB]'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected ? 'bg-[#171717] text-[#C6A66B]' : 'bg-[#F8F5EF] text-[#77736D]'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif text-[18px] text-[#171717] font-medium leading-snug">
                              {item.title}
                            </h4>
                            {isSelected && <Check className="w-4 h-4 text-[#8C6D37]" />}
                          </div>
                          <p className="text-[13px] text-[#77736D] font-light leading-relaxed mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {draft.celebrationType === 'Other' && (
                  <div className="pt-2">
                    <Input
                      label="Specify Celebration Format"
                      placeholder="e.g. 25th Silver Jubilee Royal Anniversary, Sangeet Gala"
                      value={draft.celebrationOther || ''}
                      onChange={(e) => {
                        setDraft((prev) => ({ ...prev, celebrationOther: e.target.value }));
                        if (errors.celebrationOther) setErrors((prev) => ({ ...prev, celebrationOther: '' }));
                      }}
                      error={errors.celebrationOther}
                    />
                  </div>
                )}

                {errors.celebrationType && (
                  <p className="text-[12px] text-[#BA1A1A] mt-1">{errors.celebrationType}</p>
                )}
              </div>
            )}

            {/* Step 2: Date */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-1">
                    Step 02 &bull; Wedding Date
                  </span>
                  <h2 className="font-serif text-[28px] text-[#171717] font-normal leading-snug">
                    When is the sacred celebration scheduled?
                  </h2>
                  <p className="text-[14px] text-[#55524E] font-light mt-1">
                    Select your primary target wedding date. If you have auspicious muhurat options, choose the estimated primary date.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-6 rounded-[8px] border border-[#EAE5DC] space-y-5">
                  {/* Target Wedding Year & Availability Selector */}
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] block mb-2">
                      Target Wedding Year &amp; Planning Timeline *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { year: '2026', badge: 'Active Commissions', subtitle: 'Premier 2026 Season' },
                        { year: '2025', badge: 'Final Quota', subtitle: 'Autumn / Winter 2025' },
                        { year: '2024', badge: 'Archival Inception', subtitle: '2024 & Earlier' },
                        { year: '2027', badge: 'Advance Booking', subtitle: '2027 Palace Reserves' },
                      ].map((item) => {
                        const isSelected = (draft.weddingDate && draft.weddingDate.startsWith(item.year)) || (!draft.weddingDate && item.year === '2026');
                        return (
                          <button
                            key={item.year}
                            type="button"
                            onClick={() => {
                              const currentMonthDay = draft.weddingDate && draft.weddingDate.length >= 10 ? draft.weddingDate.slice(4) : '-11-20';
                              const newDate = `${item.year}${currentMonthDay}`;
                              setDraft((prev) => ({ ...prev, weddingDate: newDate }));
                              if (errors.weddingDate) setErrors((prev) => ({ ...prev, weddingDate: '' }));
                            }}
                            className={`p-3 rounded-[6px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#C6A66B] bg-[#FDFBF7] ring-1 ring-[#C6A66B]/50 shadow-xs'
                                : 'border-[#EAE5DC] bg-white hover:border-[#D6CEBE]'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="font-serif text-[18px] text-[#171717] font-semibold">{item.year}</span>
                              <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-medium ${
                                isSelected ? 'bg-[#C6A66B]/20 text-[#8C6D37]' : 'bg-[#FAF8F5] text-[#8C827A]'
                              }`}>
                                {item.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#55524E] leading-tight">{item.subtitle}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] block mb-2">
                      Primary Target Wedding Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={draft.weddingDate}
                        onChange={(e) => {
                          setDraft((prev) => ({ ...prev, weddingDate: e.target.value }));
                          if (errors.weddingDate) setErrors((prev) => ({ ...prev, weddingDate: '' }));
                        }}
                        className={`w-full bg-white text-[#252525] text-[15px] py-3 px-4 rounded-[4px] border ${
                          errors.weddingDate ? 'border-[#BA1A1A]' : 'border-[#EAE5DC]'
                        } focus:outline-none focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B]/50 transition-all`}
                      />
                    </div>
                    {errors.weddingDate && (
                      <p className="text-[12px] text-[#BA1A1A] mt-1.5">{errors.weddingDate}</p>
                    )}
                  </div>

                  {/* Flexible Dates Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer select-none pt-2">
                    <input
                      type="checkbox"
                      checked={draft.isDateFlexible || false}
                      onChange={(e) => setDraft((prev) => ({ ...prev, isDateFlexible: e.target.checked }))}
                      className="mt-0.5 rounded text-[#C6A66B] focus:ring-[#C6A66B] border-[#D6CFC4] w-4 h-4"
                    />
                    <div>
                      <span className="text-[13px] font-medium text-[#171717] block">
                        Dates are flexible (+/- 2–4 weeks based on palace availability)
                      </span>
                      <span className="text-[12px] text-[#77736D] font-light">
                        Our directors can cross-examine auspicious wedding dates (muhurats) against venue availability.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Popular Season Guidance */}
                <div className="p-4 rounded-[6px] bg-white border border-[#EAE5DC]">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C6D37] font-semibold block mb-2">
                    Seasonality Note:
                  </span>
                  <p className="text-[12px] text-[#55524E] leading-relaxed">
                    Peak destination wedding season across Rajasthan and Goa spans <strong>October through March</strong>. For optimum weather and room block security, booking 9–14 months ahead is strongly advised.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-1">
                    Step 03 &bull; Destination &amp; Location
                  </span>
                  <h2 className="font-serif text-[28px] text-[#171717] font-normal leading-snug">
                    Where will you gather your guests?
                  </h2>
                  <p className="text-[14px] text-[#55524E] font-light mt-1">
                    Select your favored destination enclave to calculate regional logistics and venue hospitality costs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LOCATION_OPTIONS.map((loc) => {
                    const isSelected = draft.location === loc.id;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => {
                          setDraft((prev) => ({ ...prev, location: loc.id }));
                          if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                        }}
                        className={`p-4 rounded-[6px] border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#171717] bg-[#FAF8F5] ring-1 ring-[#171717] shadow-xs'
                            : 'border-[#EAE5DC] bg-white hover:border-[#C6A66B] hover:bg-[#FDFCFB]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] uppercase tracking-widest text-[#8C6D37] font-medium">
                              {loc.tag}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-[#8C6D37]" />}
                          </div>
                          <h4 className="font-serif text-[19px] text-[#171717] font-medium leading-snug">
                            {loc.title}
                          </h4>
                          <p className="text-[12px] text-[#77736D] font-light leading-relaxed mt-1">
                            {loc.subtext}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {draft.location === 'Other' && (
                  <div className="pt-2">
                    <Input
                      label="Specify Destination / City"
                      placeholder="e.g. Mussoorie, Jim Corbett, Jodhpur, Como Italy"
                      value={draft.locationOther || ''}
                      onChange={(e) => {
                        setDraft((prev) => ({ ...prev, locationOther: e.target.value }));
                        if (errors.locationOther) setErrors((prev) => ({ ...prev, locationOther: '' }));
                      }}
                      error={errors.locationOther}
                    />
                  </div>
                )}

                {errors.location && (
                  <p className="text-[12px] text-[#BA1A1A] mt-1">{errors.location}</p>
                )}
              </div>
            )}

            {/* Step 4: Guests */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-1">
                    Step 04 &bull; Guest Capacity
                  </span>
                  <h2 className="font-serif text-[28px] text-[#171717] font-normal leading-snug">
                    How many guests will be hosted?
                  </h2>
                  <p className="text-[14px] text-[#55524E] font-light mt-1">
                    Use the interactive slider to calibrate total guest invitations. This dictates banqueting, hotel room blocks, and fleet transfers.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-[8px] border border-[#EAE5DC] space-y-6">
                  <div className="text-center py-4 bg-white rounded-[6px] border border-[#EAE5DC] shadow-xs">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#77736D] font-medium block mb-1">
                      Estimated Guest Count
                    </span>
                    <span className="font-serif text-[48px] sm:text-[56px] text-[#171717] font-normal leading-none">
                      {draft.guestCount}
                    </span>
                    <span className="text-[13px] text-[#8C6D37] font-medium block mt-1">
                      {draft.guestCount < 100
                        ? 'Boutique Intimate Gathering'
                        : draft.guestCount <= 350
                        ? 'Signature Luxury Nuptials'
                        : draft.guestCount <= 700
                        ? 'Grand Royal Conclave'
                        : 'Monumental Heritage Celebration'}
                    </span>
                  </div>

                  <Slider
                    min={25}
                    max={1200}
                    step={25}
                    value={draft.guestCount}
                    onChangeValue={(val) => setDraft((prev) => ({ ...prev, guestCount: val }))}
                  />

                  {/* Benchmark Presets */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#77736D] mr-2">Quick Benchmarks:</span>
                    {[75, 150, 250, 400, 600, 850].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setDraft((prev) => ({ ...prev, guestCount: num }))}
                        className={`px-3 py-1 rounded-[3px] text-[11px] uppercase tracking-wider font-medium cursor-pointer transition-all ${
                          draft.guestCount === num
                            ? 'bg-[#171717] text-white shadow-xs'
                            : 'bg-white text-[#55524E] border border-[#EAE5DC] hover:border-[#C6A66B]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Budget */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-1">
                    Step 05 &bull; Investment Envelope
                  </span>
                  <h2 className="font-serif text-[28px] text-[#171717] font-normal leading-snug">
                    What is your targeted budget tier?
                  </h2>
                  <p className="text-[14px] text-[#55524E] font-light mt-1">
                    Select an investment range to shape realistic allocations across hospitality, production, and gastronomy.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUDGET_OPTIONS.map((tier) => {
                    const isSelected = draft.budget === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => {
                          setDraft((prev) => ({ ...prev, budget: tier.id }));
                          if (errors.budget) setErrors((prev) => ({ ...prev, budget: '' }));
                        }}
                        className={`p-5 rounded-[6px] border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#171717] bg-[#FAF8F5] ring-1 ring-[#171717] shadow-xs'
                            : 'border-[#EAE5DC] bg-white hover:border-[#C6A66B] hover:bg-[#FDFCFB]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] uppercase tracking-widest text-[#8C6D37] font-semibold">
                              {tier.label}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-[#8C6D37]" />}
                          </div>
                          <h4 className="font-serif text-[22px] text-[#171717] font-medium leading-snug">
                            {tier.title}
                          </h4>
                          <p className="text-[12px] text-[#77736D] font-light leading-relaxed mt-2">
                            {tier.idealFor}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {errors.budget && (
                  <p className="text-[12px] text-[#BA1A1A] mt-1">{errors.budget}</p>
                )}
              </div>
            )}

            {/* Step 6: Functions */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-1">
                    Step 06 &bull; Functions &amp; Ceremonies
                  </span>
                  <h2 className="font-serif text-[28px] text-[#171717] font-normal leading-snug">
                    Which functions will comprise your itinerary?
                  </h2>
                  <p className="text-[14px] text-[#55524E] font-light mt-1">
                    Select all ceremonies you intend to stage (multiple selection enabled).
                  </p>
                </div>

                <div className="space-y-2.5">
                  {FUNCTION_OPTIONS.map((func) => {
                    const isSelected = draft.functions.includes(func.id);
                    return (
                      <div
                        key={func.id}
                        onClick={() => toggleFunction(func.id)}
                        className={`p-4 rounded-[6px] border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#171717] bg-[#FAF8F5] ring-1 ring-[#171717]'
                            : 'border-[#EAE5DC] bg-white hover:border-[#C6A66B]'
                        }`}
                      >
                        <div>
                          <h4 className="font-serif text-[18px] text-[#171717] font-medium leading-snug">
                            {func.title}
                          </h4>
                          <p className="text-[12px] text-[#77736D] font-light mt-0.5">
                            {func.desc}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#171717] border-[#171717] text-[#C6A66B]'
                              : 'border-[#D6CFC4] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {errors.functions && (
                  <p className="text-[12px] text-[#BA1A1A] mt-1">{errors.functions}</p>
                )}
              </div>
            )}

            {/* Step 7: Services */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-1">
                    Step 07 &bull; Direction Services
                  </span>
                  <h2 className="font-serif text-[28px] text-[#171717] font-normal leading-snug">
                    Which services require our directorship?
                  </h2>
                  <p className="text-[14px] text-[#55524E] font-light mt-1">
                    Select all core disciplines you wish to entrust to The Wedding Dreams team.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICE_OPTIONS.map((srv) => {
                    const isSelected = draft.services.includes(srv.id);
                    const IconComponent = srv.icon;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleService(srv.id)}
                        className={`p-4 rounded-[6px] border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#171717] bg-[#FAF8F5] ring-1 ring-[#171717]'
                            : 'border-[#EAE5DC] bg-white hover:border-[#C6A66B]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isSelected ? 'bg-[#171717] text-[#C6A66B]' : 'bg-[#F8F5EF] text-[#77736D]'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-serif text-[17px] text-[#171717] font-medium leading-snug">
                                {srv.title}
                              </h4>
                              {isSelected && <Check className="w-4 h-4 text-[#8C6D37]" />}
                            </div>
                            <p className="text-[11px] text-[#77736D] font-light leading-relaxed mt-1">
                              {srv.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {errors.services && (
                  <p className="text-[12px] text-[#BA1A1A] mt-1">{errors.services}</p>
                )}
              </div>
            )}

            {/* Step 8: Contact */}
            {currentStep === 8 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-1">
                    Step 08 &bull; Contact &amp; Confidentiality
                  </span>
                  <h2 className="font-serif text-[28px] text-[#171717] font-normal leading-snug">
                    Where should we transmit your master plan?
                  </h2>
                  <p className="text-[14px] text-[#55524E] font-light mt-1">
                    Please provide your direct contact coordinates. All client information remains strictly governed under our private non-disclosure protocol.
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name *"
                    placeholder="e.g. Radhika Singhania"
                    value={draft.contact.name}
                    leftIcon={<User className="w-4 h-4" />}
                    onChange={(e) => {
                      setDraft((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, name: e.target.value },
                      }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    error={errors.name}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone / WhatsApp Number *"
                      placeholder="+91 98200 12345"
                      type="tel"
                      value={draft.contact.phone}
                      leftIcon={<Phone className="w-4 h-4" />}
                      onChange={(e) => {
                        setDraft((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value },
                        }));
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      error={errors.phone}
                    />

                    <Input
                      label="Email Address *"
                      placeholder="radhika@singhania.com"
                      type="email"
                      value={draft.contact.email}
                      leftIcon={<Mail className="w-4 h-4" />}
                      onChange={(e) => {
                        setDraft((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value },
                        }));
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      error={errors.email}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] block mb-1.5">
                      Special Aspirations or Cultural Preferences (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Traditional Marwari phera mandap by the lake, Sufi night with foreign guest dietary restrictions..."
                      value={draft.contact.notes || ''}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, notes: e.target.value },
                        }))
                      }
                      className="w-full bg-white text-[#252525] placeholder:text-[#9C968C] text-[14px] leading-relaxed p-3.5 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B]/50 transition-all"
                    />
                  </div>
                </div>

                {/* DPDP Compliance Checkbox */}
                <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE5DC] rounded-[4px] flex items-start gap-3 text-[12px] text-[#55524E]">
                  <input
                    type="checkbox"
                    id="dpdp-consent-plan"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#EAE5DC] text-[#C6A66B] focus:ring-[#C6A66B] cursor-pointer shrink-0"
                  />
                  <label htmlFor="dpdp-consent-plan" className="leading-snug cursor-pointer select-none">
                    I consent to The Wedding Dreams processing my submitted contact coordinates for event curation and directorial consultations in accordance with the{' '}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C6A66B] underline font-medium hover:text-[#171717] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </a>.
                  </label>
                </div>

                <div className="p-3.5 rounded-[6px] bg-[#FAF8F5] border border-[#EAE5DC] flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#8C6D37] shrink-0" />
                  <span className="text-[11px] text-[#66625D]">
                    Discretion guaranteed. We never transmit spam or disclose client details to unauthorized third-party vendors.
                  </span>
                </div>
              </form>
            )}

            {/* Wizard Navigation Action Bar */}
            <div className="mt-10 pt-6 border-t border-[#EAE5DC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isSubmitting}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="cursor-pointer"
                >
                  Back
                </Button>

                <button
                  type="button"
                  onClick={handleSaveProgress}
                  className="hidden sm:inline-flex items-center gap-1.5 text-[12px] uppercase tracking-wider text-[#77736D] hover:text-[#171717] px-3 py-2 cursor-pointer transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Progress</span>
                </button>
              </div>

              <div>
                {currentStep < 8 ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="cursor-pointer"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="accent"
                    size="md"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    disabled={!consentChecked || isSubmitting}
                    rightIcon={<Sparkles className="w-4 h-4" />}
                    className="cursor-pointer shadow-md"
                  >
                    Generate Master Plan
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Live Summary Sidebar on Desktop (5 Cols) */}
          <aside className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="bg-white p-6 rounded-[8px] border border-[#EAE5DC] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC] mb-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C6D37] font-semibold">
                  Live Plan Summary
                </span>
                <span className="text-[11px] text-[#77736D]">
                  {Math.round((currentStep / 8) * 100)}% Defined
                </span>
              </div>

              <div className="space-y-3.5 text-[13px]">
                {/* 1. Celebration */}
                <div className="flex items-start justify-between">
                  <span className="text-[#77736D] flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#C6A66B]" />
                    Celebration:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStepJump(1)}
                    className="font-medium text-[#171717] hover:text-[#C6A66B] text-right cursor-pointer"
                  >
                    {draft.celebrationType || 'Pending'}
                  </button>
                </div>

                {/* 2. Date */}
                <div className="flex items-start justify-between">
                  <span className="text-[#77736D] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
                    Date:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStepJump(2)}
                    className="font-medium text-[#171717] hover:text-[#C6A66B] text-right cursor-pointer"
                  >
                    {draft.weddingDate || 'Pending'}
                  </button>
                </div>

                {/* 3. Location */}
                <div className="flex items-start justify-between">
                  <span className="text-[#77736D] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C6A66B]" />
                    Location:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStepJump(3)}
                    className="font-medium text-[#171717] hover:text-[#C6A66B] text-right cursor-pointer"
                  >
                    {draft.location === 'Other' ? draft.locationOther || 'Other' : draft.location || 'Pending'}
                  </button>
                </div>

                {/* 4. Guests */}
                <div className="flex items-start justify-between">
                  <span className="text-[#77736D] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#C6A66B]" />
                    Guest Count:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStepJump(4)}
                    className="font-medium text-[#171717] hover:text-[#C6A66B] text-right cursor-pointer"
                  >
                    {draft.guestCount} Guests
                  </button>
                </div>

                {/* 5. Budget */}
                <div className="flex items-start justify-between">
                  <span className="text-[#77736D] flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-[#C6A66B]" />
                    Target Budget:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStepJump(5)}
                    className="font-medium text-[#171717] hover:text-[#C6A66B] text-right cursor-pointer"
                  >
                    {draft.budget || 'Pending'}
                  </button>
                </div>

                {/* 6. Functions */}
                <div className="pt-2 border-t border-[#F0ECE4]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#77736D] text-[11px] uppercase tracking-wider font-medium">
                      Functions ({draft.functions.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStepJump(6)}
                      className="text-[11px] text-[#8C6D37] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {draft.functions.length > 0 ? (
                      draft.functions.map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 rounded-[3px] bg-[#F8F5EF] text-[11px] text-[#252525] border border-[#EAE5DC]"
                        >
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-[#9C968C] italic">None selected yet</span>
                    )}
                  </div>
                </div>

                {/* 7. Services */}
                <div className="pt-2 border-t border-[#F0ECE4]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#77736D] text-[11px] uppercase tracking-wider font-medium">
                      Services ({draft.services.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStepJump(7)}
                      className="text-[11px] text-[#8C6D37] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {draft.services.length > 0 ? (
                      draft.services.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-[3px] bg-[#171717] text-[10px] text-white uppercase tracking-wider"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-[#9C968C] italic">None selected yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Progress Button */}
              <div className="mt-5 pt-4 border-t border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={handleSaveProgress}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-[4px] border border-[#EAE5DC] bg-[#FAF8F5] text-[#55524E] text-[12px] uppercase tracking-wider font-medium hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Progress to Device</span>
                </button>
              </div>
            </div>

            {/* Direct Concierge Prompt */}
            <div className="bg-[#FAF8F5] p-5 rounded-[8px] border border-[#EAE5DC] text-[12px] text-[#66625D]">
              <div className="flex items-center gap-2 text-[#8C6D37] font-semibold uppercase tracking-wider text-[11px] mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>Need Advisory Assistance?</span>
              </div>
              <p className="leading-relaxed">
                If you have an existing date hold or immediate inquiries regarding Taj Lake Palace, Rambagh, or Goa resorts, call our private desk directly at <strong className="text-[#171717]">+91 98200 48210</strong>.
              </p>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
};
