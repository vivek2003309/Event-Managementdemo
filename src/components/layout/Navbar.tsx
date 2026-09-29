/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Navbar Component
 * Strict CSS Grid layout (grid-cols-2 xl:grid-cols-[1fr_auto_1fr]) with clean responsive hierarchy:
 * - Mobile (<768px): Pristine unclipped brand logo on the left, sleek luxury hamburger menu on the right.
 * - Tablet (768px-1279px): Brand logo on the left, 'PLAN MY WEDDING' CTA + hamburger menu on the right.
 * - Desktop (>=1280px): Full 3-column layout (Logo, Centered Nav Links, Full CTAs & Sign In).
 */

import React, { useState } from 'react';
import { Link, useRouter } from '../../lib/router';
import { Menu, User, LogOut, Key } from 'lucide-react';
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
      {/* 1. Root Header: Sticky Top with Luxury Ivory Styling */}
      <header className="sticky top-0 z-50 w-full bg-[#F8F5EF] border-b border-[#E5DFD3]">
        {/* Strict CSS Grid Layout: 2-col on mobile/tablet (<xl), 3-col on desktop (>=xl) */}
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 h-20 grid grid-cols-2 xl:grid-cols-[1fr_auto_1fr] items-center">
          
          {/* Column 1 (Left - Brand Logo ONLY): High priority, unclipped, elegant font size on mobile */}
          <div className="flex justify-start items-center min-w-0 pr-2">
            <Link className="flex flex-col text-left group select-none" to="/">
              <span className="font-serif text-base sm:text-lg md:text-xl tracking-[0.18em] sm:tracking-[0.2em] font-medium text-[#1A1A1A] whitespace-nowrap">
                THE WEDDING DREAMS
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.24em] sm:tracking-[0.28em] text-[#8C827A] uppercase whitespace-nowrap">
                COUTURE & SCENOGRAPHY
              </span>
            </Link>
          </div>

          {/* Column 2 (Center - Nav Links ONLY): Strictly hidden below xl */}
          <nav className="hidden xl:flex items-center justify-center gap-8 px-6">
            <Link
              className={`text-xs uppercase tracking-[0.22em] font-medium transition-colors whitespace-nowrap ${
                path === '/' || path === '/weddings'
                  ? 'text-[#C5A059] font-semibold'
                  : 'text-[#1A1A1A]/80 hover:text-[#C5A059]'
              }`}
              to="/weddings"
            >
              Weddings
            </Link>
            <Link
              className={`text-xs uppercase tracking-[0.22em] font-medium transition-colors whitespace-nowrap ${
                path.startsWith('/services')
                  ? 'text-[#C5A059] font-semibold'
                  : 'text-[#1A1A1A]/80 hover:text-[#C5A059]'
              }`}
              to="/services"
            >
              Services
            </Link>
            <Link
              className={`text-xs uppercase tracking-[0.22em] font-medium transition-colors whitespace-nowrap ${
                path.startsWith('/destinations')
                  ? 'text-[#C5A059] font-semibold'
                  : 'text-[#1A1A1A]/80 hover:text-[#C5A059]'
              }`}
              to="/destinations"
            >
              Destinations
            </Link>
            <Link
              className={`text-xs uppercase tracking-[0.22em] font-medium transition-colors whitespace-nowrap ${
                path.startsWith('/our-work') || path.startsWith('/work')
                  ? 'text-[#C5A059] font-semibold'
                  : 'text-[#1A1A1A]/80 hover:text-[#C5A059]'
              }`}
              to="/work"
            >
              Our Work
            </Link>
            <Link
              className={`text-xs uppercase tracking-[0.22em] font-medium transition-colors whitespace-nowrap ${
                path.startsWith('/about')
                  ? 'text-[#C5A059] font-semibold'
                  : 'text-[#1A1A1A]/80 hover:text-[#C5A059]'
              }`}
              to="/about"
            >
              About
            </Link>
          </nav>

          {/* Column 3 (Right - CTAs & Actions) */}
          <div className="flex justify-end items-center gap-2 sm:gap-3 lg:gap-4">
            {/* 'LET'S TALK': desktop only */}
            <button
              onClick={() => {
                if (onOpenLetTalk) {
                  onOpenLetTalk();
                } else {
                  navigate('/contact');
                }
              }}
              className="hidden xl:inline-flex px-4 py-2 border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-xs uppercase tracking-wider font-medium text-[#1A1A1A] transition-all whitespace-nowrap cursor-pointer rounded-[2px]"
            >
              LET'S TALK
            </button>

            {/* Signature Gold CTA: Hidden on mobile (<md), active on tablet and desktop (>=md) */}
            <Link
              to="/plan-my-wedding"
              className="hidden md:inline-flex px-4 sm:px-5 py-2 bg-[#C5A059] hover:bg-[#b08d4b] text-white text-xs uppercase tracking-wider font-semibold shadow-sm transition-all whitespace-nowrap rounded-[2px] cursor-pointer"
            >
              PLAN MY WEDDING
            </Link>

            {/* Auth State Button: Desktop only */}
            {user ? (
              <div className="relative hidden xl:inline-block">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-[#E5DFD3] bg-white hover:border-[#C5A059] text-[#1A1A1A] text-xs font-medium cursor-pointer transition-colors shadow-xs whitespace-nowrap"
                >
                  <div className="w-5 h-5 rounded-full bg-[#C5A059] text-black flex items-center justify-center text-[10px] font-bold">
                    {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[85px] truncate text-[#1A1A1A]">
                    {profile?.displayName || 'Sanctuary'}
                  </span>
                  {isAdmin && (
                    <span className="text-[8px] uppercase tracking-wider font-semibold px-1 py-0.2 rounded-[2px] bg-[#C5A059]/20 text-[#8B6A2B]">
                      Admin
                    </span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-[4px] border border-[#E5DFD3] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#EAE5DC]">
                      <span className="text-[10px] text-[#77736D] block uppercase tracking-wider">
                        Signed in as
                      </span>
                      <strong className="text-[12px] text-[#1A1A1A] truncate block font-medium">
                        {user.email}
                      </strong>
                    </div>

                    <Link
                      to="/client"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#4A4742] hover:bg-[#F8F5EF] hover:text-[#1A1A1A] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Client Sanctuary</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#4A4742] hover:bg-[#F8F5EF] hover:text-[#1A1A1A] transition-colors"
                      >
                        <Key className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Atelier Command</span>
                      </Link>
                    )}

                    <div className="border-t border-[#EAE5DC] mt-1 pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
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
                to="/login"
                className="hidden xl:inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-[#1A1A1A] hover:text-[#C5A059] pl-1 whitespace-nowrap cursor-pointer"
              >
                <span>SIGN IN</span>
              </Link>
            )}

            {/* Mobile/Tablet Menu Hamburger Icon Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 text-[#1A1A1A] hover:text-[#C5A059] cursor-pointer shrink-0"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer (Accessible on tablet & mobile) */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenLetTalk={onOpenLetTalk}
      />
    </>
  );
};
