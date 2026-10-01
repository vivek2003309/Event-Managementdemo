import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { ShieldCheck, Copy, Check, Send, Sparkles, Key, Mail, Globe, ExternalLink } from 'lucide-react';

interface ClientCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientEmail: string;
  clientName: string;
  tempPassword: string;
  weddingId: string;
  weddingName: string;
}

export const ClientCredentialsModal: React.FC<ClientCredentialsModalProps> = ({
  isOpen,
  onClose,
  clientEmail,
  clientName,
  tempPassword,
  weddingId,
  weddingName,
}) => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const loginUrl = `${window.location.origin}/login`;
  const whatsappMessage = `Congratulations ${clientName}! Your Wedding Dreams Client Sanctuary for '${weddingName}' is now active.\n\nPortal URL: ${loginUrl}\nEmail: ${clientEmail}\nAccess Key / Password: ${tempPassword}\n\nPlease sign in to view your itinerary, budget, and guest RSVP ledger.`;

  const handleCopy = () => {
    const textToCopy = `Portal URL: ${loginUrl}\nEmail: ${clientEmail}\nPassword: ${tempPassword}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Credentials Copied',
      message: 'Sanctuary access keys copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendWhatsAppOrEmail = () => {
    setEmailSent(true);
    const encoded = encodeURIComponent(whatsappMessage);
    // Open WhatsApp or mailto
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    addToast({
      type: 'success',
      title: 'Transmission Dispatched',
      message: 'Welcome briefing and access credentials initiated.',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#171717] text-[#C6A66B] flex items-center justify-center mx-auto border border-[#C6A66B]/30 shadow-inner">
            <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-[#FAF8F5] border border-[#EAE5DC] text-[10px] uppercase tracking-wider font-semibold text-[#8C6D37]">
            <Sparkles className="w-3 h-3 text-[#C6A66B]" />
            <span>Controlled Client Sanctuary Access</span>
          </div>

          <h3 className="font-serif text-[26px] text-[#171717] font-normal">
            Credentials Generated
          </h3>
          <p className="text-[12px] text-[#77736D] max-w-sm mx-auto">
            Lead successfully converted to wedding project <strong className="text-[#171717]">{weddingName}</strong> with secure client portal access issued.
          </p>
        </div>

        {/* Credentials Box */}
        <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-[8px] border border-[#EAE5DC] space-y-3 font-mono text-[12px]">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DC]">
            <span className="text-[#77736D] text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-sans font-medium">
              <Mail className="w-3.5 h-3.5 text-[#C6A66B]" /> Client Email
            </span>
            <span className="text-[#171717] font-semibold">{clientEmail || 'client@theweddingdreams.com'}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DC]">
            <span className="text-[#77736D] text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-sans font-medium">
              <Key className="w-3.5 h-3.5 text-[#C6A66B]" /> Temporary Passkey
            </span>
            <span className="text-[#C6A66B] font-bold text-[14px] bg-white px-2 py-0.5 rounded-[4px] border border-[#D6CEBE]">
              {tempPassword}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#77736D] text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-sans font-medium">
              <Globe className="w-3.5 h-3.5 text-[#C6A66B]" /> Sanctuary Login URL
            </span>
            <a
              href={loginUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#8C6D37] hover:underline flex items-center gap-1 font-sans"
            >
              <span>{loginUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleCopy}
            className="flex-1 justify-center cursor-pointer"
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#C6A66B]" />}
          >
            {copied ? 'Copied to Clipboard' : 'Copy Credentials'}
          </Button>

          <Button
            variant="accent"
            size="md"
            onClick={handleSendWhatsAppOrEmail}
            className="flex-1 justify-center cursor-pointer"
            leftIcon={<Send className="w-4 h-4" />}
          >
            {emailSent ? 'Briefing Dispatched' : 'Send Welcome Briefing'}
          </Button>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-[12px] text-[#77736D] hover:text-[#171717] underline cursor-pointer"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </Modal>
  );
};
