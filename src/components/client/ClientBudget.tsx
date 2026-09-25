import React, { useState } from 'react';
import { BudgetDocument, BudgetAllocationItem } from '../../types/firebase';
import { formatRupees } from '../../services/budgetCalculatorService';
import { FirestoreService } from '../../services/firestoreService';
import { useRouter } from '../../lib/router';
import { useToast } from '../ui/Toast';
import {
  Wallet,
  TrendingUp,
  PieChart,
  Plus,
  ArrowUpRight,
  ExternalLink,
  DollarSign,
  Building,
  Utensils,
  Camera,
  Shirt,
  Music,
  Truck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ClientBudgetProps {
  budget?: BudgetDocument | null;
  targetBudget: number;
  userId: string;
  onBudgetUpdated?: (budget: BudgetDocument) => void;
}

const DEFAULT_CATEGORIES = [
  { key: 'venue', name: 'Venue & Scenography Architecture', pct: 38, spent: 1850000, color: '#C6A66B' },
  { key: 'catering', name: 'Gastronomy & Royal Banqueting', pct: 26, spent: 1100000, color: '#9B7B45' },
  { key: 'visuals', name: 'Editorial Photography & Cinematography', pct: 12, spent: 550000, color: '#4A3B2C' },
  { key: 'couture', name: 'Bridal Atelier & Jewellery Styling', pct: 10, spent: 420000, color: '#8C6D37' },
  { key: 'entertainment', name: 'Live Orchestration, Sufi Artists & DJ', pct: 8, spent: 300000, color: '#554228' },
  { key: 'hospitality', name: 'Royal Concierge & Airport Fleet Logistics', pct: 6, spent: 220000, color: '#2B2B2B' },
];

export const ClientBudget: React.FC<ClientBudgetProps> = ({
  budget,
  targetBudget,
  userId,
}) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const total = budget?.targetBudget || targetBudget || 6500000;
  const planned = budget?.allocatedBudget || Math.round(total * 0.95);
  const spent = 4440000; // sum of actual commitments
  const remaining = total - spent;
  const spentPercent = Math.min(100, Math.round((spent / total) * 100));

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('venue');
  const [expenseTitle, setExpenseTitle] = useState('');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(expenseAmount);
    if (!amt || amt <= 0) return;

    setCategories((prev) =>
      prev.map((c) => (c.key === expenseCategory ? { ...c, spent: c.spent + amt } : c))
    );

    addToast({
      type: 'success',
      title: 'Expense Recorded',
      message: `${formatRupees(amt)} added to ${expenseCategory.toUpperCase()} budget.`,
    });

    setExpenseAmount('');
    setExpenseTitle('');
    setIsAddingExpense(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Ledger Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D37] block">
            Target Nuptial Capital
          </span>
          <span className="font-serif text-[26px] text-[#171717] font-normal block leading-tight">
            {formatRupees(total)}
          </span>
          <span className="text-[11px] text-[#77736D] block">
            Allocated across 6 luxury production departments
          </span>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D37] block">
            Planned Allocations
          </span>
          <span className="font-serif text-[26px] text-[#171717] font-normal block leading-tight">
            {formatRupees(planned)}
          </span>
          <span className="text-[11px] text-blue-800 font-semibold bg-blue-50 px-1.5 py-0.2 rounded-[2px] inline-block">
            Planned &amp; Sourced
          </span>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D37] block">
            Committed / Spent
          </span>
          <span className="font-serif text-[26px] text-[#171717] font-normal block leading-tight">
            {formatRupees(spent)}
          </span>
          <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.2 rounded-[2px] inline-block">
            {spentPercent}% Contracted
          </span>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D37] block">
            Remaining Liquidity
          </span>
          <span className="font-serif text-[26px] text-emerald-800 font-normal block leading-tight">
            {formatRupees(remaining)}
          </span>
          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-[2px] inline-block">
            Buffer &amp; Unused Reserve
          </span>
        </div>
      </div>

      {/* Progress Bar of Overall Capital Utilization */}
      <div className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-medium text-[#171717]">
            Overall Capital Utilization ({spentPercent}%)
          </span>
          <span className="text-[#77736D]">
            {formatRupees(spent)} spent of {formatRupees(total)}
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] overflow-hidden flex">
          {categories.map((c) => {
            const widthPct = Math.round((c.spent / total) * 100);
            return (
              <div
                key={c.key}
                style={{ width: `${widthPct}%`, backgroundColor: c.color }}
                title={`${c.name}: ${formatRupees(c.spent)}`}
                className="h-full transition-all duration-300"
              />
            );
          })}
        </div>
      </div>

      {/* Category Breakdown & Action Toolbar */}
      <div className="bg-white p-6 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE5DC] pb-4">
          <div>
            <h3 className="font-serif text-[20px] text-[#171717]">
              Departmental Category Breakdown
            </h3>
            <p className="text-[12px] text-[#77736D] font-light">
              Granular distribution calibrated according to Rajasthan luxury benchmarks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingExpense(!isAddingExpense)}
              className="px-3.5 py-2 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>Record Expense</span>
            </button>

            <button
              onClick={() => navigate('/budget-planner')}
              className="px-3.5 py-2 rounded-[4px] bg-white border border-[#D6CEBE] text-[#171717] text-[11px] font-medium uppercase tracking-wider hover:border-[#171717] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Full Budget Calculator</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C6A66B]" />
            </button>
          </div>
        </div>

        {/* Add Expense Drawer */}
        {isAddingExpense && (
          <form
            onSubmit={handleAddExpense}
            className="p-4 bg-[#FAF8F5] rounded-[8px] border border-[#C6A66B]/50 space-y-3 animate-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37]">
              <span>Record Directorial / Vendor Payment</span>
              <button
                type="button"
                onClick={() => setIsAddingExpense(false)}
                className="text-[#77736D] hover:text-[#171717]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Payment Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palace Mandap Floral Advance"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Department
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Amount in INR (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 250000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider rounded-[4px] hover:bg-[#C6A66B] cursor-pointer"
              >
                Log Transaction
              </button>
            </div>
          </form>
        )}

        {/* Categories Table */}
        <div className="space-y-3">
          {categories.map((cat) => {
            const allocatedAmount = Math.round(total * (cat.pct / 100));
            const catSpentPct = Math.min(100, Math.round((cat.spent / allocatedAmount) * 100));
            return (
              <div
                key={cat.key}
                className="p-4 rounded-[8px] bg-[#FAF8F5] border border-[#EAE5DC] space-y-2 hover:border-[#C6A66B] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-serif text-[15px] text-[#171717] font-medium">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-[#77736D] font-mono">
                      ({cat.pct}% allocation)
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[13px]">
                    <span className="text-[#77736D]">
                      Spent:{' '}
                      <strong className="text-[#171717] font-serif">
                        {formatRupees(cat.spent)}
                      </strong>
                    </span>
                    <span className="text-[#77736D] font-serif">
                      / Planned: {formatRupees(allocatedAmount)}
                    </span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-white border border-[#EAE5DC] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${catSpentPct}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
