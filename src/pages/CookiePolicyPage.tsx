import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { Cookie, ArrowLeft, ShieldCheck, Database, CheckCircle } from 'lucide-react';
import { useRouter, Link } from '../lib/router';

export const CookiePolicyPage: React.FC = () => {
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
              kicker="Digital Discretion Notice"
              title="Cookie Notice"
              subtitle="Statement regarding essential session storage usage and zero cross-site tracking."
            />

            {/* Cookie Header Banner */}
            <div className="bg-[#171717] text-[#F8F5EF] p-6 sm:p-8 rounded-[8px] border border-[#C5A059]/30 mb-10 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-1">
                  Privacy Transparency
                </span>
                <h3 className="font-serif text-[22px] text-white font-normal">
                  The Wedding Dreams by Varun Rathor
                </h3>
                <p className="text-[12px] text-white/70 mt-1">
                  Strictly essential session data • Zero cross-site tracking
                </p>
              </div>
              <Cookie className="w-8 h-8 text-[#C5A059] shrink-0 hidden sm:block" />
            </div>

            {/* Policy Content Card */}
            <div className="bg-white p-8 sm:p-12 rounded-[12px] border border-[#EAE5DC] shadow-sm space-y-10 text-[14px] text-[#55524E] leading-relaxed font-light">
              {/* Section 1 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-[#171717]">
                  <CheckCircle className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    1. Strictly Essential Session Storage
                  </h3>
                </div>
                <p>
                  <strong>The Wedding Dreams by Varun Rathor</strong> utilizes strictly essential browser session storage (`localStorage` and `sessionStorage`) solely to maintain seamless concierge interactions, preserve client portal authentication states, store planning tool preferences, and remember preloader user preferences.
                </p>
                <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DC] rounded-[6px] text-[13px] space-y-2">
                  <p><strong className="text-[#171717]">Authentication Sessions:</strong> Secure, encrypted tokens to keep you logged in to your private Client Sanctuary or Admin Console.</p>
                  <p><strong className="text-[#171717]">Interactive Planning Consoles:</strong> Preserving draft wedding budgets, style quiz selections, and inquiry form progress during your visit.</p>
                  <p><strong className="text-[#171717]">Cookie Consent State:</strong> Storing your acknowledgement (`cookie_consent_ack`) so you are not repeatedly prompted on subsequent visits.</p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <ShieldCheck className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    2. Zero Cross-Site Invasive Tracking
                  </h3>
                </div>
                <p>
                  We respect the absolute privacy and digital discretion of our patrons:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[13px]">
                  <li>
                    <strong>No Advertising Profiling:</strong> We do not deploy third-party advertising tracking pixels or invasive retargeting beacons.
                  </li>
                  <li>
                    <strong>No Data Selling:</strong> We never sell, trade, or share browsing data with third-party data brokers or marketing networks.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <Database className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    3. Managing Storage & Clearing Preferences
                  </h3>
                </div>
                <p>
                  Patrons may at any time inspect, clear, or block local browser storage via their web browser settings. Clearing local storage will simply reset interactive planning drafts and require re-authenticating upon your next login.
                </p>
              </section>
            </div>

            {/* Nav Footer Links */}
            <div className="mt-8 flex items-center justify-between text-[12px] text-[#77736D]">
              <Link href="/privacy-policy" className="hover:text-[#171717] underline transition-colors">
                ← View Privacy Policy (DPDP Act, 2023)
              </Link>
              <Link href="/terms" className="hover:text-[#171717] underline transition-colors">
                View Terms of Curation →
              </Link>
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
};
