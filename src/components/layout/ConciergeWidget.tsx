import React, { useState } from 'react';
import { Sparkles, X, Send, ArrowRight } from 'lucide-react';
import { useRouter } from '../../lib/router';

export const ConciergeWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Namaste. I am your Wedding Dreams Curatorial Assistant. How may I assist your celebration vision today?',
    },
  ]);
  const { navigate } = useRouter();

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const newMessages = [...messages, { sender: 'user' as const, text }];
    setMessages(newMessages);
    setInputMessage('');

    // Generate bespoke curatorial response based on query
    setTimeout(() => {
      let reply = 'Our master directorship would be delighted to orchestrate this for you. Let us curate a dedicated proposal.';
      const lower = text.toLowerCase();

      if (lower.includes('budget') || lower.includes('cost')) {
        reply = 'For our heritage palace takeovers, our optimal allocation framework generally directs 25% to palace privatization, 20% to culinary atelier, 20% to florals and scenography, 10% to 35mm fine art cinema, and 25% to entertainment and reserve logistics.';
      } else if (lower.includes('itinerary') || lower.includes('schedule') || lower.includes('3-day')) {
        reply = 'A quintessential 3-day palace narrative begins with a Welcome Sundowner at sunset, followed by a royal Mehendi High Tea, an electrified Grand Sangeet evening, Haldi poolside carnival, traditional sunset Pheras, and an after-hours speakeasy transition.';
      } else if (lower.includes('udaipur') || lower.includes('jaipur') || lower.includes('palace') || lower.includes('rajasthan')) {
        reply = 'For royal celebrations, we recommend Jagmandir Island Palace or Taj Lake Palace in Udaipur for floating island exclusivity, or Rambagh Palace and Alila Fort Bishangarh in Jaipur for grand bastion architecture.';
      } else if (lower.includes('moodboard') || lower.includes('pastel') || lower.includes('mehendi')) {
        reply = 'Our Botanical & Modern Minimalist archetypes pair delicate dusty rose, washed French linen, hand-threaded mogra garlands, and antique hammered brass to create a tranquil sanctuary.';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Concierge Drawer Panel */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-[12px] shadow-[0_20px_50px_rgba(23,23,23,0.18)] border border-[#EAE5DC] overflow-hidden flex flex-col animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-[#FCFAF6] border-b border-[#EAE5DC] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#171717] text-[#C6A66B] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif text-[16px] font-normal text-[#171717]">
                  Curatorial Assistant
                </h4>
                <span className="text-[10px] text-[#C6A66B] uppercase tracking-[0.18em] block">
                  Atelier Directorship
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-[#77736D] hover:text-[#171717] hover:bg-[#F0EEE8] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="p-4 max-h-72 overflow-y-auto space-y-3 bg-[#F8F5EF]/40 text-[13px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-[6px] leading-relaxed ${
                  msg.sender === 'bot'
                    ? 'bg-white border border-[#EAE5DC] text-[#252525] shadow-xs'
                    : 'bg-[#171717] text-[#F8F5EF] ml-6'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="p-3 border-t border-[#EAE5DC] bg-white space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#9C968C] block mb-1">
              Curatorial Inquiries:
            </span>
            <button
              onClick={() => handleSend('Plan my budget allocation')}
              className="w-full text-left p-2 rounded-[4px] bg-[#F8F5EF] hover:bg-[#F0EEE8] text-[12px] text-[#252525] transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>💰 Plan my budget allocation</span>
              <ArrowRight className="w-3 h-3 text-[#C6A66B]" />
            </button>
            <button
              onClick={() => handleSend('Recommend palace venues in Rajasthan')}
              className="w-full text-left p-2 rounded-[4px] bg-[#F8F5EF] hover:bg-[#F0EEE8] text-[12px] text-[#252525] transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>🏰 Recommend palace venues in Rajasthan</span>
              <ArrowRight className="w-3 h-3 text-[#C6A66B]" />
            </button>
            <button
              onClick={() => navigate('/wedding-style')}
              className="w-full text-left p-2 rounded-[4px] bg-[#F9F5EB] hover:bg-[#F4ECE0] text-[12px] text-[#745A27] transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>✨ Take 60-Sec Style Diagnostic</span>
              <ArrowRight className="w-3 h-3 text-[#C6A66B]" />
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-[#EAE5DC] bg-[#FCFAF6] flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about your celebration..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-white text-[#252525] placeholder:text-[#9C968C] text-[13px] px-3 py-2 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B]"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-[4px] bg-[#171717] text-[#C6A66B] hover:bg-[#2D2D2D] transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2.5 px-4.5 py-3 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-[0.16em] shadow-[0_12px_32px_rgba(23,23,23,0.25)] hover:bg-[#2D2D2D] hover:scale-[1.02] transition-all cursor-pointer border border-[#EAE5DC]/30 select-none"
      >
        <Sparkles className="w-4 h-4 text-[#C6A66B] group-hover:rotate-12 transition-transform" />
        <span>Wedding Concierge</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] animate-pulse" />
      </button>
    </div>
  );
};
