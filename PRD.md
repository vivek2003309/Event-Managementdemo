# Product Requirements Document (PRD)
**Product Name**: The Wedding Dreams by Varun Rathor  
**Domain**: `https://event-managementdemo.vercel.app/`  
**Document Version**: 2.4  
**Date**: September 2026  

---

## 1. Executive Summary
**The Wedding Dreams by Varun Rathor** is a premier haute couture wedding directorship and event planning platform serving high-net-worth individuals, royal family lineages, and discerning couples across India, Europe, and global destination enclaves.

The platform provides a dual-facing digital architecture: a public-facing editorial showcase with interactive planning tools, and a secure real-time command suite consisting of an **Admin Directorship Enclave** and a **Client Patron Sanctuary**.

---

## 2. Business & Entity Identity
- **Legal Business Entity**: The Wedding Dreams by Varun Rathor
- **Physical Studio Address**: Ground Floor, 1/202/35, Sadar Bazar Road, Piru Vihar, Sadar Bazaar, Delhi Cantonment, New Delhi, Delhi 110010
- **Direct Telephone / WhatsApp**: +91 9871211995
- **Official Live Web Portal**: `https://event-managementdemo.vercel.app/`
- **Grievance Desk Email**: `inquiries@theweddingdreams.com`
- **Official Instagram Profile**: `https://www.instagram.com/theweddingdreamsbyvarunrathor/`

---

## 3. User Personas & Core Journeys

### Persona A: High-Net-Worth Couple / Patron Family
- **Goal**: Commission an exclusive multi-day wedding, explore architectural scenography, estimate budget envelopes, and track ceremonial progress in real-time.
- **Key Journey**:
  1. Lands on home showcase -> Reviews portfolio enclaves (Udaipur, Jaipur, Goa).
  2. Uses interactive "Plan My Wedding" wizard or "Budget Calculator".
  3. Submits consultation request with explicit DPDP consent.
  4. Signs in to private **Client Sanctuary** to review live wedding countdown, vendor directory, budget allocation, and download Master Wedding Blueprint PDF.

### Persona B: Atelier Directorship & Operations Team
- **Goal**: Manage incoming pipeline leads, track active wedding dossiers, update ceremonial milestones, generate haute couture PDF proposals, and monitor 30-day velocity.
- **Key Journey**:
  1. Signs in to **Admin Directorship Command**.
  2. Triages incoming CRM leads and updates status (Contacted, Proposal Sent, Booked).
  3. Manages active wedding dossiers (milestone dates, vendor contacts, budget breakdown).
  4. Exports high-resolution native vector PDF proposals for patrons.
  5. Views 30-day financial and milestone momentum charts powered by Recharts.

---

## 4. Key Functional Modules

### 4.1 Public Atelier Showcase & Legal Governance
- **Header & Navigation**: 1-row 3-zone top bar with instant navigation to Services, Destinations, Work, About, Contact, and "Let's Talk" drawer.
- **Service Disciplines**: 7 specialized event categories (*Wedding & Engagement Curation*, *Destination & Countryside Nuptials*, *Asian Wedding Architecture*, *Engagement & Anniversary Soirées*, *Bespoke Theme Celebrations & Outdoor Scenography*, *Baby Shower & Milestone Birthday Galas*, *Wedding Banquet & Bespoke Atelier Packages*).
- **Statutory Legal Pages**: Dedicated compliance pages for `/privacy-policy` (DPDP Act 2023), `/terms`, `/refund-policy`, and `/cookies`.
- **Discreet Cookie Banner**: Unobtrusive bottom slate banner with local storage consent persistence.

### 4.2 Admin Directorship Enclave
- **Leads Pipeline**: Triage table with status badges, quick contact actions, and lead deletion options.
- **Wedding Dossier Manager**: Full CRUD management of active weddings, guest count, venue, dates, budget breakdown, and vendor directory.
- **Proposal Generator**: Generates clean vector PDF proposals with no external canvas or AutoTable dependencies.
- **Recharts Analytics**: Visual charts showing 30-day milestone completion velocity and budget distribution.

### 4.3 Client Sanctuary
- **Real-Time Countdown**: Precise days/hours/minutes countdown to the main wedding date.
- **Ceremonial Budget Breakdown**: Visual progress bars and itemized spend categories.
- **Vendor Directory**: Direct contact list for assigned palace venues, florists, photographers, and caterers.
- **Master Wedding Blueprint PDF**: Downloadable vector document summarizing all ceremonial arrangements.

---

## 5. Non-Functional & Technical Requirements

### 5.1 Performance & Reliability
- Render duration target: Sub-120ms for UI renders; sub-600ms for cloud Firestore sync.
- Telemetry sanitization: PII keys automatically redacted from console performance logs.

### 5.2 Accessibility & Compliance
- Full WCAG 2.1 AA compliance: Visible focus rings (`focus:ring-2 focus:ring-[#C5A059]`), descriptive `alt` tags on images, keyboard `Escape` modal dismissal.
- DPDP Act 2023 compliance: Mandatory opt-in checkboxes on all consultation forms.

### 5.3 Security
- Firebase Firestore Security Rules: Strict role-based access control protecting client dossiers.
- Public Production Domain: `https://event-managementdemo.vercel.app/`.
