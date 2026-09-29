import React from 'react';
import { Link, useRouter } from '../../lib/router';
import { MAIN_NAV_ITEMS, UTILITY_NAV_ITEMS } from '../../data/navigation';
import { X, Sparkles, Phone, ArrowRight, User, LogOut, Key } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 xl:hidden flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-[#F8F5EF] h-full shadow-2xl flex flex-col justify-between p-6 z-10 border-l border-[#EAE5DC] overflow-y-auto animate-fade-in">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#EAE5DC]">
            <div className="flex flex-col">
              <span className="font-serif text-[18px] tracking-[0.18em] uppercase text-[#171717]">
                The Wedding Dreams
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C6A66B]">
                Couture & Scenography
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-[#77736D] hover:text-[#171717] rounded-[4px] hover:bg-[#F0EEE8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-6 flex flex-col space-y-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#77736D]">
              Navigation
            </span>
            {MAIN_NAV_ITEMS.map((item) => {
              const active = item.path === '/' ? path === '/' : path.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between py-2 text-[15px] tracking-wide transition-colors ${
                    active ? 'font-serif text-[18px] text-[#171717] font-semibold' : 'text-[#77736D] hover:text-[#171717]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
                </Link>
              );
            })}

            <div className="pt-4 pb-2 border-t border-[#EAE5DC]">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#77736D] block mb-3">
                Curatorial Tools
              </span>
              {UTILITY_NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className="flex items-center justify-between py-1.5 text-[13px] text-[#252525] hover:text-[#C6A66B] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] text-[#C6A66B]">→</span>
                </Link>
              ))}
            </div>

            {/* Account & Directorship Sanctuary */}
            <div className="pt-4 pb-2 border-t border-[#EAE5DC]">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#77736D] block mb-3">
                Portal Access
              </span>
              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/client"
                    onClick={onClose}
                    className="flex items-center justify-between py-1.5 text-[13px] text-[#171717] font-medium hover:text-[#C6A66B]"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#C6A66B]" />
                      <span>Client Sanctuary</span>
                    </span>
                    <span className="text-[11px] text-[#8C6D37]">Open</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className="flex items-center justify-between py-1.5 text-[13px] text-[#8C6D37] font-medium hover:underline"
                    >
                      <span className="flex items-center gap-2">
                        <Key className="w-3.5 h-3.5" />
                        <span>Atelier Command</span>
                      </span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#C6A66B]/20 font-bold">Admin</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      onClose();
                      await logout();
                      navigate('/');
                    }}
                    className="flex items-center gap-2 py-1.5 text-[12px] text-[#BA1A1A] hover:underline cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-between py-1.5 text-[13px] text-[#171717] hover:text-[#C6A66B]"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#C6A66B]" />
                    <span>Client &bull; Admin Sign In</span>
                  </span>
                  <span className="text-[11px] text-[#C6A66B]">→</span>
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#EAE5DC] flex flex-col space-y-3">
          <Link
            href="/plan-my-wedding"
            onClick={onClose}
            className="w-full py-3.5 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[12px] font-medium uppercase tracking-[0.16em] hover:bg-[#C6A66B] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <span>Plan My Wedding</span>
            <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
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
            className="w-full py-3 rounded-[4px] bg-transparent border border-[#171717]/40 text-[#171717] text-[12px] font-medium uppercase tracking-[0.16em] hover:bg-[#171717]/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Let's Talk</span>
          </button>

          <div className="text-center text-[11px] text-[#77736D] tracking-wide pt-1">
            Private Atelier: +91 (0) 98200 48210
          </div>
        </div>
      </div>
    </div>
  );
};
