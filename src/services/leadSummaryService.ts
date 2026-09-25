import { LeadDocument, WeddingPlanDocument } from '../types/firebase';

/**
 * The Wedding Dreams — Grounded Lead Intelligence Summary
 * Synthesizes truthful, factual summaries strictly using provided lead & plan data.
 * Zero invented/hallucinated parameters.
 */
export function generateLeadAISummary(lead: LeadDocument, plan?: WeddingPlanDocument | null): string {
  // If a manual or custom pre-saved summary exists and has content, we can respect it
  if (lead.aiSummary && lead.aiSummary.trim().length > 15) {
    return lead.aiSummary;
  }

  const parts: string[] = [];

  // Couple / Lead identification
  const coupleName = lead.name ? lead.name.trim() : 'Couple';
  const isPluralCouple = coupleName.includes('&') || coupleName.includes('and');
  const subject = isPluralCouple ? `${coupleName} are` : `${coupleName} is`;

  // Scale & Location
  const guests = lead.guestCount || plan?.guestCount;
  const location = lead.location || plan?.location;
  const isDestination =
    location && ['Udaipur', 'Jaipur', 'Goa', 'Jodhpur', 'Mussoorie'].includes(location);

  const eventDescriptor = isDestination ? 'destination wedding' : 'wedding celebration';

  if (guests && location) {
    parts.push(
      `${subject} planning a ${guests}-person ${eventDescriptor} in ${location}`
    );
  } else if (guests) {
    parts.push(`${subject} planning a ${guests}-person celebration`);
  } else if (location) {
    parts.push(`${subject} planning a ${eventDescriptor} in ${location}`);
  } else {
    parts.push(`${subject} planning a bespoke wedding celebration`);
  }

  // Budget Tier
  const budget = lead.budget || plan?.budgetRange;
  if (budget) {
    parts[0] += ` with an estimated ${budget} budget.`;
  } else {
    parts[0] += '.';
  }

  // Services
  const services = lead.services || plan?.selectedServices || [];
  if (services && services.length > 0) {
    const formattedServices = services.map((s) => s.toLowerCase()).join(', ');
    parts.push(`Interested in ${formattedServices}.`);
  }

  // Target Date / Auspicious Timeline
  const dateStr = lead.weddingDate || plan?.targetDate;
  if (dateStr && dateStr !== 'To be confirmed') {
    parts.push(`Targeted timeline: ${dateStr}.`);
  }

  // Relevant Client Notes (Grounded verbatim)
  if (lead.notes && lead.notes.trim().length > 0) {
    const trimmedNotes = lead.notes.trim();
    // Exclude generic placeholders
    if (!trimmedNotes.toLowerCase().includes('n/a') && trimmedNotes.length > 3) {
      parts.push(`Client notes: "${trimmedNotes}".`);
    }
  }

  // Follow-up status
  if (lead.followUpDate) {
    parts.push(`Scheduled directorship follow-up: ${lead.followUpDate}.`);
  }

  return parts.join(' ');
}
