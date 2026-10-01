# Project Roadmap & Feature Lifecycle (phases.md)
**Project**: The Wedding Dreams by Varun Rathor  
**Domain**: `https://event-managementdemo.vercel.app/`

---

## Phase 1: Core Atelier Platform & Infrastructure (Completed)
- [x] **Public Atelier Showcase**:
  - Full-screen cinematic video hero section with smooth scroll triggers.
  - Interactive portfolio galleries for Udaipur, Jaipur, Goa, and international enclaves.
  - Case study detail pages with high-resolution imagery and fine art stills.
- [x] **Curatorial Planning Consoles**:
  - Interactive "Plan My Wedding" 8-step wizard.
  - "Wedding Style Quiz" with visual aesthetic profiling.
  - Interactive "Budget Calculator" with dynamic tier distribution rules.
- [x] **Admin Directorship Enclave**:
  - CRM Pipeline lead triage (New, Contacted, Proposal Sent, Booked, Archived).
  - Active Wedding Dossier Manager with real-time Firestore sync.
  - Native Vector `jsPDF` Proposal Generator.
  - Recharts 30-Day Milestone Velocity & Financial Momentum charts.
  - Removal of redundant "Clients" tab to streamline command center navigation.
- [x] **Client Sanctuary**:
  - Authenticated patron sanctuary with real-time wedding countdown.
  - Live budget breakdown, vendor contact directory, and 100% milestone progress tracker.
  - Client Master Wedding Blueprint PDF download.

---

## Phase 2: Governance, Legal & Accessibility (Current Phase / Completed)
- [x] **Statutory Legal Compliance (DPDP Act, 2023)**:
  - Dedicated static routes: `/privacy-policy` (Data Fiduciary details, DPDP rights), `/terms`, `/refund-policy`, and `/cookies`.
  - Mandatory DPDP consent checkboxes with inline Privacy Policy links on all consultation forms.
  - Discreet bottom Cookie Consent Banner (`localStorage` persistent state).
- [x] **Verified Entity Coordinates & Contact Sync**:
  - Physical Address: `Ground Floor, 1/202/35, Sadar Bazar Road, Piru Vihar, Sadar Bazaar, Delhi Cantonment, New Delhi 110010`.
  - Phone / WhatsApp: `+91 9871211995`.
  - Grievance Email: `inquiries@theweddingdreams.com`.
  - Direct Google Maps directions link integrated across footer and contact pages.
- [x] **WCAG 2.1 AA Accessibility & Telemetry Sanitization**:
  - High-contrast focus rings (`focus:ring-2 focus:ring-[#C5A059]`) on all form inputs.
  - Explicit `aria-label` and `htmlFor` attributes across forms and controls.
  - PII-sanitized performance telemetry in `performanceMonitor.ts`.

---

## Phase 3: Enhanced Client Operations & Vendor Tools (Planned)
- [ ] **Admin CSV Lead Export**: One-click CSV export of pipeline leads for directorial review.
- [ ] **Secure Client Document Vault**: Upload and store vendor contracts and floorplans securely in client dossiers.
- [ ] **Interactive Milestone Timeline Expansion**: Custom milestone creation and automated date reminders for clients.

---

## Phase 4: Long-Term Enhancements (Backlog)
- [ ] **Post-Wedding Retrospective Suite**: Post-event feedback collection and memory archive.
- [ ] **Automated Multi-Channel Notifications**: Opt-in SMS or WhatsApp notification triggers for milestone approvals.

---

## Deprecated / Rejected Features
- **Phone OTP Auth / ReCAPTCHA**: Rejected to maintain zero-friction luxury login experience.
- **Social Media Live Wall**: Rejected to preserve client privacy and non-disclosure principles.
- **Service Worker PWA Offline Cache**: Deprecated in favor of real-time online cloud sync.
- **Background Soundscape Audio Toggles**: Removed to avoid unexpected audio playback on mobile browsers.
- **Automated Newsletter Blasts**: Rejected under strict anti-spam and DPDP data minimization rules.
