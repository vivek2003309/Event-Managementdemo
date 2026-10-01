import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, CheckCircle, Calendar, Users, Building, MessageSquare, Compass } from 'lucide-react';

interface ClientOnboardingTourProps {
  onComplete: () => void;
  clientName?: string;
}

const TOUR_STEPS = [
  {
    title: 'Welcome to Your Private Sanctuary',
    subtitle: 'Directorial Atelier Portal',
    description: 'Congratulations on your upcoming celebration. This secure sanctuary is your command center for tracking every exquisite detail of your wedding production.',
    icon: Sparkles,
    badge: 'Step 1 of 5',
  },
  {
    title: 'Wedding Milestone Timeline',
    subtitle: 'Countdown & Checklists',
    description: 'Monitor live planning progress in real-time, view critical venue locks, and review milestone deliverables updated directly by your Curatorial Director.',
    icon: Calendar,
    badge: 'Step 2 of 5',
  },
  {
    title: 'Atelier Guest Directory & RSVP',
    subtitle: 'Guest List Management',
    description: 'Seamlessly curate your guest list, track royal suite allocations, monitor dietary requirements, and manage event-specific RSVPs.',
    icon: Users,
    badge: 'Step 3 of 5',
  },
  {
    title: 'Curated Vendor Portal',
    subtitle: 'Contracted Specialists',
    description: 'Review contracted luxury venues, floral scenography artists, editorial photographers, and entertainment partners assigned to your production.',
    icon: Building,
    badge: 'Step 4 of 5',
  },
  {
    title: 'Direct 24/7 Concierge',
    subtitle: 'Atelier Communication',
    description: 'Connect directly with your dedicated directorial concierge anytime for bespoke inquiries, wardrobe fittings, and run-of-show adjustments.',
    icon: MessageSquare,
    badge: 'Step 5 of 5',
  },
];

export const ClientOnboardingTour: React.FC<ClientOnboardingTourProps> = ({
  onComplete,
  clientName = 'Esteemed Client',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('client_sanctuary_tour_completed');
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('client_sanctuary_tour_completed', 'true');
    setIsVisible(false);
    onComplete();
  };

  const step = TOUR_STEPS[currentStep];
  const IconComponent = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-lg rounded-[12px] shadow-2xl border border-[#EAE5DC] overflow-hidden flex flex-col relative">
        {/* Top bar with progress and close */}
        <div className="px-6 py-4 bg-[#171717] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C6A66B]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B]">
              Sanctuary Guided Tour
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">
              {step.badge}
            </span>
            <button
              onClick={handleFinish}
              className="text-white/70 hover:text-white p-1 rounded transition-colors cursor-pointer"
              title="Skip Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#C6A66B] flex items-center justify-center mx-auto border border-[#C6A66B]/30 shadow-xs">
            <IconComponent className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8C6D37] block">
              {step.subtitle}
            </span>
            <h2 className="font-serif text-[24px] sm:text-[28px] text-[#171717] font-normal leading-tight">
              {currentStep === 0 ? `Welcome, ${clientName} ❤️` : step.title}
            </h2>
            <p className="text-[13px] text-[#77736D] leading-relaxed max-w-md mx-auto font-light pt-1">
              {step.description}
            </p>
          </div>

          {/* Progress indicators dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentStep ? 'w-8 bg-[#C6A66B]' : 'w-2 bg-[#EAE5DC]'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-6 border-t border-[#EAE5DC] bg-[#FAF8F5] flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-[4px] bg-white border border-[#D6CEBE] text-[#55524E] hover:text-[#171717] text-[12px] font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="text-[12px] text-[#77736D] hover:text-[#171717] font-medium cursor-pointer"
            >
              Skip Tour
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[12px] font-medium uppercase tracking-[0.14em] hover:bg-[#C6A66B] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{currentStep === TOUR_STEPS.length - 1 ? 'Enter Sanctuary' : 'Next Step'}</span>
            {currentStep === TOUR_STEPS.length - 1 ? <CheckCircle className="w-4 h-4 text-[#C6A66B]" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
