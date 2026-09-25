import React, { useState } from 'react';
import { Link, useRouter } from '../../lib/router';
import { MAIN_NAV_ITEMS } from '../../data/navigation';
import { Menu, X, Sparkles, User, LogOut, Key, ShieldCheck } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { useAuth } from '../../context/AuthContext';

export interface NavbarProps {
  onOpenLetTalk?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLetTalk }) => {
  const { path, navigate } = useRouter();
  const { user, profile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);


  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-[#F8F5EF]/95 backdrop-blur-md border-b border-[#EAE5DC] transition-all duration-300">
        <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <Link
            href="/"
            className="flex flex-col group select-none cursor-pointer focus-visible:outline-none"
          >
            <span className="font-serif text-[18px] sm:text-[22px] tracking-[0.2em] uppercase text-[#171717] font-normal transition-opacity group-hover:opacity-85">
              The Wedding Dreams
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.32em] text-[#C6A66B] font-medium -mt-0.5">
              Couture & Scenography
            </span>
          </Link>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {MAIN_NAV_ITEMS.map((item) => {
              const active = item.path === '/' ? path === '/' : path.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative py-1 text-[12px] uppercase tracking-[0.16em] transition-colors duration-200 select-none ${
                    active ? 'text-[#171717] font-semibold' : 'text-[#77736D] hover:text-[#171717]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#171717] animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Primary & Secondary CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onOpenLetTalk) {
                  onOpenLetTalk();
                } else {
                  navigate('/contact');
                }
              }}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-[4px] border border-[#171717]/30 text-[11px] font-medium uppercase tracking-[0.14em] text-[#171717] hover:bg-[#171717]/[0.05] hover:border-[#171717] transition-all cursor-pointer"
            >
              Let's Talk
            </button>

            <Link
              href="/plan-my-wedding"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-[0.14em] hover:bg-[#C6A66B] hover:text-white shadow-[0_4px_14px_rgba(23,23,23,0.18)] transition-all cursor-pointer"
            >
              Plan My Wedding
            </Link>

            {/* Auth State Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2 py-1.5 px-2.5 rounded-[4px] border border-[#EAE5DC] bg-white hover:border-[#C6A66B] text-[#171717] text-[11px] font-medium cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#171717] text-[#C6A66B] flex items-center justify-center text-[10px] font-semibold">
                    {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[90px] truncate">
                    {profile?.displayName || 'Sanctuary'}
                  </span>
                  {isAdmin && (
                    <span className="text-[8px] uppercase tracking-wider font-semibold px-1 py-0.2 rounded-[2px] bg-[#C6A66B]/20 text-[#8C6D37]">
                      Admin
                    </span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-[6px] border border-[#EAE5DC] shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#F2EEE6]">
                      <span className="text-[10px] text-[#9C968C] block uppercase tracking-wider">
                        Signed in as
                      </span>
                      <strong className="text-[12px] text-[#171717] truncate block">
                        {user.email}
                      </strong>
                    </div>

                    <Link
                      href="/client"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#252525] hover:bg-[#FAF8F5] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#C6A66B]" />
                      <span>Client Sanctuary</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#252525] hover:bg-[#FAF8F5] transition-colors"
                      >
                        <Key className="w-3.5 h-3.5 text-[#8C6D37]" />
                        <span>Atelier Command</span>
                      </Link>
                    )}

                    <div className="border-t border-[#F2EEE6] mt-1 pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#BA1A1A] hover:bg-[#FDF2F2] transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] border border-[#171717]/20 text-[11px] font-medium uppercase tracking-[0.14em] text-[#171717] hover:border-[#171717] hover:bg-black/5 transition-all cursor-pointer"
              >
                <User className="w-3 h-3 text-[#C6A66B]" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}


            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="lg:hidden p-2 rounded-[4px] text-[#171717] hover:bg-[#F0EEE8] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenLetTalk={onOpenLetTalk}
      />
    </>
  );
};
