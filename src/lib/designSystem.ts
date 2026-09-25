/**
 * The Wedding Dreams — Design System Tokens & Utility Helpers
 * High-fashion editorial aesthetic, zero-pill discipline, warm ivory & champagne gold palette.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Canvas & Neutrals
    ivory: '#F8F5EF',
    ivoryLight: '#FCFAF6',
    ivoryDark: '#F0ECE2',
    white: '#FFFFFF',
    stoneBorder: '#EAE5DC',
    stoneBorderHover: '#D6CEBE',
    surfaceLow: '#F6F3ED',
    surfaceMid: '#F0EEE8',
    surfaceHigh: '#EBE8E2',

    // Deep Ink & Typography
    charcoal: '#171717',
    charcoalSurface: '#252525',
    charcoalText: '#252525',
    mutedText: '#77736D',
    subtleText: '#9C968C',

    // Accents & Materials
    gold: '#C6A66B',
    goldHover: '#B5955A',
    goldLight: '#E4C284',
    goldMuted: 'rgba(198, 166, 107, 0.15)',
    goldBg: '#F9F5EB',

    rose: '#C9A7A1',
    roseLight: '#E2BEB8',
    roseMuted: 'rgba(201, 167, 161, 0.18)',

    // Semantic States
    error: '#BA1A1A',
    errorBg: '#FDF2F2',
    success: '#2E6930',
    successBg: '#F0F9F1',
    info: '#275274',
    infoBg: '#F0F6FA',
  },

  typography: {
    fontSerif: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    fontSans: "'Manrope', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  shadows: {
    card: '0 8px 24px -6px rgba(23, 23, 23, 0.03)',
    cardHover: '0 16px 36px -10px rgba(23, 23, 23, 0.06)',
    modal: '0 24px 48px -12px rgba(23, 23, 23, 0.12), 0 4px 16px -2px rgba(23, 23, 23, 0.04)',
    goldAccent: '0 4px 16px rgba(198, 166, 107, 0.25)',
  },

  radii: {
    none: '0px',
    xs: '2px',
    sm: '4px', // Standard button, input radius (soft discipline)
    md: '6px',
    lg: '8px', // Standard card radius
    xl: '12px', // Modals & large panels
    full: '9999px', // Strict exception for avatars and numeric indicators only
  },
} as const;

/**
 * Formats an amount in Indian Rupees (INR) with standard lakh and crore nomenclature
 * @param amount Number in INR
 * @param format 'compact' | 'standard'
 */
export function formatINR(amount: number, format: 'compact' | 'standard' = 'standard'): string {
  if (format === 'compact') {
    if (amount >= 10000000) {
      const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
      return `₹${cr} Cr`;
    }
    if (amount >= 100000) {
      const l = (amount / 100000).toFixed(2).replace(/\.00$/, '');
      return `₹${l} Lakh`;
    }
  }

  // Standard Indian comma separator notation: e.g. 75,00,000
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const str = Math.round(absAmount).toString();
  
  if (str.length <= 3) {
    return `${isNegative ? '-' : ''}₹${str}`;
  }

  const lastThree = str.substring(str.length - 3);
  const remaining = str.substring(0, str.length - 3);
  const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  return `${isNegative ? '-' : ''}₹${formattedRemaining},${lastThree}`;
}

/**
 * Format guest count string
 */
export function formatGuestCount(count: number): string {
  if (count >= 1000) {
    return '1,000+ Guests (Royal Imperial)';
  }
  if (count >= 500) {
    return `${count} Guests (Grand Celebration)`;
  }
  return `${count} Guests (Bespoke Intimate)`;
}
