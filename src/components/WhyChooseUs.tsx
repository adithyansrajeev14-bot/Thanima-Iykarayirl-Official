import React from 'react';
import {
  Compass,
  ShieldAlert,
  Users,
  Clock,
  FileCheck,
  Receipt,
  CheckCircle2
} from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: Compass,
    title: 'RTO-Spec Dedicated Ground',
    desc: 'Practice on exact Kerala Motor Vehicle Department dimensions for car H-test and motorcycle 8-test before appearing at the Sub-RTO track.'
  },
  {
    icon: ShieldAlert,
    title: 'Dual-Control Safety Fleet',
    desc: 'All training hatchbacks are fitted with secondary dual brake and clutch pedals for your absolute safety and confidence in real traffic.'
  },
  {
    icon: Users,
    title: 'Certified Patient Mentors',
    desc: 'Led by Arun Iykarayil and certified instructors who specialize in teaching beginners, nervous drivers, and senior citizens with great patience.'
  },
  {
    icon: Clock,
    title: 'Flexible Daily Batches',
    desc: 'Convenient slots starting early at 6:30 AM through 6:30 PM in the evening, plus weekend batches tailored for college students and working professionals.'
  },
  {
    icon: FileCheck,
    title: 'Complete Mallappally RTO Care',
    desc: 'We manage your Parivahan Sarathi application, Learner’s License test preparation, slot booking, and test day vehicle escort at Mallappally Sub-RTO (KL-28).'
  },
  {
    icon: Receipt,
    title: 'Digital Billing & Easy Installments',
    desc: 'Transparent fees with zero hidden costs. Instant WhatsApp digital receipts, PDF export, and easy installment payment support.'
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 mb-3">
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Driving School of Choice in Mallappally
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Over a decade of excellence in creating safe, confident, and defensive drivers across Pathanamthitta district.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-7 hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
