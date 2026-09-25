import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';
import { useRouter } from '../lib/router';

export const LegalPage: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  const { navigate } = useRouter();
  const isPrivacy = type === 'privacy';

  return (
    <div className="w-full pt-12 pb-24">
      <Section variant="ivory" spacing="md">
        <PageContainer>
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#77736D] hover:text-[#171717] transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#C6A66B]" />
              <span>Return to Atelier Home</span>
            </button>

            <SectionHeading
              kicker={isPrivacy ? 'Confidentiality Sanctuary' : 'Governance & Protocol'}
              title={isPrivacy ? 'Privacy & Data Protection Policy' : 'Terms of Atelier Curation'}
              subtitle={
                isPrivacy
                  ? 'Our strict non-disclosure safeguards, encryption protocols, and discreet concierge privacy architecture.'
                  : 'Commissioning parameters, cancellation charters, and directorial exclusivity terms.'
              }
            />

            <div className="bg-white p-8 sm:p-12 rounded-[12px] border border-[#EAE5DC] shadow-sm space-y-8 text-[14px] text-[#55524E] leading-relaxed font-light">
              {isPrivacy ? (
                <>
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-[#171717]">
                      <ShieldCheck className="w-5 h-5 text-[#C6A66B]" />
                      <h3 className="font-serif text-[22px] font-normal">
                        1. Strict Client Confidentiality &amp; NDA
                      </h3>
                    </div>
                    <p>
                      The Wedding Dreams operates under strict non-disclosure principles. We recognize that our patrons value utmost discretion. Details regarding high-profile family lineages, venue locks, guest lists, and capital allocations remain completely sealed within encrypted dossiers.
                    </p>
                  </section>

                  <section className="space-y-3 border-t border-[#EAE5DC] pt-6">
                    <div className="flex items-center gap-2 text-[#171717]">
                      <Lock className="w-5 h-5 text-[#C6A66B]" />
                      <h3 className="font-serif text-[22px] font-normal">
                        2. Information We Collect &amp; Store
                      </h3>
                    </div>
                    <p>
                      When you submit an inquiry, complete a wedding planning blueprint, or sign in to your Client Sanctuary, we store:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-[13px]">
                      <li>Authenticated account credentials verified by Google or email security.</li>
                      <li>Ceremony locations, projected dates, and guest demographics.</li>
                      <li>Indicative budget parameters and vendor contract allocations.</li>
                      <li>Travel itineraries, flight details, and rooming allocations for guest hospitality.</li>
                    </ul>
                  </section>

                  <section className="space-y-3 border-t border-[#EAE5DC] pt-6">
                    <h3 className="font-serif text-[22px] text-[#171717] font-normal">
                      3. Digital Architecture &amp; Role-Based Access
                    </h3>
                    <p>
                      All database transactions are governed by Firestore security rules. Clients are strictly restricted to their own wedding dossiers, while administrative command access is locked to verified directorial emails. We never sell, monetize, or broker your personal information.
                    </p>
                  </section>

                  <section className="space-y-3 border-t border-[#EAE5DC] pt-6">
                    <h3 className="font-serif text-[22px] text-[#171717] font-normal">
                      4. Inquiries &amp; Data Rights
                    </h3>
                    <p>
                      Patrons may request a complete export or purge of their private dossier at any time by transmitting a formal request to our directorship at <span className="font-mono text-[#171717]">atelier@theweddingdreams.com</span>.
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-[#171717]">
                      <FileText className="w-5 h-5 text-[#C6A66B]" />
                      <h3 className="font-serif text-[22px] font-normal">
                        1. Directorial Retainers &amp; Exclusivity
                      </h3>
                    </div>
                    <p>
                      To guarantee singular attention, The Wedding Dreams accepts a maximum of 12 full-scale commissions per calendar season. Engagement commences upon execution of the master directorship agreement and receipt of the initial commissioning retainer.
                    </p>
                  </section>

                  <section className="space-y-3 border-t border-[#EAE5DC] pt-6">
                    <h3 className="font-serif text-[22px] text-[#171717] font-normal">
                      2. Heritage Venue &amp; Government Clearances
                    </h3>
                    <p>
                      All palace privatization locks, maritime vessel clearances on Lake Pichola, and acoustic sound permits are processed under prevailing local heritage authority regulations. We coordinate all statutory filings on your behalf.
                    </p>
                  </section>

                  <section className="space-y-3 border-t border-[#EAE5DC] pt-6">
                    <h3 className="font-serif text-[22px] text-[#171717] font-normal">
                      3. Zero Vendor Markups &amp; Transparency
                    </h3>
                    <p>
                      We operate with complete fiscal transparency. Third-party vendor contracts (caterers, pyrotechnicians, floral suppliers) are billed directly at source rates without hidden markups or intermediary commissions.
                    </p>
                  </section>
                </>
              )}

              <div className="pt-6 border-t border-[#EAE5DC] flex items-center justify-between">
                <span className="text-[11px] text-[#9C968C] uppercase tracking-wider">
                  Updated: Season 2025/2026
                </span>
                <Button variant="primary" size="sm" onClick={() => navigate('/contact')}>
                  Connect with Directorship
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
};
