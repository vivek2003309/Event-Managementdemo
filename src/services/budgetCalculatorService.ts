/**
 * The Wedding Dreams — Budget Calculator Service
 * Modular calculation logic for dynamic wedding budget planning.
 * Designed so actual proprietary company pricing matrices and rate cards
 * can seamlessly replace indicative demo estimates in production.
 */

export interface BudgetInputParams {
  targetBudget: number; // in INR
  guestCount: number;
  location: string;
  numberOfFunctions: number;
  selectedFunctions: string[];
  requiredServices: string[];
}

export interface BudgetCategoryAllocation {
  id: string;
  name: string;
  categoryKey: string;
  amountINR: number;
  percentage: number;
  color: string;
  description: string;
  guestSensitive: boolean;
  functionSensitive: boolean;
  estimatedCostPerGuest?: number;
  benchmarkRule: string;
}

export interface BudgetCalculationResult {
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
  isOverBudget: boolean;
  allocations: BudgetCategoryAllocation[];
  perGuestAverage: number;
  locationMultiplier: number;
  functionsMultiplier: number;
  currencyFormatted: {
    totalBudget: string;
    allocatedBudget: string;
    remainingBudget: string;
    perGuestAverage: string;
  };
}

export const BUDGET_LOCATIONS = [
  { id: 'Delhi NCR', label: 'Delhi NCR', multiplier: 1.0, description: 'Metropolitan farmhouses, ballroom venues & estate lawns' },
  { id: 'Jaipur', label: 'Jaipur', multiplier: 1.12, description: 'Heritage fortresses, palace courtyards & royal estates' },
  { id: 'Udaipur', label: 'Udaipur', multiplier: 1.18, description: 'Lakeside island palaces, water flotillas & Mewari heritage' },
  { id: 'Goa', label: 'Goa', multiplier: 1.08, description: 'Seaside cliffside resorts, beach cabanas & coastal sanctuaries' },
  { id: 'Other', label: 'Other Destination', multiplier: 1.15, description: 'Hill stations, international shores, and custom destination buyouts' },
];

export const ALL_FUNCTIONS_LIST = [
  { id: 'Mehendi', label: 'Mehendi Soiree', defaultHours: 4 },
  { id: 'Haldi', label: 'Haldi Carnival', defaultHours: 3 },
  { id: 'Sangeet', label: 'Grand Sangeet Concert', defaultHours: 6 },
  { id: 'Wedding', label: 'Pheras & Wedding Ceremony', defaultHours: 5 },
  { id: 'Reception', label: 'Royal Gala Reception', defaultHours: 4 },
  { id: 'Cocktail', label: 'Cocktail & After-Party', defaultHours: 5 },
];

export const ALL_SERVICES_LIST = [
  { id: 'Venue', label: 'Venue & Palace Rental', defaultWeight: 26, color: '#C6A66B' },
  { id: 'Catering', label: 'Catering & Mixology', defaultWeight: 22, color: '#171717' },
  { id: 'Décor', label: 'Décor & Floral Scenography', defaultWeight: 20, color: '#A37C40' },
  { id: 'Photography', label: 'Photography & 35mm Cinema', defaultWeight: 10, color: '#6366F1' },
  { id: 'Entertainment', label: 'Artists & Live Symphony', defaultWeight: 8, color: '#EC4899' },
  { id: 'Hospitality', label: 'Hospitality, Room Blocks & RSVP', defaultWeight: 6, color: '#10B981' },
  { id: 'Transportation', label: 'Transportation & Fleet Logistics', defaultWeight: 4, color: '#F59E0B' },
  { id: 'Miscellaneous', label: 'Permissions, Security & Contingency', defaultWeight: 4, color: '#77736D' },
];

export const PRESET_BUDGET_TIERS = [
  { label: '₹15L–₹30L', value: 2500000, description: 'Intimate boutique celebration' },
  { label: '₹30L–₹60L', value: 4500000, description: 'Curated 2 to 3-day luxury nuptials' },
  { label: '₹60L–₹1.2Cr', value: 8500000, description: 'Full palace or resort takeover' },
  { label: '₹1.2Cr–₹2.5Cr', value: 18000000, description: 'Grand heritage multi-day conclave' },
  { label: '₹2.5Cr+', value: 35000000, description: 'Monumental royal imperial buyout' },
];

export class BudgetCalculatorService {
  /**
   * Calculates the full dynamic budget allocation based on modular rules.
   */
  static calculate(params: BudgetInputParams): BudgetCalculationResult {
    const {
      targetBudget,
      guestCount,
      location,
      numberOfFunctions,
      requiredServices,
    } = params;

    // 1. Determine location multiplier
    const locConfig = BUDGET_LOCATIONS.find((l) => l.id === location) || BUDGET_LOCATIONS[0];
    const locationMultiplier = locConfig.multiplier;

    // 2. Determine function complexity multiplier
    // Baseline is 3 functions. Each additional function adds marginal logistics/production scale.
    const functionsMultiplier = Math.max(0.7, 0.7 + (numberOfFunctions * 0.1));

    // 3. Base category weights definitions
    // These weights reflect standard luxury destination wedding ratios in India
    const categoryProfiles: Record<string, {
      baseWeight: number;
      color: string;
      description: string;
      guestSensitive: boolean;
      functionSensitive: boolean;
      benchmarkRule: string;
    }> = {
      Venue: {
        baseWeight: 26,
        color: '#C6A66B',
        description: 'Heritage palace charter, lawn buyout, ambient power, and sound curfew clearances.',
        guestSensitive: false,
        functionSensitive: true,
        benchmarkRule: 'Estimated 22%–28% of overall wedding investment.',
      },
      Catering: {
        baseWeight: 22,
        color: '#171717',
        description: 'Multi-course regional banquets, live artisanal food counters, premium spirits, and midnight snacks.',
        guestSensitive: true,
        functionSensitive: true,
        benchmarkRule: 'Driven dynamically by guest headcount and number of ceremonial meals.',
      },
      Décor: {
        baseWeight: 20,
        color: '#A37C40',
        description: 'Thematic architectural sets, imported florals, custom Vedic mandap, and intelligent lighting.',
        guestSensitive: false,
        functionSensitive: true,
        benchmarkRule: 'Calibrated per scheduled function theme and spatial footprint.',
      },
      Photography: {
        baseWeight: 10,
        color: '#6366F1',
        description: 'Editorial crew, 35mm analog film, aerial drone cinematography, same-day edits & heirloom albums.',
        guestSensitive: false,
        functionSensitive: true,
        benchmarkRule: 'Standard 8%–12% allocation for bespoke visual archives.',
      },
      Entertainment: {
        baseWeight: 8,
        color: '#EC4899',
        description: 'Curated headline vocalists, Sufi midnight ensembles, folk arrival troupes, DJ & sound engineering.',
        guestSensitive: false,
        functionSensitive: true,
        benchmarkRule: 'Variable allocation depending on celebrity talent and concert staging.',
      },
      Hospitality: {
        baseWeight: 6,
        color: '#10B981',
        description: 'Airport concierge desks, luggage tagging, royal welcome hampers, and bridal shadow attendants.',
        guestSensitive: true,
        functionSensitive: false,
        benchmarkRule: 'Directly scales with guest room blocks and hospitality staffing ratios.',
      },
      Transportation: {
        baseWeight: 4,
        color: '#F59E0B',
        description: 'Luxury chauffeured sedans, guest shuttle fleet, vintage baraat open car, and luggage logistics.',
        guestSensitive: true,
        functionSensitive: false,
        benchmarkRule: 'Covers airport-to-palace fleet and inter-venue conveyances.',
      },
      Miscellaneous: {
        baseWeight: 4,
        color: '#77736D',
        description: 'Statutory government permissions, copyright music licenses (IPRS/PPL), security & reserve fund.',
        guestSensitive: false,
        functionSensitive: false,
        benchmarkRule: 'Essential 3%–5% safety buffer for unexpected ceremonial demands.',
      },
    };

    // Filter to active required services (if a service is not selected by user, weight is 0)
    // Always keep Miscellaneous as a safety reserve
    const activeCategories = Object.keys(categoryProfiles).filter(
      (catKey) => requiredServices.includes(catKey) || catKey === 'Miscellaneous'
    );

    // Dynamic guest & function impact adjustments
    // Compute adjusted raw scores
    const rawScores: Record<string, number> = {};
    let totalScore = 0;

    activeCategories.forEach((catKey) => {
      const profile = categoryProfiles[catKey];
      let score = profile.baseWeight;

      // Guest sensitivity multiplier
      if (profile.guestSensitive) {
        if (guestCount > 350) {
          // Large guest volume increases catering and hospitality ratio
          score *= 1.15;
        } else if (guestCount < 100) {
          // Intimate gathering shifts weight toward bespoke décor & photography
          score *= 0.85;
        }
      }

      // Location sensitivity
      if (catKey === 'Venue' || catKey === 'Transportation') {
        score *= locationMultiplier;
      }

      // Function sensitivity
      if (profile.functionSensitive) {
        if (numberOfFunctions > 4) {
          score *= 1.1;
        } else if (numberOfFunctions <= 2) {
          score *= 0.9;
        }
      }

      rawScores[catKey] = score;
      totalScore += score;
    });

    // 4. Distribute the target budget across active categories
    // Each allocation gets its normalized proportion of the target budget
    const allocations: BudgetCategoryAllocation[] = activeCategories.map((catKey) => {
      const profile = categoryProfiles[catKey];
      const normalizedPct = totalScore > 0 ? (rawScores[catKey] / totalScore) * 100 : 0;
      const roundedPct = Math.round(normalizedPct);
      const amountINR = Math.round((targetBudget * normalizedPct) / 100);

      const resultItem: BudgetCategoryAllocation = {
        id: catKey.toLowerCase(),
        name: catKey,
        categoryKey: catKey,
        amountINR,
        percentage: roundedPct,
        color: profile.color,
        description: profile.description,
        guestSensitive: profile.guestSensitive,
        functionSensitive: profile.functionSensitive,
        benchmarkRule: profile.benchmarkRule,
      };

      if (profile.guestSensitive && guestCount > 0) {
        resultItem.estimatedCostPerGuest = Math.round(amountINR / guestCount);
      }

      return resultItem;
    });

    // 5. Total Allocated and Remaining
    const allocatedBudget = allocations.reduce((sum, item) => sum + item.amountINR, 0);
    const remainingBudget = targetBudget - allocatedBudget;
    const isOverBudget = remainingBudget < 0;
    const perGuestAverage = guestCount > 0 ? Math.round(targetBudget / guestCount) : 0;

    return {
      totalBudget: targetBudget,
      allocatedBudget,
      remainingBudget,
      isOverBudget,
      allocations,
      perGuestAverage,
      locationMultiplier,
      functionsMultiplier,
      currencyFormatted: {
        totalBudget: formatRupees(targetBudget),
        allocatedBudget: formatRupees(allocatedBudget),
        remainingBudget: formatRupees(remainingBudget),
        perGuestAverage: formatRupees(perGuestAverage),
      },
    };
  }
}

/**
 * Format helper for Lakhs and Crores with standard symbol
 */
export function formatRupees(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (abs >= 10000000) {
    const cr = (abs / 10000000).toFixed(2).replace(/\.00$/, '');
    return `${isNegative ? '-' : ''}₹${cr} Cr`;
  }
  if (abs >= 100000) {
    const l = (abs / 100000).toFixed(2).replace(/\.00$/, '');
    return `${isNegative ? '-' : ''}₹${l} Lakh`;
  }
  return `${isNegative ? '-' : ''}₹${abs.toLocaleString('en-IN')}`;
}
