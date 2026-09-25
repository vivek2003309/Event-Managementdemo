import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../lib/router';
import { useToast } from '../components/ui/Toast';
import { FirestoreService } from '../services/firestoreService';
import { PerformanceMonitor, useRenderProfiler } from '../lib/performanceMonitor';
import { SEOHead } from '../components/seo/SEOHead';
import {
  WeddingDocument,
  TaskDocument,
  GuestDocument,
  VendorDocument,
  BudgetDocument,
} from '../types/firebase';

// Modular Subviews
import { ClientOverview } from '../components/client/ClientOverview';
import { ClientTimeline } from '../components/client/ClientTimeline';
import { ClientBudget } from '../components/client/ClientBudget';
import { ClientGuests } from '../components/client/ClientGuests';
import { ClientRSVP } from '../components/client/ClientRSVP';
import { ClientVendors } from '../components/client/ClientVendors';
import { ClientTravel } from '../components/client/ClientTravel';
import { ClientDocuments } from '../components/client/ClientDocuments';
import { ClientSchedule } from '../components/client/ClientSchedule';
import { ClientMessages } from '../components/client/ClientMessages';
import { ClientGallery } from '../components/client/ClientGallery';

import {
  LayoutDashboard,
  Calendar,
  Wallet,
  Users,
  Heart,
  Store,
  Plane,
  FileText,
  Clock,
  MessageSquare,
  Image,
  LogOut,
  Sparkles,
  Menu,
  X,
  MapPin,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export type ClientTab =
  | 'overview'
  | 'timeline'
  | 'budget'
  | 'guests'
  | 'rsvp'
  | 'vendors'
  | 'travel'
  | 'documents'
  | 'schedule'
  | 'messages'
  | 'gallery';

const SIDEBAR_ITEMS: { id: ClientTab; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'rsvp', label: 'RSVP', icon: Heart },
  { id: 'vendors', label: 'Vendors', icon: Store },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'schedule', label: 'Schedule', icon: Clock },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'gallery', label: 'Gallery', icon: Image },
];

export const ClientReservedPage: React.FC = () => {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<ClientTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Firestore Client Data State
  const [wedding, setWedding] = useState<WeddingDocument | null>(null);
  const [tasks, setTasks] = useState<TaskDocument[]>([]);
  const [guests, setGuests] = useState<GuestDocument[]>([]);
  const [vendors, setVendors] = useState<VendorDocument[]>([]);
  const [budget, setBudget] = useState<BudgetDocument | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile render duration and detect bottlenecks
  useRenderProfiler('ClientSanctuaryPortal', { context: `Tab: ${activeTab}` });

  // Fetch or initialize client wedding data
  const loadClientData = async () => {
    if (!user) return;
    setIsLoading(true);
    setErrorMsg(null);

    await PerformanceMonitor.measureAsync(
      'ClientPortal: Sync Dossier from Firestore',
      async () => {
        try {
          const clientName = profile?.displayName || 'Rahul';
          const clientWedding = await FirestoreService.getOrCreateClientWedding(user.uid, clientName);
          setWedding(clientWedding);

          if (clientWedding) {
            const [taskList, guestList, vendorList, budgetList] = await Promise.all([
              FirestoreService.getUserTasks(user.uid).catch(() => []),
              FirestoreService.getUserGuests(user.uid).catch(() => []),
              FirestoreService.getUserVendors(user.uid).catch(() => []),
              FirestoreService.getUserBudgets(user.uid).catch(() => []),
            ]);

            setTasks(taskList || []);
            setGuests(guestList || []);
            setVendors(vendorList || []);
            if (budgetList && budgetList.length > 0) {
              setBudget(budgetList[0]);
            }
          }
        } catch (err: any) {
          console.warn('Client data load warning:', err);
          setErrorMsg(err?.message || 'Failed to synchronize client records with Firestore.');
        } finally {
          setIsLoading(false);
        }
      },
      { thresholdMs: 150, context: `User: ${user.uid}` }
    );
  };

  useEffect(() => {
    if (user) {
      loadClientData();
    }
  }, [user]);

  // Derived Planning Progress (0–100%)
  const progressPercent = useMemo(() => {
    if (!tasks || tasks.length === 0) return 60;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return Math.min(100, Math.round((completed / tasks.length) * 100));
  }, [tasks]);

  // 1. Loading State
  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#C6A66B]/30 border-t-[#C6A66B] rounded-full animate-spin mx-auto" />
          <p className="text-[12px] uppercase tracking-[0.2em] text-[#8C6D37]">
            Opening Client Sanctuary...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!user) {
    return (
      <div className="w-full min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[12px] border border-[#EAE5DC] shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-[#171717] text-[#C6A66B] flex items-center justify-center mx-auto mb-4 border border-[#C6A66B]/30">
            <Heart className="w-7 h-7 fill-[#C6A66B]/20" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
            Private Client Portal
          </span>
          <h2 className="font-serif text-[26px] text-[#171717] font-normal mb-2">
            The Wedding Dreams Sanctuary
          </h2>
          <p className="text-[13px] text-[#77736D] leading-relaxed mb-6 font-light">
            Sign in to access your wedding countdown, run-of-show schedule, budget ledger, and guest RSVP management.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[12px] font-medium uppercase tracking-[0.14em] hover:bg-[#C6A66B] transition-colors cursor-pointer shadow-sm"
          >
            Authenticate Client Account
          </button>
        </div>
      </div>
    );
  }

  // Default Wedding Data Fallback
  const displayWedding = wedding || {
    id: 'w-default',
    userId: user.uid,
    clientName: profile?.displayName || 'Rahul',
    partnerName: 'Priya',
    weddingDate: '2026-12-18',
    location: 'Udaipur, Rajasthan',
    guestCount: 350,
    budget: 6500000,
    aesthetic: 'Royal Mewar Heritage & Candlelit Scenography',
    status: 'planning' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const clientNameGreeting = profile?.displayName || displayWedding.clientName || 'Esteemed Guest';

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 bg-[#171717] text-white border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-[4px] hover:bg-white/10 transition-colors"
            aria-label="Open portal navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            className="flex flex-col select-none cursor-pointer"
            onClick={() => setActiveTab('overview')}
          >
            <span className="font-serif text-[17px] tracking-[0.18em] uppercase text-white font-normal">
              The Wedding Dreams
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#C6A66B] font-medium -mt-1">
              Client Sanctuary Portal
            </span>
          </div>
        </div>

        {/* Right coordinates */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-white/5 border border-white/10 text-[11px] text-white/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Authenticated Sanctuary</span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-[#262626] border border-[#C6A66B]/50 text-[#C6A66B] flex items-center justify-center font-serif text-[12px]">
              {clientNameGreeting.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[11px] text-white font-medium block leading-none">
                {clientNameGreeting}
              </span>
              <span className="text-[9px] text-[#C6A66B] uppercase font-mono">Client Access</span>
            </div>
          </div>

          <button
            onClick={async () => {
              await logout();
              navigate('/');
            }}
            className="p-1.5 text-white/60 hover:text-rose-400 hover:bg-white/5 rounded-[4px] transition-colors ml-1 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-[#EAE5DC] flex-col justify-between py-6 px-4 shrink-0 shadow-xs">
          <div className="space-y-6">
            <div className="px-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8C6D37] block mb-1">
                Celebration Navigation
              </span>
              <p className="text-[12px] text-[#77736D] font-light">
                {displayWedding.clientName} &amp; {displayWedding.partnerName}
              </p>
            </div>

            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#171717] text-white shadow-xs font-semibold'
                        : 'text-[#55524E] hover:bg-[#FAF8F5] hover:text-[#171717]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-[#C6A66B]' : 'text-[#8C6D37]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.id === 'timeline' && tasks.length > 0 && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                          active
                            ? 'bg-[#C6A66B] text-black font-bold'
                            : 'bg-[#F2EEE6] text-[#171717]'
                        }`}
                      >
                        {tasks.filter((t) => t.status !== 'completed').length}
                      </span>
                    )}
                    {item.id === 'guests' && guests.length > 0 && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                          active
                            ? 'bg-[#C6A66B] text-black font-bold'
                            : 'bg-[#F2EEE6] text-[#171717]'
                        }`}
                      >
                        {guests.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-[6px] border border-[#EAE5DC] text-[11px] text-[#77736D] space-y-1">
            <span className="font-semibold text-[#171717] block">Palace Concierge:</span>
            <span className="font-mono text-[10px] text-[#8C6D37] block">
              +91 (0) 98200 48210
            </span>
            <span className="text-[10px] text-[#9C968C] block pt-1 border-t border-[#EAE5DC]">
              Dedicated 24/7 Directorship
            </span>
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-white h-full p-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DC]">
                  <div>
                    <span className="font-serif text-[18px] text-[#171717] block">
                      Client Sanctuary
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#C6A66B]">
                      {displayWedding.clientName} &amp; {displayWedding.partnerName}
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[#77736D] hover:text-[#171717]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-[13px] font-medium transition-colors ${
                          active
                            ? 'bg-[#171717] text-white font-semibold'
                            : 'text-[#55524E] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${active ? 'text-[#C6A66B]' : 'text-[#8C6D37]'}`} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#EAE5DC]">
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="w-full py-2 px-3 rounded-[4px] bg-[#FAF8F5] text-rose-700 text-[12px] font-medium flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TOP GREETING & WEDDING BANNER (Always visible as required) */}
          <div className="bg-white p-6 rounded-[12px] border border-[#EAE5DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="font-serif text-[26px] sm:text-[32px] text-[#171717] font-normal leading-tight">
                Welcome, {clientNameGreeting} ❤️
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#55524E]">
                <span className="font-serif font-medium text-[#171717]">
                  Wedding: {displayWedding.clientName} &amp; {displayWedding.partnerName}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
                  {new Date(displayWedding.weddingDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C6A66B]" />
                  {displayWedding.location}
                </span>
              </div>
            </div>

            {/* Planning Progress Component (0–100%) */}
            <div className="bg-[#FAF8F5] p-3.5 sm:p-4 rounded-[8px] border border-[#EAE5DC] min-w-[240px] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold uppercase tracking-wider text-[#8C6D37]">
                  Planning Progress
                </span>
                <strong className="font-serif text-[18px] text-[#171717]">
                  {progressPercent}%
                </strong>
              </div>
              <div className="w-full h-2 rounded-full bg-white border border-[#EAE5DC] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#C6A66B] to-[#8C6D37] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-[#77736D] flex items-center justify-between">
                <span>0% Initiation</span>
                <span>100% Nuptial Day</span>
              </div>
            </div>
          </div>

          {/* ACTIVE TAB DISPATCHER */}
          {activeTab === 'overview' && (
            <ClientOverview
              wedding={displayWedding}
              tasks={tasks}
              budget={budget}
              progressPercent={progressPercent}
              onNavigateTab={(tab) => setActiveTab(tab as ClientTab)}
            />
          )}

          {activeTab === 'timeline' && (
            <ClientTimeline
              tasks={tasks}
              userId={user.uid}
              weddingId={displayWedding.id || 'w-1'}
              onTasksChanged={(updated) => setTasks(updated)}
            />
          )}

          {activeTab === 'budget' && (
            <ClientBudget
              budget={budget}
              targetBudget={displayWedding.budget || 6500000}
              userId={user.uid}
              onBudgetUpdated={(b) => setBudget(b)}
            />
          )}

          {activeTab === 'guests' && (
            <ClientGuests
              guests={guests}
              userId={user.uid}
              weddingId={displayWedding.id || 'w-1'}
              onGuestsChanged={(updated) => setGuests(updated)}
            />
          )}

          {activeTab === 'rsvp' && (
            <ClientRSVP
              wedding={displayWedding}
              onRSVPSubmitted={() => {
                // Refresh guests / rsvp if needed
                FirestoreService.getUserGuests(user.uid).then((g) => g && setGuests(g));
              }}
            />
          )}

          {activeTab === 'vendors' && (
            <ClientVendors
              vendors={vendors}
              userId={user.uid}
              weddingId={displayWedding.id || 'w-1'}
              onVendorsChanged={(updated) => setVendors(updated)}
            />
          )}

          {activeTab === 'travel' && <ClientTravel userId={user.uid} />}

          {activeTab === 'documents' && <ClientDocuments userId={user.uid} />}

          {activeTab === 'schedule' && <ClientSchedule />}

          {activeTab === 'messages' && (
            <ClientMessages userId={user.uid} clientName={clientNameGreeting} />
          )}

          {activeTab === 'gallery' && <ClientGallery />}
        </main>
      </div>
    </div>
  );
};
