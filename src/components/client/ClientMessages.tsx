import React, { useState, useEffect, useRef } from 'react';
import { MessageDocument, UserRole } from '../../types/firebase';
import { FirestoreService } from '../../services/firestoreService';
import { useToast } from '../ui/Toast';
import {
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  Phone,
} from 'lucide-react';

interface ClientMessagesProps {
  userId: string;
  clientName: string;
}

const INITIAL_CONVERSATION: MessageDocument[] = [
  {
    id: 'm-1',
    userId: 'u1',
    senderId: 'director-1',
    senderName: 'Vivek (Lead Nuptial Director)',
    senderRole: 'admin',
    content:
      'Namaste! Welcome to your private wedding sanctuary. Our directorship team has completed the preliminary spatial layout for your Jagmandir mandap. How are you feeling about the rosewater fountain arrival concept?',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'm-2',
    userId: 'u1',
    senderId: 'client-1',
    senderName: 'Rahul & Priya',
    senderRole: 'client',
    content:
      'Namaste Vivek! We absolutely adored the fountain renders. Priya wanted to know if we could introduce gold brass diyas along the stone steps leading down to the lake promenade for the Sangeet evening.',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'm-3',
    userId: 'u1',
    senderId: 'director-1',
    senderName: 'Vivek (Lead Nuptial Director)',
    senderRole: 'admin',
    content:
      'Exquisite choice. We have commissioned master craftsmen from Jaipur to hand-chisel 500 brass lotus urulis with floating tea-lights and fragrant mogra petals. It will look celestial under the night stars.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export const ClientMessages: React.FC<ClientMessagesProps> = ({ userId, clientName }) => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<MessageDocument[]>(INITIAL_CONVERSATION);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load message history from Firestore
  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      if (!userId) return;
      setLoadingHistory(true);
      try {
        const stored = await FirestoreService.getUserMessages(userId);
        if (isMounted && stored && stored.length > 0) {
          const sorted = [...stored].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setMessages(sorted);
        }
      } catch (err) {
        console.warn('Could not fetch user messages from Firestore:', err);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    };

    loadMessages();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');
    setIsSending(true);

    const newMsg: MessageDocument = {
      id: `msg-${Date.now()}`,
      userId,
      senderId: userId,
      senderName: clientName || 'Rahul & Priya',
      senderRole: 'client',
      content: userText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      await FirestoreService.sendMessage({
        userId,
        senderId: userId,
        senderName: clientName || 'Rahul & Priya',
        senderRole: 'client',
        content: userText,
      });

      // Simulated instant concierge reply if asked
      setTimeout(() => {
        const reply: MessageDocument = {
          id: `reply-${Date.now()}`,
          userId,
          senderId: 'director-auto',
          senderName: 'Atelier Directorship Concierge',
          senderRole: 'admin',
          content:
            'Received with pleasure. Our production team in Udaipur has logged this note into your active run-of-show binder. We will present the revised floor plan during our Tuesday video review.',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, reply]);
      }, 1200);
    } catch (err) {
      console.warn('Message send warning:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#EAE5DC] shadow-xs flex flex-col h-[75vh] overflow-hidden animate-in fade-in duration-200">
      {/* Top Chat Header */}
      <div className="p-4 sm:p-5 border-b border-[#EAE5DC] bg-[#FAF8F5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#171717] text-[#C6A66B] flex items-center justify-center font-serif text-[15px] border border-[#C6A66B]/40">
            TWD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-[16px] text-[#171717] font-medium leading-none">
                Atelier Directorship Enclave
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[11px] text-[#77736D]">
              Direct line to Vivek &amp; Lead Scenographers
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#77736D] bg-white px-3 py-1.5 rounded-[4px] border border-[#EAE5DC]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D37]" />
          <span>Encrypted Client Channel</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FDFBF7]/60">
        {messages.map((m) => {
          const isMe = m.senderRole === 'client';
          return (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
                isMe ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-[#77736D] mb-1">
                <span className="font-semibold text-[#8C6D37]">{m.senderName}</span>
                <span>&bull;</span>
                <span>
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-[10px] text-[13px] leading-relaxed ${
                  isMe
                    ? 'bg-[#171717] text-[#F8F5EF] rounded-tr-none shadow-xs'
                    : 'bg-white text-[#171717] border border-[#EAE5DC] rounded-tl-none shadow-xs'
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-[#EAE5DC] flex gap-2">
        <input
          type="text"
          placeholder="Message your directorship team..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-[#FAF8F5] border border-[#D6CEBE] text-[13px] px-3.5 py-2.5 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
        />
        <button
          type="submit"
          disabled={isSending || !inputVal.trim()}
          className="px-5 py-2.5 bg-[#171717] text-[#F8F5EF] rounded-[4px] text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-[#C6A66B]" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
