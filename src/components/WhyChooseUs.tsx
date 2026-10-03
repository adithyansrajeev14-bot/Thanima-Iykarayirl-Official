import React from 'react';
import {
  Compass,
  ShieldCheck,
  Users,
  Clock,
  FileCheck,
  Receipt,
  CheckCircle2,
  Award,
  Car,
  ChevronRight,
  UserCheck
} from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: Compass,
    title: 'Kerala MVD-Spec Private Ground',
    desc: 'Candidates practice on exact Kerala Motor Vehicles Department dimensions for car reverse H-parking and motorcycle figure 8 before appearing at Sub-RTO Mallappally.'
  },
  {
    icon: ShieldCheck,
    title: 'Dual-Control Safety Fleet',
    desc: 'All training hatchbacks are fitted with secondary dual brake and clutch pedals under instructor control, ensuring 100% peace of mind on public roads.'
  },
  {
    icon: Users,
    title: 'Patient 1-on-1 Mentorship',
    desc: 'Led personally by Arun Iykarayil and certified instructors who specialize in transforming nervous beginners and senior learners into confident drivers.'
  },
  {
    icon: Clock,
    title: 'Flexible Daily Batches',
    desc: 'Early morning slots starting at 06:30 AM through 06:30 PM in the evening, accommodating college students, working professionals, and homemakers.'
  },
  {
    icon: FileCheck,
    title: 'End-to-End RTO Paperwork',
    desc: 'We assist with the complete Parivahan Sarathi application, medical fitness (Form 1A), Learner’s License test booking, and test-day vehicle escort.'
  },
  {
    icon: Receipt,
    title: 'Transparent Institutional Billing',
    desc: 'Clear tuition and government RTO fee breakdown. Instant digital receipts with installment tracking, zero surprise fees, and direct bill download.'
  }
];

const RTO_STEPS = [
  {
    step: '01',
    title: 'Enrollment & Sarathi Filing',
    detail: 'Submission of age & address proof (Aadhaar), medical fitness form, and Parivahan Sarathi registration for Sub RTO Mallappally (KL-28).'
  },
  {
    step: '02',
    title: 'Learner’s License (LL) Test',
    detail: 'Preparation for road safety rules and computer test. Upon clearing, official 6-month Learner’s Permit is issued by the Motor Vehicles Department.'
  },
  {
    step: '03',
    title: 'Ground Track & Road Practice',
    detail: 'Mastering clutch bite point, slope stop-and-go, steering control, reverse H-parking track, figure 8 ground, and real traffic driving.'
  },
  {
    step: '04',
    title: 'RTO Test & Driving License Issue',
    detail: 'Appearance at the official Mallappally RTO ground in our driving school vehicle with instructor escort. Passing candidates receive smart card DL.'
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gradient-to-b from-white via-sky-50/40 to-white border-b border-sky-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-sky-200/80 pb-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">
                About the Institute
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                The Driving School of Choice in Mallappally
              </h2>
            </div>
            <p className="text-sm text-slate-600 max-w-xl">
              Serving Chengaroor, Mallappally, Vennikulam, Anjilithanam, and Kottangal with patient instruction, high safety standards, and proven test results.
            </p>
          </div>
        </div>

        {/* Message from Chief Instructor Arun Iykarayil in Frosted Light Blue Glass */}
        <div className="mb-14 bg-white/80 backdrop-blur-md border border-sky-200 rounded-2xl p-6 sm:p-8 shadow-sm shadow-sky-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-900 bg-sky-100/80 border border-sky-200/80 px-3 py-1 rounded-md uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-sky-700" />
                <span>Instructor's Commitment</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                "Driving is a Life Skill of Responsibility & Road Safety"
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                When you sit behind the steering wheel, you are taking responsibility for your life and everyone on the road. In our training program, we do not believe in superficial shortcuts just to scrape past an exam. We ensure you gain true control over the clutch, accurate mirror perception, calm instincts on Kerala's steep inclines, and respect for pedestrians.
              </p>
              <div className="pt-2 text-xs text-slate-600">
                <strong className="text-slate-900 font-bold block text-sm">Arun Iykarayil</strong>
                <span>Chief Driving Instructor & Founder, Thanima Iykarayil MDS</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-sky-50/70 backdrop-blur-xs border border-sky-200/80 p-5 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider border-b border-sky-200 pb-2">
                At a Glance
              </h4>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Licensed under Kerala Motor Vehicles Rules</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Sub RTO Mallappally (KL-28) affiliated</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Private training ground in Kaduvakuzhy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dual-brake safety vehicles for all LMV classes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6 Key Features in Light Blue Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md border border-sky-200/80 rounded-xl p-6 hover:border-sky-400 hover:shadow-md hover:shadow-sky-900/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Official 4-Step Driving License Procedure in Deep Ocean Glass */}
        <div id="rto-guidelines" className="bg-gradient-to-br from-sky-950 via-slate-900 to-sky-950 text-white rounded-2xl p-8 sm:p-10 border border-sky-800/60 shadow-xl shadow-sky-950/20">
          <div className="max-w-3xl mb-8">
            <span className="text-sky-300 font-bold text-xs uppercase tracking-widest block">
              Procedural Guide
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              How You Get Your Driving License at Sub RTO Mallappally
            </h3>
            <p className="text-xs sm:text-sm text-sky-200/80 mt-2">
              Our office coordinates every statutory stage with the Motor Vehicles Department from application to final smart card dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RTO_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md border border-sky-400/20 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-2xl font-bold text-sky-300 block mb-2">
                    {step.step}
                  </span>
                  <h5 className="font-bold text-sm text-white mb-1.5">
                    {step.title}
                  </h5>
                  <p className="text-xs text-sky-100/80 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-sky-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-300">
            <span>Documents required: Aadhaar Card, 3 Passport Photos, Age Proof, and Eye Test Form 1A.</span>
            <a
              href="https://parivahan.gov.in/parivahan/"
              target="_blank"
              rel="noreferrer"
              className="text-amber-300 hover:text-white flex items-center gap-1 font-semibold transition"
            >
              <span>Sarathi Parivahan Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
