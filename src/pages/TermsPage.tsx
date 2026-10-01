import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { FileText, ArrowLeft, Shield, Scale, Calendar, AlertTriangle, Sparkles, Building2 } from 'lucide-react';
import { useRouter, Link } from '../lib/router';

export const TermsPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="w-full pt-12 pb-24">
      <Section variant="ivory" spacing="md">
        <PageContainer>
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[#77736D] hover:text-[#171717] transition-colors mb-8 cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-[#C6A66B] group-hover:-translate-x-1 transition-transform" />
              <span>Return to Atelier Home</span>
            </button>

            <SectionHeading
              kicker="Governance & Engagement Charter"
              title="Atelier Terms & Directorial Engagement"
              subtitle="Commissioning parameters, intellectual property safeguards, payment milestone schedules, and legal jurisdiction."
            />

            {/* Entity Header Banner */}
            <div className="bg-[#171717] text-[#F8F5EF] p-6 sm:p-8 rounded-[8px] border border-[#C5A059]/30 mb-10 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-1">
                  Commissioning Entity
                </span>
                <h3 className="font-serif text-[22px] text-white font-normal">
                  The Wedding Dreams by Varun Rathor
                </h3>
                <p className="text-[12px] text-white/70 mt-1">
                  Ground Floor, 1/202/35, Sadar Bazar Road, Piru Vihar, Sadar Bazaar, Delhi Cantonment, New Delhi 110010
                </p>
              </div>
              <Scale className="w-8 h-8 text-[#C5A059] shrink-0 hidden sm:block" />
            </div>

            {/* Terms Content Card */}
            <div className="bg-white p-8 sm:p-12 rounded-[12px] border border-[#EAE5DC] shadow-sm space-y-10 text-[14px] text-[#55524E] leading-relaxed font-light">
              {/* Section 1 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-[#171717]">
                  <Sparkles className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    1. Directorial Curation Scope & Exclusivity
                  </h3>
                </div>
                <p>
                  <strong>The Wedding Dreams by Varun Rathor</strong> operates as a haute couture event directorship studio. Engagement encompasses turnkey spatial design, master cue sheet orchestration, vendor contracts governance, hospitality diplomacy, and bespoke scenography. To preserve uncompromising directorial focus, our studio limits commissions to a finite number of multi-day celebrations each calendar year.
                </p>
              </section>

              {/* Section 2 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <Building2 className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    2. Intellectual Property Rights (Scenography & Architecture)
                  </h3>
                </div>
                <p>
                  All custom scenography blueprints, 3D photorealistic CAD renders, architectural mandap concepts, lighting schematics, and artistic moodboards created by The Wedding Dreams by Varun Rathor remain the exclusive intellectual property of the Atelier.
                </p>
                <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DC] rounded-[6px] text-[13px] text-[#55524E]">
                  <strong className="text-[#171717]">Usage Restriction:</strong> Designs and blueprints commissioned through our studio may not be reproduced, re-licensed, or transmitted to unapproved third-party fabricators without written directorial consent.
                </div>
              </section>

              {/* Section 3 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <Calendar className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    3. Payment Milestone Schedule
                  </h3>
                </div>
                <p>
                  Directorial services and vendor procurement proceed strictly in accordance with agreed milestone schedules executed in the master directorship contract:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[13px]">
                  <li>
                    <strong>Initial Retainer:</strong> Due upon execution of agreement to lock the calendar dates and commission concept development.
                  </li>
                  <li>
                    <strong>Progressive Milestone Installments:</strong> Disbursed at key phases (e.g., 60 days prior to load-in, 30 days prior, and final clearance prior to site setup).
                  </li>
                  <li>
                    <strong>Third-Party Vendor Disbursals:</strong> Palace buyouts, culinary contracts, and aviation charters are funded directly as per vendor deadlines.
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <AlertTriangle className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    4. Force Majeure Protocols
                  </h3>
                </div>
                <p>
                  Neither party shall be held liable for failure to perform contractual obligations if caused by an event beyond reasonable control, including natural disasters, acts of God, civil emergencies, government travel bans, or official municipal sound/curfew mandates. In such events, both parties agree to consult in good faith to reschedule the celebration subject to calendar availability.
                </p>
              </section>

              {/* Section 5 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <Scale className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    5. Jurisdiction & Governing Law
                  </h3>
                </div>
                <p>
                  These Terms of Engagement and any disputes or claims arising out of or in connection with directorial services provided by The Wedding Dreams by Varun Rathor shall be governed by and construed in accordance with the laws of India.
                </p>
                <div className="p-4 bg-[#F8F5EF] border border-[#E5DFD3] rounded-[6px] text-[13px]">
                  <strong className="text-[#171717]">Exclusive Venue of Dispute:</strong> Both parties irrevocably agree that the <strong>Courts of Delhi, India</strong> shall have exclusive jurisdiction to settle any dispute, claim, or controversy arising under or regarding these Terms.
                </div>
              </section>
            </div>

            {/* Nav Footer Links */}
            <div className="mt-8 flex items-center justify-between text-[12px] text-[#77736D]">
              <Link href="/privacy-policy" className="hover:text-[#171717] underline transition-colors">
                ← View Privacy Policy (DPDP Act, 2023)
              </Link>
              <Link href="/refund-policy" className="hover:text-[#171717] underline transition-colors">
                View Retainer &amp; Cancellation Policy →
              </Link>
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
};
