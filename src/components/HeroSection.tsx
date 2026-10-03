import React from 'react';
import { SchoolSettings } from '../types';
import { LearnerBadge } from './LearnerBadge';
import {
  Car,
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Search,
  ArrowRight,
  Phone,
  Award,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

interface HeroSectionProps {
  settings: SchoolSettings;
  onOpenLookup: () => void;
  onExploreCourses: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onOpenLookup,
  onExploreCourses,
}) => {
  const handleAdmissionWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${settings.name}, I would like to inquire about driving admissions, course fees, and available batch timings.`
    );
    window.open(`https://wa.me/91${settings.whatsappPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const groundTrackImg = settings.customImages?.groundTrackImage || '/src/assets/images/ground_track_h_1790908104536.jpg';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-100/80 via-blue-50/70 to-slate-100 border-b border-sky-200/80 text-slate-800">
      {/* Light Blue Glass Ambient Glow Spheres (Subtle & Elegant) */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-5 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Notice Ticker Bar in Frosted Ice Glass */}
      <div className="relative z-10 bg-sky-200/50 backdrop-blur-md border-b border-sky-300/50 py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-sky-950">
          <div className="flex items-center gap-2">
            <span className="bg-sky-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shadow-2xs">
              Notice
            </span>
            <span className="font-medium text-slate-800">
              New training batches starting every Monday. Practical ground slots open for Sub RTO Mallappally test preparation.
            </span>
          </div>
          <div className="text-sky-800 text-[11px] font-mono font-medium">
            RTO Code: KL-28 • Sub RTO Mallappally
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Institutional Header & Description */}
          <div className="lg:col-span-7 space-y-6">
            {/* Institution Badge with Glass Card Styling */}
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-md border border-sky-200/80 px-4 py-2 rounded-xl shadow-xs">
              <LearnerBadge size="sm" />
              <div>
                <span className="text-sky-800 font-extrabold text-xs uppercase tracking-wider block">
                  Govt. Approved Driving Institute
                </span>
                <span className="text-[11px] text-slate-600">
                  Affiliated for Kerala Motor Vehicles Department Driving Tests
                </span>
              </div>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Thanima Iykarayil <br />
                <span className="text-sky-800">Motor Driving School</span>
              </h1>
              <p className="text-sky-900 font-semibold text-base sm:text-lg mt-2">
                "Learn to Drive with Confidence & Safety"
              </p>
            </div>

            {/* Subtext */}
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Providing rigorous driver training in Mallappally since 2012. Our curriculum combines private Kerala RTO-standard H-track and 8-track ground practice with dual-brake on-road training, led personally by Arun Iykarayil and certified instructors.
            </p>

            {/* Key Practical Facts in Frosted Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white/80 backdrop-blur-md border border-sky-200/80 p-3.5 rounded-xl shadow-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Private H & 8 Track</span>
                </div>
                <div className="text-slate-600 text-[11px] mt-1">Dedicated ground in Chengaroor</div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-sky-200/80 p-3.5 rounded-xl shadow-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dual Safety Controls</span>
                </div>
                <div className="text-slate-600 text-[11px] mt-1">Dual brake & clutch fitted cars</div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-sky-200/80 p-3.5 rounded-xl shadow-xs col-span-2 sm:col-span-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sub RTO Mallappally</span>
                </div>
                <div className="text-slate-600 text-[11px] mt-1">End-to-end Sarathi paperwork</div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <button
                onClick={handleAdmissionWhatsApp}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Inquire Admission on WhatsApp</span>
              </button>

              <button
                onClick={onExploreCourses}
                className="px-5 py-3.5 rounded-xl font-bold text-sm text-sky-950 bg-sky-200/70 hover:bg-sky-200 border border-sky-300/80 backdrop-blur-md transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Course Tariffs & Fees</span>
                <ArrowRight className="w-4 h-4 text-sky-800" />
              </button>

              <button
                onClick={onOpenLookup}
                className="px-4 py-3.5 rounded-xl font-semibold text-xs text-sky-900 hover:text-sky-950 bg-white/80 hover:bg-white border border-sky-200 backdrop-blur-md transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                title="Search your receipt by student name or mobile"
              >
                <Search className="w-3.5 h-3.5 text-sky-700" />
                <span>Student Bill Lookup</span>
              </button>
            </div>

            {/* Verification & Trust Row with Frosted Glass Badge */}
            <div className="pt-4 border-t border-sky-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-600 text-sm flex items-center gap-1">
                  4.9★
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </span>
                <span>153 Verified Google Reviews</span>
              </div>
              <span className="text-sky-300">|</span>
              <div>
                <strong className="text-slate-900">10,000+</strong> Candidates Trained
              </div>
              <span className="text-sky-300">|</span>
              <div>
                <strong className="text-slate-900">98%</strong> First-Attempt Pass Rate
              </div>
            </div>
          </div>

          {/* Right Column: Ground Practice Card in Light Blue Glass Frame */}
          <div className="lg:col-span-5">
            <div className="bg-white/85 backdrop-blur-md border border-sky-200 rounded-2xl overflow-hidden shadow-lg shadow-sky-900/5">
              {/* Photo with clean caption */}
              <div className="relative aspect-[4/3] bg-sky-100 border-b border-sky-200">
                <img
                  src={groundTrackImg}
                  alt="Thanima Iykarayil MDS Private Training Ground in Chengaroor"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-sky-950/85 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded border border-sky-800 shadow-xs">
                  Private RTO Ground Track
                </div>
              </div>

              {/* Card Details with Glass Styling */}
              <div className="p-5 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Mallappally Driving Test Preparation
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Built to exact Kerala Motor Vehicles Department dimensions for standard 'H' reverse parking test and two-wheeler figure '8' balance track.
                  </p>
                </div>

                {/* Practical Information List */}
                <div className="space-y-2 text-xs text-slate-700 border-t border-sky-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Training Ground:</span>
                    <span className="font-semibold text-slate-900">Kaduvakuzhy, Chengaroor P.O.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Chief Instructor:</span>
                    <span className="font-semibold text-slate-900">Arun Iykarayil</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Morning Slot:</span>
                    <span className="font-semibold text-sky-800 font-mono">06:30 AM – 08:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Evening Slot:</span>
                    <span className="font-semibold text-sky-800 font-mono">04:30 PM – 06:30 PM</span>
                  </div>
                </div>

                {/* Direct Telephone Link in Glass Card */}
                <div className="p-3 bg-sky-50/80 backdrop-blur-xs rounded-xl border border-sky-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Direct Office Hotline:</span>
                  <a
                    href={`tel:${settings.primaryPhone}`}
                    className="font-bold text-sky-900 hover:text-sky-700 font-mono flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-700" />
                    <span>{settings.primaryPhone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
