import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../../lib/router';
import {
  ConciergeService,
  ChatMessage,
  LeadCaptureData,
  ExtractedLeadSummary,
} from '../../services/conciergeService';
import {
  Sparkles,
  X,
  Send,
  ArrowRight,
  RotateCcw,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Users,
  Wallet,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Compass,
  Clock,
  ChevronDown,
  Minimize2,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface AIWeddingConciergeProps {
  onOpenLetTalk?: () => void;
}

const QUICK_ACTIONS = [
  { label: 'Plan My Wedding', query: 'I would like to start planning my wedding step by step.' },
  { label: 'Create My Timeline', query: 'Can you help me design an ideal multi-day wedding timeline and run-of-show?' },
  { label: 'Estimate My Budget', query: 'How should I structure my indicative wedding budget across venue, decor, catering, and entertainment?' },
  { label: 'Find My Wedding Style', query: 'Can you help me discover the ideal design style and aesthetic for my celebration?' },
  { label: 'Explore Destinations', query: 'What are the finest luxury wedding destinations in India between Udaipur, Jaipur, and Goa?' },
  { label: 'Talk to an Expert', query: 'I would like to speak directly with a Wedding Dreams senior director.' },
];

export const AIWeddingConcierge: React.FC<AIWeddingConciergeProps> = ({ onOpenLetTalk }) => {
  const { navigate } = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'lead'>('chat');
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => ConciergeService.getStoredMessages());
  const [leadForm, setLeadForm] = useState<LeadCaptureData>(() => ({
    name: '',
    phone: '',
    email: '',
    weddingDate: '',
    location: 'Udaipur',
    guestCount: 250,
    budget: '₹50L–₹1Cr',
    notes: '',
    ...ConciergeService.getStoredLead(),
  }));
  const [leadSaved, setLeadSaved] = useState<boolean>(false);
  const [leadSummary, setLeadSummary] = useState<ExtractedLeadSummary | null>(null);
  const [isExtractingLead, setIsExtractingLead] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab, isLoading]);

  // Save messages on update
  useEffect(() => {
    ConciergeService.saveMessages(messages);
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, activeTab]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await ConciergeService.sendMessage(newHistory, leadForm);

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        offerExpert: response.offerExpert,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If user provided substantive details, extract lead parameters in background
      if (newHistory.length >= 3 && !leadSaved) {
        setIsExtractingLead(true);
        ConciergeService.extractLeadFromConversation(newHistory).then((extracted) => {
          if (extracted) {
            setLeadSummary(extracted);
            // Autofill leadForm if fields were discovered
            setLeadForm((prev) => ({
              ...prev,
              name: extracted.name || prev.name,
              phone: extracted.phone || prev.phone,
              email: extracted.email || prev.email,
              weddingDate: extracted.weddingDate || prev.weddingDate,
              location: extracted.location || prev.location,
              guestCount: extracted.guestCount || prev.guestCount,
              budget: extracted.budget || prev.budget,
            }));
          }
          setIsExtractingLead(false);
        });
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'Namaste. Our curatorial concierge system is momentarily experiencing high demand. Please click "Retry" or connect directly with our directors.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    // Find last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all conversation history with the Wedding Concierge?')) {
      ConciergeService.clearHistory();
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content:
            'Namaste. Conversation refreshed. How may I assist in orchestrating your celebration today?',
          timestamp: new Date().toISOString(),
        },
      ]);
      setLeadSummary(null);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ConciergeService.saveLead(leadForm);
    setLeadSaved(true);

    // Persist lead to Firestore asynchronously
    try {
      import('../../services/firestoreService').then(({ FirestoreService }) => {
        FirestoreService.createLead({
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          weddingDate: leadForm.weddingDate,
          location: leadForm.location,
          guestCount: Number(leadForm.guestCount) || 250,
          budget: leadForm.budget,
          source: 'AI Wedding Concierge',
          status: 'new',
          notes: leadForm.notes,
        }).catch((err) => console.warn('Firestore lead save from concierge:', err));
      });
    } catch (e) {
      console.warn('Firestore import error:', e);
    }

    // Append confirmation in chat

    const leadConfirmMessage: ChatMessage = {
      id: `lead-ack-${Date.now()}`,
      role: 'assistant',
      content: `Thank you, ${leadForm.name || 'esteemed guest'}. Your celebration parameters for ${leadForm.location} with ~${leadForm.guestCount} guests have been logged into our master ledger. Our lead directorship team will review your timeline and connect with you shortly.`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, leadConfirmMessage]);
    setActiveTab('chat');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#171717] text-white shadow-[0_8px_30px_rgba(23,23,23,0.35)] hover:bg-[#252525] hover:scale-105 active:scale-95 transition-all border border-[#C6A66B]/50 cursor-pointer group"
        aria-label="Open AI Wedding Concierge"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A66B] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C6A66B]" />
        </span>
        <Sparkles className="w-4 h-4 text-[#C6A66B] transition-transform group-hover:rotate-12" />
        <span className="text-[13px] font-medium tracking-wide">
          Wedding Concierge
        </span>
      </button>

      {/* Concierge Dialog Panel */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-22 sm:right-6 z-50 w-full sm:w-[420px] sm:max-w-[calc(100vw-3rem)] h-full sm:h-[620px] bg-white sm:rounded-[12px] shadow-[0_24px_64px_rgba(23,23,23,0.28)] border border-[#EAE5DC] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#171717] text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[6px] bg-[#222222] border border-[#C6A66B]/40 flex items-center justify-center text-[#C6A66B] shadow-inner">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-[17px] text-white font-normal leading-tight">
                    Wedding Concierge
                  </h3>
                  <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-[2px] bg-[#C6A66B]/20 text-[#EAE5DC] border border-[#C6A66B]/30">
                    AI Director
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-white/60 font-light">
                    The Wedding Dreams Atelier
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Clear conversation"
                className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Clear chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close concierge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tab Bar (Chat vs Lead Capture Summary) */}
          <div className="flex border-b border-[#EAE5DC] bg-[#FAF8F5] px-4 shrink-0 text-[12px] font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`py-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-[#171717] text-[#171717] font-semibold'
                  : 'border-transparent text-[#77736D] hover:text-[#171717]'
              }`}
            >
              Curatorial Chat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lead')}
              className={`py-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'lead'
                  ? 'border-[#171717] text-[#171717] font-semibold'
                  : 'border-transparent text-[#77736D] hover:text-[#171717]'
              }`}
            >
              <span>Enquiry Dossier</span>
              {leadSaved && <Check className="w-3 h-3 text-[#10B981]" />}
            </button>
          </div>

          {/* TAB 1: Chat Experience */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#FDFBF7]">
              {/* Quick Actions Scroll Bar */}
              <div className="px-3 py-2 bg-white border-b border-[#EAE5DC] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-[#9C968C] font-semibold pl-1 whitespace-nowrap">
                  Prompts:
                </span>
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      if (action.label === 'Plan My Wedding') {
                        navigate('/plan-my-wedding');
                        setIsOpen(false);
                      } else if (action.label === 'Find My Wedding Style') {
                        navigate('/wedding-style');
                        setIsOpen(false);
                      } else if (action.label === 'Explore Destinations') {
                        navigate('/destinations');
                        setIsOpen(false);
                      } else if (action.label === 'Talk to an Expert') {
                        if (onOpenLetTalk) {
                          onOpenLetTalk();
                          setIsOpen(false);
                        } else {
                          handleSendMessage(action.query);
                        }
                      } else {
                        handleSendMessage(action.query);
                      }
                    }}
                    className="px-2.5 py-1 rounded-[4px] bg-[#F8F5EF] hover:bg-[#F0ECE2] text-[#252525] text-[11px] whitespace-nowrap font-medium transition-colors border border-[#EAE5DC] cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Chat Message Scroll Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-[8px] text-[13px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#171717] text-white shadow-xs rounded-br-xs'
                          : msg.isError
                          ? 'bg-[#FDF2F2] border border-[#F2C0C0] text-[#BA1A1A] rounded-bl-xs'
                          : 'bg-white border border-[#EAE5DC] text-[#252525] shadow-xs rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.content}</div>

                      {/* Error State with Retry Button */}
                      {msg.isError && (
                        <div className="mt-2.5 pt-2 border-t border-[#F2C0C0] flex items-center justify-between">
                          <span className="text-[11px] text-[#BA1A1A]">Network timeout</span>
                          <button
                            type="button"
                            onClick={handleRetry}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#BA1A1A] hover:underline cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        </div>
                      )}

                      {/* Explicit "Would you like to connect with a Wedding Expert?" Callout */}
                      {msg.offerExpert && (
                        <div className="mt-3 pt-3 border-t border-[#EAE5DC] bg-[#FAF8F5] -mx-3.5 -mb-3.5 p-3 rounded-b-[7px]">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-1">
                            Directorship Connection
                          </span>
                          <p className="text-[12px] text-[#55524E] mb-2.5">
                            Would you like to connect with a Wedding Expert for customized venue calendars and private tastings?
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (onOpenLetTalk) {
                                  onOpenLetTalk();
                                  setIsOpen(false);
                                } else {
                                  setActiveTab('lead');
                                }
                              }}
                              className="px-3 py-1.5 rounded-[4px] bg-[#171717] text-white text-[11px] font-medium hover:bg-[#252525] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>Connect with Expert</span>
                              <ArrowRight className="w-3 h-3 text-[#C6A66B]" />
                            </button>

                            <a
                              href="https://wa.me/919820048210?text=Namaste%2C%20I%20am%20chatting%20with%20The%20Wedding%20Dreams%20AI%20Concierge%20and%20would%20like%20to%20speak%20with%20a%20human%20expert."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-[4px] bg-[#25D366] text-white text-[11px] font-medium hover:bg-[#20ba5a] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-[#9C968C] mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}

                {/* Loading State Bubble */}
                {isLoading && (
                  <div className="flex flex-col items-start">
                    <div className="bg-white border border-[#EAE5DC] p-3 rounded-[8px] rounded-bl-xs text-[12px] text-[#77736D] flex items-center gap-2 shadow-xs">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="font-light italic text-[11px]">Curating response...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-[#EAE5DC] shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about venues, timelines, services, or budgets..."
                    className="flex-1 bg-[#F8F5EF] text-[#252525] text-[13px] py-2.5 px-3.5 rounded-[6px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B] focus:bg-white transition-all"
                    disabled={isLoading}
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-2.5 rounded-[6px] bg-[#171717] text-[#C6A66B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#252525] transition-all cursor-pointer shrink-0 shadow-xs"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-[10px] text-[#9C968C] text-center mt-2 leading-tight">
                  Discreet &bull; Indicative guidance only. Real tariffs confirmed upon direct review.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Lead Capture & Structured Dossier Summary */}
          {activeTab === 'lead' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-[#FDFBF7]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C6D37] block mb-1">
                  Enquiry Dossier &bull; Directorship Link
                </span>
                <h4 className="font-serif text-[20px] text-[#171717] font-normal leading-snug">
                  Connect with a Wedding Expert
                </h4>
                <p className="text-[12px] text-[#55524E] font-light leading-relaxed mt-1">
                  Share your celebration coordinates. Our senior directors review every enquiry under complete client discretion.
                </p>
              </div>

              {/* Structured Lead Summary Extracted from Chat if available */}
              {leadSummary && (
                <div className="p-3.5 rounded-[6px] bg-[#FAF8F5] border border-[#C6A66B]/40 shadow-xs">
                  <div className="flex items-center gap-2 text-[#8C6D37] text-[11px] font-semibold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
                    <span>Auto-Extracted from Conversation</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#252525]">
                    <div>
                      <span className="text-[#77736D] block">Location:</span>
                      <strong className="font-medium">{leadSummary.location || 'Pending'}</strong>
                    </div>
                    <div>
                      <span className="text-[#77736D] block">Target Date:</span>
                      <strong className="font-medium">{leadSummary.weddingDate || 'Pending'}</strong>
                    </div>
                    <div>
                      <span className="text-[#77736D] block">Guests:</span>
                      <strong className="font-medium">{leadSummary.guestCount ? `${leadSummary.guestCount} Guests` : 'Pending'}</strong>
                    </div>
                    <div>
                      <span className="text-[#77736D] block">Budget:</span>
                      <strong className="font-medium">{leadSummary.budget || 'Pending'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Lead Capture Form */}
              <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full bg-white text-[13px] py-2 px-3 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="+91 98200 00000"
                      className="w-full bg-white text-[13px] py-2 px-3 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="radhika@domain.com"
                      className="w-full bg-white text-[13px] py-2 px-3 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={leadForm.weddingDate}
                      onChange={(e) => setLeadForm({ ...leadForm, weddingDate: e.target.value })}
                      className="w-full bg-white text-[13px] py-2 px-3 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                      Destination
                    </label>
                    <select
                      value={leadForm.location}
                      onChange={(e) => setLeadForm({ ...leadForm, location: e.target.value })}
                      className="w-full bg-white text-[13px] py-2 px-3 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B]"
                    >
                      <option value="Udaipur">Udaipur, Rajasthan</option>
                      <option value="Jaipur">Jaipur, Rajasthan</option>
                      <option value="Goa">Goa Coastal Sanctuary</option>
                      <option value="Delhi NCR">Delhi NCR Metropolitan</option>
                      <option value="Other">Other Global Enclave</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                      Guest Count
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={2000}
                      value={leadForm.guestCount}
                      onChange={(e) => setLeadForm({ ...leadForm, guestCount: e.target.value })}
                      className="w-full bg-white text-[13px] py-2 px-3 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                      Target Budget
                    </label>
                    <select
                      value={leadForm.budget}
                      onChange={(e) => setLeadForm({ ...leadForm, budget: e.target.value })}
                      className="w-full bg-white text-[13px] py-2 px-3 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B]"
                    >
                      <option value="₹10–25L">₹10–25 Lakhs</option>
                      <option value="₹25–50L">₹25–50 Lakhs</option>
                      <option value="₹50L–₹1Cr">₹50 Lakhs – ₹1 Crore</option>
                      <option value="₹1Cr+">₹1 Crore +</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-[4px] bg-[#171717] text-white text-[13px] font-medium hover:bg-[#252525] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Log Dossier &bull; Request Private Call</span>
                    <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
                  </button>
                </div>
              </form>

              {leadSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[6px] text-[12px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dossier saved to master records.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
