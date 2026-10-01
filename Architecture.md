# System Architecture & Technical Specification
**Project**: The Wedding Dreams by Varun Rathor  
**Domain**: `https://event-managementdemo.vercel.app/`

---

## 1. System Overview
The Wedding Dreams digital platform is a haute couture wedding planning, directorial management, and real-time client collaboration suite. The application operates as a single-page React application powered by Vite, Firebase Firestore, and Firebase Authentication, designed for high-net-worth patrons and studio directors.

---

## 2. Frontend Architecture
- **Framework**: React 18 SPA with TypeScript.
- **Routing**: Lightweight history-API SPA router (`src/lib/router.tsx`) supporting public routes, parameter-based detail pages (`/services/:slug`, `/our-work/:slug`), and protected reserved areas.
- **State Management**:
  - `AuthContext.tsx`: Manages Firebase Authentication state, user profile roles (Admin vs. Client), and authentication loading gates.
  - `AtelierDataContext.tsx`: Real-time state hub managing CRM lead pipelines, active client wedding dossiers, and directorship proposals.
- **Modular Component Hierarchy**:
  - `src/components/layout/`: Navbar, Footer, Section, PageContainer, ConsultationModal.
  - `src/components/home/`: Hero, Cinematic Showcase, Brand Story, Service Disciplines.
  - `src/components/admin/`: Directorship Command Center, Leads Triage Table, Wedding Dossier Manager, Proposal Generator, Recharts Milestone Velocity.
  - `src/components/client/`: Patron Sanctuary, Real-Time Countdown, Ceremonial Budget Breakdown, Vendor Directory, Live Milestone Checklist, Blueprint PDF Exporter.
  - `src/components/common/`: CookieBanner, Toast notifications, ErrorBoundary.

---

## 3. Data Persistence & Real-Time Synchronization
- **Database**: Firebase Firestore (`(default)` instance).
- **Primary Collections**:
  - `crm_leads`: Public inquiry submissions, consultation requests, and interactive wedding planner drafts.
  - `managed_weddings`: Active client wedding dossiers, ceremonial milestones, budget allocations, vendor contacts, and client credentials.
  - `inquiries`: Direct contact form submissions.
- **Sync Architecture**:
  - Real-time `onSnapshot` subscriptions with clean unsubscribe handlers on component unmount.
  - Debounced write guards for local optimistic updates during budget or milestone edits.

---

## 4. Document Generation & PDF Engine
- **Engine**: Pure native vector `jsPDF` (`src/utils/pdfGenerator.ts` & `src/utils/proposalPdfGenerator.ts`).
- **Zero Heavy Dependencies**: Pure vector primitives (`doc.rect`, `doc.text`, `doc.line`, `doc.addImage`) without `html2canvas` rasterization artifacts or `jsPDF-AutoTable` limitations.
- **Documents Produced**:
  1. *Luxury Directorial Proposal* (Admin Command): High-resolution proposal with milestone schedules, investment allocations, and terms.
  2. *Master Wedding Blueprint* (Client Sanctuary): Personal ceremonial guide, budget breakdown, vendor contact matrix, and countdown.

---

## 5. Data Protection, Privacy & Analytics
- **Compliance**: India's Digital Personal Data Protection (DPDP) Act, 2023.
- **Data Minimization**: Collects only Name, Phone/WhatsApp, Email, Destination, Guest Count, and Event Type.
- **Telemetry Sanitization**: `PerformanceMonitor` (`src/lib/performanceMonitor.ts`) strips PII keys (`name`, `email`, `phone`, `budget`, `notes`) before storing or logging execution duration metrics.
- **Role-Based Access Control**: Firestore security rules restrict clients to their own wedding document while admin actions require verified directorial credentials.
