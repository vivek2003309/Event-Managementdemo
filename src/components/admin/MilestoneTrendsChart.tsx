import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ManagedWedding, INITIAL_WEDDINGS, DEFAULT_PLANNING_CHECKLIST } from './mockWeddings';
import { TrendingUp } from 'lucide-react';

export const MilestoneTrendsChart: React.FC = () => {
  const [weddings, setWeddings] = useState<ManagedWedding[]>([]);

  useEffect(() => {
    const loadStored = () => {
      try {
        const stored = localStorage.getItem('managed_weddings') || localStorage.getItem('wedding_managed_projects');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWeddings(parsed);
        } else {
          setWeddings(INITIAL_WEDDINGS);
        }
      } catch {
        setWeddings(INITIAL_WEDDINGS);
      }
    };
    loadStored();

    const handleUpdate = () => loadStored();
    window.addEventListener('managed_weddings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('managed_weddings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Filter 'in_progress' or 'planning' weddings
  const inProgressWeddings = useMemo(() => {
    return weddings.filter(
      (w) => w.status === 'in_progress' || w.status === 'planning' || !w.status
    );
  }, [weddings]);

  // Calculate current average progress of in-progress weddings
  const currentAvgProgress = useMemo(() => {
    if (inProgressWeddings.length === 0) return 45;
    const total = inProgressWeddings.reduce((acc, w) => {
      const checklist = w.checklist && w.checklist.length > 0 ? w.checklist : DEFAULT_PLANNING_CHECKLIST;
      const sum = checklist.reduce((s, m) => s + (m.progress || 0), 0);
      return acc + Math.round(sum / checklist.length);
    }, 0);
    return Math.round(total / inProgressWeddings.length);
  }, [inProgressWeddings]);

  // Generate 30-day trend data ending at currentAvgProgress today
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Simulate a smooth growth curve leading up to currentAvgProgress
      const variance = Math.sin(i * 0.4) * 4;
      const progressValue = Math.max(
        10,
        Math.min(100, Math.round(currentAvgProgress - (i * 0.6) + variance))
      );

      data.push({
        date: dateStr,
        averageProgress: progressValue,
      });
    }
    return data;
  }, [currentAvgProgress]);

  return (
    <div className="bg-white p-6 rounded-[12px] border border-[#EAE5DC] shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#C6A66B]/30 text-[#C6A66B]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-[18px] text-[#171717] font-normal">
              Milestone Trends &mdash; Last 30 Days
            </h3>
          </div>
          <p className="text-[12px] text-[#77736D]">
            Average completion trajectory across all active 'In Progress' &amp; 'Planning' wedding portfolios.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#FAF8F5] px-3.5 py-2 rounded-[8px] border border-[#EAE5DC]">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#77736D] block font-semibold">
              Active Portfolio Avg
            </span>
            <strong className="font-serif text-[16px] text-[#171717]">
              {currentAvgProgress}%
            </strong>
          </div>
          <div className="w-px h-8 bg-[#D6CEBE]" />
          <div className="text-[10px] text-[#8C6D37] font-mono">
            {inProgressWeddings.length} Active
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-[260px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C6A66B" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#C6A66B" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE1" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#9C968C"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#EAE5DC' }}
            />
            <YAxis
              stroke="#9C968C"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#171717] text-white p-3 rounded-[6px] shadow-xl border border-[#C6A66B]/40 text-[12px] space-y-1">
                      <p className="font-mono text-[10px] text-[#C6A66B]">{label}</p>
                      <p className="font-serif text-[14px]">
                        Average Progress: <strong className="font-mono text-[#C6A66B]">{payload[0].value}%</strong>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="averageProgress"
              stroke="#8C6D37"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorProgress)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
