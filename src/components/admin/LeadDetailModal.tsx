import React, { useState } from 'react';
import { LeadDocument, LeadStatus, WeddingPlanDocument } from '../../types/firebase';
import { generateLeadAISummary } from '../../services/leadSummaryService';
import { FirestoreService } from '../../services/firestoreService';
import { useToast } from '../ui/Toast';
import {
  X,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Wallet,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  Send,
  Building,
  Tag,
  ExternalLink,
  AlertCircle,
  HelpCircle,
  UserCheck,
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: LeadDocument;
  plan?: WeddingPlanDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: (updatedLead: LeadDocument) => void;
  adminName?: string;
}

const STATUS_CONFIG: Record<
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

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  plan,
  isOpen,
  onClose,
  onLeadUpdated,
  adminName = 'Director',
}) => {
  const { addToast } = useToast();
  const [currentLead, setCurrentLead] = useState<LeadDocument>(lead);
  const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState(lead.followUpDate || '');
  const [savingStatus, setSavingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'plan' | 'notes'>('details');

  if (!isOpen) return null;

  const aiSummary = generateLeadAISummary(currentLead, plan);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!currentLead.id) return;
    setSavingStatus(true);
    try {
      await FirestoreService.updateLead(currentLead.id, { status: newStatus });
      const updated: LeadDocument = {
        ...currentLead,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      setCurrentLead(updated);
      onLeadUpdated(updated);
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Lead transitioned to "${STATUS_CONFIG[newStatus]?.label || newStatus}".`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not modify lead status in Firestore.',
      });
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveFollowUp = async (dateVal: string) => {
    if (!currentLead.id) return;
    setFollowUpDate(dateVal);
    try {
      await FirestoreService.updateLead(currentLead.id, { followUpDate: dateVal });
      const updated: LeadDocument = { ...currentLead, followUpDate: dateVal };
      setCurrentLead(updated);
      onLeadUpdated(updated);
      addToast({
        type: 'success',
        title: 'Follow-up Scheduled',
        message: `Follow-up set for ${dateVal}.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save follow-up date.',
      });
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !currentLead.id) return;

    try {
      await FirestoreService.addLeadNote(currentLead.id, newNote.trim(), adminName);
      const newNoteItem = {
        id: `note-${Date.now()}`,
        text: newNote.trim(),
        author: adminName,
        createdAt: new Date().toISOString(),
      };
      const updatedNotesList = [newNoteItem, ...(currentLead.notesList || [])];
      const updated: LeadDocument = {
        ...currentLead,
        notes: newNote.trim(),
        notesList: updatedNotesList,
      };
      setCurrentLead(updated);
      onLeadUpdated(updated);
      setNewNote('');
      addToast({
        type: 'success',
        title: 'Note Logged',
        message: 'Directorial observation saved to Firestore.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not save note.',
      });
    }
  };

  const statusStyle = STATUS_CONFIG[currentLead.status] || STATUS_CONFIG.new;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-3xl rounded-[12px] shadow-2xl border border-[#EAE5DC] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE5DC] bg-[#FAF8F5] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-[3px] border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                {statusStyle.label}
              </span>
              <span className="text-[11px] font-mono text-[#8C6D37] bg-white px-2 py-0.5 rounded-[3px] border border-[#EAE5DC]">
                ID: {currentLead.id?.slice(0, 8) || 'LEAD'}
              </span>
              {currentLead.source && (
                <span className="text-[10px] text-[#77736D] uppercase tracking-wider">
                  via {currentLead.source}
                </span>
              )}
            </div>

            <h2 className="font-serif text-[22px] sm:text-[26px] text-[#171717] font-normal leading-tight">
              {currentLead.name}
            </h2>
            <div className="flex items-center gap-4 text-[12px] text-[#77736D]">
              <span>Created {new Date(currentLead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              {currentLead.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C6A66B]" />
                  {currentLead.location}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#77736D] hover:text-[#171717] hover:bg-black/5 rounded-[4px] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* AI-Generated Lead Summary Section */}
          <div className="bg-[#FAF8F5] border border-[#C6A66B]/40 rounded-[8px] p-4.5 relative overflow-hidden shadow-xs">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#C6A66B]" />
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#8C6D37]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8C6D37]">
                AI-Generated Executive Summary
              </span>
            </div>
            <p className="text-[13px] sm:text-[14px] text-[#171717] leading-relaxed font-light pl-0.5">
              "{aiSummary}"
            </p>
            <div className="mt-2 text-[10px] text-[#9C968C] flex items-center gap-1.5">
              <span>Strictly grounded from submitted parameters &bull; Zero simulated facts</span>
            </div>
          </div>

          {/* Quick Action Bar: Status & Follow-up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FDFBF7] p-4 rounded-[8px] border border-[#EAE5DC]">
            {/* Status Change */}
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                Pipeline Status
              </label>
              <select
                value={currentLead.status}
                disabled={savingStatus}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="w-full bg-white border border-[#D6CEBE] text-[12px] font-medium py-2 px-3 rounded-[4px] focus:outline-none focus:border-[#C6A66B] cursor-pointer"
              >
                <option value="new">New Inquiry</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal Sent</option>
                <option value="won">Won & Contracted</option>
                <option value="lost">Lost / Passed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                Next Directorial Follow-Up
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => handleSaveFollowUp(e.target.value)}
                  className="w-full bg-white border border-[#D6CEBE] text-[12px] font-medium py-1.5 px-3 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#EAE5DC] gap-6 text-[12px] font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'details'
                  ? 'border-[#171717] text-[#171717] font-semibold'
                  : 'border-transparent text-[#77736D] hover:text-[#171717]'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>Celebration Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-[#171717] text-[#171717] font-semibold'
                  : 'border-transparent text-[#77736D] hover:text-[#171717]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>Notes & History ({currentLead.notesList?.length || (currentLead.notes ? 1 : 0)})</span>
            </button>

            {plan && (
              <button
                type="button"
                onClick={() => setActiveTab('plan')}
                className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'plan'
                    ? 'border-[#171717] text-[#171717] font-semibold'
                    : 'border-transparent text-[#77736D] hover:text-[#171717]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Wedding Plan Blueprint</span>
              </button>
            )}
          </div>

          {/* TAB 1: Details */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Card */}
                <div className="p-4 rounded-[6px] bg-[#FAF8F5] border border-[#EAE5DC] space-y-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C6D37] block">
                    Contact Coordinates
                  </span>
                  <div className="space-y-2 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#77736D] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#C6A66B]" />
                        Phone:
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${currentLead.phone}`}
                          className="font-mono text-[#171717] hover:underline"
                        >
                          {currentLead.phone}
                        </a>
                        <a
                          href={`https://wa.me/${currentLead.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-[2px] bg-[#25D366] text-white text-[10px] font-medium"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#77736D] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C6A66B]" />
                        Email:
                      </span>
                      <a
                        href={`mailto:${currentLead.email}`}
                        className="text-[#171717] font-mono text-[11px] hover:underline"
                      >
                        {currentLead.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Parameters Card */}
                <div className="p-4 rounded-[6px] bg-[#FAF8F5] border border-[#EAE5DC] space-y-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C6D37] block">
                    Event Parameters
                  </span>
                  <div className="space-y-2 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#77736D] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
                        Wedding Date:
                      </span>
                      <strong className="text-[#171717] font-medium">
                        {currentLead.weddingDate || 'Flexible / TBD'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#77736D] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#C6A66B]" />
                        Guest Roster:
                      </span>
                      <strong className="text-[#171717] font-medium">
                        ~{currentLead.guestCount || 250} Guests
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#77736D] flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-[#C6A66B]" />
                        Budget Range:
                      </span>
                      <strong className="text-[#171717] font-serif font-semibold text-[13px]">
                        {currentLead.budget || 'Custom Allocation'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Required */}
              <div className="p-4 rounded-[6px] bg-[#FAF8F5] border border-[#EAE5DC]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-2">
                  Commissioned Services
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentLead.services && currentLead.services.length > 0 ? (
                    currentLead.services.map((svc) => (
                      <span
                        key={svc}
                        className="px-2.5 py-1 rounded-[3px] bg-white border border-[#EAE5DC] text-[11px] text-[#171717] font-medium"
                      >
                        {svc}
                      </span>
                    ))
                  ) : (
                    <span className="text-[12px] text-[#77736D] italic">
                      Full-Service End-to-End Orchestration
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Notes */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#77736D] block">
                  Add Directorial Note / Consultation Update
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spoke with couple. Sent revised palace décor mood board..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 bg-white border border-[#D6CEBE] text-[12px] py-2 px-3 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#171717] text-[#F8F5EF] text-[11px] uppercase tracking-wider font-semibold rounded-[4px] hover:bg-[#C6A66B] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </div>
              </form>

              {/* Notes Timeline */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9C968C] block">
                  Historical Log
                </span>

                {currentLead.notesList && currentLead.notesList.length > 0 ? (
                  currentLead.notesList.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-white rounded-[6px] border border-[#EAE5DC] space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#77736D]">
                        <span className="font-semibold text-[#8C6D37]">{note.author || 'Director'}</span>
                        <span>{new Date(note.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[12px] text-[#171717] leading-relaxed font-light">
                        {note.text}
                      </p>
                    </div>
                  ))
                ) : currentLead.notes ? (
                  <div className="p-3 bg-white rounded-[6px] border border-[#EAE5DC] space-y-1">
                    <span className="text-[10px] font-semibold text-[#8C6D37]">Initial Notes</span>
                    <p className="text-[12px] text-[#171717] font-light leading-relaxed">
                      {currentLead.notes}
                    </p>
                  </div>
                ) : (
                  <p className="text-[12px] text-[#77736D] italic py-2">
                    No notes recorded yet. Add your first consultation observation above.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Associated Wedding Plan */}
          {activeTab === 'plan' && plan && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF8F5] rounded-[6px] border border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#8C6D37] block">
                    {plan.planNumber}
                  </span>
                  <h4 className="font-serif text-[18px] text-[#171717]">
                    {plan.celebrationType} in {plan.location}
                  </h4>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {plan.status}
                </span>
              </div>

              {plan.selectedFunctions && plan.selectedFunctions.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Functions & Ceremonies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.selectedFunctions.map((fn) => (
                      <span
                        key={fn}
                        className="px-2 py-0.5 rounded bg-white border border-[#EAE5DC] text-[11px]"
                      >
                        {fn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {plan.selectedServices && plan.selectedServices.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                    Requested Services
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.selectedServices.map((svc) => (
                      <span
                        key={svc}
                        className="px-2 py-0.5 rounded bg-white border border-[#EAE5DC] text-[11px]"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#EAE5DC] bg-[#FAF8F5] flex items-center justify-between">
          <div className="text-[11px] text-[#77736D]">
            {currentLead.followUpDate ? (
              <span className="flex items-center gap-1.5 text-[#8C6D37] font-medium">
                <Clock className="w-3.5 h-3.5" />
                Follow-up due: {currentLead.followUpDate}
              </span>
            ) : (
              <span>No follow-up pending</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] transition-colors cursor-pointer"
          >
            Close Lead
          </button>
        </div>
      </div>
    </div>
  );
};
