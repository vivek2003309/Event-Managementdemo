/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WeddingManagement Component
 * Directorial Wedding Project Management Console & Planning Tracker.
 * Displays all converted weddings alongside active projects dynamically.
 * Features an interactive Planning Milestone Checklist, Overall Project Completion Progress Bar,
 * milestone status/percentage updates, project archiving, and deletion.
 * Persists changes in localStorage under "managed_weddings".
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ManagedWedding, WeddingMilestone, INITIAL_WEDDINGS, DEFAULT_PLANNING_CHECKLIST } from './mockWeddings';
import { useToast } from '../ui/Toast';
import {
  Building,
  Calendar,
  MapPin,
  Users,
  Wallet,
  Sparkles,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Plus,
  AlertCircle,
  Eye,
  X,
  Archive,
  BarChart3,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const STORAGE_KEY = 'managed_weddings';
const BACKUP_STORAGE_KEY = 'wedding_managed_projects';

export const WeddingManagement: React.FC = () => {
  const { addToast } = useToast();
  const [weddings, setWeddings] = useState<ManagedWedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedWedding, setSelectedWedding] = useState<ManagedWedding | null>(null);

  // Load from localStorage or seed initial data
  const loadWeddings = useCallback((isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BACKUP_STORAGE_KEY);
      if (stored) {
        try {
          const parsed: ManagedWedding[] = JSON.parse(stored);
          // Ensure all items have checklist initialized
          const withChecklists = parsed.map((item) => ({
            ...item,
            checklist:
              item.checklist && item.checklist.length > 0
                ? item.checklist
                : JSON.parse(JSON.stringify(DEFAULT_PLANNING_CHECKLIST)),
          }));
          setWeddings(withChecklists);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(withChecklists));
          localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(withChecklists));
        } catch {
          setWeddings(INITIAL_WEDDINGS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WEDDINGS));
          localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(INITIAL_WEDDINGS));
        }
      } else {
        setWeddings(INITIAL_WEDDINGS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WEDDINGS));
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(INITIAL_WEDDINGS));
      }

      if (isManual) {
        addToast({
          type: 'success',
          title: 'Weddings Synchronized',
          message: 'Project pipeline refreshed successfully.',
        });
      }
    } catch (e) {
      console.error('Failed to load managed weddings:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadWeddings();

    const handleUpdate = () => loadWeddings();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === BACKUP_STORAGE_KEY || !e.key) {
        loadWeddings();
      }
    };

    window.addEventListener('managed_weddings_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('managed_weddings_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadWeddings]);

  // Persist helper
  const saveWeddings = (updated: ManagedWedding[]) => {
    setWeddings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('managed_weddings_updated'));
  };

  // Update Status
  const handleStatusChange = (id: string, newStatus: string) => {
    const updated = weddings.map((w) =>
      w.id === id ? { ...w, status: newStatus } : w
    );
    saveWeddings(updated);

    if (selectedWedding?.id === id) {
      setSelectedWedding({ ...selectedWedding, status: newStatus });
    }

    addToast({
      type: 'success',
      title: 'Project Status Updated',
      message: `Wedding project status set to ${newStatus}.`,
    });
  };

  // Archive Project
  const handleArchive = (id: string, name: string) => {
    if (!window.confirm(`Archive wedding project for ${name}? It will be marked as Archived.`)) {
      return;
    }

    handleStatusChange(id, 'archived');

    addToast({
      type: 'info',
      title: 'Project Archived',
      message: `Wedding for ${name} has been archived.`,
    });
  };

  // Delete Project
  const handleDelete = (id: string, _name?: string) => {
    setWeddings((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    window.dispatchEvent(new CustomEvent('managed_weddings_updated', { detail: { id } }));

    if (selectedWedding?.id === id) {
      setSelectedWedding(null);
    }

    addToast({
      type: 'info',
      title: 'Project Deleted',
      message: 'Record permanently removed',
    });
  };

  // Clear All Mock / Initial Sample Weddings
  const handleClearMockData = () => {
    if (
      !window.confirm(
        'Clear initial sample mock weddings? Only real converted leads will remain in the pipeline.'
      )
    ) {
      return;
    }

    const convertedOnly = weddings.filter(
      (w) => w.sourceLeadId || !w.id.startsWith('wed-00')
    );
    saveWeddings(convertedOnly);

    addToast({
      type: 'success',
      title: 'Mock Data Cleared',
      message: `Preserved ${convertedOnly.length} real converted projects.`,
    });
  };

  // Milestone updates inside Blueprint Drawer
  const handleMilestoneStatusChange = (milestoneId: string, newStatus: string) => {
    if (!selectedWedding) return;

    let defaultProg = 0;
    if (newStatus === 'Completed') defaultProg = 100;
    else if (newStatus === 'In Progress') defaultProg = 50;

    const currentChecklist = selectedWedding.checklist || DEFAULT_PLANNING_CHECKLIST;
    const updatedChecklist = currentChecklist.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            status: newStatus,
            progress:
              newStatus === 'Completed'
                ? 100
                : newStatus === 'Pending'
                ? 0
                : m.progress === 0 || m.progress === 100
                ? defaultProg
                : m.progress,
          }
        : m
    );

    const updatedWedding = {
      ...selectedWedding,
      checklist: updatedChecklist,
    };

    setSelectedWedding(updatedWedding);

    const allUpdated = weddings.map((w) =>
      w.id === selectedWedding.id ? updatedWedding : w
    );
    saveWeddings(allUpdated);
  };

  const handleMilestoneProgressChange = (milestoneId: string, progressVal: number) => {
    if (!selectedWedding) return;

    const safeVal = Math.min(100, Math.max(0, progressVal));
    const currentChecklist = selectedWedding.checklist || DEFAULT_PLANNING_CHECKLIST;

    const updatedChecklist = currentChecklist.map((m) => {
      if (m.id === milestoneId) {
        let status = m.status;
        if (safeVal === 100) status = 'Completed';
        else if (safeVal === 0) status = 'Pending';
        else if (safeVal > 0 && safeVal < 100) status = 'In Progress';
        return { ...m, progress: safeVal, status };
      }
      return m;
    });

    const updatedWedding = {
      ...selectedWedding,
      checklist: updatedChecklist,
    };

    setSelectedWedding(updatedWedding);

    const allUpdated = weddings.map((w) =>
      w.id === selectedWedding.id ? updatedWedding : w
    );
    saveWeddings(allUpdated);
  };

  // Calculate Overall Progress
  const calculateOverallProgress = (checklist?: WeddingMilestone[]) => {
    if (!checklist || checklist.length === 0) return 0;
    const total = checklist.reduce((acc, curr) => acc + (curr.progress || 0), 0);
    return Math.round(total / checklist.length);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Filtered weddings (Optimized with useMemo)
  const filteredWeddings = useMemo(() => {
    const list = weddings.filter((w) => {
      const matchesStatus =
        statusFilter === 'all' ||
        w.status?.toLowerCase() === statusFilter.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesStatus;

      const clientStr = (w.clientName || '').toLowerCase();
      const partnerStr = (w.partnerName || '').toLowerCase();
      const locStr = (w.location || w.destination || '').toLowerCase();
      const aestheticStr = (w.aesthetic || '').toLowerCase();

      const matchesQuery =
        clientStr.includes(q) ||
        partnerStr.includes(q) ||
        locStr.includes(q) ||
        aestheticStr.includes(q);

      return matchesStatus && matchesQuery;
    });

    return [...list].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [weddings, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredWeddings.length / pageSize) || 1;
  const paginatedWeddings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWeddings.slice(start, start + pageSize);
  }, [filteredWeddings, currentPage, pageSize]);

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          Confirmed
        </span>
      );
    }
    if (s === 'in_progress') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <Clock className="w-3 h-3 text-blue-600" />
          In Progress
        </span>
      );
    }
    if (s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
          Completed
        </span>
      );
    }
    if (s === 'archived') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
          Archived
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <Sparkles className="w-3 h-3 text-[#C5A059]" />
        Planning
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Action Header */}
      <div className="bg-white rounded-[10px] border border-[#EAE5DC] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[18px] sm:text-[22px] text-[#171717] font-normal">
              Commissioned Wedding Projects ({weddings.length})
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FAF8F5] text-[#8C6D37] border border-[#EAE5DC]">
              Master Roster
            </span>
          </div>
          <p className="text-[12px] text-[#77736D] mt-0.5 font-light">
            Live client productions and converted leads. Click on any project to view or update planning milestones and progress bars.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Clear Sample Data Button */}
          <button
            onClick={handleClearMockData}
            className="px-3 py-1.5 rounded-[4px] bg-[#FAF8F5] hover:bg-rose-50 text-[#77736D] hover:text-rose-700 border border-[#D6CEBE] text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
            title="Remove sample mock weddings so only real converted leads appear"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear Mock Data</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => loadWeddings(true)}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 rounded-[4px] bg-[#171717] hover:bg-[#C6A66B] text-white text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Projects</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[8px] border border-[#EAE5DC] p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77736D]" />
          <input
            type="text"
            placeholder="Search couple, city, aesthetic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#D6CEBE] text-[12px] pl-8 pr-7 py-1.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#77736D] hover:text-[#171717]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#D6CEBE] text-[12px] py-1 px-2.5 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
          >
            <option value="all">All Projects ({weddings.length})</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-[10px] border border-[#EAE5DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#EAE5DC] bg-[#FAF8F5] text-[10px] uppercase tracking-[0.12em] text-[#77736D] font-semibold">
                <th className="py-3 px-4">Commission / Couple</th>
                <th className="py-3 px-4">Partner Name</th>
                <th className="py-3 px-4">Celebration Date</th>
                <th className="py-3 px-4">Destination &amp; Venue</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Capital Allocation</th>
                <th className="py-3 px-4">Milestone Progress</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F2EEE6]">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-32" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-5 bg-[#F2EEE6] rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-5 bg-[#F2EEE6] rounded w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredWeddings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] text-[#C6A66B] flex items-center justify-center mx-auto">
                        <Building className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <h4 className="font-serif text-[18px] text-[#171717]">No Wedding Projects Found</h4>
                      <p className="text-[12px] text-[#77736D] font-light">
                        {searchQuery || statusFilter !== 'all'
                          ? 'Try clearing your search query or status filter.'
                          : 'No managed projects are currently active. Open the Leads / Inquiries tab and click "Convert to Wedding" on any lead.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedWeddings.map((wedding) => {
                  const progressPct = calculateOverallProgress(wedding.checklist);

                  return (
                    <tr key={wedding.id} className="hover:bg-[#FCFBF8] transition-colors group">
                      {/* Client Name */}
                      <td className="py-3.5 px-4 font-medium text-[#171717]">
                        <div className="flex items-center gap-1.5">
                          <span>{wedding.clientName}</span>
                          {wedding.sourceLeadId && (
                            <span
                              className="px-1.5 py-0.2 rounded-[2px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] uppercase font-mono font-semibold"
                              title="Converted from Directorial Inquiry"
                            >
                              Converted
                            </span>
                          )}
                        </div>
                        {wedding.aesthetic && (
                          <span className="text-[10px] text-[#8C6D37] block truncate max-w-[200px]">
                            {wedding.aesthetic}
                          </span>
                        )}
                      </td>

                      {/* Partner Name (Exact fallback rule requested by user) */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[12px] ${
                            wedding.partnerName &&
                            wedding.partnerName.trim() !== '' &&
                            wedding.partnerName.toLowerCase() !== 'not available'
                              ? 'text-[#171717] font-medium'
                              : 'text-[#9C968C] italic font-light'
                          }`}
                        >
                          {wedding.partnerName && wedding.partnerName.trim() !== ''
                            ? wedding.partnerName
                            : 'Not Available'}
                        </span>
                      </td>

                      {/* Wedding Date */}
                      <td className="py-3.5 px-4 text-[#171717] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
                          <span>{wedding.weddingDate || wedding.date || 'TBD'}</span>
                        </div>
                      </td>

                      {/* Destination & Venue */}
                      <td className="py-3.5 px-4 text-[#171717]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
                          <span className="truncate max-w-[180px]" title={wedding.location || wedding.destination}>
                            {wedding.location || wedding.destination || 'Selected Palace'}
                          </span>
                        </div>
                      </td>

                      {/* Guest Count */}
                      <td className="py-3.5 px-4 text-[#55524E]">
                        <span>~{wedding.guestCount || 'Bespoke'} Guests</span>
                      </td>

                      {/* Budget */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-[3px] bg-[#FAF8F5] border border-[#EAE5DC] text-[11px] font-medium text-[#8C6D37]">
                          {typeof wedding.budget === 'number'
                            ? `₹${(wedding.budget / 10000000).toFixed(1)} Cr`
                            : wedding.budget || wedding.budgetAllocation || 'Bespoke'}
                        </span>
                      </td>

                      {/* Milestone Progress Bar */}
                      <td className="py-3.5 px-4 min-w-[130px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono text-[#77736D]">{progressPct}%</span>
                            <span className="text-[9px] uppercase tracking-wider text-[#8C6D37] font-semibold">
                              {progressPct === 100 ? 'Ready' : progressPct > 50 ? 'On Track' : 'In Prep'}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#EAE5DC] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#C6A66B] to-[#8C6D37] transition-all duration-300"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(wedding.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <select
                            value={wedding.status || 'planning'}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusChange(wedding.id, e.target.value);
                            }}
                            className="bg-white border border-[#D6CEBE] text-[11px] py-1 px-2 rounded-[3px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                          >
                            <option value="planning">Planning</option>
                            <option value="in_progress">In Progress</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                          </select>

                          {/* Open Blueprint / Planning Drawer */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWedding(wedding);
                            }}
                            className="p-1.5 rounded-[3px] text-[#77736D] hover:text-[#171717] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                            title="Open Wedding Planning Tracker"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Project */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(wedding.id, wedding.clientName);
                            }}
                            className="p-1.5 rounded-[3px] text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination Controls */}
        <div className="p-3 border-t border-[#EAE5DC] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#77736D]">
          <span>
            Displaying {filteredWeddings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredWeddings.length)} of {filteredWeddings.length} projects ({weddings.length} total)
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-[3px] border border-[#D6CEBE] bg-white text-[#171717] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F5] cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-2 text-[#171717]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-[3px] border border-[#D6CEBE] bg-white text-[#171717] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF8F5] cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <span className="font-mono text-[10px]">
            Storage: Local Synchronized Cache (managed_weddings)
          </span>
        </div>
      </div>

      {/* Wedding Detail Blueprint & Interactive Planning Dashboard Modal */}
      {selectedWedding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-[10px] border border-[#EAE5DC] shadow-2xl overflow-hidden animate-fade-in my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#171717] text-white flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-semibold">
                    Commission Blueprint &bull; ID: {selectedWedding.id.slice(-6)}
                  </span>
                  {selectedWedding.status === 'archived' && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-neutral-700 text-neutral-200">
                      Archived
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-normal mt-0.5">
                  {selectedWedding.clientName}
                  {selectedWedding.partnerName &&
                    selectedWedding.partnerName.trim() !== '' &&
                    selectedWedding.partnerName.toLowerCase() !== 'not available' &&
                    ` & ${selectedWedding.partnerName}`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWedding(null)}
                className="p-1.5 text-white/70 hover:text-white rounded-[4px] hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Event Coordinates Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-3.5 rounded-[8px] border border-[#EAE5DC]">
                <div>
                  <span className="text-[#77736D] text-[10px] uppercase tracking-wider block">Lead Client</span>
                  <span className="font-medium text-[#171717] mt-0.5 block truncate">
                    {selectedWedding.clientName}
                  </span>
                </div>
                <div>
                  <span className="text-[#77736D] text-[10px] uppercase tracking-wider block">Partner Name</span>
                  <span className="font-medium text-[#171717] mt-0.5 block truncate">
                    {selectedWedding.partnerName && selectedWedding.partnerName.trim() !== ''
                      ? selectedWedding.partnerName
                      : 'Not Available'}
                  </span>
                </div>
                <div>
                  <span className="text-[#77736D] text-[10px] uppercase tracking-wider block">Wedding Date</span>
                  <span className="font-medium text-[#171717] mt-0.5 block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#C6A66B]" />
                    {selectedWedding.weddingDate || selectedWedding.date || 'TBD'}
                  </span>
                </div>
                <div>
                  <span className="text-[#77736D] text-[10px] uppercase tracking-wider block">Destination</span>
                  <span className="font-medium text-[#171717] mt-0.5 block truncate flex items-center gap-1" title={selectedWedding.location || selectedWedding.destination}>
                    <MapPin className="w-3 h-3 text-[#C6A66B] shrink-0" />
                    {selectedWedding.location || selectedWedding.destination || 'Unspecified'}
                  </span>
                </div>
              </div>

              {/* OVERALL PROJECT COMPLETION PROGRESS BAR (Requirement 2) */}
              <div className="p-4 rounded-[8px] bg-[#FAF8F5] border border-[#C6A66B]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#8C6D37]" />
                    <span className="font-serif text-[15px] font-medium text-[#171717]">
                      Overall Project Completion
                    </span>
                  </div>
                  <span className="font-mono text-[14px] font-bold text-[#8C6D37]">
                    {calculateOverallProgress(selectedWedding.checklist)}%
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-[#EAE5DC] overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#C6A66B] to-[#8C6D37] rounded-full transition-all duration-300"
                    style={{ width: `${calculateOverallProgress(selectedWedding.checklist)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#77736D] pt-0.5">
                  <span>
                    {(selectedWedding.checklist || DEFAULT_PLANNING_CHECKLIST).filter(
                      (m) => m.status === 'Completed'
                    ).length}{' '}
                    of {(selectedWedding.checklist || DEFAULT_PLANNING_CHECKLIST).length} Milestones Finalized
                  </span>
                  <span className="italic">Calculated dynamically from milestones</span>
                </div>
              </div>

              {/* PLANNING CHECKLIST MILESTONES (Requirement 2) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#8C6D37]">
                    Production Milestones &amp; Run-of-Show Readiness
                  </span>
                  <span className="text-[10px] text-[#77736D]">
                    Adjust status or slider to update completion
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(selectedWedding.checklist || DEFAULT_PLANNING_CHECKLIST).map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-3 bg-white rounded-[6px] border border-[#EAE5DC] hover:border-[#C6A66B]/60 transition-colors shadow-2xs space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] flex items-center justify-center font-mono text-[10px] text-[#8C6D37]">
                            {milestone.id}
                          </span>
                          <span className="font-medium text-[#171717] text-[13px]">
                            {milestone.title}
                          </span>
                        </div>

                        {/* Status Selector */}
                        <div className="flex items-center gap-2">
                          <select
                            value={milestone.status}
                            onChange={(e) =>
                              handleMilestoneStatusChange(milestone.id, e.target.value)
                            }
                            className={`text-[11px] font-semibold py-1 px-2.5 rounded-[4px] border cursor-pointer ${
                              milestone.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : milestone.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <span className="font-mono text-[12px] font-semibold text-[#171717] w-10 text-right">
                            {milestone.progress}%
                          </span>
                        </div>
                      </div>

                      {/* Percentage Range Slider */}
                      <div className="flex items-center gap-3 pt-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={milestone.progress}
                          onChange={(e) =>
                            handleMilestoneProgressChange(milestone.id, Number(e.target.value))
                          }
                          className="w-full accent-[#C6A66B] h-1.5 bg-[#EAE5DC] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Directorial Vision Notes */}
              {selectedWedding.notes && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Directorial Notes &amp; Client Brief
                  </span>
                  <div className="bg-[#FAF8F5] p-3 rounded-[6px] border border-[#EAE5DC] text-[#55524E] leading-relaxed">
                    {selectedWedding.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-[#EAE5DC] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                {/* Archive Button */}
                <button
                  onClick={() => handleArchive(selectedWedding.id, selectedWedding.clientName)}
                  className="px-3 py-1.5 rounded-[4px] text-neutral-700 hover:text-black hover:bg-neutral-200 border border-neutral-300 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Archive this wedding project"
                >
                  <Archive className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Archive Project</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(selectedWedding.id, selectedWedding.clientName);
                  }}
                  className="px-3 py-1.5 rounded-[4px] text-rose-600 hover:bg-rose-50 border border-rose-200 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Permanently delete project"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Project</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedWedding(null)}
                className="px-4 py-2 rounded-[4px] bg-[#171717] text-white hover:bg-[#C6A66B] text-[11px] font-medium transition-colors cursor-pointer ml-auto"
              >
                Close Planning Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
