import React, { useMemo } from 'react';
import { LeadDocument, WeddingDocument } from '../../types/firebase';
import {
  TrendingUp,
  Award,
  Users,
  Wallet,
  MapPin,
  Calendar,
  Sparkles,
  PieChart,
  BarChart3,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface AdminAnalyticsViewProps {
  leads: LeadDocument[];
  weddings: WeddingDocument[];
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ leads, weddings }) => {
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const wonLeads = leads.filter((l) => l.status === 'won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    // Status breakdown
    const byStatus = {
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      qualified: leads.filter((l) => l.status === 'qualified').length,
      proposal: leads.filter((l) => l.status === 'proposal').length,
      won: wonLeads,
      lost: leads.filter((l) => l.status === 'lost').length,
    };

    // Location distribution
    const locationCounts: Record<string, number> = {};
    leads.forEach((l) => {
      const loc = l.location || 'Undecided';
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Approximate Pipeline Calculation in Crores
    let totalEstimatedValueCrores = 0;
    leads.forEach((l) => {
      const b = l.budget || '';
      if (b.includes('1Cr+')) totalEstimatedValueCrores += 1.25;
      else if (b.includes('50–75L') || b.includes('50L–₹1Cr') || b.includes('50L-1Cr')) totalEstimatedValueCrores += 0.65;
      else if (b.includes('25–50L')) totalEstimatedValueCrores += 0.35;
      else if (b.includes('10–25L')) totalEstimatedValueCrores += 0.18;
      else totalEstimatedValueCrores += 0.5;
    });

    // Average Guests
    const leadsWithGuests = leads.filter((l) => l.guestCount && l.guestCount > 0);
    const avgGuests =
      leadsWithGuests.length > 0
        ? Math.round(
            leadsWithGuests.reduce((sum, l) => sum + (l.guestCount || 0), 0) /
              leadsWithGuests.length
          )
        : 350;

    return {
      totalLeads,
      wonLeads,
      conversionRate,
      byStatus,
      topLocations,
      totalEstimatedValueCrores: totalEstimatedValueCrores.toFixed(1),
      avgGuests,
    };
  }, [leads, weddings]);

  return (
    <div className="space-y-6">
      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] block">
            Conversion Rate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-[28px] text-[#171717] font-normal">
              {stats.conversionRate}%
            </span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[2px] border border-emerald-200">
              {stats.wonLeads} Contracted
            </span>
          </div>
          <span className="text-[11px] text-[#9C968C] block">
            From {stats.totalLeads} total inbound dossiers
          </span>
        </div>

        <div className="bg-white p-5 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] block">
            Active Pipeline Value
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-[28px] text-[#171717] font-normal">
              ₹{stats.totalEstimatedValueCrores} Cr
            </span>
            <span className="text-[11px] font-medium text-[#8C6D37] bg-[#FAF8F5] px-2 py-0.5 rounded-[2px] border border-[#EAE5DC]">
              Est. Volume
            </span>
          </div>
          <span className="text-[11px] text-[#9C968C] block">
            Sum of qualified celebration budgets
          </span>
        </div>

        <div className="bg-white p-5 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] block">
            Average Celebration Scale
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-[28px] text-[#171717] font-normal">
              ~{stats.avgGuests}
            </span>
            <span className="text-[11px] font-medium text-[#171717] bg-[#F2EEE6] px-2 py-0.5 rounded-[2px]">
              Guests / Wedding
            </span>
          </div>
          <span className="text-[11px] text-[#9C968C] block">
            Across Rajasthan & Coastal luxury hubs
          </span>
        </div>

        <div className="bg-white p-5 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] block">
            In Proposal Review
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-[28px] text-[#171717] font-normal">
              {stats.byStatus.proposal}
            </span>
            <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-[2px] border border-indigo-200">
              Active Despatch
            </span>
          </div>
          <span className="text-[11px] text-[#9C968C] block">
            High-intent couples reviewing contracts
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Stage Funnel */}
        <div className="bg-white p-6 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#C6A66B]" />
              <h3 className="font-serif text-[18px] text-[#171717]">
                Pipeline Stage Distribution
              </h3>
            </div>
            <span className="text-[11px] text-[#77736D]">Live Real-time</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'New Inquiries', count: stats.byStatus.new, color: 'bg-amber-400' },
              { label: 'Contacted & Triage', count: stats.byStatus.contacted, color: 'bg-blue-400' },
              { label: 'Qualified Heritage', count: stats.byStatus.qualified, color: 'bg-purple-400' },
              { label: 'Proposal Dispatched', count: stats.byStatus.proposal, color: 'bg-indigo-500' },
              { label: 'Won & Contracted', count: stats.byStatus.won, color: 'bg-emerald-500' },
              { label: 'Lost / Passed', count: stats.byStatus.lost, color: 'bg-rose-300' },
            ].map((stage) => {
              const pct = stats.totalLeads > 0 ? Math.round((stage.count / stats.totalLeads) * 100) : 0;
              return (
                <div key={stage.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#171717]">{stage.label}</span>
                    <span className="font-medium text-[#77736D]">
                      {stage.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Destination Distribution */}
        <div className="bg-white p-6 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C6A66B]" />
              <h3 className="font-serif text-[18px] text-[#171717]">
                Destination Demand Index
              </h3>
            </div>
            <span className="text-[11px] text-[#77736D]">By Geography</span>
          </div>

          <div className="space-y-3">
            {stats.topLocations.map(([loc, count]) => {
              const pct = stats.totalLeads > 0 ? Math.round((count / stats.totalLeads) * 100) : 0;
              return (
                <div key={loc} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#171717] font-medium">{loc}</span>
                    <span className="text-[#77736D]">
                      {count} celebrations ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#C6A66B] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-[#FAF8F5] rounded-[6px] border border-[#EAE5DC] text-[11px] text-[#77736D] space-y-1">
            <strong className="text-[#171717] block">Directorial Insight:</strong>
            <p>
              Udaipur and Jaipur continue to dominate 70%+ of luxury royal palace commissions, with Goa remaining the premier choice for contemporary coastal multi-day nuptials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
