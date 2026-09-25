import React, { useState } from 'react';
import { VendorDocument, VendorStatus } from '../../types/firebase';
import { FirestoreService } from '../../services/firestoreService';
import { formatRupees } from '../../services/budgetCalculatorService';
import { useToast } from '../ui/Toast';
import {
  Store,
  Plus,
  Trash2,
  Edit,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  DollarSign,
  Tag,
  Building,
  Camera,
  Palette,
  Music,
  X,
} from 'lucide-react';

interface ClientVendorsProps {
  vendors: VendorDocument[];
  userId: string;
  weddingId: string;
  onVendorsChanged: (vendors: VendorDocument[]) => void;
}

const STATUS_STYLE: Record<
  VendorStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  shortlisted: { label: 'Shortlisted', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  contacted: { label: 'In Contact', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  contracted: { label: 'Contracted', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  paid: { label: 'Retainer Paid', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
};

export const ClientVendors: React.FC<ClientVendorsProps> = ({
  vendors,
  userId,
  weddingId,
  onVendorsChanged,
}) => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorDocument | null>(null);

  // Form
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Décor & Florals');
  const [formContact, setFormContact] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formStatus, setFormStatus] = useState<VendorStatus>('contracted');
  const [formNotes, setFormNotes] = useState('');

  const openAddModal = () => {
    setEditingVendor(null);
    setFormName('');
    setFormCategory('Décor & Florals');
    setFormContact('');
    setFormPhone('');
    setFormAmount('');
    setFormStatus('contracted');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (v: VendorDocument) => {
    setEditingVendor(v);
    setFormName(v.businessName);
    setFormCategory(v.category);
    setFormContact(v.contactPerson || '');
    setFormPhone(v.phone || '');
    setFormAmount(v.contractedAmount ? String(v.contractedAmount) : '');
    setFormStatus(v.status);
    setFormNotes(v.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingVendor && editingVendor.id) {
      try {
        const updates: Partial<VendorDocument> = {
          businessName: formName.trim(),
          category: formCategory,
          contactPerson: formContact.trim(),
          phone: formPhone.trim(),
          contractedAmount: Number(formAmount) || 0,
          status: formStatus,
          notes: formNotes.trim(),
        };
        await FirestoreService.updateVendor(editingVendor.id, updates);
        const updated = vendors.map((v) =>
          v.id === editingVendor.id ? { ...v, ...updates } : v
        );
        onVendorsChanged(updated);
        setIsModalOpen(false);
        addToast({
          type: 'success',
          title: 'Vendor Updated',
          message: `${formName} records updated.`,
        });
      } catch (e) {
        addToast({ type: 'error', title: 'Error', message: 'Could not update vendor.' });
      }
    } else {
      try {
        const payload: Omit<VendorDocument, 'id' | 'createdAt'> = {
          userId,
          weddingId,
          businessName: formName.trim(),
          category: formCategory,
          contactPerson: formContact.trim(),
          phone: formPhone.trim(),
          contractedAmount: Number(formAmount) || 0,
          status: formStatus,
          notes: formNotes.trim(),
        };
        const newId = await FirestoreService.addVendor(payload);
        const newDoc: VendorDocument = {
          id: newId,
          ...payload,
          createdAt: new Date().toISOString(),
        };
        onVendorsChanged([...vendors, newDoc]);
        setIsModalOpen(false);
        addToast({
          type: 'success',
          title: 'Vendor Assigned',
          message: `${formName} added to commissioned directory.`,
        });
      } catch (e) {
        addToast({ type: 'error', title: 'Error', message: 'Could not assign vendor.' });
      }
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!window.confirm('Remove vendor from your celebration ledger?')) return;
    try {
      await FirestoreService.deleteVendor(id);
      onVendorsChanged(vendors.filter((v) => v.id !== id));
      addToast({
        type: 'info',
        title: 'Vendor Removed',
        message: 'Vendor unassigned.',
      });
    } catch (e) {
      addToast({ type: 'error', title: 'Error', message: 'Could not remove vendor.' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs">
        <div>
          <h2 className="font-serif text-[22px] text-[#171717]">
            Commissioned Artisans &amp; Vendor Partners
          </h2>
          <p className="text-[12px] text-[#77736D] font-light">
            Verified master suppliers, palace venues, and production ateliers assigned to your nuptials
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#C6A66B]" />
          <span>Assign Vendor</span>
        </button>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendors.map((vendor) => {
          const style = STATUS_STYLE[vendor.status] || STATUS_STYLE.contracted;
          return (
            <div
              key={vendor.id || vendor.businessName}
              className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-3 hover:border-[#C6A66B] transition-colors relative"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase font-semibold text-[#8C6D37] tracking-wider">
                  {vendor.category}
                </span>
                <span
                  className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-[2px] border ${style.bg} ${style.text} ${style.border}`}
                >
                  {style.label}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-[18px] text-[#171717] font-medium leading-snug">
                  {vendor.businessName}
                </h3>
                {vendor.contactPerson && (
                  <span className="text-[12px] text-[#77736D] block">
                    Contact: {vendor.contactPerson}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#F2EEE6] text-[12px]">
                {vendor.phone && (
                  <div className="flex items-center justify-between text-[#77736D]">
                    <span>Phone:</span>
                    <a href={`tel:${vendor.phone}`} className="font-mono text-[#171717] hover:underline">
                      {vendor.phone}
                    </a>
                  </div>
                )}
                {vendor.contractedAmount ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[#77736D]">Agreed Fee:</span>
                    <strong className="text-[#171717] font-serif">
                      {formatRupees(vendor.contractedAmount)}
                    </strong>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#F2EEE6] text-[11px]">
                <button
                  onClick={() => openEditModal(vendor)}
                  className="text-[#8C6D37] hover:underline font-medium cursor-pointer"
                >
                  Edit Coordinates
                </button>
                {vendor.id && (
                  <button
                    onClick={() => handleDeleteVendor(vendor.id!)}
                    className="text-[#9C968C] hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
        >
          <div className="bg-white w-full max-w-md rounded-[12px] shadow-2xl border border-[#EAE5DC] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#FAF8F5] border-b border-[#EAE5DC] flex items-center justify-between">
              <h3 className="font-serif text-[18px] text-[#171717]">
                {editingVendor ? 'Edit Vendor Dossier' : 'Assign New Vendor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#77736D] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="p-5 space-y-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Business / Atelier Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mewar Sound & Scenography"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Décor & Florals">Décor &amp; Florals</option>
                    <option value="Photography">Photography</option>
                    <option value="Catering">Catering</option>
                    <option value="Music & Entertainment">Music &amp; Entertainment</option>
                    <option value="Bridal Couture">Bridal Couture</option>
                    <option value="Transport & Fleet">Transport &amp; Fleet</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Contract Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as VendorStatus)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  >
                    <option value="shortlisted">Shortlisted</option>
                    <option value="contacted">In Contact</option>
                    <option value="contracted">Contracted</option>
                    <option value="paid">Retainer Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anand Rathore"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 00000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Contract Amount in INR (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 850000"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D6CEBE] rounded-[4px] text-[11px] uppercase tracking-wider text-[#77736D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#171717] text-[#F8F5EF] rounded-[4px] text-[11px] uppercase tracking-wider font-semibold hover:bg-[#C6A66B] transition-colors"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
