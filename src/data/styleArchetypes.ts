import { StyleArchetype } from '../types';

export const STYLE_ARCHETYPES: StyleArchetype[] = [
  {
    id: 'royal-heritage',
    code: 'A',
    name: 'Royal Heritage',
    tagline: 'Palatial Grandeur, Sacred Rituals & Antique Brass',
    description:
      'Palace arches, antique hammered brass, deep vermilion, and marigold garlands. Your vision harmonizes timeless palace grandeur with clean, contemporary silhouettes.',
    palette: [
      { name: 'Champagne Gold', hex: '#C6A66B' },
      { name: 'Warm Ivory', hex: '#F8F5EF' },
      { name: 'Deep Emerald', hex: '#1A3A32' },
      { name: 'Crimson Velvet', hex: '#8E2828' },
    ],
    recommendedVenues: ['Jagmandir Island Palace (Udaipur)', 'The Leela Palace (Jaipur)', 'Alila Fort Bishangarh'],
    materials: ['Hand-beaten brassware', 'Mogra and tuberose floral canopies', 'Banarasi spun silk', 'Carved sandstone jaalis'],
  },
  {
    id: 'modern-minimalist',
    code: 'B',
    name: 'Modern Minimalist',
    tagline: 'Architectural Restraint, Monochromatic Foliage & Raw Stone',
    description:
      'Monochrome linen, olive foliage, architectural blooms, and intentional negative space. Designed for aesthetics who value quiet luxury and uncluttered sightlines.',
    palette: [
      { name: 'Alabaster White', hex: '#FFFFFF' },
      { name: 'Sage Olive', hex: '#5C6355' },
      { name: 'Linen Stone', hex: '#D8D2C4' },
      { name: 'Charcoal Noir', hex: '#171717' },
    ],
    recommendedVenues: ['Chattarpur Glass Estate (Delhi)', 'Amanbagh (Alwar)', 'The Glasshouse on the Ganges'],
    materials: ['Washed French linen', 'Sculptural olive trees', 'Monolithic travertine bars', 'Hand-thrown ceramics'],
  },
  {
    id: 'contemporary-glamour',
    code: 'C',
    name: 'Contemporary Glamour',
    tagline: 'Mirrored Stages, Crystal Refractions & Kinetic Illumination',
    description:
      'Mirrored podiums, crystal chandeliers, kinetic spotlights, champagne towers, and sound-dampened velvet speakeasies for after-hours revelry.',
    palette: [
      { name: 'Gilded Gold', hex: '#FFDEA5' },
      { name: 'Noir Black', hex: '#171717' },
      { name: 'Smoked Mirror', hex: '#EBE8E2' },
      { name: 'Deep Espresso', hex: '#4A3B32' },
    ],
    recommendedVenues: ['The Taj Mahal Palace (Mumbai)', 'Rambagh Palace Grounds', 'Armani Hotel (Dubai)'],
    materials: ['Faceted smoked crystal', 'Smoked bevel glass', 'High-polish chrome and gold', 'Midnight black velvet'],
  },
  {
    id: 'botanical-whimsical',
    code: 'D',
    name: 'Botanical Whimsical',
    tagline: 'Orangerie Glasshouses, Cascading Wisteria & Wild English Flora',
    description:
      'Orangerie glasshouses, hanging wisteria, antique rosewood, wild English flora, and candlelit conservatory banquets beneath stars.',
    palette: [
      { name: 'Dusty Rose', hex: '#E2BEB8' },
      { name: 'Forest Fern', hex: '#526B50' },
      { name: 'Blush Ivory', hex: '#E8DDD1' },
      { name: 'Warm Taupe', hex: '#8E7970' },
    ],
    recommendedVenues: ['Villa Balbianello (Lake Como)', 'The Savoy (Mussoorie)', 'The Tamara (Coorg)'],
    materials: ['Preserved moss & lichen', 'Wild trailing sweet pea', 'Antique wrought iron', 'Textured cotton rag paper'],
  },
];
