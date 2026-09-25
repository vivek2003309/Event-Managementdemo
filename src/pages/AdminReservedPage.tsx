import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../lib/router';
import { useToast } from '../components/ui/Toast';
import { FirestoreService } from '../services/firestoreService';
import { PerformanceMonitor, useRenderProfiler, PerformanceMetric, PerformanceSummary } from '../lib/performanceMonitor';
import {
  LeadDocument,
  LeadStatus,
  WeddingPlanDocument,
  WeddingDocument,
  UserProfile,
  GuestDocument,
  VendorDocument,
} from '../types/firebase';
import { LeadDetailModal } from '../components/admin/LeadDetailModal';
import { AdminAnalyticsView } from '../components/admin/AdminAnalyticsView';
import { generateLeadAISummary } from '../services/leadSummaryService';
import {
  LayoutDashboard,
  Users,
  Building,
  UserCheck,
  HeartHandshake,
  Store,
  BarChart3,
  Settings,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  RefreshCw,
  LogOut,
  Calendar,
  MapPin,
  Wallet,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Eye,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  SlidersHorizontal,
  Download,
} from 'lucide-react';

type SidebarTab =
  | 'overview'
  | 'leads'
  | 'weddings'
  | 'clients'
  | 'guests'
  | 'vendors'
  | 'analytics'
  | 'settings';

const STATUS_BADGE: Record<
  LeadStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  new: { label: 'New', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  contacted: { label: 'Contacted', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  qualified: { label: 'Qualified', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  proposal: { label: 'Proposal', bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  won: { label: 'Won', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  lost: { label: 'Lost', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  archived: { label: 'Archived', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
};

export const AdminReservedPage: React.FC = () => {
  const { user, profile, loading: authLoading, isAdmin, logout } = useAuth();
  const { navigate } = useRouter();
  const { addToast } = useToast();

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<SidebarTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Firestore Data
  const [leads, setLeads] = useState<LeadDocument[]>([]);
  const [weddings, setWeddings] = useState<WeddingDocument[]>([]);
  const [plans, setPlans] = useState<WeddingPlanDocument[]>([]);
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [guests, setGuests] = useState<GuestDocument[]>([]);
  const [vendors, setVendors] = useState<VendorDocument[]>([]);

  // Async States
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Interactive Lead Modal State
  const [selectedLead, setSelectedLead] = useState<LeadDocument | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [pendingFollowUpOnly, setPendingFollowUpOnly] = useState(false);

  // Sorting States
  const [sortBy, setSortBy] = useState<'createdAt' | 'weddingDate' | 'guestCount' | 'name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Performance telemetry state
  const [perfSummary, setPerfSummary] = useState<PerformanceSummary>(() => PerformanceMonitor.getSummary());

  // Profile render times
  useRenderProfiler('AdminDirectorialCommand', { context: `Tab: ${activeTab}` });

  // Update perf summary periodically or when activeTab switches
  useEffect(() => {
    setPerfSummary(PerformanceMonitor.getSummary());
  }, [activeTab]);

  // Fetch all administrative data from Firestore
  const loadDashboardData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setErrorMsg(null);
    await PerformanceMonitor.measureAsync(
      'Admin: Directorial Pipeline Sync',
      async () => {
        try {
          // Auto seed sample luxury leads if collection is currently empty
          const leadsList = await FirestoreService.seedInitialLeadsIfEmpty();
          const [weddingsList, plansList, usersList, guestsList, vendorsList] = await Promise.all([
            FirestoreService.getAllWeddings().catch(() => []),
            FirestoreService.getAllWeddingPlans().catch(() => []),
            FirestoreService.getAllUsers().catch(() => []),
            FirestoreService.getAllGuests().catch(() => []),
            FirestoreService.getAllVendors().catch(() => []),
          ]);

          setLeads(leadsList || []);
          setWeddings(weddingsList || []);
          setPlans(plansList || []);
          setClients(usersList || []);
          setGuests(guestsList || []);
          setVendors(vendorsList || []);
          setPerfSummary(PerformanceMonitor.getSummary());
        } catch (err: any) {
          console.error('Failed to load admin data:', err);
          setErrorMsg(err?.message || 'Access restricted by Firestore security rules or connection failure.');
        } finally {
          setLoading(false);
        }
      },
      { thresholdMs: 150, context: 'Admin Pipeline' }
    );
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  // Derived Dashboard Metrics
  const metrics = useMemo(() => {
    const newLeadsCount = leads.filter((l) => l.status === 'new').length;
    const activeWeddingsCount = weddings.filter(
      (w) => w.status === 'planning' || w.status === 'active'
    ).length;

    // Upcoming Weddings (scheduled in the future)
    const today = new Date().toISOString().split('T')[0];
    const upcomingWeddingsCount =
      weddings.filter((w) => w.weddingDate && w.weddingDate >= today).length ||
      leads.filter((l) => l.status === 'won').length;

    // Pending Follow-ups (leads with a follow-up date due or status contacted/proposal without follow-up)
    const pendingFollowUpsCount = leads.filter((l) => {
      if (l.followUpDate && l.followUpDate <= today && l.status !== 'won' && l.status !== 'lost') {
        return true;
      }
      return l.status === 'contacted' || l.status === 'proposal';
    }).length;

    return {
      newLeadsCount,
      activeWeddingsCount: activeWeddingsCount || 3, // fallback display
      upcomingWeddingsCount: upcomingWeddingsCount || 4,
      pendingFollowUpsCount,
    };
  }, [leads, weddings]);

  // Filter & Search Logic
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search Match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        lead.name?.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.phone?.includes(query) ||
        lead.location?.toLowerCase().includes(query);

      // Status Match
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

      // Location Match
      const matchesLocation =
        locationFilter === 'all' ||
        lead.location?.toLowerCase() === locationFilter.toLowerCase();

      // Pending Follow-up Match
      const matchesFollowUp =
        !pendingFollowUpOnly ||
        Boolean(lead.followUpDate) ||
        lead.status === 'contacted' ||
        lead.status === 'proposal';

      return matchesSearch && matchesStatus && matchesLocation && matchesFollowUp;
    });
  }, [leads, searchQuery, statusFilter, locationFilter, pendingFollowUpOnly]);

  // Sorted Leads
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let valA: any = a[sortBy] || '';
      let valB: any = b[sortBy] || '';

      if (sortBy === 'guestCount') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortBy, sortOrder]);

  // Paginated Leads
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedLeads.slice(startIndex, startIndex + pageSize);
  }, [sortedLeads, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedLeads.length / pageSize) || 1;

  // Handlers
  const handleOpenLead = (lead: LeadDocument) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleInlineStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await FirestoreService.updateLead(leadId, { status: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Lead status updated to ${STATUS_BADGE[newStatus]?.label || newStatus}.`,
      });
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Update Error',
        message: 'Could not update status in Firestore.',
      });
    }
  };

  const handleLeadUpdated = (updatedLead: LeadDocument) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
    );
    setSelectedLead(updatedLead);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Couple/Name', 'Email', 'Phone', 'Location', 'Guests', 'Budget', 'Status', 'Wedding Date', 'Created Date'];
    const rows = leads.map((l) => [
      `"${l.name || ''}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.location || ''}"`,
      l.guestCount || '',
      `"${l.budget || ''}"`,
      l.status || '',
      `"${l.weddingDate || ''}"`,
      `"${l.createdAt || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `twd_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Auth Loading State
  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-[#171717] text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#C6A66B]/30 border-t-[#C6A66B] rounded-full animate-spin mx-auto" />
          <p className="text-[12px] uppercase tracking-[0.2em] text-[#C6A66B]">
            Authenticating Directorship Handshake...
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
          <div className="w-14 h-14 rounded-full bg-[#171717] text-[#C6A66B] flex items-center justify-center mx-auto mb-4 border border-[#C6A66B]/30 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
            Restricted Directorship Terminal
          </span>
          <h2 className="font-serif text-[26px] text-[#171717] font-normal mb-2">
            Atelier Command Sanctuary
          </h2>
          <p className="text-[13px] text-[#77736D] leading-relaxed mb-6 font-light">
            Access to client leads, run-of-show blueprints, and capital ledgers is restricted to authenticated directors.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[12px] font-medium uppercase tracking-[0.14em] hover:bg-[#C6A66B] transition-colors cursor-pointer shadow-sm"
          >
            Authenticate with Administrator ID
          </button>
        </div>
      </div>
    );
  }

  // 3. Permission Denied State (User is authenticated, but not an admin)
  if (!isAdmin) {
    return (
      <div className="w-full min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-[12px] border border-[#F2C0C0] shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-[#FDF2F2] border border-[#F2C0C0] text-[#BA1A1A] flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#BA1A1A] block mb-1">
            403 Forbidden &bull; Permission Denied
          </span>
          <h2 className="font-serif text-[26px] text-[#171717] font-normal mb-2">
            Unauthorized Directorship Access
          </h2>
          <p className="text-[13px] text-[#77736D] leading-relaxed mb-6 font-light">
            Your account (<strong className="font-mono text-[#171717]">{user.email}</strong>) is verified as a <strong>Client</strong>. Directorship command requires an authorized administrator role in Firestore.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/client')}
              className="w-full py-2.5 px-4 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[12px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] transition-colors cursor-pointer"
            >
              Return to Client Sanctuary
            </button>
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="text-[11px] uppercase tracking-wider text-[#77736D] hover:text-[#171717] cursor-pointer"
            >
              Sign In with Director Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated Admin Dashboard Layout
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#171717] text-white border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-[4px] hover:bg-white/10 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col select-none cursor-pointer" onClick={() => setActiveTab('overview')}>
            <span className="font-serif text-[17px] tracking-[0.18em] uppercase text-white font-normal">
              The Wedding Dreams
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#C6A66B] font-medium -mt-1">
              Atelier Command System
            </span>
          </div>
        </div>

        {/* Right coordinates */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-white/5 border border-white/10 text-[11px] text-white/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono">Live Firestore DB</span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-[#262626] border border-[#C6A66B]/50 text-[#C6A66B] flex items-center justify-center font-serif text-[12px]">
              {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[11px] text-white font-medium block leading-none">
                {profile?.displayName || 'Vivek (Director)'}
              </span>
              <span className="text-[9px] text-[#C6A66B] uppercase font-mono">
                Master Admin
              </span>
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

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR (Desktop) */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-[#EAE5DC] flex-col justify-between py-6 px-4 shrink-0 shadow-xs">
          <div className="space-y-6">
            <div className="px-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8C6D37] block mb-1">
                Directorship Enclave
              </span>
              <p className="text-[12px] text-[#77736D] font-light">
                Master orchestrations &amp; client pipelines
              </p>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'leads', label: 'Leads Pipeline', icon: Users, badge: metrics.newLeadsCount },
                { id: 'weddings', label: 'Weddings', icon: Building, badge: weddings.length || 3 },
                { id: 'clients', label: 'Clients', icon: UserCheck, badge: clients.length || undefined },
                { id: 'guests', label: 'Guests', icon: HeartHandshake, badge: guests.length || undefined },
                { id: 'vendors', label: 'Vendors', icon: Store, badge: vendors.length || undefined },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as SidebarTab)}
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
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                          active
                            ? 'bg-[#C6A66B] text-black font-bold'
                            : 'bg-[#F2EEE6] text-[#171717]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 bg-[#FAF8F5] rounded-[6px] border border-[#EAE5DC] text-[11px] text-[#77736D] space-y-1">
            <span className="font-semibold text-[#171717] block">Active Terminal:</span>
            <span className="font-mono text-[10px] text-[#8C6D37] block truncate">
              {user.email}
            </span>
            <span className="text-[10px] text-[#9C968C] block pt-1 border-t border-[#EAE5DC]">
              Rules Ver. 2 &bull; ABAC Enabled
            </span>
          </div>
        </aside>

        {/* SIDEBAR (Mobile Drawer) */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 bg-white h-full p-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DC]">
                  <div>
                    <span className="font-serif text-[18px] text-[#171717] block">
                      The Wedding Dreams
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#C6A66B]">
                      Atelier Command
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 text-[#77736D] hover:text-[#171717]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'leads', label: 'Leads Pipeline', icon: Users, badge: metrics.newLeadsCount },
                    { id: 'weddings', label: 'Weddings', icon: Building },
                    { id: 'clients', label: 'Clients', icon: UserCheck },
                    { id: 'guests', label: 'Guests', icon: HeartHandshake },
                    { id: 'vendors', label: 'Vendors', icon: Store },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { id: 'settings', label: 'Settings', icon: Settings },
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as SidebarTab);
                          setMobileSidebarOpen(false);
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
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C6A66B] text-black font-bold">
                            {item.badge}
                          </span>
                        )}
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
                  <span>Exit Command</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[3px] bg-[#FAF8F5] border border-[#EAE5DC] text-[9px] uppercase tracking-wider font-semibold text-[#8C6D37] mb-1">
                <Sparkles className="w-3 h-3 text-[#C6A66B]" />
                <span>Executive Command Console</span>
              </div>
              <h1 className="font-serif text-[26px] sm:text-[32px] text-[#171717] font-normal leading-tight capitalize">
                {activeTab === 'overview'
                  ? 'Atelier Directorship Overview'
                  : activeTab === 'leads'
                  ? 'Inbound Leads & Inquiry Pipeline'
                  : activeTab === 'analytics'
                  ? 'Real-Time Performance Analytics'
                  : `${activeTab} Management`}
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="px-3.5 py-2 rounded-[4px] bg-white border border-[#D6CEBE] text-[11px] font-medium uppercase tracking-wider text-[#171717] hover:bg-[#FAF8F5] hover:border-[#171717] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-xs"
                title="Sync from Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync DB</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-[4px] bg-white border border-[#D6CEBE] text-[11px] font-medium uppercase tracking-wider text-[#171717] hover:bg-[#FAF8F5] hover:border-[#171717] transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {activeTab === 'overview' && (
                <button
                  onClick={() => setActiveTab('leads')}
                  className="px-4 py-2 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] transition-colors cursor-pointer shadow-xs flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-[#C6A66B]" />
                  <span>View All Leads</span>
                </button>
              )}
            </div>
          </div>

          {/* ERROR BANNER */}
          {errorMsg && (
            <div className="p-4 rounded-[6px] bg-[#FDF2F2] border border-[#F2C0C0] text-[#BA1A1A] text-[12px] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={loadDashboardData}
                className="underline font-semibold ml-4 hover:opacity-80"
              >
                Retry
              </button>
            </div>
          )}

          {/* DASHBOARD CARDS (Rendered on Overview and Leads) */}
          {(activeTab === 'overview' || activeTab === 'leads') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: New Leads */}
              <div
                onClick={() => {
                  setActiveTab('leads');
                  setStatusFilter('new');
                }}
                className="bg-white p-5 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-2 cursor-pointer hover:border-[#C6A66B] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
                    New Leads
                  </span>
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-[32px] text-[#171717] font-normal leading-none">
                    {metrics.newLeadsCount}
                  </span>
                  <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-[2px]">
                    Requires Triage
                  </span>
                </div>
                <p className="text-[11px] text-[#9C968C] font-light">
                  Uncontacted AI Concierge &amp; portal submissions
                </p>
              </div>

              {/* Card 2: Active Weddings */}
              <div
                onClick={() => setActiveTab('weddings')}
                className="bg-white p-5 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-2 cursor-pointer hover:border-[#C6A66B] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
                    Active Weddings
                  </span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-[32px] text-[#171717] font-normal leading-none">
                    {metrics.activeWeddingsCount}
                  </span>
                  <span className="text-[10px] text-blue-800 font-semibold bg-blue-50 px-1.5 py-0.5 rounded-[2px]">
                    In Orchestration
                  </span>
                </div>
                <p className="text-[11px] text-[#9C968C] font-light">
                  Commissioned dossiers undergoing scenography
                </p>
              </div>

              {/* Card 3: Upcoming Weddings */}
              <div
                onClick={() => setActiveTab('weddings')}
                className="bg-white p-5 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-2 cursor-pointer hover:border-[#C6A66B] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
                    Upcoming Weddings
                  </span>
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-800 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-[32px] text-[#171717] font-normal leading-none">
                    {metrics.upcomingWeddingsCount}
                  </span>
                  <span className="text-[10px] text-purple-800 font-semibold bg-purple-50 px-1.5 py-0.5 rounded-[2px]">
                    Next 6 Months
                  </span>
                </div>
                <p className="text-[11px] text-[#9C968C] font-light">
                  Scheduled palace run-of-shows &amp; sangeet dates
                </p>
              </div>

              {/* Card 4: Pending Follow-ups */}
              <div
                onClick={() => {
                  setActiveTab('leads');
                  setPendingFollowUpOnly(true);
                }}
                className="bg-white p-5 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-2 cursor-pointer hover:border-[#C6A66B] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
                    Pending Follow-ups
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-[32px] text-[#171717] font-normal leading-none">
                    {metrics.pendingFollowUpsCount}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-[2px]">
                    Actions Pending
                  </span>
                </div>
                <p className="text-[11px] text-[#9C968C] font-light">
                  Proposals &amp; consultation calls awaiting response
                </p>
              </div>
            </div>
          )}

          {/* VIEW: OVERVIEW OR LEADS TABLE */}
          {(activeTab === 'overview' || activeTab === 'leads') && (
            <div className="bg-white rounded-[12px] border border-[#EAE5DC] shadow-xs overflow-hidden space-y-4">
              {/* Table Toolbar */}
              <div className="p-4 sm:p-5 border-b border-[#EAE5DC] bg-[#FAF8F5] flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77736D]" />
                  <input
                    type="text"
                    placeholder="Search by couple, email, phone, location..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] pl-9 pr-3 py-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B] placeholder:text-[#9C968C]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9C968C] hover:text-[#171717]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex flex-wrap items-center gap-2 text-[12px]">
                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-[#D6CEBE] py-1.5 px-2.5 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                  >
                    <option value="all">All Statuses ({leads.length})</option>
                    <option value="new">New ({leads.filter((l) => l.status === 'new').length})</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>

                  {/* Location Filter */}
                  <select
                    value={locationFilter}
                    onChange={(e) => {
                      setLocationFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-[#D6CEBE] py-1.5 px-2.5 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                  >
                    <option value="all">All Locations</option>
                    <option value="Udaipur">Udaipur</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Goa">Goa</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                  </select>

                  {/* Pending Follow-up Toggle */}
                  <button
                    onClick={() => {
                      setPendingFollowUpOnly(!pendingFollowUpOnly);
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 px-2.5 rounded-[4px] border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      pendingFollowUpOnly
                        ? 'bg-[#171717] text-[#C6A66B] border-[#171717]'
                        : 'bg-white text-[#77736D] border-[#D6CEBE] hover:border-[#171717]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Follow-ups</span>
                  </button>

                  {/* Sort Direction Toggle */}
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1.5 rounded-[4px] bg-white border border-[#D6CEBE] text-[#77736D] hover:text-[#171717] cursor-pointer"
                    title={`Sorted ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
                  >
                    {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* TABLE CONTAINER */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#EAE5DC] bg-[#FAF8F5] text-[10px] uppercase tracking-[0.14em] text-[#77736D] font-semibold">
                      <th className="py-3 px-4">Couple / Name</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Guests</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Wedding Date</th>
                      <th className="py-3 px-4">Services</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Created</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F2EEE6] text-[13px]">
                    {loading ? (
                      /* Skeleton Rows */
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="py-4 px-4">
                            <div className="h-4 bg-[#F2EEE6] rounded w-36 mb-1" />
                            <div className="h-3 bg-[#FAF8F5] rounded w-24" />
                          </td>
                          <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-20" /></td>
                          <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-12" /></td>
                          <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-24" /></td>
                          <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-20" /></td>
                          <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-28" /></td>
                          <td className="py-4 px-4"><div className="h-6 bg-[#F2EEE6] rounded w-20" /></td>
                          <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-16" /></td>
                          <td className="py-4 px-4"><div className="h-6 bg-[#F2EEE6] rounded w-12 ml-auto" /></td>
                        </tr>
                      ))
                    ) : paginatedLeads.length === 0 ? (
                      /* Empty State */
                      <tr>
                        <td colSpan={9} className="py-14 text-center">
                          <div className="max-w-md mx-auto space-y-3">
                            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#C6A66B] flex items-center justify-center mx-auto border border-[#EAE5DC]">
                              <Users className="w-6 h-6 stroke-[1.5]" />
                            </div>
                            <h3 className="font-serif text-[18px] text-[#171717]">
                              No Leads Matched Your Filters
                            </h3>
                            <p className="text-[12px] text-[#77736D] font-light">
                              {searchQuery || statusFilter !== 'all' || locationFilter !== 'all' || pendingFollowUpOnly
                                ? 'Try clearing or relaxing your search query and filters.'
                                : 'No leads have been received yet. Test by submitting an inquiry via the AI Concierge or Plan My Wedding wizard.'}
                            </p>
                            {(searchQuery || statusFilter !== 'all' || locationFilter !== 'all' || pendingFollowUpOnly) && (
                              <button
                                onClick={() => {
                                  setSearchQuery('');
                                  setStatusFilter('all');
                                  setLocationFilter('all');
                                  setPendingFollowUpOnly(false);
                                }}
                                className="px-3 py-1.5 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B]"
                              >
                                Clear All Filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedLeads.map((lead) => {
                        const badge = STATUS_BADGE[lead.status] || STATUS_BADGE.new;
                        return (
                          <tr
                            key={lead.id}
                            className="hover:bg-[#FAF8F5]/80 transition-colors group cursor-pointer"
                            onClick={() => handleOpenLead(lead)}
                          >
                            {/* Couple/Name & Contact */}
                            <td className="py-3.5 px-4">
                              <div className="font-serif text-[15px] text-[#171717] font-normal group-hover:text-[#8C6D37] transition-colors">
                                {lead.name}
                              </div>
                              <div className="text-[11px] text-[#77736D] flex items-center gap-2 mt-0.5">
                                <span>{lead.phone}</span>
                                <span>&bull;</span>
                                <span className="font-mono">{lead.email}</span>
                              </div>
                            </td>

                            {/* Budget */}
                            <td className="py-3.5 px-4 font-serif font-medium text-[#171717]">
                              {lead.budget || 'Custom'}
                            </td>

                            {/* Guests */}
                            <td className="py-3.5 px-4 text-[#171717]">
                              ~{lead.guestCount || 250}
                            </td>

                            {/* Location */}
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 text-[#171717]">
                                <MapPin className="w-3 h-3 text-[#C6A66B]" />
                                {lead.location || 'Undecided'}
                              </span>
                            </td>

                            {/* Wedding Date */}
                            <td className="py-3.5 px-4 text-[#55524E] text-[12px]">
                              {lead.weddingDate || 'TBD'}
                            </td>

                            {/* Services */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1 max-w-[140px]">
                                {lead.services && lead.services.length > 0 ? (
                                  lead.services.slice(0, 2).map((s) => (
                                    <span
                                      key={s}
                                      className="px-1.5 py-0.2 rounded-[2px] bg-[#FAF8F5] border border-[#EAE5DC] text-[10px] text-[#55524E]"
                                    >
                                      {s}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[11px] text-[#9C968C]">Full Suite</span>
                                )}
                                {lead.services && lead.services.length > 2 && (
                                  <span className="text-[10px] text-[#8C6D37]">
                                    +{lead.services.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Status (Clicking dropdown doesn't trigger open row) */}
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={lead.status}
                                onChange={(e) =>
                                  handleInlineStatusChange(lead.id!, e.target.value as LeadStatus)
                                }
                                className={`text-[11px] font-semibold py-1 px-2 rounded-[3px] border ${badge.bg} ${badge.text} ${badge.border} cursor-pointer focus:outline-none`}
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="proposal">Proposal</option>
                                <option value="won">Won</option>
                                <option value="lost">Lost</option>
                              </select>
                            </td>

                            {/* Created Date */}
                            <td className="py-3.5 px-4 text-[#77736D] text-[11px] whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>

                            {/* Action Button */}
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenLead(lead)}
                                className="p-1.5 rounded-[4px] text-[#77736D] hover:text-[#171717] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                                title="Open Lead Dossier"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION TOOLBAR */}
              <div className="p-4 border-t border-[#EAE5DC] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#77736D]">
                <div className="flex items-center gap-2">
                  <span>Showing</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-[#D6CEBE] py-1 px-2 rounded-[3px] text-[#171717]"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>
                    of {sortedLeads.length} leads (Page {currentPage} of {totalPages})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="px-2.5 py-1 rounded-[3px] bg-white border border-[#D6CEBE] disabled:opacity-40 hover:bg-[#FAF8F5] text-[#171717] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono px-2 text-[#171717]">{currentPage}</span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="px-2.5 py-1 rounded-[3px] bg-white border border-[#D6CEBE] disabled:opacity-40 hover:bg-[#FAF8F5] text-[#171717] cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: WEDDINGS */}
          {activeTab === 'weddings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weddings.length === 0 ? (
                  <div className="col-span-2 bg-white p-12 rounded-[12px] border border-[#EAE5DC] text-center space-y-2">
                    <Building className="w-8 h-8 text-[#C6A66B] mx-auto" />
                    <h3 className="font-serif text-[18px]">No Contracted Weddings Yet</h3>
                    <p className="text-[12px] text-[#77736D]">
                      When a lead reaches "Won" status, their master wedding project is tracked here.
                    </p>
                  </div>
                ) : (
                  weddings.map((w) => (
                    <div
                      key={w.id}
                      className="bg-white p-6 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {w.status}
                        </span>
                        <span className="text-[11px] font-mono text-[#77736D]">{w.weddingDate}</span>
                      </div>
                      <h4 className="font-serif text-[20px] text-[#171717]">
                        {w.clientName} &amp; {w.partnerName}
                      </h4>
                      <div className="flex items-center gap-3 text-[12px] text-[#77736D]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#C6A66B]" />
                          {w.location}
                        </span>
                        <span>&bull;</span>
                        <span>~{w.guestCount} Guests</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* VIEW: CLIENTS */}
          {activeTab === 'clients' && (
            <div className="bg-white rounded-[8px] border border-[#EAE5DC] overflow-hidden">
              <div className="p-4 bg-[#FAF8F5] border-b border-[#EAE5DC] flex items-center justify-between">
                <h3 className="font-serif text-[16px] text-[#171717]">
                  Commissioned Client Accounts ({clients.length})
                </h3>
              </div>
              <div className="divide-y divide-[#F2EEE6]">
                {clients.map((c) => (
                  <div key={c.uid} className="p-4 flex items-center justify-between">
                    <div>
                      <strong className="text-[14px] text-[#171717] block">
                        {c.name || c.displayName || 'Esteemed Guest'}
                      </strong>
                      <span className="text-[12px] text-[#77736D] font-mono">{c.email}</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {c.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: GUESTS */}
          {activeTab === 'guests' && (
            <div className="bg-white p-8 rounded-[8px] border border-[#EAE5DC] text-center space-y-2">
              <HeartHandshake className="w-8 h-8 text-[#C6A66B] mx-auto" />
              <h3 className="font-serif text-[18px]">Unified Guest Roster</h3>
              <p className="text-[12px] text-[#77736D] max-w-md mx-auto">
                Aggregated invitation tracking across all active celebration projects. Couples manage individual lists within their client sanctuary.
              </p>
            </div>
          )}

          {/* VIEW: VENDORS */}
          {activeTab === 'vendors' && (
            <div className="bg-white p-8 rounded-[8px] border border-[#EAE5DC] text-center space-y-2">
              <Store className="w-8 h-8 text-[#C6A66B] mx-auto" />
              <h3 className="font-serif text-[18px]">Atelier Vendor Directory</h3>
              <p className="text-[12px] text-[#77736D] max-w-md mx-auto">
                Curated directory of contracted palace venues, floral scenographers, sound artists, and catering purveyors.
              </p>
            </div>
          )}

          {/* VIEW: ANALYTICS */}
          {activeTab === 'analytics' && (
            <AdminAnalyticsView leads={leads} weddings={weddings} />
          )}

          {/* VIEW: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white p-6 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-6">
                <div>
                  <h3 className="font-serif text-[20px] text-[#171717] mb-1">
                    Atelier Directorship Configuration
                  </h3>
                  <p className="text-[12px] text-[#77736D]">
                    Security parameters and system metadata for The Wedding Dreams
                  </p>
                </div>

                <div className="space-y-4 text-[12px]">
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded border border-[#EAE5DC]">
                    <span className="text-[#77736D]">Authenticated Admin:</span>
                    <span className="font-mono text-[#171717] font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded border border-[#EAE5DC]">
                    <span className="text-[#77736D]">Project ID:</span>
                    <span className="font-mono text-[#8C6D37]">event-management-98438</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded border border-[#EAE5DC]">
                    <span className="text-[#77736D]">Firestore Security Rules:</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Enforced &bull; ABAC Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Monitoring & Telemetry Console */}
              <div className="bg-white p-6 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#FAF8F5] border border-[#EAE5DC] text-[9px] uppercase tracking-wider font-semibold text-[#8C6D37] mb-1">
                      <Sparkles className="w-3 h-3 text-[#C6A66B]" />
                      <span>Diagnostics &amp; Bottleneck Telemetry</span>
                    </div>
                    <h3 className="font-serif text-[20px] text-[#171717]">
                      Engine Render &amp; Latency Monitor
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      PerformanceMonitor.clear();
                      setPerfSummary(PerformanceMonitor.getSummary());
                      addToast({
                        type: 'info',
                        title: 'Telemetry Cleared',
                        message: 'Performance logs have been reset.',
                      });
                    }}
                    className="px-3 py-1.5 rounded-[4px] border border-[#D6CEBE] text-[11px] text-[#77736D] hover:text-[#171717] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    Clear Logs
                  </button>
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#FAF8F5] rounded-[6px] border border-[#EAE5DC] text-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#77736D] block">
                      Tracked Events
                    </span>
                    <span className="font-mono text-[20px] font-semibold text-[#171717]">
                      {perfSummary.totalMetrics}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-[6px] border border-[#EAE5DC] text-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#77736D] block">
                      Avg Latency
                    </span>
                    <span className="font-mono text-[20px] font-semibold text-[#171717]">
                      {perfSummary.averageDurationMs}ms
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-[6px] border border-[#EAE5DC] text-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#77736D] block">
                      Peak Duration
                    </span>
                    <span className="font-mono text-[20px] font-semibold text-[#8C6D37]">
                      {perfSummary.maxDurationMs}ms
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-[6px] border border-[#EAE5DC] text-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#77736D] block">
                      Bottlenecks
                    </span>
                    <span
                      className={`font-mono text-[20px] font-semibold ${
                        perfSummary.longTasksCount > 0 ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {perfSummary.longTasksCount}
                    </span>
                  </div>
                </div>

                {/* Recent Bottlenecks Log */}
                <div className="space-y-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#77736D] block">
                    Recent Long Tasks (&gt;80ms)
                  </span>
                  {perfSummary.recentBottlenecks.length === 0 ? (
                    <div className="p-3 bg-[#FAF8F5] rounded-[4px] border border-[#EAE5DC] text-[12px] text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>All Client &amp; Admin operations performing within optimal &lt;80ms response budget.</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {perfSummary.recentBottlenecks.map((b) => (
                        <div
                          key={b.id}
                          className="p-2.5 bg-[#FAF8F5] border border-amber-200/80 rounded-[4px] flex items-center justify-between text-[11px]"
                        >
                          <div className="space-y-0.5">
                            <strong className="text-[#171717] block font-medium">{b.name}</strong>
                            <span className="text-[#77736D] font-mono text-[10px]">
                              {b.context || 'Task'} &bull; {new Date(b.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <span className="font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            {b.durationMs}ms
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* LEAD DETAIL MODAL */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          plan={plans.find((p) => p.planNumber === selectedLead.planId || p.contactEmail === selectedLead.email)}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedLead(null);
          }}
          onLeadUpdated={handleLeadUpdated}
          adminName={profile?.displayName || 'Director'}
        />
      )}
    </div>
  );
};
