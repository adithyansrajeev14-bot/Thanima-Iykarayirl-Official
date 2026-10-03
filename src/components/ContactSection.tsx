import React, { useState } from 'react';
import { SchoolSettings } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { LearnerBadge } from './LearnerBadge';

interface ContactSectionProps {
  settings: SchoolSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Combo Pack (LMV Car + MCWG Bike)');
  const [timing, setTiming] = useState('Morning 06:30 AM – 08:30 AM');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const text = encodeURIComponent(
      `Hello ${settings.name},\n*Admission Inquiry*\nName: ${name.trim()}\nMobile: ${phone.trim()}\nCourse: ${selectedCourse}\nPreferred Slot: ${timing}\nNote: ${message.trim() || 'Please advise on next batch start date and Sarathi documentation.'}`
    );
    window.open(`https://wa.me/91${settings.whatsappPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-16 bg-gradient-to-b from-white via-sky-50/50 to-sky-100/60 border-b border-sky-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-sky-200/80 pb-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">
                Office & Training Ground
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Contact & Admissions Desk
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Visit our office and ground at Chengaroor, Mallappally, or reach out to our admission counselors for slot bookings and Sarathi paperwork guidance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Official Driving School Office Information in Light Blue Glass */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-sky-200 rounded-2xl p-6 space-y-4 shadow-sm shadow-sky-900/5">
              <div className="flex items-center gap-3">
                <LearnerBadge size="md" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {settings.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Affiliated to Sub RTO Mallappally (KL-28) • Govt. Recognized MDS
                  </p>
                </div>
              </div>

              <div className="border-t border-sky-100 pt-4 space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Office & Ground Address:</strong>
                    <span>{settings.address}</span>
                    <div className="text-slate-500 mt-0.5">{settings.city} - {settings.pincode}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Admissions & Inquiries:</strong>
                    <div className="font-mono text-slate-900 mt-0.5">
                      <a href={`tel:${settings.primaryPhone}`} className="hover:text-sky-700 font-bold">
                        {settings.primaryPhone}
                      </a>
                      <span className="mx-2 text-slate-400">/</span>
                      <a href={`tel:${settings.secondaryPhone}`} className="hover:text-sky-700 font-bold">
                        {settings.secondaryPhone}
                      </a>
                    </div>
                    <span className="text-[11px] text-slate-500">Lines open 06:00 AM – 08:00 PM daily</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Training Hours:</strong>
                    <span>Practical Driving: 06:30 AM – 06:30 PM (Monday through Saturday)</span>
                    <div className="text-slate-500 mt-0.5">Sunday batches available by prior appointment</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Official Correspondence:</strong>
                    <a href={`mailto:${settings.email}`} className="text-slate-600 hover:text-slate-900 font-mono">
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-sky-100 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/91${settings.whatsappPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp: {settings.whatsappPhone}</span>
                </a>

                <a
                  href={settings.googleMapsUrl || 'https://www.google.com/maps/place/Thanima+Iykkarayil+Motor+Driving+School/@9.4362596,76.6413042,101m/data=!3m1!1e3!4m8!3m7!1s0x3b0625e130d716c1:0xf434ddbb4440fbd8!8m2!3d9.4361345!4d76.6414822!9m1!1b1!16s%2Fg%2F11ns5khhs7?entry=ttu'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-950 text-xs font-semibold border border-sky-200 transition"
                  title="View on Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>Google Maps Location</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Jurisdiction Notice in Frosted Ice Glass */}
            <div className="p-4 rounded-xl bg-sky-50/80 backdrop-blur-xs border border-sky-200 text-xs text-sky-950 space-y-1 shadow-2xs">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
                <span>Kerala Motor Vehicles Department Jurisdiction</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                Sub RTO Mallappally (KL-28) covers Mallappally, Anicadu, Chengaroor, Kaviyoor, Kallooppara, Kunnamthanam, Kottangal, Perumpanachy, and Vennikulam taluk areas. Candidates from other jurisdictions can also train with Aadhaar address verification.
              </p>
            </div>
          </div>

          {/* Right Column: Admission Inquiry Form in Light Blue Glass */}
          <div className="lg:col-span-6">
            <div className="bg-white/80 backdrop-blur-md border border-sky-200 rounded-2xl p-6 sm:p-7 shadow-sm shadow-sky-900/5">
              <div className="mb-5 border-b border-sky-100 pb-3">
                <h4 className="text-base font-bold text-slate-900">
                  Admission Inquiry & Batch Reservation
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Fill in your details below and we will confirm slot availability and Sarathi document requirements.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-800 font-semibold mb-1">
                    Candidate's Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Mohan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/90 border border-sky-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-semibold mb-1">
                    Mobile / WhatsApp Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9562879877"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/90 border border-sky-200 rounded-lg px-3 py-2 text-slate-900 font-mono placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200/50 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">Course Choice</label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full bg-white/90 border border-sky-200 rounded-lg px-3 py-2 text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200/50 focus:outline-none"
                    >
                      <option value="Combo Pack (LMV Car + Bike)">Combo Pack (Car + Bike)</option>
                      <option value="LMV Only (Car - Four Wheeler)">LMV Car Only</option>
                      <option value="MCWG Only (Two Wheeler with Gear)">MCWG Motorcycle Only</option>
                      <option value="MCWOG (Scooter Non-Gear)">MCWOG Scooter Only</option>
                      <option value="Road Confidence Refresher">Refresher Course</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">Preferred Time Slot</label>
                    <select
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                      className="w-full bg-white/90 border border-sky-200 rounded-lg px-3 py-2 text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200/50 focus:outline-none"
                    >
                      <option value="Morning 06:30 AM – 08:30 AM">Morning 06:30 AM – 08:30 AM</option>
                      <option value="Day Slot 09:30 AM – 12:30 PM">Day Slot 09:30 AM – 12:30 PM</option>
                      <option value="Afternoon 02:00 PM – 04:30 PM">Afternoon 02:00 PM – 04:30 PM</option>
                      <option value="Evening 04:30 PM – 06:30 PM">Evening 04:30 PM – 06:30 PM</option>
                      <option value="Weekend Special (Sat & Sun)">Weekend Special (Sat & Sun)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-semibold mb-1">
                    Special Notes / Inquiries
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Need help with Learner's permit test preparation, or slope driving practice..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/90 border border-sky-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200/50 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg font-bold text-xs text-white bg-sky-600 hover:bg-sky-700 transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry to Office Desk (WhatsApp)</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
