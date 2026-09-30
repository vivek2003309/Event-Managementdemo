/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AdminVendorManagement Component
 * Full CRUD Luxury Vendor Directory for Atelier Directors.
 * Features: Categories filter, Wedding project filter, Contact coordination,
 * Contract Status badges ('Draft', 'Contracted', 'Paid in Full'), and Add/Edit Vendor modal.
 * Persists in localStorage under key "atelier_vendors".
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AtelierVendor, INITIAL_ATELIER_VENDORS } from '../../data/seedAtelierData';
import { ManagedWedding, INITIAL_WEDDINGS } from './mockWeddings';
import { useToast } from '../ui/Toast';
import {
  Store,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Phone,
  Mail,
  Building,
  Sparkles,
  CheckCircle2,
  Clock,
  Wallet,
  X,
  RefreshCw,
  Tag,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const STORAGE_KEY = 'atelier_vendors';
const WEDDINGS_STORAGE_KEY = 'managed_weddings';

const VENDOR_CATEGORIES = [
  'Palace & Venue',
  'Floral & Scenography',
  'Gastronomy & Catering',
  'Cinematography',
  'Sound & Pyro',
  'Couture Styling',
];

export const AdminVendorManagement: React.FC = () => {
  const { addToast } = useToast();
  const [vendors, setVendors] = useState<AtelierVendor[]>([]);
  const [weddings, setWeddings] = useState<ManagedWedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWeddingFilter, setSelectedWeddingFilter] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<AtelierVendor | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    category: 'Palace & Venue',
    contactPerson: '',
    phone: '',
    email: '',
    contractedAmount: '₹50,00,000',
    weddingId: '',
    status: 'Contracted' as 'Draft' | 'Contracted' | 'Paid in Full',
    notes: '',
  });

  // Load weddings from localStorage
  const loadWeddingsList = useCallback(() => {
    try {
      const stored = localStorage.getItem(WEDDINGS_STORAGE_KEY) || localStorage.getItem('wedding_managed_projects');
      if (stored) {
        setWeddings(JSON.parse(stored));
      } else {
        setWeddings(INITIAL_WEDDINGS);
      }
    } catch {
      setWeddings(INITIAL_WEDDINGS);
    }
  }, []);

  // Load vendors from localStorage
  const loadVendors = useCallback((isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setVendors(JSON.parse(stored));
      } else {
        setVendors(INITIAL_ATELIER_VENDORS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ATELIER_VENDORS));
      }

      if (isManual) {
        addToast({
          type: 'success',
          title: 'Vendors Synced',
          message: 'Vendor directory synchronized successfully.',
        });
      }
    } catch (e) {
      console.error('Failed to load atelier vendors:', e);
      setVendors(INITIAL_ATELIER_VENDORS);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadWeddingsList();
    loadVendors();

    const handleSync = () => {
      loadVendors();
      loadWeddingsList();
    };

    window.addEventListener('atelier_vendors_updated', handleSync);
    window.addEventListener('managed_weddings_updated', loadWeddingsList);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('atelier_vendors_updated', handleSync);
      window.removeEventListener('managed_weddings_updated', loadWeddingsList);
      window.removeEventListener('storage', handleSync);
    };
  }, [loadVendors, loadWeddingsList]);

  // Persist helper
  const saveVendors = (updatedList: AtelierVendor[]) => {
    setVendors(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent('atelier_vendors_updated'));
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const defaultWedId = weddings[0]?.id || 'wed-001';
    setEditingVendor(null);
    setFormData({
      businessName: '',
      category: 'Palace & Venue',
      contactPerson: '',
      phone: '',
      email: '',
      contractedAmount: '₹50,00,000',
      weddingId: defaultWedId,
      status: 'Contracted',
      notes: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (vendor: AtelierVendor) => {
    setEditingVendor(vendor);
    setFormData({
      businessName: vendor.businessName,
      category: vendor.category,
      contactPerson: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email || '',
      contractedAmount: String(vendor.contractedAmount),
      weddingId: vendor.weddingId,
      status: vendor.status,
      notes: vendor.notes || '',
    });
    setIsModalOpen(true);
  };

  // Delete Vendor
  const handleDeleteVendor = (idOrVendor: string | AtelierVendor) => {
    const vendorId = typeof idOrVendor === 'string' ? idOrVendor : idOrVendor.id;
    if (!vendorId) return;

    setVendors((prev) => {
      const updated = prev.filter((v) => v.id !== vendorId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    window.dispatchEvent(new CustomEvent('atelier_vendors_updated', { detail: { id: vendorId } }));

    addToast({
      type: 'info',
      title: 'Vendor Removed',
      message: 'Record permanently removed',
    });
  };

  // Save Add/Edit
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim()) {
      alert('Please enter vendor business name.');
      return;
    }

    const assignedWedding = weddings.find((w) => w.id === formData.weddingId);
    const weddingName = assignedWedding
      ? `${assignedWedding.clientName}${assignedWedding.partnerName && assignedWedding.partnerName !== 'Not Available' ? ' & ' + assignedWedding.partnerName : ''}`
      : 'Atelier Master Project';

    if (editingVendor) {
      // Update
      const updatedList = vendors.map((v) =>
        v.id === editingVendor.id
          ? {
              ...v,
              businessName: formData.businessName.trim(),
              category: formData.category,
              contactPerson: formData.contactPerson.trim(),
              phone: formData.phone.trim(),
              email: formData.email.trim(),
              contractedAmount: formData.contractedAmount.trim(),
              weddingId: formData.weddingId,
              weddingName,
              status: formData.status,
              notes: formData.notes.trim(),
            }
          : v
      );
      saveVendors(updatedList);
      addToast({
        type: 'success',
        title: 'Vendor Updated',
        message: `Contract terms updated for ${formData.businessName}.`,
      });
    } else {
      // Create
      const newVendor: AtelierVendor = {
        id: `vnd-${Date.now()}`,
        businessName: formData.businessName.trim(),
        category: formData.category,
        contactPerson: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        contractedAmount: formData.contractedAmount.trim(),
        weddingId: formData.weddingId,
        weddingName,
        status: formData.status,
        notes: formData.notes.trim(),
        createdAt: new Date().toISOString(),
      };
      saveVendors([newVendor, ...vendors]);
      addToast({
        type: 'success',
        title: 'Vendor Contracted',
        message: `${formData.businessName} added to the production directory.`,
      });
    }

    setIsModalOpen(false);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedWeddingFilter, selectedStatus, searchQuery]);

  // Filtered vendors (Optimized with useMemo)
  const filteredVendors = useMemo(() => {
    const list = vendors.filter((v) => {
      if (selectedCategory !== 'all' && v.category !== selectedCategory) {
        return false;
      }
      if (selectedWeddingFilter !== 'all' && v.weddingId !== selectedWeddingFilter) {
        return false;
      }
      if (selectedStatus !== 'all' && v.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesBusiness = (v.businessName || '').toLowerCase().includes(q);
        const matchesCategory = (v.category || '').toLowerCase().includes(q);
        const matchesContact = (v.contactPerson || '').toLowerCase().includes(q);
        const matchesPhone = (v.phone || '').toLowerCase().includes(q);
        return matchesBusiness || matchesCategory || matchesContact || matchesPhone;
      }
      return true;
    });

    return [...list].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [vendors, selectedCategory, selectedWeddingFilter, selectedStatus, searchQuery]);

  const totalPages = Math.ceil(filteredVendors.length / pageSize) || 1;
  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVendors.slice(start, start + pageSize);
  }, [filteredVendors, currentPage, pageSize]);

  const getStatusBadge = (status: string) => {
    if (status === 'Paid in Full') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Paid in Full
        </span>
      );
    }
    if (status === 'Contracted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF8F5] text-[#8C6D37] border border-[#D6CEBE]">
          <Sparkles className="w-3 h-3 text-[#C6A66B]" />
          Contracted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-700 border border-gray-200">
        <Clock className="w-3 h-3 text-gray-500" />
        Draft Terms
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-[10px] border border-[#EAE5DC] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[18px] sm:text-[22px] text-[#171717] font-normal">
              Atelier Vendor &amp; Artisan Directory ({vendors.length})
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FAF8F5] text-[#8C6D37] border border-[#EAE5DC]">
              Directorial Purveyors
            </span>
          </div>
          <p className="text-[12px] text-[#77736D] mt-0.5 font-light">
            Palace venues, couture scenography, Michelin gastronomy, and ARRI cinema crews under contractual engagement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Vendor Button (Requirement 2) */}
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 rounded-[4px] bg-[#171717] hover:bg-[#C6A66B] text-white text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add New Vendor</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={() => loadVendors(true)}
            disabled={isRefreshing}
            className="p-2 rounded-[4px] bg-[#FAF8F5] hover:bg-[#F2EEE6] text-[#77736D] border border-[#D6CEBE] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (Requirement 2) */}
      <div className="bg-white rounded-[8px] border border-[#EAE5DC] p-3 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77736D]" />
          <input
            type="text"
            placeholder="Search vendor, contact person, category..."
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

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold">
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-[#D6CEBE] text-[11px] py-1 px-2.5 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {VENDOR_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Wedding Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold">
              Project:
            </span>
            <select
              value={selectedWeddingFilter}
              onChange={(e) => setSelectedWeddingFilter(e.target.value)}
              className="bg-white border border-[#D6CEBE] text-[11px] py-1 px-2.5 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
            >
              <option value="all">All Celebrations</option>
              {weddings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.clientName}
                  {w.partnerName && w.partnerName !== 'Not Available' ? ` & ${w.partnerName}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold">
              Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-[#D6CEBE] text-[11px] py-1 px-2 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Contracted">Contracted</option>
              <option value="Paid in Full">Paid in Full</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Table (Requirement 2 Columns) */}
      <div className="bg-white rounded-[10px] border border-[#EAE5DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#EAE5DC] bg-[#FAF8F5] text-[10px] uppercase tracking-[0.12em] text-[#77736D] font-semibold">
                <th className="py-3 px-4">Vendor &amp; Category</th>
                <th className="py-3 px-4">Lead Contact &amp; Phone</th>
                <th className="py-3 px-4">Assigned Wedding Project</th>
                <th className="py-3 px-4">Contract Value &amp; Budget</th>
                <th className="py-3 px-4">Contract Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F2EEE6]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-32" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-[#F2EEE6] rounded w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] text-[#C6A66B] flex items-center justify-center mx-auto">
                        <Store className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <h4 className="font-serif text-[18px] text-[#171717]">No Vendors Found</h4>
                      <p className="text-[12px] text-[#77736D] font-light">
                        {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                          ? 'Try resetting the category filter or search query.'
                          : 'No artisan partners currently listed. Click "+ Add New Vendor" to register purveyors.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedVendors.map((vendor) => {
                  return (
                    <tr key={vendor.id} className="hover:bg-[#FCFBF8] transition-colors group">
                      {/* Vendor Name & Category */}
                      <td className="py-3.5 px-4 font-medium text-[#171717]">
                        <div className="flex items-center gap-1.5">
                          <span>{vendor.businessName}</span>
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded-[3px] bg-[#FAF8F5] border border-[#EAE5DC] text-[10px] font-medium text-[#8C6D37]">
                          {vendor.category}
                        </span>
                      </td>

                      {/* Lead Contact & Phone */}
                      <td className="py-3.5 px-4 text-[#55524E]">
                        <span className="font-medium text-[#171717] block">
                          {vendor.contactPerson}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-[#77736D] mt-0.5">
                          <Phone className="w-3 h-3 text-[#C6A66B]" />
                          <span>{vendor.phone}</span>
                          {vendor.email && (
                            <>
                              <span>&bull;</span>
                              <span className="font-mono">{vendor.email}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Assigned Wedding */}
                      <td className="py-3.5 px-4 text-[#55524E]">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
                          <span className="truncate max-w-[170px]" title={vendor.weddingName}>
                            {vendor.weddingName}
                          </span>
                        </div>
                      </td>

                      {/* Contract Value & Budget */}
                      <td className="py-3.5 px-4">
                        <span className="font-serif font-medium text-[#171717] text-[13px] block">
                          {typeof vendor.contractedAmount === 'number'
                            ? `₹${vendor.contractedAmount.toLocaleString('en-IN')}`
                            : vendor.contractedAmount}
                        </span>
                        {vendor.notes && (
                          <span className="text-[10px] text-[#77736D] block truncate max-w-[180px]" title={vendor.notes}>
                            {vendor.notes}
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(vendor.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(vendor);
                            }}
                            className="p-1.5 rounded-[3px] text-[#77736D] hover:text-[#171717] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteVendor(vendor);
                            }}
                            className="p-1.5 rounded-[3px] text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Vendor"
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
            Displaying {filteredVendors.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredVendors.length)} of {filteredVendors.length} purveyors ({vendors.length} total)
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
            Storage: Local Storage (atelier_vendors)
          </span>
        </div>
      </div>

      {/* Add / Edit Vendor Modal (Requirement 2) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-md w-full rounded-[10px] border border-[#EAE5DC] shadow-2xl overflow-hidden animate-fade-in my-8">
            <div className="p-4 bg-[#171717] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] font-semibold block">
                  {editingVendor ? 'Edit Supplier Record' : 'Contract Artisan Partner'}
                </span>
                <h3 className="font-serif text-lg font-normal">
                  {editingVendor ? editingVendor.businessName : 'New Vendor Commission'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-white/70 hover:text-white rounded-[4px] hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4 text-xs">
              {/* Company Name */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                  Company / Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Leela Palace Udaipur"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              {/* Category Dropdown (The 6 required categories) */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                  Couture Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                >
                  {VENDOR_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Point of Contact & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Point of Contact *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditya Rajawat"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 294 670 1234"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="contact@business.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              {/* Assigned Wedding Project */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                  Assigned Wedding Project
                </label>
                <select
                  value={formData.weddingId}
                  onChange={(e) => setFormData({ ...formData, weddingId: e.target.value })}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                >
                  {weddings.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.clientName}
                      {w.partnerName && w.partnerName !== 'Not Available' ? ` & ${w.partnerName}` : ''} ({w.location || w.destination})
                    </option>
                  ))}
                </select>
              </div>

              {/* Contract Fee & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Contracted Fee / Budget *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹1,20,00,000"
                    value={formData.contractedAmount}
                    onChange={(e) => setFormData({ ...formData, contractedAmount: e.target.value })}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                    Contract Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'Draft' | 'Contracted' | 'Paid in Full',
                      })
                    }
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Contracted">Contracted</option>
                    <option value="Paid in Full">Paid in Full</option>
                  </select>
                </div>
              </div>

              {/* Deliverables / Scope of Work */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold block">
                  Scope of Work &amp; Deliverables
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific scenography architecture, equipment, or staging provisions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-[4px] bg-[#FAF8F5] text-[#77736D] hover:text-[#171717] text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[4px] bg-[#171717] hover:bg-[#C6A66B] text-white text-[11px] font-medium uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  {editingVendor ? 'Save Changes' : 'Contract Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
