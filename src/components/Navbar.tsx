import React from 'react';
import { LearnerBadge } from './LearnerBadge';
import { SchoolSettings } from '../types';
import { Phone, Shield, FilePlus, LogOut, CheckCircle } from 'lucide-react';

interface NavbarProps {
  settings: SchoolSettings;
  currentView: 'generate' | 'admin';
  onNavigate: (view: 'generate' | 'admin') => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentView,
  onNavigate,
  pendingCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('generate')}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <LearnerBadge size="md" className="group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                THANIMA IYKARAYIL
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                MDS
              </span>
            </div>
            <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider hidden xs:block">
              Motor Driving School • Mallappally
            </div>
          </div>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3">
          {/* If strictly in Admin Mode, show Admin Status indicator and Exit option */}
          {currentView === 'admin' ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Admin Mode</span>
                {pendingCount > 0 && (
                  <span className="ml-1 bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px]">
                    {pendingCount} dues
                  </span>
                )}
              </div>
              <button
                onClick={() => onNavigate('generate')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                title="Exit Admin Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit to Form</span>
              </button>
            </div>
          ) : (
            /* Regular Public View: NO clues, no admin buttons, no /adminmode text */
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Official Digital Billing Portal</span>
              </div>

              <a
                href={`tel:${settings.primaryPhone}`}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-200 transition"
                title="Call Driving School"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-mono">{settings.primaryPhone}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
