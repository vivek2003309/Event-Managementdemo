import React, { useState, useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { useToast } from '../components/ui/Toast';
import { formatINR } from '../lib/designSystem';
import { useAuth } from '../context/AuthContext';
import { FirestoreService } from '../services/firestoreService';
import {
  BudgetCalculatorService,
  BUDGET_LOCATIONS,
  ALL_FUNCTIONS_LIST,
  ALL_SERVICES_LIST,
  PRESET_BUDGET_TIERS,
  formatRupees,
  BudgetCategoryAllocation,
} from '../services/budgetCalculatorService';
import {
  Wallet,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  Check,
  Save,
  Phone,
  ArrowRight,
  AlertCircle,
  Printer,
  RotateCcw,
  Building,
  Utensils,
  Camera,
  Music,
  Car,
  ShieldCheck,
  CheckCircle2,
  Info,
  HelpCircle,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  Venue: Building,
  Catering: Utensils,
  Décor: Sparkles,
  Photography: Camera,
  Entertainment: Music,
  Hospitality: Users,
  Transportation: Car,
  Miscellaneous: ShieldCheck,
};

export const BudgetPlannerPage: React.FC<{ onOpenLetTalk: () => void }> = ({ onOpenLetTalk }) => {
  const { addToast } = useToast();
  const { user } = useAuth();

  // Storage key for local saving
  const STORAGE_KEY = 'twd_budget_planner_state';

  // 1. Interactive Inputs
  const [targetBudget, setTargetBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).targetBudget || 6500000;
    } catch (e) {}
    return 6500000; // 65 Lakhs default
  });

  const [guestCount, setGuestCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).guestCount || 250;
    } catch (e) {}
    return 250;
  });

  const [location, setLocation] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).location || 'Udaipur';
    } catch (e) {}
    return 'Udaipur';
  });

  const [selectedFunctions, setSelectedFunctions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).selectedFunctions || ['Mehendi', 'Sangeet', 'Wedding', 'Reception'];
    } catch (e) {}
    return ['Mehendi', 'Sangeet', 'Wedding', 'Reception'];
  });

  const [requiredServices, setRequiredServices] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).requiredServices || [
        'Venue',
        'Catering',
        'Décor',
        'Photography',
        'Entertainment',
        'Hospitality',
        'Transportation',
      ];
    } catch (e) {}
    return [
      'Venue',
      'Catering',
      'Décor',
      'Photography',
      'Entertainment',
      'Hospitality',
      'Transportation',
    ];
  });

  // Active chart hover / focus slice
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // 2. Dynamic Calculation Engine
  const result = useMemo(() => {
    return BudgetCalculatorService.calculate({
      targetBudget,
      guestCount,
      location,
      numberOfFunctions: selectedFunctions.length,
      selectedFunctions,
      requiredServices,
    });
  }, [targetBudget, guestCount, location, selectedFunctions, requiredServices]);

  // Save progress handler
  const handleSavePlan = async () => {
    try {
      const payload = {
        targetBudget,
        guestCount,
        location,
        selectedFunctions,
        requiredServices,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      if (user) {
        await FirestoreService.saveBudget({
          userId: user.uid,
          targetBudget,
          allocatedBudget: result.allocatedBudget,
          remainingBudget: result.remainingBudget,
          location,
          guestCount,
          allocations: result.allocations.map((a) => ({
            id: a.id,
            name: a.name,
            categoryKey: a.categoryKey,
            amountINR: a.amountINR,
            percentage: a.percentage,
            color: a.color,
            description: a.description,
            estimatedCostPerGuest: a.estimatedCostPerGuest,
          })),
        });
        addToast({
          type: 'success',
          title: 'Budget Saved to Cloud Sanctuary',
          message: 'Your custom budget parameters have been synced to your Firestore account.',
        });
      } else {
        addToast({
          type: 'success',
          title: 'Wedding Budget Saved',
          message: 'Saved to browser storage. Sign in to sync your budget to your cloud dossier.',
        });
      }
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Unable to save budget parameters to cloud storage.',
      });
    }
  };


  // Reset parameters
  const handleReset = () => {
    setTargetBudget(6500000);
    setGuestCount(250);
    setLocation('Udaipur');
    setSelectedFunctions(['Mehendi', 'Sangeet', 'Wedding', 'Reception']);
    setRequiredServices(['Venue', 'Catering', 'Décor', 'Photography', 'Entertainment', 'Hospitality', 'Transportation']);
    localStorage.removeItem(STORAGE_KEY);
    addToast({
      type: 'info',
      title: 'Reset Completed',
      message: 'Budget parameters restored to signature luxury defaults.',
    });
  };

  // Function toggle
  const toggleFunction = (funcId: string) => {
    setSelectedFunctions((prev) => {
      if (prev.includes(funcId)) {
        if (prev.length <= 1) {
          addToast({
            type: 'info',
            title: 'At least one function required',
            message: 'A celebration itinerary requires at least one ceremonial event.',
          });
          return prev;
        }
        return prev.filter((f) => f !== funcId);
      }
      return [...prev, funcId];
    });
  };

  // Service toggle
  const toggleService = (srvId: string) => {
    setRequiredServices((prev) => {
      if (prev.includes(srvId)) {
        if (prev.length <= 1) {
          addToast({
            type: 'info',
            title: 'At least one service required',
            message: 'Please maintain at least one service category in your scope.',
          });
          return prev;
        }
        return prev.filter((s) => s !== srvId);
      }
      return [...prev, srvId];
    });
  };

  // Selected or hovered allocation details for chart center
  const activeAllocation = useMemo(() => {
    if (!hoveredCategory) return null;
    return result.allocations.find((a) => a.categoryKey === hoveredCategory) || null;
  }, [hoveredCategory, result.allocations]);

  // SVG Donut calculations
  const donutRadius = 88;
  const donutStrokeWidth = 24;
  const circumference = 2 * Math.PI * donutRadius;

  let accumulatedPercent = 0;
  const donutSegments = result.allocations.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] pt-24 pb-24 text-[#252525]">
      <PageContainer>
        {/* Editorial Header */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[4px] bg-[#C6A66B]/15 text-[#8C6D37] text-[11px] uppercase tracking-[0.2em] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Financial Architecture &bull; Algorithmic Modeling</span>
          </div>
          <h1 className="font-serif text-[40px] sm:text-[56px] text-[#171717] font-normal leading-tight">
            Wedding Budget Planner
          </h1>
          <p className="text-[15px] sm:text-[18px] text-[#55524E] max-w-2xl mx-auto mt-2 font-light leading-relaxed">
            Calibrate your celebration parameters to model realistic capital distribution across palace rental, banqueting, scenography, and guest hospitality.
          </p>

          {/* Prominent Mandatory Non-Quotation Disclaimer */}
          <div className="mt-5 max-w-2xl mx-auto p-3.5 rounded-[6px] bg-[#FAF8F5] border border-[#EAE5DC] flex items-start gap-3 text-left">
            <Info className="w-4 h-4 text-[#8C6D37] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#66625D] leading-relaxed">
              <strong className="text-[#171717]">Indicative Algorithmic Benchmark:</strong> Figures and percentages below represent dynamic industry estimates for exploratory planning. They do not constitute official binding quotations or contractual commitments from The Wedding Dreams.
            </p>
          </div>
        </div>

        {/* 3 High-Level Metric Cards (Total, Allocated, Remaining) */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* 1. Total Target Budget */}
          <div className="bg-white p-5 rounded-[8px] border border-[#EAE5DC] shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-[#77736D] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">Target Investment</span>
              <Wallet className="w-4 h-4 text-[#C6A66B]" />
            </div>
            <div className="font-serif text-[28px] sm:text-[32px] text-[#171717] font-normal leading-none mt-1">
              {formatRupees(targetBudget)}
            </div>
            <span className="text-[11px] text-[#77736D] block mt-1.5 font-light">
              Full targeted investment envelope
            </span>
          </div>

          {/* 2. Allocated Budget */}
          <div className="bg-white p-5 rounded-[8px] border border-[#EAE5DC] shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-[#77736D] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">Allocated Budget</span>
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="font-serif text-[28px] sm:text-[32px] text-[#171717] font-normal leading-none mt-1">
              {formatRupees(result.allocatedBudget)}
            </div>
            <span className="text-[11px] text-[#77736D] block mt-1.5 font-light">
              Sum of active service categories
            </span>
          </div>

          {/* 3. Remaining / Cushion Budget */}
          <div
            className={`p-5 rounded-[8px] border shadow-xs transition-all ${
              result.isOverBudget
                ? 'bg-[#FDF2F2] border-[#F2C0C0]'
                : 'bg-white border-[#EAE5DC]'
            }`}
          >
            <div className="flex items-center justify-between text-[#77736D] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">
                {result.isOverBudget ? 'Budget Deficit' : 'Contingency & Reserve'}
              </span>
              <ShieldCheck className={`w-4 h-4 ${result.isOverBudget ? 'text-[#BA1A1A]' : 'text-[#8C6D37]'}`} />
            </div>
            <div
              className={`font-serif text-[28px] sm:text-[32px] font-normal leading-none mt-1 ${
                result.isOverBudget ? 'text-[#BA1A1A]' : 'text-[#8C6D37]'
              }`}
            >
              {formatRupees(Math.abs(result.remainingBudget))}
            </div>
            <span className="text-[11px] text-[#77736D] block mt-1.5 font-light">
              {result.isOverBudget
                ? 'Allocations exceed target envelope'
                : 'Unallocated buffer for unpredicted costs'}
            </span>
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs & Sliders (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[8px] border border-[#EAE5DC] shadow-xs space-y-6">
              <h2 className="font-serif text-[22px] text-[#171717] font-normal border-b border-[#EAE5DC] pb-3">
                Celebration Parameters
              </h2>

              {/* 1. Target Budget Range & Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#77736D]">
                    Target Investment Envelope (INR)
                  </label>
                  <span className="font-serif text-[20px] text-[#C6A66B] font-medium">
                    {formatRupees(targetBudget)}
                  </span>
                </div>

                <Slider
                  min={1500000}
                  max={50000000}
                  step={500000}
                  value={targetBudget}
                  valueDisplay={formatRupees(targetBudget)}
                  onChangeValue={setTargetBudget}
                />

                {/* Quick Budget Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_BUDGET_TIERS.map((tier) => (
                    <button
                      key={tier.label}
                      type="button"
                      onClick={() => setTargetBudget(tier.value)}
                      className={`px-2.5 py-1 rounded-[3px] text-[10px] uppercase tracking-wider font-medium cursor-pointer transition-all ${
                        Math.abs(targetBudget - tier.value) < 1000000
                          ? 'bg-[#171717] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-[#55524E] border border-[#EAE5DC] hover:border-[#C6A66B]'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Guest Count Slider & Impact */}
              <div className="space-y-3 pt-3 border-t border-[#F2EEE6]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#77736D] block">
                      Guest Cohort Count
                    </label>
                    <span className="text-[10px] text-[#8C6D37]">
                      Updates catering &amp; hospitality estimates dynamically
                    </span>
                  </div>
                  <span className="font-serif text-[20px] text-[#171717] font-medium">
                    {guestCount} Guests
                  </span>
                </div>

                <Slider
                  min={25}
                  max={1000}
                  step={25}
                  value={guestCount}
                  valueDisplay={`${guestCount} Guests`}
                  onChangeValue={setGuestCount}
                />

                <div className="flex items-center justify-between text-[11px] text-[#77736D] pt-1">
                  <span>Per-guest investment: ~{formatRupees(result.perGuestAverage)}</span>
                  <div className="flex gap-1.5">
                    {[100, 250, 450, 700].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`px-2 py-0.5 rounded-[2px] text-[9px] uppercase tracking-wider cursor-pointer ${
                          guestCount === num ? 'bg-[#171717] text-white' : 'bg-[#F2EEE6] text-[#55524E]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Destination Location Selection */}
              <div className="space-y-2 pt-3 border-t border-[#F2EEE6]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#77736D]">
                    Destination Location
                  </label>
                  <span className="text-[10px] text-[#8C6D37]">
                    Multiplier: {result.locationMultiplier}x
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BUDGET_LOCATIONS.map((loc) => {
                    const isSelected = location === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setLocation(loc.id)}
                        className={`p-2.5 rounded-[4px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#171717] bg-[#FAF8F5] ring-1 ring-[#171717]'
                            : 'border-[#EAE5DC] bg-white hover:border-[#C6A66B]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-medium text-[#171717]">{loc.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#8C6D37]" />}
                        </div>
                        <span className="text-[9px] text-[#77736D] mt-0.5">
                          {loc.multiplier > 1.0 ? `+${Math.round((loc.multiplier - 1) * 100)}% logistics` : 'Standard basis'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Number of Functions & Selection */}
              <div className="space-y-2 pt-3 border-t border-[#F2EEE6]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#77736D] block">
                      Scheduled Ceremonies ({selectedFunctions.length} Functions)
                    </label>
                    <span className="text-[10px] text-[#8C6D37]">
                      Scales décor, catering meals, and concert staging
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {ALL_FUNCTIONS_LIST.map((func) => {
                    const isSelected = selectedFunctions.includes(func.id);
                    return (
                      <div
                        key={func.id}
                        onClick={() => toggleFunction(func.id)}
                        className={`p-2.5 rounded-[4px] border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#C6A66B] bg-[#FDFBF7] ring-1 ring-[#C6A66B]'
                            : 'border-[#EAE5DC] bg-white hover:border-[#D6CEBE]'
                        }`}
                      >
                        <span className="text-[12px] font-medium text-[#171717]">{func.label}</span>
                        <div
                          className={`w-4 h-4 rounded-[2px] flex items-center justify-center border ${
                            isSelected ? 'bg-[#171717] border-[#171717] text-white' : 'border-[#D6CEBE]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Required Services Scope */}
              <div className="space-y-2 pt-3 border-t border-[#F2EEE6]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#77736D]">
                    Required Service Categories
                  </label>
                  <span className="text-[10px] text-[#77736D]">
                    Toggle on/off to reallocate
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_SERVICES_LIST.filter((s) => s.id !== 'Miscellaneous').map((srv) => {
                    const isSelected = requiredServices.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleService(srv.id)}
                        className={`p-2.5 rounded-[4px] border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#171717] bg-[#FAF8F5]'
                            : 'border-[#EAE5DC] bg-white text-[#9C968C] hover:border-[#C6A66B]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: srv.color }}
                          />
                          <span className={`text-[12px] font-medium ${isSelected ? 'text-[#171717]' : 'text-[#9C968C]'}`}>
                            {srv.label}
                          </span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-[2px] flex items-center justify-center border ${
                            isSelected ? 'bg-[#C6A66B] border-[#C6A66B] text-white' : 'border-[#D6CEBE]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Utility Action Bar */}
              <div className="pt-4 border-t border-[#EAE5DC] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#77736D] hover:text-[#171717] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSavePlan}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                  className="cursor-pointer"
                >
                  Save My Wedding Plan
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Donut Chart, Category Breakdown & Directorship CTAs (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Interactive Donut Chart Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[8px] border border-[#EAE5DC] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif text-[22px] text-[#171717] font-normal">
                    Capital Distribution Chart
                  </h2>
                  <p className="text-[12px] text-[#77736D]">
                    Hover or tap any sector to view specific category economics.
                  </p>
                </div>
              </div>

              {/* SVG Interactive Donut Chart */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                <div className="relative w-56 h-56 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
                    {/* Background Ring */}
                    <circle
                      cx="110"
                      cy="110"
                      r={donutRadius}
                      fill="transparent"
                      stroke="#F4EFE6"
                      strokeWidth={donutStrokeWidth}
                    />

                    {/* Category Slices */}
                    {donutSegments.map((segment) => {
                      const isHovered = hoveredCategory === segment.categoryKey;
                      return (
                        <circle
                          key={segment.categoryKey}
                          cx="110"
                          cy="110"
                          r={donutRadius}
                          fill="transparent"
                          stroke={segment.color}
                          strokeWidth={isHovered ? donutStrokeWidth + 4 : donutStrokeWidth}
                          strokeDasharray={segment.strokeDasharray}
                          strokeDashoffset={segment.strokeDashoffset}
                          className="transition-all duration-300 cursor-pointer origin-center"
                          onMouseEnter={() => setHoveredCategory(segment.categoryKey)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          onClick={() => setHoveredCategory(segment.categoryKey)}
                        />
                      );
                    })}
                  </svg>

                  {/* Centered Dynamic Data Callout */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
                    {activeAllocation ? (
                      <>
                        <span className="text-[10px] uppercase tracking-wider text-[#8C6D37] font-semibold block truncate max-w-[120px]">
                          {activeAllocation.name}
                        </span>
                        <span className="font-serif text-[22px] text-[#171717] font-normal leading-tight mt-0.5">
                          {activeAllocation.percentage}%
                        </span>
                        <span className="text-[11px] text-[#55524E] font-medium block">
                          {formatRupees(activeAllocation.amountINR)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] uppercase tracking-widest text-[#77736D] font-medium block">
                          Total Budget
                        </span>
                        <span className="font-serif text-[20px] text-[#171717] font-normal leading-tight mt-0.5">
                          {formatRupees(targetBudget)}
                        </span>
                        <span className="text-[10px] text-[#8C6D37] font-medium block mt-0.5">
                          {result.allocations.length} Active Heads
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Compact Legend Chips */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] w-full sm:w-auto">
                  {result.allocations.map((item) => (
                    <div
                      key={item.categoryKey}
                      onMouseEnter={() => setHoveredCategory(item.categoryKey)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`flex items-center gap-2 p-1 rounded-[3px] transition-colors cursor-pointer ${
                        hoveredCategory === item.categoryKey ? 'bg-[#FAF8F5]' : ''
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#171717] truncate max-w-[90px]">{item.name}</span>
                      <span className="text-[#8C6D37] font-medium ml-auto">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Breakdown with Progress Bars */}
            <div className="bg-white p-6 sm:p-8 rounded-[8px] border border-[#EAE5DC] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-[20px] text-[#171717] font-normal">
                  Category Breakdown &amp; Progress
                </h3>
                <span className="text-[11px] text-[#77736D]">
                  Ranked by capital intensity
                </span>
              </div>

              <div className="space-y-4">
                {result.allocations.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.categoryKey] || Sparkles;
                  const isHovered = hoveredCategory === cat.categoryKey;

                  return (
                    <div
                      key={cat.categoryKey}
                      onMouseEnter={() => setHoveredCategory(cat.categoryKey)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`p-3 rounded-[6px] transition-all ${
                        isHovered ? 'bg-[#FAF8F5] ring-1 ring-[#C6A66B]/50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[13px] font-medium mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[#171717] font-semibold">{cat.name}</span>
                          {cat.guestSensitive && (
                            <span className="text-[9px] uppercase tracking-wider text-[#8C6D37] bg-[#F4EFE6] px-1.5 py-0.5 rounded-[2px] hidden sm:inline">
                              Guest Sensitive
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[#8C6D37] font-serif text-[16px] font-normal">
                            {cat.percentage}%
                          </span>
                          <span className="text-[#171717] font-serif text-[16px] font-medium">
                            {formatRupees(cat.amountINR)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-[#F4EFE6] overflow-hidden mb-1.5">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${Math.min(100, (cat.percentage / 30) * 100)}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>

                      <p className="text-[11px] text-[#77736D] font-light leading-relaxed pl-8">
                        {cat.description}
                        {cat.estimatedCostPerGuest && (
                          <span className="text-[#8C6D37] block mt-0.5">
                            Approx. {formatRupees(cat.estimatedCostPerGuest)} per guest across scheduled functions.
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Directorship CTA Box */}
            <div className="bg-[#171717] text-white p-6 sm:p-8 rounded-[8px] shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-medium block mb-1.5">
                  Directorial Review &bull; Zero Hidden Costs
                </span>
                <h3 className="font-serif text-[24px] sm:text-[28px] font-normal text-white mb-2 leading-tight">
                  Talk to a Wedding Expert
                </h3>
                <p className="text-[13px] text-white/75 font-light leading-relaxed mb-6">
                  Discuss this preliminary capital allocation with our directorship team. We will evaluate real-time palace tariffs in {location} for {guestCount} guests and structure a contractually guaranteed line-item budget.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="accent"
                    size="lg"
                    className="flex-1 justify-center shadow-md cursor-pointer"
                    onClick={onOpenLetTalk}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Talk to a Wedding Expert
                  </Button>

                  <a
                    href={`https://wa.me/919871211995?text=Hello%20The%20Wedding%20Dreams,%20I%20have%20modeled%20a%20wedding%20budget%20of%20${encodeURIComponent(formatRupees(targetBudget))}%20for%20${guestCount}%20guests%20in%20${encodeURIComponent(location)}%20on%20The%20Wedding%20Dreams%20Budget%20Planner.%20I%20would%20love%20to%20review%20this%20with%20an%20expert.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-[4px] bg-[#25D366] text-white text-[13px] font-medium hover:bg-[#20ba5a] transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                  <span>Guaranteed 12-hour turnaround</span>
                  <span>Direct Access NDA Available</span>
                </div>
              </div>
            </div>

            {/* Utility Print Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#77736D] hover:text-[#171717] font-medium cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Budget Blueprint</span>
              </button>

              <button
                type="button"
                onClick={handleSavePlan}
                className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-wider text-[#8C6D37] hover:text-[#171717] font-medium cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save to Browser</span>
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
