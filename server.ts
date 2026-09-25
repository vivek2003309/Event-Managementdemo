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

// 1. AI Concierge Chat Endpoint
app.post('/api/concierge/chat', async (req, res) => {
  try {
    const { messages, leadData } = req.body;

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

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let replyText = '';
    let apiError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: contextualInstruction,
            temperature: 0.7,
          },
        });
        if (response.text) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        apiError = err;
        console.warn(`Model ${model} request failed, attempting next fallback:`, err?.message || err);
      }
    }

    // If upstream Google API has transient 503/429 spikes, fallback gracefully to domain curatorial response
    if (!replyText) {
      const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user')?.content?.toLowerCase() || '';
      if (lastUserMsg.includes('destination') || lastUserMsg.includes('udaipur') || lastUserMsg.includes('jaipur') || lastUserMsg.includes('goa')) {
        replyText = `Namaste. For destination celebrations, The Wedding Dreams specializes in four quintessential enclaves:

1. **Udaipur (Lake Pichola)**: World-renowned for island palaces like Taj Lake Palace and Jagmandir Island, offering royal flotilla arrivals and serene water reflections.
2. **Jaipur (The Pink City)**: Majestic fortresses and palatial gardens such as Rambagh Palace and Jai Mahal for torch-lit baithaks and royal elephant processions.
3. **Goa (Coastal Luxury)**: Secluded cliffside estates in Cabo Serai or South Goa beach resorts for bohemian sundowners and ocean-facing Vedic pheras.
4. **Delhi NCR**: Grand farmhouses and Lutyens lawns for monumental gatherings requiring large guest capacities.

Would you like to connect with a Wedding Expert to discuss dates and palace availability for your preferred enclave?`;
      } else if (lastUserMsg.includes('budget') || lastUserMsg.includes('cost') || lastUserMsg.includes('pricing')) {
        replyText = `Namaste. While exact costings depend on your chosen dates, venue contracts, and artist specifications, our standard indicative allocation framework is structured as follows:

• **Venue & Palace Charter**: ~25%
• **Catering & Mixology**: ~20%
• **Décor & Floral Scenography**: ~20%
• **Photography & 35mm Cinema**: ~10%
• **Entertainment & Headline Artists**: ~8%
• **Hospitality & Guest Concierge**: ~7%
• **Contingency Buffer & Logistics**: ~10%

You can also use our interactive /budget-planner to model your exact headcount. Would you like to connect with a Wedding Expert for a tailored line-item estimate?`;
      } else if (lastUserMsg.includes('timeline') || lastUserMsg.includes('schedule') || lastUserMsg.includes('month') || lastUserMsg.includes('when')) {
        replyText = `Namaste. For high-demand destination weddings, our directors recommend the following master planning timeline:

• **9–14 Months Out**: Secure heritage venue charter and lock 100% room inventory.
• **6–8 Months Out**: Finalize creative scenography themes, 3D spatial renders, and headline artists.
• **4–6 Months Out**: Private menu tastings, master mixology curation, and ritual coordination.
• **2–3 Months Out**: Deploy guest digital RSVPs, flight logistics, and airport concierge desks.
• **Wedding Week**: Full directorship takeover, sound clearances, and bridal shadow assistance.

Would you like to connect with a Wedding Expert to map your custom dates?`;
      } else {
        replyText = `Namaste. The Wedding Dreams orchestrates bespoke celebrations across six core directorships: Planning & Management, Décor & Scenography, Destination Takeovers, Royal Gastronomy, Curated Entertainment, and 35mm Cinematic Films.

How may I assist you with your destination, ceremonial timeline, or indicative budget? Would you like to connect with a Wedding Expert?`;
      }
    }

    // Detect purchase intent in the conversation to signal UI to highlight the lead capture/connect action
    const lowerText = replyText.toLowerCase();
    const hasIntentOffer = lowerText.includes('connect with a wedding expert') || lowerText.includes('talk to a wedding expert');

    res.json({
      reply: replyText,
      offerExpert: hasIntentOffer,
    });
  } catch (error: any) {
    console.error('Gemini Concierge Chat error:', error);
    res.status(500).json({
      error: error?.message || 'Unable to consult the AI Wedding Concierge. Please retry.',
      reply: 'Namaste. Our curatorial concierge system is momentarily experiencing high demand. Please retry or click "Talk to an Expert" to speak directly with our directors.',
    });
  }
});

// 2. Structured Lead Extraction Endpoint
app.post('/api/concierge/extract-lead', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const conversationTranscript = messages
      .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const prompt = `
Analyze the following conversation between a client and The Wedding Dreams AI Concierge.
Extract all wedding parameters and contact details mentioned by the client. If not mentioned, set to null.

Conversation:
${conversationTranscript}

Return ONLY a valid JSON object matching this schema:
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

    let parsed: any = null;
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          parsed = JSON.parse(response.text.trim());
          break;
        }
      } catch (err: any) {
        console.warn(`Lead extraction with ${model} failed, trying next fallback:`, err?.message || err);
      }
    }

    // Heuristic regex fallback if upstream API is unavailable
    if (!parsed) {
      const phoneMatch = conversationTranscript.match(/(?:\+91|0)?[6-9]\d{9}/);
      const emailMatch = conversationTranscript.match(/[\w.-]+@[\w.-]+\.\w+/);
      const guestMatch = conversationTranscript.match(/(\d{2,4})\s*(?:guests|people|pax)/i);
      const budgetMatch = conversationTranscript.match(/(?:₹?\s*\d+(?:[.–]\d+)?\s*(?:lakhs?|lac|cr|crores?))/i);
      const locationMatch = conversationTranscript.match(/(udaipur|jaipur|goa|delhi|mumbai|kerala)/i);

      parsed = {
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
    }

    res.json({ lead: parsed });
  } catch (error: any) {
    console.error('Lead extraction error:', error);
    res.json({
      lead: {
        name: null,
        phone: null,
        email: null,
        weddingDate: null,
        location: null,
        guestCount: null,
        budget: null,
        intentScore: 'medium',
        summary: 'Enquiry details logged.',
      },
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function start() {
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
