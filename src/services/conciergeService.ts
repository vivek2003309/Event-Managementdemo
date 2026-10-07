/**
 * The Wedding Dreams — Concierge Service
 * Communicates with the server-side Gemini API endpoints without exposing API keys.
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isError?: boolean;
  offerExpert?: boolean;
}

export interface LeadCaptureData {
  name: string;
  phone: string;
  email: string;
  weddingDate: string;
  location: string;
  guestCount: number | string;
  budget: string;
  notes?: string;
}

export interface ExtractedLeadSummary {
  name: string | null;
  phone: string | null;
  email: string | null;
  weddingDate: string | null;
  location: string | null;
  guestCount: number | null;
  budget: string | null;
  intentScore?: 'high' | 'medium' | 'low';
  summary?: string;
}

const CHAT_STORAGE_KEY = 'twd_concierge_chat_history';
const LEAD_STORAGE_KEY = 'twd_concierge_lead_data';

export class ConciergeService {
  /**
   * Retrieves saved conversation from localStorage
   */
  static getStoredMessages(): ChatMessage[] {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
    return [
      {
        id: 'initial-welcome',
        role: 'assistant',
        content:
          'Namaste. I am your Wedding Dreams AI Concierge. Whether you are envisioning a royal palace takeover in Udaipur, an intimate cliffside celebration in Goa, or need guidance on ceremonial timelines and indicative budgets, I am here to assist your vision. How may I begin shaping your celebration today?',
        timestamp: new Date().toISOString(),
      },
    ];
  }

  /**
   * Persists conversation history
   */
  static saveMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to persist chat messages:', e);
    }
  }

  /**
   * Clears saved conversation
   */
  static clearHistory(): void {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear chat history:', e);
    }
  }

  /**
   * Retrieves stored lead data
   */
  static getStoredLead(): Partial<LeadCaptureData> {
    try {
      const saved = localStorage.getItem(LEAD_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  }

  /**
   * Persists lead capture data
   */
  static saveLead(lead: LeadCaptureData): void {
    try {
      localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(lead));
    } catch (e) {}
  }

  /**
   * Sends user message to server-side Gemini endpoint
   */
  static async sendMessage(
    history: ChatMessage[],
    leadData?: Partial<LeadCaptureData>
  ): Promise<{ reply: string; offerExpert: boolean }> {
    const formatted = history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      content: m.content,
    }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const lastMsg = history[history.length - 1]?.content?.toLowerCase() || '';

    try {
      const response = await fetch('/api/concierge/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: formatted,
          leadData,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      return {
        reply: data.reply || "Namaste! Welcome to The Wedding Dreams Atelier. How may I assist you with your destination curation, venue selection, or wedding timeline today?",
        offerExpert: Boolean(data.offerExpert),
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.warn('ConciergeService.sendMessage fallback:', error?.message || error);

      let fallbackReply = "Namaste! I'd be delighted to assist you with your wedding planning details. You can also connect directly with our Creative Directors on WhatsApp or explore our planning tools right here.";
      if (lastMsg.includes('how are you') || lastMsg.includes('kaise ho') || lastMsg.includes('kya haal')) {
        fallbackReply = "I'm doing wonderful, thank you for asking! Hope your day is going well. As the concierge for The Wedding Dreams, I'm here to assist with everything from palace venues to wedding budgets. How can I help you curate your celebration today?";
      } else if (lastMsg.includes('hi') || lastMsg.includes('hello') || lastMsg.includes('hey') || lastMsg.includes('namaste')) {
        fallbackReply = "Namaste! Welcome to The Wedding Dreams Atelier. Whether you are exploring luxury destinations or curating wedding decor, I'm here to assist. What type of celebration are you dreaming of?";
      }

      return {
        reply: fallbackReply,
        offerExpert: true,
      };
    }
  }

  /**
   * Extracts structured lead parameters from conversation
   */
  static async extractLeadFromConversation(
    history: ChatMessage[]
  ): Promise<ExtractedLeadSummary | null> {
    try {
      const formatted = history.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const response = await fetch('/api/concierge/extract-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: formatted }),
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data.lead || null;
    } catch (e) {
      console.warn('Extract lead failed:', e);
      return null;
    }
  }
}
