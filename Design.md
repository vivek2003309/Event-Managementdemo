# Atelier Design System & Visual Specification
**Brand**: The Wedding Dreams by Varun Rathor  
**Style Core**: Haute Couture Editorial & Architectural Scenography

---

## 1. Color Tokens & Palette

### Primary Atelier Palette
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Atelier Gold** | `#C5A059` / `#C6A66B` | Primary brand accent, borders, highlights, CTA hover states |
| **Deep Gold** | `#B08D46` / `#8C6D37` | Badges, subtle dark mode borders, active states |
| **Deep Charcoal / Noir** | `#171717` | Dark mode background, footer background, primary text on ivory |
| **Warm Alabaster / Ivory** | `#F8F5EF` / `#FCFAF6` | Light mode primary background, card fill |
| **Muted Slate** | `#77736D` | Subtitles, helper captions, secondary metadata |
| **Borders & Dividers** | `#EAE5DC` / `#E5DFD3` | Hairline card outlines, section dividers |

---

## 2. Typography Hierarchy

### Display & Editorial Serif
- **Font Family**: Playfair Display / Cormorant Garamond style serif (`font-serif`).
- **Application**: Main hero headlines, section titles, card title headers, quote callouts.
- **Style**: Normal weight (`font-normal`), italic variants for romance and sub-quotes.

### Body & Geometric Sans-Serif
- **Font Family**: Inter / SF Pro style clean sans-serif (`font-sans`).
- **Application**: Body copy, form inputs, button labels, navigation items.
- **Numbers & Metadata**: Monospace numbers (`font-mono` / tabular nums) for budgets, dates, and milestone counts.

---

## 3. Component Design Patterns

### Hairline Borders & Frames
- All luxury cards feature a crisp `1px` border (`border border-[#EAE5DC]`) and subtle shadow (`shadow-sm` or `shadow-[0_4px_24px_-6px_rgba(23,23,23,0.04)]`).

### Side Drawers & Floating Suites
- `AIWeddingConcierge`: Floating bottom-right suite with smooth tabbed navigation (Assistant, Style Quiz, Lead Capture).
- `ConsultationModal`: Centered modal with backdrop blur (`backdrop-blur-sm`), keyboard `Escape` dismissal, and DPDP opt-in checkbox.

### WCAG 2.1 AA Accessibility
- Visible focus rings on all form inputs and selects: `focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059]`.
- Explicit `aria-label` or `<label htmlFor="...">` attributes across all interactive elements.

### Cookie Consent Banner
- Discreet bottom slate banner (`#171717`) with gold accent button and direct link to `/cookies`.
