/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsAppCTA } from './components/layout/FloatingWhatsAppCTA';
import { AIWeddingConcierge } from './components/concierge/AIWeddingConcierge';
import { ConsultationModal } from './components/layout/ConsultationModal';
import { LuxuryEditorialPreloader } from './components/ui/LuxuryEditorialPreloader';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { OurWorkPage } from './pages/OurWorkPage';
import { CaseStudyDetailPage } from './pages/CaseStudyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PlanMyWeddingPage } from './pages/PlanMyWeddingPage';
import { WeddingStylePage } from './pages/WeddingStylePage';
import { BudgetPlannerPage } from './pages/BudgetPlannerPage';
import { ClientReservedPage } from './pages/ClientReservedPage';
import { AdminReservedPage } from './pages/AdminReservedPage';
import { AuthPage } from './pages/AuthPage';
import { LegalPage } from './pages/LegalPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { CookieBanner } from './components/common/CookieBanner';
import { AuthProvider } from './context/AuthContext';
import { AtelierDataProvider } from './context/AtelierDataContext';

function AppContent() {
  const { path } = useRouter();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Router dispatcher
  const renderCurrentPage = () => {
    // Auth routes
    if (
      path === '/login' ||
      path === '/signup' ||
      path === '/forgot-password' ||
      path === '/auth'
    ) {
      return <AuthPage />;
    }

    // Reserved routes
    if (path.startsWith('/client')) {
      return <ClientReservedPage />;
    }
    if (path.startsWith('/admin')) {
      return <AdminReservedPage />;
    }


    // Individual Service Detail Route: /services/[slug]
    if (path.startsWith('/services/')) {
      const slug = path.replace('/services/', '').replace(/\/$/, '');
      return (
        <ServiceDetailPage
          slug={slug}
          onOpenLetTalk={() => setIsConsultationOpen(true)}
        />
      );
    }

    // Individual Case Study Detail Route: /our-work/[slug]
    if (path.startsWith('/our-work/')) {
      const slug = path.replace('/our-work/', '').replace(/\/$/, '');
      return (
        <CaseStudyDetailPage
          slug={slug}
          onOpenLetTalk={() => setIsConsultationOpen(true)}
        />
      );
    }

    switch (path) {
      case '/weddings':
        return (
          <HomePage
            onOpenLetTalk={() => setIsConsultationOpen(true)}
            preloaderComplete={isLoaded}
          />
        );
      case '/services':
        return <ServicesPage onOpenLetTalk={() => setIsConsultationOpen(true)} />;
      case '/destinations':
        return <DestinationsPage onOpenLetTalk={() => setIsConsultationOpen(true)} />;
      case '/work':
      case '/our-work':
        return <OurWorkPage onOpenLetTalk={() => setIsConsultationOpen(true)} />;
      case '/about':
        return <AboutPage onOpenLetTalk={() => setIsConsultationOpen(true)} />;
      case '/contact':
        return <ContactPage />;
      case '/plan-my-wedding':
        return <PlanMyWeddingPage onOpenLetTalk={() => setIsConsultationOpen(true)} />;
      case '/wedding-style':
        return <WeddingStylePage onOpenLetTalk={() => setIsConsultationOpen(true)} />;
      case '/budget-planner':
        return <BudgetPlannerPage onOpenLetTalk={() => setIsConsultationOpen(true)} />;
      case '/privacy':
      case '/privacy-policy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsPage />;
      case '/refund-policy':
        return <RefundPolicyPage />;
      case '/cookies':
      case '/cookie-policy':
        return <CookiePolicyPage />;
      case '/':
      default:
        return (
          <HomePage
            onOpenLetTalk={() => setIsConsultationOpen(true)}
            preloaderComplete={isLoaded}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#252525] flex flex-col font-sans selection:bg-[#C6A66B]/25 selection:text-[#171717] overflow-x-clip">
      {/* Haute Couture Editorial Preloader */}
      <LuxuryEditorialPreloader
        onComplete={() => {
          setShowPreloader(false);
          setIsLoaded(true);
        }}
      />

      {/* 1-Row 3-Zone Top Navigation */}
      <Navbar onOpenLetTalk={() => setIsConsultationOpen(true)} />

      {/* Main Page Content */}
      <main className="flex-1 w-full">{renderCurrentPage()}</main>

      {/* Magazine 4-Column Footer */}
      <Footer />

      {/* Floating WhatsApp CTA */}
      <FloatingWhatsAppCTA />

      {/* AI Wedding Concierge Floating Suite */}
      <AIWeddingConcierge onOpenLetTalk={() => setIsConsultationOpen(true)} />

      {/* Private Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      {/* Discreet Cookie & Discretion Banner */}
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AtelierDataProvider>
            <RouterProvider>
              <AppContent />
            </RouterProvider>
          </AtelierDataProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

