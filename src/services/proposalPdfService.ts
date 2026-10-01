import { jsPDF } from 'jspdf';

export function generateLuxuryProposalPDF(lead: any, _plan?: any) {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const darkBlack = [23, 23, 23];
    const gold = [197, 160, 89]; // #C5A059
    const charcoal = [85, 82, 78];

    // Timestamp
    const timestampText = 'Document Generated: ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Header Background
    doc.setFillColor(darkBlack[0], darkBlack[1], darkBlack[2]);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Gold accent line
    doc.setFillColor(gold[0], gold[1], gold[2]);
    doc.rect(0, 45, pageWidth, 1.5, 'F');

    // Header Typography
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('THE WEDDING DREAMS', pageWidth / 2, 16, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('Couture Scenography & Destination Nuptials', pageWidth / 2, 23, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text('Directorial Sanctuary: https://event-managementdemo.vercel.app/', pageWidth / 2, 30, { align: 'center' });
    doc.text(timestampText, pageWidth / 2, 37, { align: 'center' });

    let currentY = 55;

    // Atelier Manifesto
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
    doc.text('THE ATELIER MANIFESTO', 14, currentY);
    currentY += 5;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    const manifesto = 'The Wedding Dreams is an architectural scenography and directorial wedding atelier. We curate rare, high-production celebrations across palatial heritage fortresses, coastal sanctuaries, and private alpine estates with single-point directorial command.';
    const splitManifesto = doc.splitTextToSize(manifesto, pageWidth - 28);
    doc.text(splitManifesto, 14, currentY);
    currentY += splitManifesto.length * 5 + 8;

    // Divider
    doc.setDrawColor(214, 206, 190);
    doc.setLineWidth(0.4);
    doc.line(14, currentY, pageWidth - 14, currentY);
    currentY += 8;

    // Project Scope & Client Dossier
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
    doc.text('PROJECT SCOPE & CLIENT DOSSIER', 14, currentY);
    currentY += 6;

    const clientNameVal = lead.clientName || lead.name || 'Esteemed Patron';
    const partnerNameVal = lead.partnerName && lead.partnerName.toLowerCase() !== 'not available' ? ` & ${lead.partnerName}` : '';
    const fullNameVal = `${clientNameVal}${partnerNameVal}`;

    const details = [
      ['Client / Couple:', fullNameVal],
      ['Contact Email:', lead.email || 'N/A'],
      ['Destination Venue:', lead.location || lead.destination || 'Udaipur / Jaipur Heritage Palace'],
      ['Anticipated Guests:', lead.guestCount ? `${lead.guestCount} Distinguished Guests` : '350 Guests'],
      ['Investment Envelope:', lead.budget || lead.budgetAllocation || '₹3 Cr – ₹7 Cr (Bespoke Scenography)'],
      ['Project Status:', lead.status ? lead.status.toUpperCase() : 'CONFIRMED COMMISSION'],
    ];

    doc.setFontSize(9);
    details.forEach(([label, val]) => {
      if (currentY > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
      doc.text(label, 14, currentY);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
      doc.text(val, 65, currentY);
      currentY += 6;
    });

    currentY += 6;

    // Core Planning Disciplines
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
    doc.text('CORE PLANNING DISCIPLINES & SCOPE OF SERVICE', 14, currentY);
    currentY += 6;

    const disciplines = [
      ['1. Planning & Management:', 'Single-point directorial coordination, run-of-show orchestration, and vendor contract negotiations.'],
      ['2. Scenography & Floral Decor:', 'Architectural lighting, bespoke mandap structures, botanical installations, and thematic spatial design.'],
      ['3. Production Logistics:', 'Sound, lighting, pyrotechnics, artist management, multi-lingual hospitality desks, and transport fleets.'],
      ['4. Hospitality & Guest Curation:', 'VIP butler services, custom welcome hampers, hotel room allocations, and concierge itineraries.'],
    ];

    disciplines.forEach(([title, desc]) => {
      if (currentY > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
      doc.text(title, 14, currentY);
      currentY += 5;
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
      const splitDesc = doc.splitTextToSize(desc, pageWidth - 28);
      doc.text(splitDesc, 14, currentY);
      currentY += splitDesc.length * 5 + 4;
    });

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Private & Confidential — Exclusively Curated by The Wedding Dreams', 14, pageHeight - 10);
      doc.text('Directorial Sanctuary: https://event-managementdemo.vercel.app/', pageWidth - 14, pageHeight - 10, { align: 'right' });
    }

    const safeName = clientNameVal.replace(/\s+/g, '_');
    doc.save(`${safeName}_Wedding_Proposal.pdf`);
  } catch (err) {
    console.error('Proposal PDF generation error:', err);
  }
}
