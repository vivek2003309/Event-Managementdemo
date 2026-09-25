/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PhoneAuthTab Component
 * Multi-step Firebase SMS OTP Authentication with invisible reCAPTCHA,
 * countdown resend timers, country code selector, and luxury editorial styling.
 */

import React, { useState, useEffect, useRef } from 'react';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { useRouter } from '../../lib/router';
import { Phone, ShieldCheck, ArrowRight, RotateCcw, Check, Sparkles, AlertCircle, Edit2 } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
];

export const PhoneAuthTab: React.FC = () => {
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const { addToast } = useToast();
  const { navigate } = useRouter();

  // Multi-step: 'input-phone' | 'verify-otp'
  const [step, setStep] = useState<'input-phone' | 'verify-otp'>('input-phone');

  // Phone input states
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');

  // OTP states
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Loading & status states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Recaptcha verifier ref
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Clean up recaptcha on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {}
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const getOrCreateRecaptchaVerifier = () => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        setErrorMsg('reCAPTCHA security check expired. Please try sending OTP again.');
      },
    });

    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 8) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }

    const fullPhoneNumber = `${countryCode}${cleanNumber}`;
    setIsSendingOtp(true);

    try {
      const appVerifier = getOrCreateRecaptchaVerifier();
      const result = await sendPhoneOtp(fullPhoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep('verify-otp');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);

      addToast({
        type: 'success',
        title: 'SMS Dispatched',
        message: `A 6-digit verification passkey was transmitted to ${countryCode} ${cleanNumber}.`,
      });

      // Auto-focus first OTP input after render
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      console.error('Send OTP Error:', err);
      // Reset reCAPTCHA if error
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {}
        recaptchaVerifierRef.current = null;
      }

      const msg =
        err?.code === 'auth/invalid-phone-number'
          ? 'Invalid phone number format. Please verify your country code.'
          : err?.code === 'auth/too-many-requests'
          ? 'SMS rate limit exceeded. Please wait a few moments before trying again.'
          : err?.message || 'Unable to send SMS verification code. Please check details.';
      setErrorMsg(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handle paste of entire OTP code
      const digits = val.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-advance to next input
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg('Please enter the full 6-digit verification passkey.');
      return;
    }

    if (!confirmationResult) {
      setErrorMsg('Session expired. Please request a new verification code.');
      setStep('input-phone');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyPhoneOtp(confirmationResult, fullOtp, fullName.trim() || undefined);
      addToast({
        type: 'success',
        title: 'Authentication Verified',
        message: 'Welcome to The Wedding Dreams Client Sanctuary.',
      });
      navigate('/client/dashboard');
    } catch (err: any) {
      console.error('OTP Verification error:', err);
      const msg =
        err?.code === 'auth/invalid-verification-code'
          ? 'Invalid verification code. Please re-enter the 6 digits sent to your device.'
          : err?.code === 'auth/code-expired'
          ? 'Passkey has expired. Please request a new code.'
          : err?.message || 'Verification failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Invisible Recaptcha Container */}
      <div id="recaptcha-container" />

      {errorMsg && (
        <div className="p-3 bg-[#FDF2F2] border border-[#F2C0C0] text-[#BA1A1A] text-[12px] rounded-[4px] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMsg}</span>
        </div>
      )}

      {step === 'input-phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
              Full Name <span className="text-[#9C968C] font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Radhika Merchant"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-[#D6CEBE] rounded-[4px] px-3 py-2 text-[14px] text-[#171717] placeholder:text-[#9C968C] focus:outline-none focus:border-[#C6A66B] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
              Mobile Coordinate
            </label>
            <div className="flex gap-2">
              {/* Country Code Select */}
              <div className="relative w-[110px] shrink-0">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full bg-white border border-[#D6CEBE] rounded-[4px] px-2.5 py-2 text-[13px] text-[#171717] focus:outline-none focus:border-[#C6A66B] transition-colors cursor-pointer appearance-none pr-6"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[#77736D] text-[10px]">
                  ▼
                </div>
              </div>

              {/* Number Input */}
              <div className="relative flex-1">
                <input
                  type="tel"
                  placeholder="98200 48210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full bg-white border border-[#D6CEBE] rounded-[4px] pl-9 pr-3 py-2 text-[14px] text-[#171717] placeholder:text-[#9C968C] focus:outline-none focus:border-[#C6A66B] transition-colors font-mono"
                />
                <Phone className="w-3.5 h-3.5 text-[#C6A66B] absolute left-3 top-3" />
              </div>
            </div>
            <p className="text-[11px] text-[#9C968C] font-light mt-1">
              A private 6-digit cryptographic passkey will be transmitted via SMS.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSendingOtp}
            className="w-full bg-[#171717] hover:bg-[#C6A66B] text-white py-2.5 px-4 rounded-[4px] text-[12px] font-medium uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 mt-2"
          >
            {isSendingOtp ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Transmitting Passkey...</span>
              </>
            ) : (
              <>
                <span>Transmit Verification Passkey</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE5DC] rounded-[6px] flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#77736D]">
                Verification Code Sent To
              </div>
              <div className="font-mono text-[13px] font-medium text-[#171717]">
                {countryCode} {phoneNumber}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep('input-phone');
                setErrorMsg(null);
              }}
              className="text-[11px] text-[#C6A66B] hover:text-[#8C6D37] flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] text-center">
              Enter 6-Digit SMS Passkey
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 sm:w-11 h-12 text-center text-[18px] font-mono font-semibold bg-white border border-[#D6CEBE] rounded-[4px] text-[#171717] focus:outline-none focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B] transition-all"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-[#77736D]">Didn't receive SMS passkey?</span>
            {resendTimer > 0 ? (
              <span className="text-[#9C968C] font-mono">
                Resend in {resendTimer}s
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={isSendingOtp}
                className="text-[#C6A66B] hover:text-[#171717] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.join('').length !== 6}
            className="w-full bg-[#171717] hover:bg-[#C6A66B] text-white py-2.5 px-4 rounded-[4px] text-[12px] font-medium uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 mt-2"
          >
            {isVerifying ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Dossier...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Verify &amp; Enter Sanctuary</span>
              </>
            )}
          </button>
        </form>
      )}

      <div className="pt-2 text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-[#9C968C]">
          <Sparkles className="w-3 h-3 text-[#C6A66B]" />
          <span>Protected by Firebase Secure Cloud Gateway</span>
        </div>
      </div>
    </div>
  );
};
