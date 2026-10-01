/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AuthModal Component
 * Streamlined editorial modal strictly supporting Email & Password authentication for Client Sanctuary.
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { Lock, Sparkles, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'email';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    loginWithEmail,
    resetPassword,
    error,
    clearError,
  } = useAuth();
  const { addToast } = useToast();

  const [emailMode, setEmailMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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
      } else {
        await loginWithEmail(email, password);
        addToast({
          type: 'success',
          title: 'Welcome to Client Sanctuary',
          message: 'Authentication successful.',
        });
        onClose();
      }
    } catch (err) {
      // Handled in context / error state
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
            Client Sanctuary Login
          </h3>
          <p className="text-[12px] text-[#77736D] max-w-sm mx-auto leading-relaxed">
            Access is reserved exclusively for commissioned wedding clients. Please use the credentials provided by your atelier director.
          </p>
        </div>

        {/* Email & Password Form */}
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

          <div className="space-y-1">
            <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
              Registered Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. couple@atelierweddings.com"
              className="w-full bg-white border border-[#D6CEBE] rounded-[4px] px-3.5 py-2.5 text-[13px] text-[#171717] focus:outline-none focus:border-[#C6A66B]"
            />
          </div>

          {emailMode !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
                  Atelier Access Key / Password
                </label>
                <button
                  type="button"
                  onClick={() => setEmailMode('forgot')}
                  className="text-[10px] text-[#8C6D37] hover:underline cursor-pointer"
                >
                  Forgot access key?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin-issued access password"
                className="w-full bg-white border border-[#D6CEBE] rounded-[4px] px-3.5 py-2.5 text-[13px] text-[#171717] focus:outline-none focus:border-[#C6A66B]"
              />
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={submitting}
            className="w-full justify-center mt-3 cursor-pointer shadow-sm py-3 bg-[#171717] text-white hover:bg-[#C6A66B] uppercase tracking-[0.12em] font-medium"
            rightIcon={
              submitting ? (
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
              )
            }
          >
            {submitting ? 'Authenticating...' : emailMode === 'forgot' ? 'Send Password Recovery' : 'ENTER CLIENT SANCTUARY'}
          </Button>

          {emailMode === 'forgot' && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmailMode('login');
                  clearError();
                  setResetSent(false);
                }}
                className="text-[#8C6D37] font-semibold text-[11px] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Return to login</span>
              </button>
            </div>
          )}
        </form>

        <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-center gap-1.5 text-[11px] text-[#9C968C]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C6A66B]" />
          <span>256-Bit SSL Encrypted Protocol &bull; Verified Client Sanctuary</span>
        </div>
      </div>
    </Modal>
  );
};
