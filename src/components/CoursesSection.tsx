import React from 'react';
import { CoursePackage, SchoolSettings } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  Car,
  Bike,
  CheckCircle2,
  Clock,
  Shield,
  MessageSquare,
  FileCheck2,
  FileText,
  Phone
} from 'lucide-react';

interface CoursesSectionProps {
  courses: CoursePackage[];
  settings: SchoolSettings;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, settings }) => {
  const handleBookCourseWhatsApp = (course: CoursePackage) => {
    const total = course.defaultFee + course.defaultRtoFee;
    const msg = encodeURIComponent(
      `Hello ${settings.name}, I would like to inquire about the ${course.name} (Tuition: ${formatCurrency(course.defaultFee)} + RTO Fee: ${formatCurrency(course.defaultRtoFee)} = Total: ${formatCurrency(total)}). Please share the upcoming batch timings.`
    );
    window.open(`https://wa.me/91${settings.whatsappPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="courses" className="py-16 bg-gradient-to-b from-sky-50/40 via-blue-50/20 to-sky-50/40 border-b border-sky-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-sky-200/80 pb-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">
                Official Prospectus
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Courses & Fee Tariffs
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Transparent, itemized pricing approved for Sub RTO Mallappally. Includes tuition, private ground sessions, fuel, and government test fees.
            </div>
          </div>
        </div>

        {/* Courses Tariff Cards Grid with Light Blue Glass Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isCombo = course.category === 'COMBO';
            const totalFee = course.defaultFee + course.defaultRtoFee;

            return (
              <div
                key={course.id}
                className={`bg-white/80 backdrop-blur-md border rounded-xl transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isCombo
                    ? 'border-sky-500 ring-2 ring-sky-300/40'
                    : 'border-sky-200 hover:border-sky-400'
                }`}
              >
                {/* Header ribbon for recommended package in ice glass */}
                {isCombo && (
                  <div className="bg-sky-900 text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 text-center">
                    Comprehensive Package • LMV Car + MCWG Motorcycle
                  </div>
                )}

                <div className="p-6">
                  {/* Category and duration */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold text-sky-900 bg-sky-100/70 border border-sky-200 px-2 py-0.5 rounded text-[11px] uppercase tracking-wide">
                      Category: {course.category}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      {course.durationDays} Days Course
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug mt-1">
                    {course.name}
                  </h3>
                  <div className="text-xs text-slate-600 mt-1">
                    Vehicle: <strong className="text-slate-800">{course.vehicleType}</strong>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Itemized Fee Breakdown Table in Frosted Ice Glass */}
                  <div className="mt-5 p-3.5 rounded-lg bg-sky-50/70 border border-sky-200 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Tuition & Ground Fee:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(course.defaultFee)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>RTO Govt. Test Fee:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(course.defaultRtoFee)}</span>
                    </div>
                    <div className="pt-2 border-t border-sky-200 flex justify-between items-baseline font-sans">
                      <span className="font-bold text-sky-950 text-xs">Total Package Tariff:</span>
                      <span className="text-xl font-black text-sky-950 font-mono">
                        {formatCurrency(totalFee)}
                      </span>
                    </div>
                  </div>

                  {/* Inclusions checklist */}
                  <div className="mt-5 space-y-2 text-xs text-slate-700">
                    <div className="font-bold text-sky-950 text-[11px] uppercase tracking-wider mb-1">
                      Curriculum Includes:
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Private H-Track reverse parking & 8-Track ground training</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Dual-control safety hatchbacks with instructor intervention</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Sub RTO Mallappally driving test escort in school vehicle</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Installment payment facility with digital receipts</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleBookCourseWhatsApp(course)}
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Inquire / Enroll on WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional RTO Services Banner in Light Blue Glass Panel */}
        <div className="mt-12 bg-white/80 backdrop-blur-md rounded-xl p-6 border border-sky-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 border border-sky-200">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Sarathi Portal Services for Existing License Holders
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Driving license renewal, address change, endorsement of badge/hazardous vehicle, duplicate license, and International Driving Permit (IDP) processing for Sub RTO Mallappally (KL-28).
              </p>
            </div>
          </div>

          <a
            href={`tel:${settings.primaryPhone}`}
            className="px-5 py-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-950 text-xs font-bold transition flex items-center gap-2 shrink-0 border border-sky-300 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-sky-700" />
            <span>Contact RTO Desk: {settings.primaryPhone}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
