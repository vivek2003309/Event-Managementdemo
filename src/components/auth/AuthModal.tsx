/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AuthModal Component
 * Editorial modal supporting Google Sign-In, Phone SMS OTP verification, and Email/Password authentication.
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { PhoneAuthTab } from './PhoneAuthTab';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { Lock, Mail, Phone, Sparkles, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'phone' | 'email' | 'google';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'phone',
}) => {
  const {
    signInWithGoogle,
    loginWithEmail,
    signupWithEmail,
    resetPassword,
    error,
    clearError,
  } = useAuth();
  const { addToast } = useToast();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [emailMode, setEmailMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleGoogleSignIn = async () => {
    clearError();
    setSubmitting(true);
    try {
      await signInWithGoogle();
      addToast({
        type: 'success',
        title: 'Google Sign-In Verified',
        message: 'Welcome to your private wedding sanctuary.',
      });
      onClose();
    } catch (err) {
      // error set in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);

    try {
      if (emailMode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
        addToast({
          type: 'success',
          title: 'Instructions Transmitted',
          message: 'Password reset link sent to your email address.',
        });
      } else if (emailMode === 'signup') {
        await signupWithEmail(email, password, name);
        addToast({
          type: 'success',
          title: 'Account Provisioned',
          message: 'Welcome to The Wedding Dreams client portal.',
        });
        onClose();
      } else {
        await loginWithEmail(email, password);
        addToast({
          type: 'success',
          title: 'Welcome Back',
          message: 'Authentication successful.',
        });
        onClose();
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#171717] text-[#C6A66B] flex items-center justify-center mx-auto border border-[#C6A66B]/30 shadow-inner">
            <Lock className="w-5 h-5 stroke-[1.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-[#FAF8F5] border border-[#EAE5DC] text-[10px] uppercase tracking-wider font-semibold text-[#8C6D37]">
            <Sparkles className="w-3 h-3 text-[#C6A66B]" />
            <span>Private Nuptial Sanctuary</span>
          </div>

          <h3 className="font-serif text-[26px] text-[#171717] font-normal">
            Authenticate Session
          </h3>
          <p className="text-[12px] text-[#77736D] max-w-sm mx-auto">
            Access your curated wedding blueprints, budget ledgers, and private directorship communications.
          </p>
        </div>

        {/* Auth Method Selector Tabs */}
        <div className="flex rounded-[6px] bg-[#FAF8F5] p-1 border border-[#EAE5DC] text-[11px] font-medium">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              clearError();
            }}
            className={`flex-1 py-1.5 rounded-[4px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'phone'
                ? 'bg-[#171717] text-white font-semibold shadow-xs'
                : 'text-[#77736D] hover:text-[#171717]'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Phone OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              clearError();
            }}
            className={`flex-1 py-1.5 rounded-[4px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'email'
                ? 'bg-[#171717] text-white font-semibold shadow-xs'
                : 'text-[#77736D] hover:text-[#171717]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Email Access</span>
          </button>
        </div>

        {/* Google Quick Sign-In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full py-2.5 px-4 rounded-[4px] bg-white border border-[#D6CEBE] hover:border-[#171717] hover:bg-[#FAF8F5] text-[#171717] text-[12px] font-medium uppercase tracking-[0.08em] flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#EAE5DC] w-full" />
          <span className="bg-white px-3 text-[10px] uppercase tracking-widest text-[#9C968C] absolute font-medium">
            {authMethod === 'phone' ? 'Or Mobile Passkey' : 'Or Email Login'}
          </span>
        </div>

        {/* Tab 1: Phone OTP Flow */}
        {authMethod === 'phone' && <PhoneAuthTab />}

        {/* Tab 2: Email Flow */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4 animate-in fade-in duration-300">
            {error && (
              <div className="p-3 bg-[#FDF2F2] border border-[#F2C0C0] text-[#BA1A1A] text-[12px] rounded-[4px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {resetSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] rounded-[4px] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Password reset link sent to your email.</span>
              </div>
            )}

            {emailMode === 'signup' && (
              <div className="space-y-1">
                <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika Merchant"
                  className="w-full bg-white border border-[#D6CEBE] rounded-[4px] px-3 py-2 text-[13px] text-[#171717] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@theweddingdreams.com"
                className="w-full bg-white border border-[#D6CEBE] rounded-[4px] px-3 py-2 text-[13px] text-[#171717] focus:outline-none focus:border-[#C6A66B]"
              />
            </div>

            {emailMode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
                    Password
                  </label>
                  {emailMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setEmailMode('forgot')}
                      className="text-[10px] text-[#8C6D37] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#D6CEBE] rounded-[4px] px-3 py-2 text-[13px] text-[#171717] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={submitting}
              className="w-full justify-center mt-2 cursor-pointer shadow-sm"
              rightIcon={
                submitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
                )
              }
            >
              {submitting
                ? 'Authenticating...'
                : emailMode === 'forgot'
                ? 'Send Password Recovery'
                : emailMode === 'signup'
                ? 'Create Client Sanctuary'
                : 'Enter Client Sanctuary'}
            </Button>

            {/* Email Mode Sub-Toggle */}
            <div className="pt-2 text-center text-[11px] text-[#77736D]">
              {emailMode === 'login' && (
                <p>
                  Need a new client account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setEmailMode('signup');
                      clearError();
                    }}
                    className="text-[#8C6D37] font-semibold hover:underline cursor-pointer ml-1"
                  >
                    Sign up
                  </button>
                </p>
              )}
              {emailMode === 'signup' && (
                <p>
                  Already have credentials?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setEmailMode('login');
                      clearError();
                    }}
                    className="text-[#8C6D37] font-semibold hover:underline cursor-pointer ml-1"
                  >
                    Log in
                  </button>
                </p>
              )}
              {emailMode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setEmailMode('login');
                    clearError();
                    setResetSent(false);
                  }}
                  className="text-[#8C6D37] font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Return to login</span>
                </button>
              )}
            </div>
          </form>
        )}

        <div className="pt-2 border-t border-[#EAE5DC] flex items-center justify-center gap-1.5 text-[11px] text-[#9C968C]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C6A66B]" />
          <span>256-Bit SSL Encrypted Protocol &bull; Firebase Verified</span>
        </div>
      </div>
    </Modal>
  );
};
