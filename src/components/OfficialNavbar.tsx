import React, { useState } from 'react';
import { SchoolSettings } from '../types';
import { LearnerBadge } from './LearnerBadge';
import {
  Phone,
  Search,
  MessageSquare,
  Menu,
  X,
  MapPin,
  Clock,
  LogOut,
  ShieldCheck,
  FileText
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
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-sky-200/80 shadow-xs">
      {/* Top Institutional Utility Bar with Ice Blue Glass Tint */}
      <div className="bg-sky-950/90 text-sky-200 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-sky-800/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-sky-100">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Kaduvakuzhy, Chengaroor P.O., Mallappally (KL-28)</span>
            </span>
            <span className="hidden md:inline-block text-sky-700">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-sky-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Training: 06:30 AM – 06:30 PM (Mon – Sat)</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a
              href={`tel:${settings.primaryPhone}`}
              className="text-amber-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span className="font-mono">{settings.primaryPhone}</span>
            </a>
            <span className="text-sky-700">|</span>
            <a
              href={`tel:${settings.secondaryPhone}`}
              className="text-sky-300 hover:text-white font-mono hidden xs:inline"
            >
              {settings.secondaryPhone}
            </a>
            <span className="text-sky-700 hidden xs:inline">|</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Govt. Recognized MDS</span>
              <span className="sm:hidden">Govt. MDS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            if (currentView !== 'website') onNavigateView('website');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <LearnerBadge size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                THANIMA IYKARAYIL
              </span>
              <span className="bg-sky-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider shadow-xs">
                MDS
              </span>
            </div>
            <div className="text-[11px] font-semibold text-sky-800 uppercase tracking-wide">
              Motor Driving School • Sub RTO Mallappally (KL-28)
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        {currentView !== 'admin' && (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <button
              onClick={() => scrollToSection('top')}
              className="hover:text-sky-600 transition py-1 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-sky-600 transition py-1 cursor-pointer"
            >
              About School
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              className="hover:text-sky-600 transition py-1 cursor-pointer"
            >
              Courses & Tariffs
            </button>
            <button
              onClick={() => scrollToSection('rto-guidelines')}
              className="hover:text-sky-600 transition py-1 cursor-pointer"
            >
              RTO Rules & Tests
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="hover:text-sky-600 transition py-1 cursor-pointer"
            >
              Ground & Fleet
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="hover:text-sky-600 transition py-1 cursor-pointer"
            >
              Reviews (4.9★)
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-sky-600 transition py-1 cursor-pointer"
            >
              Contact Desk
            </button>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentView === 'admin' ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-50 border border-sky-300 text-sky-950 text-xs font-bold">
                <span>Administrative Mode Active</span>
                {pendingCount > 0 && (
                  <span className="ml-1 bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded text-[10px]">
                    {pendingCount} due
                  </span>
                )}
              </div>
              <button
                onClick={() => onNavigateView('website')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white/80 hover:bg-white border border-sky-200 transition cursor-pointer"
                title="Exit to Driving School Website"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit to Website</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Find My Digital Bill Button with Glass Style */}
              <button
                onClick={onOpenLookup}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold text-sky-900 hover:text-sky-950 bg-sky-50/80 hover:bg-sky-100/90 border border-sky-200/90 backdrop-blur-xs transition cursor-pointer shadow-xs"
                title="Search and download your official fee receipt / bill"
              >
                <FileText className="w-3.5 h-3.5 text-sky-700" />
                <span className="hidden sm:inline">Download Fee Receipt</span>
                <span className="sm:hidden">Receipt</span>
              </button>

              {/* Book Admission WhatsApp */}
              <a
                href={`https://wa.me/91${settings.whatsappPhone}?text=${encodeURIComponent('Hi Thanima Iykarayil MDS, I want to inquire about driving class admission and batch timings.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-md transition shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">Admissions Inquiry</span>
                <span className="sm:hidden">Inquire</span>
              </a>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-md hover:bg-sky-50 border border-sky-200 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown with Glass Styling */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-sky-200 px-4 pt-3 pb-5 space-y-2 text-sm font-semibold text-slate-700">
          <button
            onClick={() => scrollToSection('top')}
            className="w-full text-left py-2 px-3 rounded hover:bg-sky-50 text-slate-900"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="w-full text-left py-2 px-3 rounded hover:bg-sky-50 text-slate-900"
          >
            About School & Instructors
          </button>
          <button
            onClick={() => scrollToSection('courses')}
            className="w-full text-left py-2 px-3 rounded hover:bg-sky-50 text-slate-900"
          >
            Courses & Tariffs
          </button>
          <button
            onClick={() => scrollToSection('rto-guidelines')}
            className="w-full text-left py-2 px-3 rounded hover:bg-sky-50 text-slate-900"
          >
            RTO Rules & Test Preparation
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="w-full text-left py-2 px-3 rounded hover:bg-sky-50 text-slate-900"
          >
            Training Ground & Fleet
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="w-full text-left py-2 px-3 rounded hover:bg-sky-50 text-slate-900 flex items-center justify-between"
          >
            <span>Student Google Reviews</span>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
              4.9★ (153 Reviews)
            </span>
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full text-left py-2 px-3 rounded hover:bg-sky-50 text-slate-900"
          >
            Contact Office & Map
          </button>

          <div className="pt-3 border-t border-sky-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLookup();
              }}
              className="w-full py-2.5 bg-sky-50 text-sky-900 font-bold text-xs rounded border border-sky-200 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-sky-700" />
              <span>Download Fee Receipt / Bill</span>
            </button>
            <a
              href={`tel:${settings.primaryPhone}`}
              className="w-full py-2.5 bg-white text-slate-900 font-bold text-xs rounded border border-sky-300 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-slate-700" />
              <span>Call Office: {settings.primaryPhone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
