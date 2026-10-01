import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/layout/SectionHeading';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Lock, FileText, ArrowLeft, Mail, Phone, MapPin, UserCheck, AlertCircle } from 'lucide-react';
import { useRouter, Link } from '../lib/router';

export const PrivacyPolicyPage: React.FC = () => {
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
              kicker="Governance & Data Fiduciary Charter"
              title="Privacy Policy & Data Protection (DPDP Act, 2023)"
              subtitle="Confidentiality protocol, data processing scope, and statutory patron rights under India's Digital Personal Data Protection Act, 2023."
            />

            {/* Fiduciary Contact Banner Card */}
            <div className="bg-[#171717] text-[#F8F5EF] p-6 sm:p-8 rounded-[8px] border border-[#C5A059]/30 mb-10 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-1">
                    Designated Data Fiduciary
                  </span>
                  <h3 className="font-serif text-[22px] text-white font-normal">
                    The Wedding Dreams by Varun Rathor
                  </h3>
                </div>
                <ShieldCheck className="w-8 h-8 text-[#C5A059] shrink-0" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px] text-white/80 pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-[11px] uppercase tracking-wider">Registered Address:</strong>
                    <span className="text-white/70">
                      Ground Floor, 1/202/35, Sadar Bazar Road, Piru Vihar, Sadar Bazaar, Delhi Cantonment, New Delhi 110010
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-[11px] uppercase tracking-wider">Direct Line:</strong>
                    <span className="text-white/70">+91 9871211995</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-[11px] uppercase tracking-wider">Data Protection Desk:</strong>
                    <span className="text-white/70">inquiries@theweddingdreams.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Content Card */}
            <div className="bg-white p-8 sm:p-12 rounded-[12px] border border-[#EAE5DC] shadow-sm space-y-10 text-[14px] text-[#55524E] leading-relaxed font-light">
              {/* Section 1 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-[#171717]">
                  <ShieldCheck className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    1. Data Fiduciary Identity & Statutory Compliance
                  </h3>
                </div>
                <p>
                  <strong>The Wedding Dreams by Varun Rathor</strong> acts as the sole Data Fiduciary responsible for processing personal data provided by patrons, prospective clients, and partners. All processing activities adhere strictly to the mandate of the <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em> of India and international discreet hospitality standards.
                </p>
              </section>

              {/* Section 2 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <Lock className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    2. Data Collection Scope
                  </h3>
                </div>
                <p>
                  To safeguard absolute client discretion and minimize digital exposure, our collection of personal data is limited strictly to necessary parameters:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DC] rounded-[6px]">
                    <strong className="text-[#171717] font-medium block mb-1 text-[13px]">
                      Identity & Coordinates
                    </strong>
                    <p className="text-[12px] text-[#77736D]">
                      Patron Full Name, Secondary Partner/Family Contact Name, Telephone/WhatsApp number, and Email Address.
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] border border-[#EAE5DC] rounded-[6px]">
                    <strong className="text-[#171717] font-medium block mb-1 text-[13px]">
                      Celebration Parameters
                    </strong>
                    <p className="text-[12px] text-[#77736D]">
                      Target event dates, guest list size envelopes, preferred destination enclaves (e.g., Udaipur, Jaipur, Lake Como), and stylistic preferences.
                    </p>
                  </div>
                </div>
                <p className="text-[13px] text-[#8C827A] italic pt-1">
                  * Note: We do not collect biometric data, sensitive financial credentials on public pages, or invasive cross-site tracking markers.
                </p>
              </section>

              {/* Section 3 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <FileText className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    3. Legal Purpose & Directorial Processing
                  </h3>
                </div>
                <p>
                  Personal data transmitted through our web portal, concierge widget, or planning consoles is processed exclusively for specified legal purposes:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[13px]">
                  <li>
                    <strong>Directorial Consultation & Proposal Curation:</strong> Preparing tailor-made spatial blueprints, palace feasibility checks, and budget estimates.
                  </li>
                  <li>
                    <strong>Client Concierge Communication:</strong> Scheduling private consultations, transmitting cue sheets, and responding to WhatsApp or telephonic inquiries.
                  </li>
                  <li>
                    <strong>Authenticated Client Sanctuary Access:</strong> Managing secure role-based client portal logins and private wedding itineraries.
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="space-y-4 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <UserCheck className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    4. Patron Data Rights Under DPDP Act, 2023
                  </h3>
                </div>
                <p>
                  In compliance with the DPDP Act 2023, every patron (“Data Principal”) enjoys unencumbered statutory rights regarding their personal data:
                </p>
                <div className="space-y-3 text-[13px]">
                  <div className="p-3 border-l-2 border-[#C5A059] bg-[#FAF8F5] pl-4">
                    <strong className="text-[#171717]">Right to Access & Summary:</strong> Request a comprehensive digital summary of all personal data held within our studio systems.
                  </div>
                  <div className="p-3 border-l-2 border-[#C5A059] bg-[#FAF8F5] pl-4">
                    <strong className="text-[#171717]">Right to Correction & Erasure:</strong> Instruct the directorship to correct inaccurate data or permanently delete your celebration dossier.
                  </div>
                  <div className="p-3 border-l-2 border-[#C5A059] bg-[#FAF8F5] pl-4">
                    <strong className="text-[#171717]">Right to Withdraw Consent:</strong> Revoke consent for communications or data processing at any point without penalty.
                  </div>
                  <div className="p-3 border-l-2 border-[#C5A059] bg-[#FAF8F5] pl-4">
                    <strong className="text-[#171717]">Right of Grievance Redressal:</strong> Seek immediate resolution for any privacy concerns via our designated Data Protection Officer.
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="space-y-3 border-t border-[#EAE5DC] pt-8">
                <div className="flex items-center gap-2 text-[#171717]">
                  <AlertCircle className="w-5 h-5 text-[#C6A66B]" />
                  <h3 className="font-serif text-[22px] font-normal">
                    5. Grievance Redressal Mechanism
                  </h3>
                </div>
                <p>
                  If you have questions regarding data privacy, wish to exercise your DPDP rights, or desire a permanent deletion of your inquiry dossier, please contact our Data Protection Office:
                </p>
                <div className="p-5 bg-[#F8F5EF] border border-[#E5DFD3] rounded-[8px] text-[13px] space-y-2">
                  <p><strong className="text-[#171717]">Grievance Redressal Officer:</strong> Directorial Privacy Desk</p>
                  <p><strong className="text-[#171717]">Fiduciary Entity:</strong> The Wedding Dreams by Varun Rathor</p>
                  <p><strong className="text-[#171717]">Physical Address:</strong> Ground Floor, 1/202/35, Sadar Bazar Road, Piru Vihar, Sadar Bazaar, Delhi Cantonment, New Delhi 110010</p>
                  <p><strong className="text-[#171717]">Email:</strong> <a href="mailto:inquiries@theweddingdreams.com" className="text-[#C6A66B] hover:underline">inquiries@theweddingdreams.com</a></p>
                  <p><strong className="text-[#171717]">Telephone:</strong> +91 9871211995</p>
                  <p className="text-[12px] text-[#77736D] pt-1">
                    * Resolution Commitment: All privacy inquiries and erasure requests are acknowledged within 24 hours and completed within 72 business hours.
                  </p>
                </div>
              </section>
            </div>

            {/* Nav Footer Links */}
            <div className="mt-8 flex items-center justify-between text-[12px] text-[#77736D]">
              <Link href="/terms" className="hover:text-[#171717] underline transition-colors">
                View Terms of Curation →
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
