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
  Award
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
      `Hello *${settings.name}*, I would like to inquire about driving admissions and batch timings.`
    );
    window.open(`https://wa.me/91${settings.whatsappPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const heroImg = settings.customImages?.heroImage || '/src/assets/images/hero_driving_car_1790908090052.jpg';
  const groundTrackImg = settings.customImages?.groundTrackImage || '/src/assets/images/ground_track_h_1790908104536.jpg';

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Hero Image with Deep Blue / Slate Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Thanima Iykarayil MDS Training Ground"
          className="w-full h-full object-cover object-center opacity-25 scale-105 transform filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-blue-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left 7 cols: Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/30 text-blue-200 border border-blue-400/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admissions Open • Sub RTO Mallappally (KL-28)</span>
            </div>

            {/* School Name & Slogan */}
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <LearnerBadge size="lg" className="shadow-2xl ring-4 ring-white/20" />
                <span className="text-amber-300 font-extrabold uppercase tracking-widest text-xs sm:text-sm">
                  Govt. Recognized Motor Driving School
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                THANIMA IYKARAYIL <br />
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
                  MOTOR DRIVING SCHOOL
                </span>
              </h1>
              <p className="text-amber-300 font-bold text-lg sm:text-2xl tracking-wide uppercase mt-2">
                "{settings.tagline}"
              </p>
            </div>

            {/* Subtext */}
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Specialized H-Track and 8-Track ground preparation, dual-control safety vehicles, and patient 1-on-1 coaching by Arun Iykarayil & certified instructors in Mallappally. Clear your driving test on the very first attempt!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={handleAdmissionWhatsApp}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Book Admission on WhatsApp</span>
              </button>

              <button
                onClick={onExploreCourses}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 backdrop-blur-md flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>View Courses & Fees</span>
                <ArrowRight className="w-4 h-4 text-blue-300" />
              </button>

              <button
                onClick={onOpenLookup}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span>Find My Bill</span>
              </button>
            </div>

            {/* Mini Trust Points */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-1">
                  <span>4.9★</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-[11px] text-slate-400">153 Google Reviews</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-white">98%</div>
                <div className="text-[11px] text-slate-400">First-Attempt Pass</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-white">10K+</div>
                <div className="text-[11px] text-slate-400">Drivers Trained</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-white">6:30 AM</div>
                <div className="text-[11px] text-slate-400">Flexible Batches</div>
              </div>
            </div>
          </div>

          {/* Right 5 cols: Highlight Feature Card with Track Photo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-slate-800/80 border border-slate-700 shadow-2xl p-5 backdrop-blur-md space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-700">
                <img
                  src={groundTrackImg}
                  alt="Mallappally H-Track Ground Practice"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  RTO Ground Practice
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-xs text-white">
                  <div className="font-bold flex items-center gap-1.5 text-amber-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>H-Track & 8-Track Ground Included</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Exact RTO track dimensions for reverse parking & bike ground test
                  </div>
                </div>
              </div>

              {/* Quick Info Points */}
              <div className="space-y-2 text-xs text-slate-200">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Dual-Control Hatchbacks & Modern Fleet</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <Award className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>End-to-End Mallappally Sub-RTO (KL-28) Clearance</span>
                </div>
              </div>

              {/* Hotline Contact Banner */}
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">Direct Hotline:</span>
                <a
                  href={`tel:${settings.primaryPhone}`}
                  className="font-mono font-bold text-amber-300 hover:text-white flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>{settings.primaryPhone} / {settings.secondaryPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
