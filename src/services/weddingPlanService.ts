/**
 * The Wedding Dreams — Wedding Plan Service Layer
 * Manages drafts, client-side persistence, validation, and submission of bespoke wedding plans.
 * Architecture ready for future Firebase Firestore integration.
 */

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  notes?: string;
}

export type CelebrationType =
  | 'Wedding'
  | 'Destination Wedding'
  | 'Engagement'
  | 'Reception'
  | 'Other';

export type LocationType =
  | 'Delhi NCR'
  | 'Jaipur'
  | 'Udaipur'
  | 'Goa'
  | 'Other';

export type BudgetTier =
  | '₹10–25L'
  | '₹25–50L'
  | '₹50L–₹1Cr'
  | '₹1Cr+';

export type WeddingFunction =
  | 'Mehendi'
  | 'Haldi'
  | 'Sangeet'
  | 'Wedding'
  | 'Reception';

export type WeddingService =
  | 'Planning'
  | 'Décor'
  | 'Catering'
  | 'Photography'
  | 'Entertainment'
  | 'Hospitality'
  | 'Transportation';

export interface PlanDraft {
  celebrationType: CelebrationType | '';
  celebrationOther?: string;
  weddingDate: string; // YYYY-MM-DD
  isDateFlexible?: boolean;
  location: LocationType | '';
  locationOther?: string;
  guestCount: number;
  budget: BudgetTier | '';
  functions: WeddingFunction[];
  services: WeddingService[];
  contact: ContactInfo;
  currentStep: number;
  updatedAt?: string;
}

export interface BudgetDistributionItem {
  category: string;
  percentage: number;
  estimatedAmountINR: string;
  notes: string;
  colorHex: string;
}

export interface PlanningPriority {
  phase: string;
  timing: string;
  title: string;
  description: string;
}

export interface PreliminaryPlan {
  id: string;
  eventType: string;
  date: string;
  formattedDate: string;
  location: string;
  guests: number;
  budget: string;
  functions: string[];
  requiredServices: string[];
  suggestedPlanningPriorities: PlanningPriority[];
  indicativeBudgetDistribution: BudgetDistributionItem[];
  indicativeTotalEstimate: string;
  contact: ContactInfo;
  createdAt: string;
  status: 'submitted' | 'in_review';
}

const STORAGE_KEY_DRAFT = 'twd_plan_my_wedding_draft';
const STORAGE_KEY_SUBMISSIONS = 'twd_plan_my_wedding_submissions';

export const INITIAL_DRAFT: PlanDraft = {
  celebrationType: 'Wedding',
  celebrationOther: '',
  weddingDate: '',
  isDateFlexible: false,
  location: 'Udaipur',
  locationOther: '',
  guestCount: 250,
  budget: '₹50L–₹1Cr',
  functions: ['Mehendi', 'Sangeet', 'Wedding', 'Reception'],
  services: ['Planning', 'Décor', 'Catering', 'Photography', 'Hospitality'],
  contact: {
    name: '',
    phone: '',
    email: '',
    notes: '',
  },
  currentStep: 1,
};

export class WeddingPlanService {
  /**
   * Retrieves saved draft from storage or defaults
   */
  static getDraft(): PlanDraft {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_DRAFT, ...parsed };
      }
    } catch (e) {
      console.warn('Unable to retrieve wedding plan draft from localStorage:', e);
    }
    return { ...INITIAL_DRAFT };
  }

  /**
   * Saves ongoing draft progress to storage
   */
  static saveDraft(draft: PlanDraft): void {
    try {
      const payload = {
        ...draft,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(payload));
    } catch (e) {
      console.warn('Unable to persist wedding plan draft to localStorage:', e);
    }
  }

  /**
   * Clears saved draft upon successful submission
   */
  static clearDraft(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_DRAFT);
    } catch (e) {
      console.warn('Failed to clear draft:', e);
    }
  }

  /**
   * Generates calculated indicative budget distribution based on tier and selected services
   */
  static calculateBudgetDistribution(budgetTier: BudgetTier, selectedServices: WeddingService[]): BudgetDistributionItem[] {
    let baselineINR = 7500000; // 75 Lakhs default
    if (budgetTier === '₹10–25L') baselineINR = 1800000;
    if (budgetTier === '₹25–50L') baselineINR = 3800000;
    if (budgetTier === '₹50L–₹1Cr') baselineINR = 7500000;
    if (budgetTier === '₹1Cr+') baselineINR = 18500000;

    const baseWeights: Record<string, { weight: number; color: string; notes: string }> = {
      'Venue & Hospitality': {
        weight: selectedServices.includes('Hospitality') ? 30 : 25,
        color: '#171717',
        notes: 'Room inventory locks, palace rental, royal guest concierges & VIP protocols',
      },
      'Décor & Scenography': {
        weight: selectedServices.includes('Décor') ? 25 : 12,
        color: '#C6A66B',
        notes: 'Architectural florals, mandap engineering, atmospheric lighting & thematic sets',
      },
      'Food & Beverage': {
        weight: selectedServices.includes('Catering') ? 22 : 12,
        color: '#A37C40',
        notes: 'Curated royal banquets, artisanal regional counters, midnight feasts & master bar service',
      },
      'Photography & Cinema': {
        weight: selectedServices.includes('Photography') ? 10 : 6,
        color: '#6366F1',
        notes: 'Drone cinematography, editorial portraits, 35mm film stills & signature teasers',
      },
      'Entertainment & Artistry': {
        weight: selectedServices.includes('Entertainment') ? 8 : 4,
        color: '#EC4899',
        notes: 'Live Sufi ensembles, headline performers, celebrity choreographers & sound design',
      },
      'Logistics & Management': {
        weight: selectedServices.includes('Planning') || selectedServices.includes('Transportation') ? 5 : 3,
        color: '#10B981',
        notes: 'Show direction, air charters, luggage logistics, government permissions & security',
      },
    };

    // Calculate total weights and normalize
    const totalWeight = Object.values(baseWeights).reduce((sum, item) => sum + item.weight, 0);

    return Object.entries(baseWeights).map(([category, config]) => {
      const percentage = Math.round((config.weight / totalWeight) * 100);
      const amount = Math.round((baselineINR * percentage) / 100);
      
      let formattedAmount = '';
      if (amount >= 10000000) {
        formattedAmount = `₹${(amount / 10000000).toFixed(2)} Cr`;
      } else {
        formattedAmount = `₹${(amount / 100000).toFixed(1)} Lakhs`;
      }

      return {
        category,
        percentage,
        estimatedAmountINR: formattedAmount,
        notes: config.notes,
        colorHex: config.color,
      };
    });
  }

  /**
   * Generates dynamic strategic planning priorities based on location, guests, and timeline
   */
  static generatePlanningPriorities(draft: PlanDraft): PlanningPriority[] {
    const loc = draft.location === 'Other' ? draft.locationOther || 'Destination' : draft.location;
    const isDestination = draft.celebrationType === 'Destination Wedding' || ['Udaipur', 'Jaipur', 'Goa'].includes(loc);

    const priorities: PlanningPriority[] = [
      {
        phase: 'Phase 1',
        timing: 'Immediately (9–12 Months Out)',
        title: isDestination ? `Secure Heritage Venue & Room Block in ${loc}` : `Finalize Primary Venue & Hold Golden Dates`,
        description: `High-demand palaces and luxury resorts in ${loc} book out 9 to 14 months in advance during peak auspicious dates. Securing 100% room inventory and sound curfew clearances is the first critical milestone.`,
      },
      {
        phase: 'Phase 2',
        timing: '6–8 Months Out',
        title: 'Master Scenography & Creative Vision Direction',
        description: `Develop distinct mood boards, 3D spatial renders, and color stories for ${draft.functions.length || 4} functions (${draft.functions.slice(0, 3).join(', ')}${draft.functions.length > 3 ? '...' : ''}). Finalize floral imports and ambient lighting schematics.`,
      },
      {
        phase: 'Phase 3',
        timing: '4–6 Months Out',
        title: 'Curated Tasting Sessions & Entertainment Bookings',
        description: `Conduct private menu tastings for ${draft.guestCount} guests. Lock headline musical acts, Sufi midnight singers, celebrity choreographers, and ritual Vedic pandits.`,
      },
      {
        phase: 'Phase 4',
        timing: '2–3 Months Out',
        title: 'VIP Guest Concierge & Arrival Logistics',
        description: `Deploy customized guest digital RSVP portal, airport fleet transfers, luggage tagging systems, and hospitality hampers tailored for your guests.`,
      },
      {
        phase: 'Phase 5',
        timing: 'Wedding Week',
        title: 'On-Site Operational Direction & Flawless Execution',
        description: `Our directorship team takes over all vendor management, run-of-show cues, sound checks, and bridal shadow assistance so family members remain fully present as hosts.`,
      },
    ];

    return priorities;
  }

  /**
   * Submits the completed plan. Emulates a network request and saves to service storage.
   */
  static async submitWeddingPlan(draft: PlanDraft): Promise<PreliminaryPlan> {
    // Simulate brief network latency for authentic luxury feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    const loc = draft.location === 'Other' ? draft.celebrationOther || 'Selected Destination' : draft.location;
    const eventType = draft.celebrationType === 'Other' ? draft.celebrationOther || 'Celebration' : draft.celebrationType;

    let formattedDate = 'Flexible Schedule';
    if (draft.weddingDate) {
      try {
        const d = new Date(draft.weddingDate);
        formattedDate = d.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } catch (e) {
        formattedDate = draft.weddingDate;
      }
    }

    const budgetDist = this.calculateBudgetDistribution(draft.budget as BudgetTier, draft.services);
    const priorities = this.generatePlanningPriorities(draft);

    const submission: PreliminaryPlan = {
      id: `TWD-${Date.now().toString().slice(-6)}`,
      eventType,
      date: draft.weddingDate || 'To be confirmed',
      formattedDate,
      location: loc,
      guests: draft.guestCount,
      budget: draft.budget || 'Custom Allocation',
      functions: draft.functions,
      requiredServices: draft.services,
      suggestedPlanningPriorities: priorities,
      indicativeBudgetDistribution: budgetDist,
      indicativeTotalEstimate: draft.budget || '₹50L–₹1Cr',
      contact: draft.contact,
      createdAt: new Date().toISOString(),
      status: 'submitted',
    };

    // Store in historical submissions
    try {
      const existing = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(submission);
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(list));
      this.clearDraft();
    } catch (e) {
      console.warn('Failed to store submission in localStorage:', e);
    }

    // Persist to Firestore asynchronously
    try {
      import('./firestoreService').then(({ FirestoreService }) => {
        import('../lib/firebase').then(({ auth }) => {
          const currentUid = auth.currentUser?.uid || 'guest';
          FirestoreService.saveWeddingPlan({
            userId: currentUid,
            planNumber: submission.id,
            celebrationType: submission.eventType,
            targetDate: submission.date,
            isDateFlexible: Boolean(draft.isDateFlexible),
            location: submission.location,
            guestCount: submission.guests,
            budgetRange: submission.budget,
            selectedFunctions: submission.functions,
            selectedServices: submission.requiredServices,
            status: 'submitted',
            contactName: draft.contact?.name,
            contactPhone: draft.contact?.phone,
            contactEmail: draft.contact?.email,
            notes: draft.contact?.notes,
          }).catch((err) => console.warn('Firestore plan save:', err));

          if (draft.contact?.name && (draft.contact?.email || draft.contact?.phone)) {
            FirestoreService.createLead({
              name: draft.contact.name,
              email: draft.contact.email || '',
              phone: draft.contact.phone || '',
              weddingDate: submission.date,
              location: submission.location,
              guestCount: submission.guests,
              budget: submission.budget,
              source: 'Plan My Wedding Wizard',
              status: 'new',
              notes: draft.contact.notes,
            }).catch((err) => console.warn('Firestore lead save:', err));
          }
        });
      });
    } catch (fsErr) {
      console.warn('Firestore integration sync warning:', fsErr);
    }

    return submission;

  }

  /**
   * Get all past submitted plans (useful for client/admin review)
   */
  static getSubmissions(): PreliminaryPlan[] {
    try {
      const existing = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      return existing ? JSON.parse(existing) : [];
    } catch (e) {
      return [];
    }
  }
}
