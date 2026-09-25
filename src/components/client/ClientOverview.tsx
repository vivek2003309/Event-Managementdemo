import React, { useState, useEffect } from 'react';
import {
  WeddingDocument,
  TaskDocument,
  BudgetDocument,
  ScheduleEvent,
} from '../../types/firebase';
import { formatRupees } from '../../services/budgetCalculatorService';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Wallet,
  ArrowRight,
  ListTodo,
  Users,
  MapPin,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

interface ClientOverviewProps {
  wedding: WeddingDocument;
  tasks: TaskDocument[];
  budget?: BudgetDocument | null;
  onNavigateTab: (tab: string) => void;
  progressPercent: number;
}

export const ClientOverview: React.FC<ClientOverviewProps> = ({
  wedding,
  tasks,
  budget,
  onNavigateTab,
  progressPercent,
}) => {
  // Live Countdown calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(wedding.weddingDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [wedding.weddingDate]);

  // Derived tasks
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 4);
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;

  // Budget calculations
  const totalBudget = budget?.targetBudget || wedding.budget || 6500000;
  const allocatedBudget = budget?.allocatedBudget || 5800000;
  const spentBudget = Math.round(totalBudget * 0.45);
  const remainingBudget = totalBudget - spentBudget;
  const budgetSpentPercent = Math.min(100, Math.round((spentBudget / totalBudget) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. ROYAL COUNTDOWN BANNER */}
      <div className="bg-gradient-to-r from-[#171717] via-[#222120] to-[#171717] text-[#F8F5EF] p-6 sm:p-8 rounded-[12px] shadow-lg border border-[#C6A66B]/30 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#C6A66B]">
                Celebration Countdown
              </span>
              <span className="text-white/30">&bull;</span>
              <span className="text-[11px] text-white/70 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C6A66B]" />
                {wedding.location}
              </span>
            </div>

            <h2 className="font-serif text-[24px] sm:text-[30px] font-normal leading-tight text-white">
              {wedding.clientName} &amp; {wedding.partnerName}
            </h2>

            <p className="text-[13px] text-white/70 font-light max-w-xl">
              {wedding.aesthetic || 'Royal Mewar Heritage & Candlelit Scenography'} &bull; Scheduled for{' '}
              {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Countdown Boxes */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center shrink-0">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Minutes', val: timeLeft.minutes },
              { label: 'Seconds', val: timeLeft.seconds },
            ].map((box) => (
              <div
                key={box.label}
                className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 rounded-[8px] min-w-[64px] sm:min-w-[76px] backdrop-blur-xs shadow-inner"
              >
                <span className="font-serif text-[22px] sm:text-[28px] font-normal text-white block leading-none mb-1">
                  {String(box.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-[0.18em] text-[#C6A66B] font-medium block">
                  {box.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PROGRESS & METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Progress Card */}
        <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#8C6D37]">
              Planning Progress
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              On Schedule
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-[36px] text-[#171717] font-normal leading-none">
                {progressPercent}%
              </span>
              <span className="text-[11px] text-[#77736D]">completed</span>
            </div>
            <span className="text-[11px] text-[#77736D]">
              {completedTasksCount} of {tasks.length || 5} milestones
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C6A66B] to-[#8C6D37] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[12px] text-[#77736D] font-light leading-relaxed">
            Venue, decor concepts, and guest invites are advancing in synchrony with your dedicated lead director.
          </p>

          <button
            onClick={() => onNavigateTab('timeline')}
            className="w-full py-2 rounded-[4px] bg-[#FAF8F5] border border-[#EAE5DC] text-[11px] font-medium uppercase tracking-wider text-[#171717] hover:bg-[#171717] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Review Full Timeline</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
          </button>
        </div>

        {/* Budget Summary Card */}
        <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#8C6D37]">
              Budget Ledger
            </span>
            <span className="text-[11px] font-serif font-medium text-[#171717]">
              {formatRupees(totalBudget)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="bg-[#FAF8F5] p-3 rounded-[6px] border border-[#EAE5DC]">
              <span className="text-[10px] uppercase tracking-wider text-[#77736D] block">
                Committed / Spent
              </span>
              <strong className="text-[15px] font-serif text-[#171717]">
                {formatRupees(spentBudget)}
              </strong>
              <span className="text-[10px] text-[#8C6D37] block mt-0.5">
                {budgetSpentPercent}% allocated
              </span>
            </div>

            <div className="bg-[#FAF8F5] p-3 rounded-[6px] border border-[#EAE5DC]">
              <span className="text-[10px] uppercase tracking-wider text-[#77736D] block">
                Remaining Reserve
              </span>
              <strong className="text-[15px] font-serif text-emerald-800">
                {formatRupees(remainingBudget)}
              </strong>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Liquid balance</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('budget')}
            className="w-full py-2 rounded-[4px] bg-[#FAF8F5] border border-[#EAE5DC] text-[11px] font-medium uppercase tracking-wider text-[#171717] hover:bg-[#171717] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Open Budget Planner</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
          </button>
        </div>

        {/* Guest & RSVP Card */}
        <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#8C6D37]">
              Guest Roster &amp; RSVP
            </span>
            <span className="text-[11px] text-[#77736D]">
              ~{wedding.guestCount} Target
            </span>
          </div>

          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#171717]">Attending Confirmed</span>
              <strong className="text-emerald-800 font-semibold font-mono">185 Guests</strong>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] overflow-hidden">
              <div className="h-full rounded-full bg-emerald-600" style={{ width: '53%' }} />
            </div>

            <div className="flex items-center justify-between text-[12px] pt-1">
              <span className="text-[#77736D]">Awaiting Confirmation</span>
              <span className="text-[#77736D] font-mono">140</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#77736D]">Hotel Accommodations Needed</span>
              <span className="text-[#8C6D37] font-mono">68 Rooms</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('rsvp')}
            className="w-full py-2 rounded-[4px] bg-[#FAF8F5] border border-[#EAE5DC] text-[11px] font-medium uppercase tracking-wider text-[#171717] hover:bg-[#171717] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Inspect RSVP Portal</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
          </button>
        </div>
      </div>

      {/* 3. UPCOMING TASKS & CEREMONIAL SCHEDULE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upcoming Tasks */}
        <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-3">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-[#C6A66B]" />
              <h3 className="font-serif text-[17px] text-[#171717]">
                Immediate Priority Tasks
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="text-[11px] text-[#8C6D37] hover:underline font-medium cursor-pointer"
            >
              View all ({tasks.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((t) => (
                <div
                  key={t.id || t.title}
                  className="p-3 rounded-[6px] bg-[#FAF8F5] border border-[#EAE5DC] flex items-center justify-between gap-3 hover:border-[#C6A66B] transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[13px] text-[#171717] font-medium block">
                      {t.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-[#77736D]">
                      <span className="font-semibold text-[#8C6D37]">{t.category}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C6A66B]" />
                        Due {t.dueDate}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-[2px] border ${
                      t.status === 'in_progress'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {t.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-[#77736D] text-[12px] italic">
                All immediate milestone tasks completed!
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Ceremonies */}
        <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C6A66B]" />
              <h3 className="font-serif text-[17px] text-[#171717]">
                Curated Ceremonial Schedule
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('schedule')}
              className="text-[11px] text-[#8C6D37] hover:underline font-medium cursor-pointer"
            >
              Full 3-Day Run-of-Show
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                day: 'Day 1 &bull; Dec 16',
                title: 'The Royal Welcome & Mehfil-e-Mehendi',
                time: '4:00 PM – 10:00 PM',
                location: 'Palace Courtyard & Poolside Lawns',
                attire: 'Regal Pastels & Handwoven Florals',
              },
              {
                day: 'Day 2 &bull; Dec 17',
                title: 'Haldi Royale & Celestial Sangeet Night',
                time: '11:00 AM & 7:30 PM',
                location: 'Lake Promenade & Grand Ballroom',
                attire: 'Haldi Ochre Yellow & Jewel-Toned Couture',
              },
              {
                day: 'Day 3 &bull; Dec 18',
                title: 'Royal Baraat, Vedic Mandap & Reception Gala',
                time: '4:30 PM Onwards',
                location: 'Jagmandir Island Palace Amphitheatre',
                attire: 'Regal Ivory, Gold & Royal Sherwanis',
              },
            ].map((event, idx) => (
              <div
                key={idx}
                className="p-3 rounded-[6px] bg-[#FAF8F5] border border-[#EAE5DC] space-y-1 hover:border-[#C6A66B] transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span
                    className="font-semibold text-[#8C6D37]"
                    dangerouslySetInnerHTML={{ __html: event.day }}
                  />
                  <span className="text-[#77736D] font-mono">{event.time}</span>
                </div>
                <h4 className="text-[13px] font-medium text-[#171717]">{event.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-[#77736D] pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C6A66B]" />
                    {event.location}
                  </span>
                  <span>&bull;</span>
                  <span className="italic">{event.attire}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
