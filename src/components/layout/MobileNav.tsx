import React from 'react';
import { Link, useRouter } from '../../lib/router';
import { MAIN_NAV_ITEMS, UTILITY_NAV_ITEMS } from '../../data/navigation';
import { X, ArrowRight, User, LogOut, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLetTalk?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onOpenLetTalk }) => {
  const { path, navigate } = useRouter();
  const { user, profile, isAdmin, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden flex justify-end" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-[#F8F5EF] h-full shadow-2xl flex flex-col justify-between p-5 sm:p-6 z-10 border-l border-[#EAE5DC] overflow-y-auto animate-fade-in">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#EAE5DC]">
            <div className="flex flex-col">
              <span className="font-serif text-[18px] tracking-[0.18em] uppercase text-[#171717] font-medium">
                The Wedding Dreams
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-medium mt-0.5">
                Couture & Scenography
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="min-w-[44px] min-h-[44px] p-2.5 text-[#77736D] hover:text-[#171717] rounded-[4px] hover:bg-[#EAE5DC]/60 active:bg-[#EAE5DC] transition-colors flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-5 flex flex-col space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8C827A] px-1 mb-1">
              Main Menu
            </span>
            {MAIN_NAV_ITEMS.map((item) => {
              const active = item.path === '/' ? (path === '/' || path === '/weddings') : path.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`min-h-[48px] flex items-center justify-between px-3.5 py-3 rounded-[4px] transition-all text-[15px] tracking-wide cursor-pointer ${
                    active
                      ? 'bg-[#C5A059]/15 border-l-4 border-[#C5A059] text-[#171717] font-semibold shadow-2xs'
                      : 'text-[#4A4744] hover:text-[#171717] hover:bg-[#EAE5DC]/50 active:bg-[#EAE5DC]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {active && <span className="w-2 h-2 rounded-full bg-[#C5A059] shrink-0" />}
                    <span className={active ? 'font-serif text-[17px] text-[#171717]' : ''}>{item.label}</span>
                  </span>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${active ? 'text-[#C5A059] translate-x-0.5' : 'text-[#8C827A]'}`} />
                </Link>
              );
            })}

            {/* Curatorial Tools Section */}
            <div className="pt-4 pb-1 border-t border-[#EAE5DC] mt-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8C827A] px-1 block mb-2">
                Curatorial Tools
              </span>
              {UTILITY_NAV_ITEMS.map((item) => {
                const active = path.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[4px] text-[13px] transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#C5A059]/10 text-[#8C6D37] font-semibold'
                        : 'text-[#252525] hover:text-[#C5A059] hover:bg-[#EAE5DC]/40'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[12px] text-[#C5A059]">→</span>
                  </Link>
                );
              })}
            </div>

            {/* Account & Directorship Sanctuary */}
            <div className="pt-4 pb-1 border-t border-[#EAE5DC]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8C827A] px-1 block mb-2">
                Portal Access
              </span>
              {user ? (
                <div className="space-y-1">
                  <Link
                    href="/client"
                    onClick={onClose}
                    className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[4px] text-[13px] font-medium cursor-pointer transition-colors ${
                      path.startsWith('/client') ? 'bg-[#C5A059]/15 text-[#8C6D37] font-semibold' : 'text-[#171717] hover:text-[#C5A059] hover:bg-[#EAE5DC]/40'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#C5A059]" />
                      <span>Client Sanctuary</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#8C6D37]">Active</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[4px] text-[13px] font-medium cursor-pointer transition-colors ${
                        path.startsWith('/admin') ? 'bg-[#C5A059]/15 text-[#8C6D37] font-semibold' : 'text-[#8C6D37] hover:bg-[#EAE5DC]/40'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        <span>Atelier Command</span>
                      </span>
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#C5A059]/25 text-[#8C6D37] font-bold">Admin</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      onClose();
                      await logout();
                      navigate('/');
                    }}
                    className="w-full min-h-[44px] flex items-center gap-2 px-3.5 py-2.5 text-[12px] text-[#BA1A1A] hover:bg-red-50 rounded-[4px] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[4px] text-[13px] font-medium transition-colors cursor-pointer ${
                    path === '/login' || path === '/auth' ? 'bg-[#C5A059]/15 text-[#8C6D37] font-semibold' : 'text-[#171717] hover:text-[#C5A059] hover:bg-[#EAE5DC]/40'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C5A059]" />
                    <span>Client &bull; Admin Sign In</span>
                  </span>
                  <span className="text-[12px] text-[#C5A059]">→</span>
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-5 border-t border-[#EAE5DC] flex flex-col space-y-3">
          <Link
            href="/plan-my-wedding"
            onClick={onClose}
            className="w-full min-h-[48px] py-3.5 px-4 rounded-[4px] bg-[#C5A059] hover:bg-[#b08d4b] text-black text-[12px] font-semibold uppercase tracking-[0.16em] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <span>Plan My Wedding</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>

          <button
            onClick={() => {
              onClose();
              if (onOpenLetTalk) {
                onOpenLetTalk();
              } else {
                navigate('/contact');
              }
            }}
            className="w-full min-h-[48px] py-3 px-4 rounded-[4px] bg-transparent border border-[#171717]/40 text-[#171717] text-[12px] font-medium uppercase tracking-[0.16em] hover:bg-[#171717] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Let's Talk</span>
          </button>

          <div className="text-center text-[11px] text-[#8C827A] tracking-wide pt-1">
            Direct Concierge: +91 9871211995
          </div>
        </div>
      </div>
    </div>
  );
};
