import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../lib/router';
import { useToast } from '../components/ui/Toast';
import { PhoneAuthTab } from '../components/auth/PhoneAuthTab';
import {
  Lock,
  Mail,
  KeyRound,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Check,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const {
    user,
    profile,
    loading,
    isAdmin,
    error,
    signInWithGoogle,
    loginWithEmail,
    signupWithEmail,
    updateUserPhone,
    resetPassword,
    logout,
    clearError,
  } = useAuth();
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [resetSent, setResetSent] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Phone linking state for logged-in users
  const [linkingPhone, setLinkingPhone] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState(profile?.phone || profile?.phoneNumber || '');
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

  // If already logged in, show account sanctuary card
  if (user && !submitting) {
    return (
      <div className="w-full pt-28 pb-24 bg-[#FDFBF7] min-h-screen">
        <PageContainer>
          <div className="max-w-md mx-auto bg-white p-8 sm:p-10 rounded-[12px] border border-[#EAE5DC] shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-[#171717] text-[#C6A66B] flex items-center justify-center mx-auto mb-4 border-2 border-[#C6A66B]/40 shadow-inner">
              {profile?.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName || 'User'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-7 h-7" />
              )}
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
              {isAdmin ? 'Directorial Command Active' : 'Authenticated Client Sanctuary'}
            </span>
            <h2 className="font-serif text-[26px] text-[#171717] font-normal mb-1">
              {profile?.displayName || user.displayName || 'Esteemed Guest'}
            </h2>
            <p className="text-[12px] text-[#77736D] mb-4 font-mono">
              {user.email || user.phoneNumber || 'Authenticated Patron'}
            </p>

            {/* Linked Phone Status / Update Field */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE5DC] rounded-[8px] mb-6 text-left space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#77736D] uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C6A66B]" />
                  <span>Verified WhatsApp / Mobile</span>
                </span>
                {!linkingPhone && (
                  <button
                    type="button"
                    onClick={() => setLinkingPhone(true)}
                    className="text-[#C6A66B] hover:text-[#8C6D37] font-medium text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    {profile?.phone || profile?.phoneNumber ? 'Update' : 'Link Phone'}
                  </button>
                )}
              </div>

              {linkingPhone ? (
                <div className="flex gap-2 pt-1">
                  <input
                    type="tel"
                    placeholder="+91 98200 48210"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    className="flex-1 bg-white border border-[#D6CEBE] rounded-[4px] px-2.5 py-1.5 text-[12px] text-[#171717] font-mono focus:outline-none focus:border-[#C6A66B]"
                  />
                  <button
                    type="button"
                    disabled={isUpdatingPhone || !newPhoneNumber.trim()}
                    onClick={async () => {
                      setIsUpdatingPhone(true);
                      try {
                        await updateUserPhone(newPhoneNumber.trim());
                        setLinkingPhone(false);
                        addToast({
                          type: 'success',
                          title: 'Contact Verified',
                          message: 'Your phone coordinate has been linked to your dossier.',
                        });
                      } catch (err) {
                        addToast({
                          type: 'error',
                          title: 'Update Error',
                          message: 'Could not update phone number.',
                        });
                      } finally {
                        setIsUpdatingPhone(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#171717] text-white text-[11px] font-medium rounded-[4px] hover:bg-[#C6A66B] transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkingPhone(false)}
                    className="px-2 py-1.5 text-[11px] text-[#77736D] hover:text-[#171717] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="font-mono text-[13px] text-[#171717] font-medium">
                  {profile?.phone || profile?.phoneNumber || (
                    <span className="text-[#9C968C] font-normal italic text-[12px]">
                      No mobile number linked yet
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {isAdmin ? (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => navigate('/admin')}
                  rightIcon={<ArrowRight className="w-4 h-4 text-[#C6A66B]" />}
                >
                  Enter Atelier Command (Admin)
                </Button>
              ) : null}

              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center"
                onClick={() => navigate('/client')}
              >
                Go to My Wedding Sanctuary
              </Button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  addToast({
                    type: 'info',
                    title: 'Signed Out',
                    message: 'Your authenticated session has ended securely.',
                  });
                }}
                className="w-full py-2.5 text-[11px] uppercase tracking-wider text-[#77736D] hover:text-[#171717] transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);

    try {
      if (mode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
        addToast({
          type: 'success',
          title: 'Instructions Transmitted',
          message: 'Check your email for secure password reset link.',
        });
      } else if (mode === 'signup') {
        await signupWithEmail(email, password, name);
        addToast({
          type: 'success',
          title: 'Welcome to The Wedding Dreams',
          message: 'Your client account has been securely provisioned.',
        });
        navigate('/client');
      } else {
        await loginWithEmail(email, password);
        addToast({
          type: 'success',
          title: 'Authentication Successful',
          message: 'Welcome back to your wedding portal.',
        });
        if (isAdminMode) {
          navigate('/admin');
        } else {
          navigate('/client');
        }
      }
    } catch (err: any) {
      // Handled in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

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
      if (isAdminMode) {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch (err) {
      // Error handled
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full pt-28 pb-24 bg-[#FDFBF7] min-h-screen">
      <PageContainer>
        <div className="max-w-md mx-auto bg-white p-7 sm:p-10 rounded-[12px] border border-[#EAE5DC] shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#171717] text-[#C6A66B] flex items-center justify-center mx-auto mb-3 border border-[#C6A66B]/30 shadow-inner">
              <Lock className="w-5 h-5 stroke-[1.5]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-[#FAF8F5] border border-[#EAE5DC] text-[10px] uppercase tracking-wider font-semibold text-[#8C6D37] mb-2">
              <Sparkles className="w-3 h-3 text-[#C6A66B]" />
              <span>{isAdminMode ? 'Directorial Command Access' : 'Private Client Sanctuary'}</span>
            </div>

            <h1 className="font-serif text-[28px] text-[#171717] font-normal leading-tight">
              {mode === 'forgot'
                ? 'Reset Security Credentials'
                : mode === 'signup'
                ? 'Create Client Account'
                : isAdminMode
                ? 'Atelier Directorship Login'
                : 'Welcome Back'}
            </h1>
            <p className="text-[12px] text-[#77736D] leading-relaxed mt-1 font-light">
              {mode === 'forgot'
                ? 'Enter your verified email to receive a password recovery transmission.'
                : mode === 'signup'
                ? 'Create a confidential dossier to track your plans, budget allocations, and ceremony tasks.'
                : isAdminMode
                ? 'Restricted portal for directorship operations, lead triage, and contract reviews.'
                : 'Sign in to access your wedding portfolio, budgets, and dedicated planners.'}
            </p>
          </div>

          {/* Role Toggle: Client vs Admin */}
          <div className="flex rounded-[6px] bg-[#FAF8F5] p-1 border border-[#EAE5DC] mb-6 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(false);
                clearError();
              }}
              className={`flex-1 py-1.5 rounded-[4px] transition-all cursor-pointer ${
                !isAdminMode
                  ? 'bg-white text-[#171717] font-semibold shadow-xs'
                  : 'text-[#77736D] hover:text-[#171717]'
              }`}
            >
              Client Sanctuary
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(true);
                setMode('login');
                clearError();
              }}
              className={`flex-1 py-1.5 rounded-[4px] transition-all cursor-pointer ${
                isAdminMode
                  ? 'bg-[#171717] text-[#C6A66B] font-semibold shadow-xs'
                  : 'text-[#77736D] hover:text-[#171717]'
              }`}
            >
              Admin Command
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-[6px] bg-[#FDF2F2] border border-[#F2C0C0] text-[#BA1A1A] text-[12px] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{error}</div>
            </div>
          )}

          {/* Reset Sent Banner */}
          {resetSent && (
            <div className="mb-5 p-3 rounded-[6px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">
                Password recovery transmission dispatched. Please check your inbox.
              </div>
            </div>
          )}

          {/* Email & Password Form (Strictly Email + Password for both Admin and Client) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isAdminMode && mode === 'signup' && (
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full bg-[#FAF8F5] text-[13px] py-2 px-3 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B] focus:bg-white"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#77736D] block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminMode ? "admin@theweddingdreams.com" : "Enter registered client email"}
                className="w-full bg-[#FAF8F5] text-[13px] py-2.5 px-3 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B] focus:bg-white"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#77736D]">
                    {isAdminMode ? 'Password' : 'Atelier Access Key / Password'}
                  </label>
                  {isAdminMode && mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
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
                  placeholder={isAdminMode ? "Admin@Wedding2026" : "Enter admin-issued access password"}
                  className="w-full bg-[#FAF8F5] text-[13px] py-2.5 px-3 rounded-[4px] border border-[#EAE5DC] focus:outline-none focus:border-[#C6A66B] focus:bg-white"
                />
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={submitting}
              className="w-full justify-center mt-3 py-3 cursor-pointer shadow-sm bg-[#171717] text-white hover:bg-[#C6A66B] uppercase tracking-[0.12em] font-medium"
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
                : mode === 'forgot'
                ? 'Send Recovery Link'
                : isAdminMode
                ? 'AUTHENTICATE AS DIRECTOR'
                : 'ENTER CLIENT SANCTUARY'}
            </Button>
          </form>

          {/* Toggle between Login, Signup, and Forgot */}
          <div className="mt-6 pt-4 border-t border-[#EAE5DC] text-center text-[12px] text-[#77736D]">
            {mode === 'login' && !isAdminMode && (
              <p>
                First time coordinating with us?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    clearError();
                  }}
                  className="text-[#8C6D37] font-semibold hover:underline cursor-pointer ml-1"
                >
                  Create an account
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p>
                Already have a commissioned dossier?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    clearError();
                  }}
                  className="text-[#8C6D37] font-semibold hover:underline cursor-pointer ml-1"
                >
                  Log in
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  clearError();
                  setResetSent(false);
                }}
                className="text-[#8C6D37] font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Return to Sign In</span>
              </button>
            )}
          </div>

          <div className="mt-5 text-[11px] text-[#9C968C] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>End-to-End Encrypted &bull; 256-Bit SSL Sanctuary</span>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
