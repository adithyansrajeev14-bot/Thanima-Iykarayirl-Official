import React, { useState } from 'react';
import { SchoolSettings } from '../types';
import { LearnerBadge } from './LearnerBadge';
import {
  Phone,
  Search,
  MessageSquare,
  Menu,
  X,
  Star,
  Shield,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface OfficialNavbarProps {
  settings: SchoolSettings;
  currentView: 'generate' | 'admin' | 'website';
  onNavigateView: (view: 'generate' | 'admin' | 'website') => void;
  onOpenLookup: () => void;
  pendingCount?: number;
}

export const OfficialNavbar: React.FC<OfficialNavbarProps> = ({
  settings,
  currentView,
  onNavigateView,
  onOpenLookup,
  pendingCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'website') {
      onNavigateView('website');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            if (currentView !== 'website') onNavigateView('website');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <LearnerBadge size="md" className="group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                THANIMA IYKARAYIL
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                MDS
              </span>
            </div>
            <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider hidden xs:block">
              Motor Driving School • Mallappally
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        {currentView !== 'admin' && (
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <button
              onClick={() => scrollToSection('top')}
              className="hover:text-blue-700 transition cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              className="hover:text-blue-700 transition cursor-pointer"
            >
              Courses & Fees
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="hover:text-blue-700 transition cursor-pointer flex items-center gap-1"
            >
              <span>Reviews</span>
              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full flex items-center">
                4.9★
              </span>
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="hover:text-blue-700 transition cursor-pointer"
            >
              Training Gallery
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-blue-700 transition cursor-pointer"
            >
              Why Choose Us
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-blue-700 transition cursor-pointer"
            >
              Contact & Map
            </button>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Mode View Banner & Exit */}
          {currentView === 'admin' ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Admin Panel Active</span>
                {pendingCount > 0 && (
                  <span className="ml-1 bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px]">
                    {pendingCount} dues
                  </span>
                )}
              </div>
              <button
                onClick={() => onNavigateView('website')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                title="Exit Admin Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit to Website</span>
              </button>
            </div>
          ) : (
            /* Regular Customer/Visitor Actions */
            <div className="flex items-center gap-2">
              {/* Find My Digital Bill Button */}
              <button
                onClick={onOpenLookup}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition cursor-pointer shadow-sm"
                title="Search and download your driving school digital bill"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Find My Bill</span>
                <span className="sm:hidden">Bill</span>
              </button>

              {/* Direct Hotline Call */}
              <a
                href={`tel:${settings.primaryPhone}`}
                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl border border-slate-200 transition"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-mono">{settings.primaryPhone}</span>
              </a>

              {/* Book Admission WhatsApp */}
              <a
                href={`https://wa.me/91${settings.whatsappPhone}?text=${encodeURIComponent('Hi Thanima Iykarayil MDS, I want to book admission for driving class.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">Book Admission</span>
                <span className="sm:hidden">Book</span>
              </a>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && currentView !== 'admin' && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 text-sm font-semibold text-slate-700 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => scrollToSection('top')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-900"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('courses')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-900"
          >
            Courses & Fees
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-900 flex items-center justify-between"
          >
            <span>Google Reviews</span>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              4.9★ (153 Reviews)
            </span>
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-900"
          >
            Training Facilities & Fleet
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-900"
          >
            Why Choose Us
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-900"
          >
            Contact & Location Map
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLookup();
              }}
              className="w-full py-2.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find My Digital Bill & PDF</span>
            </button>
            <a
              href={`tel:${settings.primaryPhone}`}
              className="w-full py-2.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Call Office: {settings.primaryPhone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
