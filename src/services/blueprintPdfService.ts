import { jsPDF } from 'jspdf';
import { TaskDocument, VendorDocument, BudgetDocument } from '../types/firebase';

export function generateWeddingBlueprintPDF(
  wedding: any,
  tasks: TaskDocument[],
  _guests: any[], // STRICTLY EXCLUDED: Guests and RSVP lists must not be included
  vendors: VendorDocument[],
  budget: BudgetDocument | null
) {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Primary Colors
    const darkBlack = [23, 23, 23];
    const gold = [197, 160, 89]; // #C5A059
    const charcoal = [85, 82, 78];

    const timestampText = 'Document Generated: ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Header Banner Background
    doc.setFillColor(darkBlack[0], darkBlack[1], darkBlack[2]);
    doc.rect(0, 0, pageWidth, 45, 'F');

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
    doc.text('OFFICIAL DIRECTORIAL BLUEPRINT & SANCTUARY DOSSIER', pageWidth / 2, 23, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text('Directorial Sanctuary: https://event-managementdemo.vercel.app/', pageWidth / 2, 30, { align: 'center' });
    doc.text(timestampText, pageWidth / 2, 37, { align: 'center' });

    let currentY = 55;

    // Celebration & Client Details (Overview)
    doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`Client Dossier: ${wedding.clientName || wedding.name || 'Client'} & ${wedding.partnerName || 'Partner'}`, 14, currentY);
    currentY += 6;

    const progressPct = wedding.progressPct !== undefined ? wedding.progressPct : 45;

    const overviewDetails = [
      ['Destination Venue:', wedding.location || wedding.destination || 'Udaipur Heritage Fortress'],
      ['Celebration Date:', wedding.weddingDate || wedding.date || '2026-11-20'],
      ['Anticipated Guests:', `${wedding.guestCount || 350} Distinguished Guests`],
      ['Total Budget Envelope:', `₹${Number(wedding.budget || 6500000).toLocaleString('en-IN')}`],
      ['Real-Time Progress:', `${progressPct}% Finalized (Live Admin Synchronized)`],
    ];

    doc.setFontSize(9);
    overviewDetails.forEach(([label, val]) => {
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

    // 1. LIVE BUDGET BREAKDOWN & ALLOCATION
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
    doc.text('1. Live Budget Breakdown & Allocation', 14, currentY);
    currentY += 6;

    const budgetItems = budget?.allocations?.length ? budget.allocations : [
      { name: 'Venue & Accommodations', percentage: 40, amountINR: 2600000, description: 'Palace takeover & suites' },
      { name: 'Couture Scenography & Decor', percentage: 25, amountINR: 1625000, description: 'Floral & structural mandaps' },
      { name: 'Gastronomy & Banquets', percentage: 20, amountINR: 1300000, description: 'Multi-cuisine fine dining' },
      { name: 'Production, Sound & Lighting', percentage: 15, amountINR: 975000, description: 'AV, staging & artist fees' },
    ];

    budgetItems.forEach((b: any, idx: number) => {
      if (currentY > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
      doc.text(`${idx + 1}. ${b.name} (${b.percentage}%)`, 14, currentY);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
      doc.text(`₹${Number(b.amountINR || 0).toLocaleString('en-IN')} — ${b.description || 'Allocated'}`, 14, currentY + 5);
      currentY += 12;
    });

    currentY += 4;

    // 2. PRODUCTION TIMELINE & MILESTONE ROADMAP
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
    doc.text('2. Production Timeline & Milestone Roadmap', 14, currentY);
    currentY += 6;

    const checklistRows = wedding.checklist?.length ? wedding.checklist : tasks;
    checklistRows.forEach((c: any, idx: number) => {
      if (currentY > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }
      const title = c.title || 'Milestone Phase';
      const prog = c.progress !== undefined ? `${c.progress}%` : (c.status === 'completed' ? '100%' : '40%');
      const stat = c.status || 'In Progress';
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
      doc.text(`${idx + 1}. ${title}`, 14, currentY);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
      doc.text(`Progress: ${prog} | Status: ${stat}`, 14, currentY + 5);
      currentY += 12;
    });

    currentY += 4;

    // 3. CURATED VENDOR CONTACTS & PRODUCTION SCHEDULE
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
    doc.text('3. Curated Vendor Contacts & Production Schedule', 14, currentY);
    currentY += 6;

    const vendorList = vendors.length > 0 ? vendors : [
      { businessName: 'The Leela Palace Udaipur', category: 'Venue', contactPerson: 'General Manager', contactPhone: '+91 294 670 1234', status: 'Contracted' }
    ];

    vendorList.forEach((v: any, idx: number) => {
      if (currentY > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
      doc.text(`${idx + 1}. ${v.businessName} (${v.category})`, 14, currentY);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
      doc.text(`Contact: ${v.contactPerson || 'Specialist'} | Line: ${v.contactPhone || v.phone || v.email || 'Concierge'} | Status: ${v.status || 'Contracted'}`, 14, currentY + 5);
      currentY += 12;
    });

    currentY += 4;

    // 4. TRAVEL & LOGISTICS OVERVIEW
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkBlack[0], darkBlack[1], darkBlack[2]);
    doc.text('4. Travel & Logistics Overview', 14, currentY);
    currentY += 6;

    const logisticsText = wedding.travelNotes || 'Private airport transfers, luxury fleet coordination, and dedicated hospitality desks are stationed at Maharana Pratap Airport (UDR) and primary gateway terminals. VIP check-in is arranged at the palace atrium.';
    const splitLogistics = doc.splitTextToSize(logisticsText, pageWidth - 28);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.text(splitLogistics, 14, currentY);

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Private & Confidential — Exclusively Curated by The Wedding Dreams', 14, pageHeight - 10);
      doc.text('Official Directorial Portal: https://event-managementdemo.vercel.app/', pageWidth - 14, pageHeight - 10, { align: 'right' });
    }

    const clientNameSafe = (wedding.clientName || wedding.name || 'Client').replace(/\s+/g, '_');
    doc.save(`Wedding_Blueprint_${clientNameSafe}.pdf`);
  } catch (err) {
    console.error('Blueprint PDF generation error:', err);
  }
}
