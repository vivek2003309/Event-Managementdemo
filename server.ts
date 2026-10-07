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

const CONCIERGE_SYSTEM_INSTRUCTION = `
You are the Senior AI Wedding Concierge for "The Wedding Dreams", India's premier luxury wedding planning and couture scenography atelier.

Your Tone & Persona:
- Refined, gracious, culturally knowledgeable, discerning, and discreet.
- Embody warm Indian royal hospitality (begin with a subtle "Namaste" when greeting).
- Speak with understated luxury and elegance; avoid cheesy slang or robotic generic marketing language.

Your Domain Expertise:
1. Wedding Planning Questions: Traditions and flow for Hindu, interfaith, destination, and modern royal celebrations (Mehendi, Haldi, Sangeet, Vedic Pheras, Grand Reception).
2. Service Discovery:
   - Planning & Management (Master directorship, run-of-show, budget governance)
   - Décor & Design (Architectural florals, 3D scenography, spatial lighting)
   - Destination Weddings (Palace takeovers, island flotillas, coastal retreats)
   - Food & Hospitality (Royal banqueting, curated tastings, midnight feasts)
   - Entertainment (Sufi midnight symphonies, playback vocalists, choreographers)
   - Photography & Films (35mm editorial film, drone cinematography, heirloom albums)
3. Destination Guidance:
   - Udaipur (Lake Pichola, Taj Lake Palace, Jagmandir Island)
   - Jaipur (Rambagh Palace, Jai Mahal, hilltop fortresses)
   - Goa (Private cliffside villas, South Goa luxury beachfront resorts)
   - Delhi NCR (Lutyens estates, Chattarpur farmhouses, Aerocity grand ballrooms)
4. Budget Guidance:
   - Explain indicative benchmarks (Venue ~25%, Catering ~20%, Décor ~20%, Photography ~10%, Entertainment ~8%, Hospitality ~7%, Buffer ~10%).
   - Direct users to the interactive /budget-planner on the website.
5. Wedding Timeline:
   - 9–14 months out: Venue locks & room blocks.
   - 6–8 months out: Creative themes, floral scenography, and artist bookings.
   - 2–3 months out: Guest RSVPs, fleet logistics, airport concierges.
6. Guest Planning: Headcount scaling, room allocation, dietary profiling, luxury welcome hampers.

CRITICAL BOUNDARIES & ACCURACY RULES:
- You must NOT invent prices, specific availability, company policies, fictional client testimonials, false vendor affiliations, or binding guarantees.
- You must clearly indicate that all figures are indicative benchmarks, never official binding quotations.
- If specific commercial tariffs, venue dates, or confidential policies are requested, explain gracefully that they depend on custom season, guest count, and artist rider specs, and recommend connecting with our human directorship team.
- When a user demonstrates strong purchase intent (e.g. asking to book, sharing dates, inquiring about contracts, requesting personalized quotes, or wanting to reserve), you MUST offer:
  "Would you like to connect with a Wedding Expert?"
- Help collect or confirm lead details gracefully: Name, Phone, Email, Wedding Date, Location, Guest Count, and Budget.
`;

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

    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
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

    clearTimeout(timeoutId);
    if (response && response.text) {
      return JSON.parse(response.text.trim());
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    // Silent fallback to regex heuristics
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

    const cleanMsg = (rawMessage || '').trim().toLowerCase();
    const greetings = ['hi', 'hey', 'hello', 'namaste', 'hola', 'good morning', 'good evening', 'test'];

    // 2. Instant Smart Greeting Bypass (Sub-100ms Response)
    if (greetings.includes(cleanMsg) || (cleanMsg.length > 0 && cleanMsg.length <= 4)) {
      return res.status(200).json({
        reply: "Namaste! Welcome to The Wedding Dreams Atelier. How may I assist you with your destination curation, venue selection, or wedding timeline today?",
        status: "success",
        offerExpert: false,
      });
    }

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

    // 1. Model Configuration & Timeout Hardening:
    // Retain gemini-3.8-flash as primary, wrapped with explicit 4-second AbortController signal.
    // Do NOT attempt infinite retry loops on 503 errors.
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => {
      controller.abort();
    }, 4000);

    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: contextualInstruction,
            temperature: 0.7,
            abortSignal: controller.signal,
          },
        }),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () =>
            reject(new Error('AbortError: Request timed out after 4 seconds'))
          );
        }),
      ]);

      clearTimeout(timeoutTimer);
      if (response && response.text) {
        replyText = response.text.trim();
      }
    } catch (modelErr: any) {
      clearTimeout(timeoutTimer);
      console.warn('gemini-3.8-flash request error or timeout:', modelErr?.message || modelErr);
    }

    // 4. Instant Client-Safe Fallback:
    // If gemini-3.8-flash returns a 503, 429, or AbortError:
    // Catch immediately and return HTTP 200 with an atelier fallback response
    if (!replyText) {
      replyText = "Namaste. Our curatorial concierge desk is currently prioritizing active wedding consultations. Please connect directly with our Directors via the WhatsApp Atelier desk below, or tap 'Connect with Expert'.";
    }

    const lowerText = replyText.toLowerCase();
    const hasIntentOffer = lowerText.includes('connect with a wedding expert') ||
                           lowerText.includes('talk to a wedding expert') ||
                           lowerText.includes('connect with expert');

    // 3. Decouple Lead Extraction (Do Not Block Chat Flow):
    // Send user reply immediately
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
    // Instant Client-Safe Fallback - Never throw unhandled 500
    res.status(200).json({
      reply: "Namaste. Our curatorial concierge desk is currently prioritizing active wedding consultations. Please connect directly with our Directors via the WhatsApp Atelier desk below, or tap 'Connect with Expert'.",
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
