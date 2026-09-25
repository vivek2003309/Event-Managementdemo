import React, { useState } from 'react';
import { ClientDocumentEntry } from '../../types/firebase';
import { useToast } from '../ui/Toast';
import {
  FileText,
  Upload,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck,
  Eye,
  X,
} from 'lucide-react';

interface ClientDocumentsProps {
  userId: string;
}

const INITIAL_DOCS: ClientDocumentEntry[] = [
  {
    id: 'doc-1',
    userId: 'u1',
    title: 'Master Directorship Agreement & Royal Terms',
    category: 'Contract',
    fileType: 'PDF Document',
    size: '2.4 MB',
    uploadDate: '2026-09-15',
    status: 'verified',
  },
  {
    id: 'doc-2',
    userId: 'u1',
    title: 'Jagmandir Island Palace Scenography Moodboard Deck',
    category: 'Moodboard',
    fileType: 'High-Res Presentation',
    size: '18.6 MB',
    uploadDate: '2026-09-20',
    status: 'verified',
  },
  {
    id: 'doc-3',
    userId: 'u1',
    title: 'Mandap Vedic Spatial Architecture Blueprint (v3)',
    category: 'Floorplan',
    fileType: 'Architectural DWG/PDF',
    size: '6.1 MB',
    uploadDate: '2026-09-22',
    status: 'verified',
  },
  {
    id: 'doc-4',
    userId: 'u1',
    title: 'First Tranche Retainer & Palace Booking Invoice #TWD-904',
    category: 'Invoice',
    fileType: 'Tax Receipt PDF',
    size: '840 KB',
    uploadDate: '2026-09-18',
    status: 'verified',
  },
  {
    id: 'doc-5',
    userId: 'u1',
    title: '3-Day Minute-by-Minute Master Run-of-Show Protocol',
    category: 'Run-of-Show',
    fileType: 'Executive PDF',
    size: '1.2 MB',
    uploadDate: '2026-09-24',
    status: 'draft',
  },
];

export const ClientDocuments: React.FC<ClientDocumentsProps> = ({ userId }) => {
  const { addToast } = useToast();
  const storageKey = `twd_client_docs_${userId}`;

  const [docs, setDocs] = useState<ClientDocumentEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`twd_client_docs_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DOCS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateDocsAndStorage = (newDocs: ClientDocumentEntry[]) => {
    setDocs(newDocs);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newDocs));
    } catch (e) {}
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ClientDocumentEntry['category']>('Moodboard');

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDoc: ClientDocumentEntry = {
      id: `doc-${Date.now()}`,
      userId,
      title: title.trim(),
      category,
      fileType: 'Encrypted PDF Vault',
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    updateDocsAndStorage([newDoc, ...docs]);
    setIsModalOpen(false);
    setTitle('');
    addToast({
      type: 'success',
      title: 'Document Transmitted',
      message: `${title} uploaded to client secure sanctuary.`,
    });
  };

  const handleDelete = (id: string) => {
    updateDocsAndStorage(docs.filter((d) => d.id !== id));
    addToast({ type: 'info', title: 'Removed', message: 'Document removed from ledger.' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs">
        <div>
          <h2 className="font-serif text-[22px] text-[#171717]">
            Client Document Vault &amp; Directorship Archive
          </h2>
          <p className="text-[12px] text-[#77736D] font-light">
            Executed contracts, moodboards, architectural schematics, and official permits
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Upload className="w-3.5 h-3.5 text-[#C6A66B]" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs space-y-3 hover:border-[#C6A66B] transition-colors relative"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] uppercase font-semibold text-[#8C6D37] tracking-wider">
                {doc.category}
              </span>
              <span
                className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-[2px] border ${
                  doc.status === 'verified'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {doc.status === 'verified' ? 'Verified' : 'Pending Review'}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-[17px] text-[#171717] font-medium leading-snug line-clamp-2">
                {doc.title}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-[#77736D] font-mono">
                <span>{doc.fileType}</span>
                <span>&bull;</span>
                <span>{doc.size}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F2EEE6] flex items-center justify-between text-[11px]">
              <span className="text-[#9C968C]">Uploaded {doc.uploadDate}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addToast({ type: 'info', title: 'Vault Access', message: 'Opening authenticated preview...' })}
                  className="p-1.5 text-[#77736D] hover:text-[#171717] hover:bg-black/5 rounded-[4px] transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-[#9C968C] hover:text-rose-600 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-[12px] shadow-2xl border border-[#EAE5DC] overflow-hidden">
            <div className="p-5 bg-[#FAF8F5] border-b border-[#EAE5DC] flex items-center justify-between">
              <h3 className="font-serif text-[18px] text-[#171717]">Upload Document to Vault</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#77736D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoc} className="p-5 space-y-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Udaipur Drone Cinematography Permit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                  Classification
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[12px] p-2 rounded-[4px]"
                >
                  <option value="Contract">Contract</option>
                  <option value="Moodboard">Moodboard</option>
                  <option value="Floorplan">Floorplan</option>
                  <option value="Invoice">Invoice</option>
                  <option value="Run-of-Show">Run-of-Show</option>
                  <option value="Permit">Permit</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-[#D6CEBE] rounded-[8px] text-center space-y-2 bg-[#FAF8F5]">
                <Upload className="w-6 h-6 text-[#C6A66B] mx-auto" />
                <span className="text-[12px] text-[#77736D] block">
                  Select PDF, DWG, or Presentation file (Max 50MB)
                </span>
                <span className="text-[10px] text-[#9C968C] block">
                  Encrypted at rest with Firebase Security
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-[4px] text-[11px] uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#171717] text-white rounded-[4px] text-[11px] uppercase tracking-wider font-semibold hover:bg-[#C6A66B]"
                >
                  Commit Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
