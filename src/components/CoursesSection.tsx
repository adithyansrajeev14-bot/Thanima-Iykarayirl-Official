import React from 'react';
import { CoursePackage, SchoolSettings } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  Car,
  Bike,
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  MessageSquare,
  ArrowRight,
  FileCheck2
} from 'lucide-react';

interface CoursesSectionProps {
  courses: CoursePackage[];
  settings: SchoolSettings;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, settings }) => {
  const handleBookCourseWhatsApp = (course: CoursePackage) => {
    const total = course.defaultFee + course.defaultRtoFee;
    const msg = encodeURIComponent(
      `Hi *${settings.name}*, I would like to enroll / inquire about the *${course.name}* (Tuition: ${formatCurrency(course.defaultFee)} + RTO: ${formatCurrency(course.defaultRtoFee)}). Please share the upcoming batch timings.`
    );
    window.open(`https://wa.me/91${settings.whatsappPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="courses" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 mb-3">
            <Car className="w-3.5 h-3.5 text-blue-600" />
            <span>Govt. Recognized Driving Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Driving Courses & Tariffs
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Tailored for complete beginners to license holders seeking high-traffic confidence. Transparent fees with zero hidden charges.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => {
            const isCombo = course.category === 'COMBO';
            const totalFee = course.defaultFee + course.defaultRtoFee;

            return (
              <div
                key={course.id}
                className={`relative rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isCombo
                    ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20'
                    : 'border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Popular Badge */}
                {isCombo && (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider py-1.5 px-4 text-center">
                    ★ Most Recommended Choice (Car + Bike)
                  </div>
                )}

                <div className="p-6 sm:p-7">
                  {/* Category & Duration */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {course.category}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.durationDays} Days Course
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                    {course.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Vehicle: <strong className="text-slate-700">{course.vehicleType}</strong>
                  </p>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Pricing Box */}
                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-500">Package Total:</span>
                      <span className="text-2xl font-black text-slate-900">
                        {formatCurrency(totalFee)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-200/60">
                      <span>Tuition Fee: {formatCurrency(course.defaultFee)}</span>
                      <span>RTO Govt Fee: {formatCurrency(course.defaultRtoFee)}</span>
                    </div>
                  </div>

                  {/* Course Highlights */}
                  <div className="mt-6 space-y-2 text-xs text-slate-700">
                    <div className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wider">
                      What's Included:
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Dedicated ground practice for H-Track and 8-Track</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Dual-control safety cars with experienced instructor</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Sub-RTO Mallappally Learner's License & Road Test support</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Flexible batch slots (6:30 AM – 6:30 PM)</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => handleBookCourseWhatsApp(course)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                      isCombo
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-blue-900 text-white'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Inquire / Book on WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Services Notice */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Need DL Renewal, Address Change, or International Driving Permit?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                We handle complete Sarathi Parivahan RTO services at Sub-RTO Mallappally (KL-28).
              </p>
            </div>
          </div>

          <a
            href={`tel:${settings.primaryPhone}`}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-2 flex-shrink-0"
          >
            <span>Call RTO Desk: {settings.primaryPhone}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
