import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { RefreshCw, ArrowLeft, Calendar, FileText, AlertCircle, Building } from 'lucide-react';
import { useRouter, Link } from '../lib/router';

export const RefundPolicyPage: React.FC = () => {
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
              kicker="Financial Governance Charter"
              title="Retainer & Cancellation Policy"
              subtitle="Directorial retainer commitments, third-party vendor pass-through deposit rules, and date postponement guidelines."
            />

            {/* Refund Header Banner */}
            <div className="bg-[#171717] text-[#F8F5EF] p-6 sm:p-8 rounded-[8px] border border-[#C5A059]/30 mb-10 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-1">
                  Atelier Policy Reference
                </span>
                <h3 className="font-serif text-[22px] text-white font-normal">
                  The Wedding Dreams by Varun Rathor
                </h3>
                <p className="text-[12px] text-white/70 mt-1">
                  Contact: +91 9871211995 | Email: inquiries@theweddingdreams.com
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-[#C5A059] shrink-0 hidden sm:block" />
            </div>

            {/* Policy Content Card */}
            <div className="bg-white p-8 sm:p-12 rounded-[12px] border border-[#EAE5DC] shadow-sm space-y-10 text-[14px] text-[#55524E] leading-relaxed font-light">
              {/* Section 1 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-[#171717]">
                  <Calendar className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    1. Non-Refundable Bespoke Retainers
                  </h3>
                </div>
                <p>
                  Because <strong>The Wedding Dreams by Varun Rathor</strong> commissions a strictly limited calendar of multi-day celebrations each year to ensure singular directorial focus, locking a date immediately turns away all other prospective commissions for those specific dates.
                </p>
                <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DC] rounded-[6px] text-[13px]">
                  <strong className="text-[#171717] block mb-1">Directorial Retainer Terms:</strong>
                  All initial commissioning retainers paid to lock the studio's calendar are <strong>strictly non-refundable</strong> once executed. This covers initial spatial research, venue feasibility audits, architectural drafting, and exclusivity locking.
                </div>
              </section>

              {/* Section 2 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <Building className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    2. Third-Party Vendor Deposit Pass-Through Terms
                  </h3>
                </div>
                <p>
                  As an overarching directorial studio, payments for external vendors (including palace hotels, heritage estates, private aviation charters, Michelin-star culinary teams, and botanical suppliers) are disbursed directly as per vendor agreements.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[13px]">
                  <li>
                    <strong>Transparent Pass-Through:</strong> Third-party vendor deposits are subject entirely to the cancellation and refund schedules of those individual vendor contracts.
                  </li>
                  <li>
                    <strong>Zero Broker Markups on Refunds:</strong> In the event a venue or supplier issues a partial refund or credit under their contract, 100% of that recovered credit is passed through directly to the patron.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <RefreshCw className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    3. Date Postponement & Rescheduling Guidelines
                  </h3>
                </div>
                <p>
                  Should an unexpected circumstance require a shift in celebration dates:
                </p>
                <div className="space-y-3 text-[13px]">
                  <div className="p-3 border-l-2 border-[#C5A059] bg-[#FAF8F5] pl-4">
                    <strong className="text-[#171717]">Notice Period:</strong> Written notice of date postponement must be submitted at least 90 days prior to the original load-in date.
                  </div>
                  <div className="p-3 border-l-2 border-[#C5A059] bg-[#FAF8F5] pl-4">
                    <strong className="text-[#171717]">Credit Transferability:</strong> Subject to directorial calendar availability within a 12-month window from the original date, 100% of the directorial retainer will be applied toward the new dates.
                  </div>
                  <div className="p-3 border-l-2 border-[#C5A059] bg-[#FAF8F5] pl-4">
                    <strong className="text-[#171717]">Vendor Calendar Realignment:</strong> Rescheduling remains subject to venue and third-party supplier availability and potential seasonal rate differences.
                  </div>
                </div>
              </section>
            </div>

            {/* Nav Footer Links */}
            <div className="mt-8 flex items-center justify-between text-[12px] text-[#77736D]">
              <Link href="/terms" className="hover:text-[#171717] underline transition-colors">
                ← View Atelier Terms
              </Link>
              <Link href="/cookies" className="hover:text-[#171717] underline transition-colors">
                View Cookie Notice →
              </Link>
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
};
