/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ClientAtelierVendorRoster Component
 * Client Sanctuary Assigned Vendors & Production Partners.
 * Displays live production vendors, contract status, and direct artisanal contacts.
 * Synchronized with "atelier_vendors".
 */

import React, { useState, useMemo } from 'react';
import { AtelierVendor } from '../../data/seedAtelierData';
import {
  Store,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles,
  Building,
  ShieldCheck,
  Search,
  Tag
} from 'lucide-react';

interface ClientAtelierVendorRosterProps {
  weddingId: string;
  weddingName: string;
  vendors: AtelierVendor[];
}

export const ClientAtelierVendorRoster: React.FC<ClientAtelierVendorRosterProps> = ({
  weddingId,
  weddingName,
  vendors,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          v.businessName.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.contactPerson.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [vendors, selectedCategory, searchQuery]);

  const categories = useMemo(() => {
    return Array.from(new Set(vendors.map((v) => v.category)));
  }, [vendors]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-[12px] p-5 sm:p-6 border border-[#C6A66B]/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#C6A66B]">
              Master Purveyors &amp; Artisans
            </span>
            <span className="text-white/20">&bull;</span>
            <span className="text-[11px] text-white/70">
              {vendors.length} Contracted Teams
            </span>
          </div>
          <h2 className="font-serif text-[22px] sm:text-[26px] font-normal text-white mt-0.5">
            Your Dedicated Production Partners
          </h2>
          <p className="text-[12px] text-stone-300 font-light mt-0.5 max-w-xl">
            Contracted palace venues, floral scenographers, Michelin chefs, and ARRI cinema crews under directorial orchestration.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-stone-800/80 border border-[#C6A66B]/30 text-stone-300 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-[#C6A66B]" />
          <span>Directorial Escrow Protected</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[8px] border border-[#EAE5DC] p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77736D]" />
          <input
            type="text"
            placeholder="Search vendor, artist, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#D6CEBE] text-[12px] pl-8 pr-3 py-1.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] uppercase tracking-wider text-[#77736D] font-semibold">
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#D6CEBE] text-[11px] py-1 px-2.5 rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
          >
            <option value="all">All Disciplines ({vendors.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-white p-12 rounded-[10px] border border-[#EAE5DC] text-center space-y-2">
            <Store className="w-8 h-8 text-[#C6A66B] mx-auto stroke-[1.5]" />
            <h4 className="font-serif text-[18px] text-[#171717]">No Vendors in Category</h4>
            <p className="text-[12px] text-[#77736D]">
              Clear your search or category filter to view all assigned purveyors.
            </p>
          </div>
        ) : (
          filtered.map((v) => (
            <div
              key={v.id}
              className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] hover:border-[#C6A66B]/50 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-[3px] bg-[#FAF8F5] border border-[#EAE5DC] text-[10px] font-semibold text-[#8C6D37] uppercase tracking-wider mb-1">
                    {v.category}
                  </span>
                  <h3 className="font-serif text-[18px] text-[#171717] font-normal leading-tight">
                    {v.businessName}
                  </h3>
                </div>

                {v.status === 'Paid in Full' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Paid in Full
                  </span>
                )}
                {v.status === 'Contracted' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF8F5] text-[#8C6D37] border border-[#D6CEBE] shrink-0">
                    <Sparkles className="w-3 h-3 text-[#C6A66B]" />
                    Contracted
                  </span>
                )}
                {v.status === 'Draft' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-700 border border-gray-200 shrink-0">
                    <Clock className="w-3 h-3 text-gray-500" />
                    Draft Terms
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-[#55524E]">
                <div className="flex items-center justify-between">
                  <span className="text-[#77736D]">Lead Artisan:</span>
                  <span className="font-medium text-[#171717]">{v.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#77736D]">Direct Contact:</span>
                  <div className="flex items-center gap-2">
                    <a href={`tel:${v.phone}`} className="font-mono text-[#171717] hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#C6A66B]" />
                      {v.phone}
                    </a>
                  </div>
                </div>
                {v.contractedAmount && (
                  <div className="flex items-center justify-between pt-1 border-t border-[#F2EEE6]">
                    <span className="text-[#77736D]">Allocated Budget:</span>
                    <span className="font-serif font-medium text-[#8C6D37] text-[13px]">
                      {typeof v.contractedAmount === 'number'
                        ? `₹${v.contractedAmount.toLocaleString('en-IN')}`
                        : v.contractedAmount}
                    </span>
                  </div>
                )}
              </div>

              {v.notes && (
                <div className="p-2.5 rounded-[4px] bg-[#FAF8F5] border border-[#EAE5DC] text-[11px] text-[#55524E] leading-relaxed">
                  <span className="font-semibold text-[#171717] block text-[10px] uppercase tracking-wider mb-0.5">
                    Production Scope:
                  </span>
                  {v.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
