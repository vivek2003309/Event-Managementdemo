import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client strictly on server side with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CONCIERGE_SYSTEM_INSTRUCTION = `You are the bespoke AI Concierge for 'The Wedding Dreams' (a luxury couture & scenography wedding house).

CRITICAL CONVERSATIONAL RULES:
1. Mirror the User's Language:
   - If user writes in Hindi / Hinglish (e.g. 'kya haal hai', 'namaste', 'kaise ho'), reply warmly in fluent, natural Hinglish.
   - If user writes in English (e.g. 'How are you?', 'Hi', 'What's up'), reply warmly in natural English.

2. Two-Step Conversational Pivot:
   - Step 1 (Acknowledge & Respond Warmly): If the user asks a casual, personal, or off-topic question ('how are you', 'tell me a joke', 'who are you', 'weather'), answer them warmly and politely first just like a friendly human (e.g., 'I am doing wonderful, thank you for asking! Hope you're having a lovely day.').
   - Step 2 (Gentle Atelier Invitation): In the very next line, naturally introduce your role and offer help (e.g., 'Main The Wedding Dreams atelier ka concierge hoon. Chahe aap royal destination wedding plan kar rahe ho, decor themes dekhni ho ya budget estimate karna ho—bataiye main aapki celebration mein kaise madad kar sakta hoon?').

3. Tone & Length:
   - Keep responses crisp, elegant, and friendly (under 3-4 sentences total).
   - Never sound robotic or cold. Be welcoming and poised.`;

// Intelligent Offline Rule Engine (Bulletproof Fallback)
function getIntelligentFallback(message: string): string {
  const clean = (message || '').toLowerCase().trim();

  // Small-talk 1: "how are you" / "kaise ho" / "kya haal"
  if (
    clean.includes('how are you') ||
    clean.includes('kaise ho') ||
    clean.includes('kya haal') ||
    clean.includes('kaise hai') ||
    clean.includes('how r u') ||
    clean.includes('how do you do')
  ) {
    return "I'm doing wonderful, thank you for asking! Hope your day is going well. As the concierge for The Wedding Dreams, I'm here to assist with everything from palace venues to wedding budgets. How can I help you curate your celebration today?";
  }

  // Small-talk 2: "hi" / "hello" / "hey" / "namaste"
  if (
    clean === 'hi' ||
    clean === 'hello' ||
    clean === 'hey' ||
    clean === 'namaste' ||
    clean === 'hola' ||
    clean.startsWith('hi ') ||
    clean.startsWith('hello ') ||
    clean.startsWith('hey ') ||
    clean.startsWith('namaste ')
  ) {
    return "Namaste! Welcome to The Wedding Dreams Atelier. Whether you are exploring luxury destinations or curating wedding decor, I'm here to assist. What type of celebration are you dreaming of?";
  }

  // Any other message during API downtime
  return "Namaste! I'd be delighted to assist you with your wedding planning details. You can also connect directly with our Creative Directors on WhatsApp or explore our planning tools right here.";
}

// Helper: Decoupled Asynchronous Lead Extraction
async function extractLeadDossierAsync(messages: Array<{ role: string; content: string }>) {
  if (!Array.isArray(messages) || messages.length < 2) return null;

  const conversationTranscript = messages
    .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  // Fast heuristic regex extraction fallback
  const phoneMatch = conversationTranscript.match(/(?:\+91|0)?[6-9]\d{9}/);
  const emailMatch = conversationTranscript.match(/[\w.-]+@[\w.-]+\.\w+/);
  const guestMatch = conversationTranscript.match(/(\d{2,4})\s*(?:guests|people|pax)/i);
  const budgetMatch = conversationTranscript.match(/(?:₹?\s*\d+(?:[.–]\d+)?\s*(?:lakhs?|lac|cr|crores?))/i);
  const locationMatch = conversationTranscript.match(/(udaipur|jaipur|goa|delhi|mumbai|kerala)/i);

  const fallbackLead = {
    name: null,
    phone: phoneMatch ? phoneMatch[0] : null,
    email: emailMatch ? emailMatch[0] : null,
    weddingDate: null,
    location: locationMatch ? locationMatch[0] : null,
    guestCount: guestMatch ? parseInt(guestMatch[1], 10) : null,
    budget: budgetMatch ? budgetMatch[0] : null,
    intentScore: phoneMatch || emailMatch ? 'high' : 'medium',
    summary: 'Enquiry details identified from conversation context.',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const prompt = `
Analyze the conversation between a client and The Wedding Dreams AI Concierge.
Extract all wedding parameters and contact details mentioned by the client. If not mentioned, set to null.

Conversation:
${conversationTranscript}

Return ONLY valid JSON matching this schema:
{
  "name": string or null,
  "phone": string or null,
  "email": string or null,
  "weddingDate": string or null,
  "location": string or null,
  "guestCount": number or null,
  "budget": string or null,
  "intentScore": "high" | "medium" | "low",
  "summary": string
}
`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let parsed: any = null;

    for (const model of candidateModels) {
      try {
        const response = await Promise.race([
          ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
              responseMimeType: 'application/json',
              abortSignal: controller.signal,
            },
          }),
          new Promise<never>((_, reject) => {
            controller.signal.addEventListener('abort', () =>
              reject(new Error('AbortError: Lead extraction timed out'))
            );
          }),
        ]);

        if (response && response.text) {
          parsed = JSON.parse(response.text.trim());
          break;
        }
      } catch (err: any) {
        // Continue to next candidate
      }
    }

    clearTimeout(timeoutId);
    if (parsed) return parsed;
  } catch (err: any) {
    clearTimeout(timeoutId);
  }

  return fallbackLead;
}

// 1. AI Concierge Chat Endpoint
app.post('/api/concierge/chat', async (req, res) => {
  try {
    const { messages, message, leadData } = req.body;

    // Detect user's current message string
    const rawMessage = typeof message === 'string'
      ? message
      : Array.isArray(messages) && messages.length > 0
        ? messages[messages.length - 1].content || ''
        : '';

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Format conversation history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // If leadData exists, append contextual lead awareness
    let contextualInstruction = CONCIERGE_SYSTEM_INSTRUCTION;
    if (leadData && Object.keys(leadData).length > 0) {
      contextualInstruction += `\n\nKnown Lead Context for this client:\n${JSON.stringify(leadData, null, 2)}`;
    }

    let replyText = '';

    // Model Configuration & Timeout Hardening:
    // 6-second timeout with AbortController signal
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => {
      controller.abort();
    }, 6000);

    // Try primary gemini-3.8-flash, with seamless gemini-3.1-flash-lite fallback if quota/rate-limited
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

    for (const model of candidateModels) {
      if (replyText) break;
      try {
        const response = await Promise.race([
          ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: contextualInstruction,
              temperature: 0.7,
              maxOutputTokens: 300,
              abortSignal: controller.signal,
            },
          }),
          new Promise<never>((_, reject) => {
            controller.signal.addEventListener('abort', () =>
              reject(new Error('AbortError: Request timed out after 6 seconds'))
            );
          }),
        ]);

        if (response && response.text) {
          replyText = response.text.trim();
          break;
        }
      } catch (modelErr: any) {
        console.warn(`Model ${model} request error:`, modelErr?.message?.slice(0, 120) || modelErr);
      }
    }

    clearTimeout(timeoutTimer);

    // Intelligent Offline Rule Engine (Bulletproof Fallback):
    // If Gemini API throws 503, rate limit (429), or timeout, use contextual fallback dictionary
    if (!replyText) {
      replyText = getIntelligentFallback(rawMessage);
    }

    const lowerText = replyText.toLowerCase();
    const hasIntentOffer = lowerText.includes('connect with a wedding expert') ||
                           lowerText.includes('talk to a wedding expert') ||
                           lowerText.includes('connect with expert') ||
                           lowerText.includes('creative directors');

    // Decouple Lead Extraction: Send user reply immediately
    res.status(200).json({
      reply: replyText,
      status: "success",
      offerExpert: hasIntentOffer,
    });

    // Execute lead extraction asynchronously without awaiting in HTTP cycle
    extractLeadDossierAsync(messages).catch((err) =>
      console.error("Lead extraction failed silently:", err)
    );
  } catch (error: any) {
    console.error('Concierge Chat general error:', error);
    const rawMessage = typeof req.body?.message === 'string'
      ? req.body.message
      : Array.isArray(req.body?.messages) && req.body.messages.length > 0
        ? req.body.messages[req.body.messages.length - 1].content || ''
        : '';

    // Always return HTTP 200 with intelligent fallback response so UI never breaks
    res.status(200).json({
      reply: getIntelligentFallback(rawMessage),
      status: "success",
      offerExpert: true,
    });
  }
});

// 2. Structured Lead Extraction Endpoint
app.post('/api/concierge/extract-lead', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(200).json({ lead: null });
    }
    const lead = await extractLeadDossierAsync(messages);
    res.status(200).json({ lead });
  } catch (error: any) {
    console.error('Lead extraction endpoint error:', error);
    res.status(200).json({ lead: null });
  }
});

// Setup Vite middleware in dev or static files in production
async function start() {
  // Always serve static assets from public/ folder with optimal caching
  app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Wedding Dreams server running on http://0.0.0.0:${PORT}`);
  });
}

start();
