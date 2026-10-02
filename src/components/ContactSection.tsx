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
  ExternalLink
} from 'lucide-react';
import { LearnerBadge } from './LearnerBadge';

interface ContactSectionProps {
  settings: SchoolSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Combo Pack (LMV Car + Bike)');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const text = encodeURIComponent(
      `Hi *${settings.name}*!\nMy Name: *${name.trim()}*\nMobile: *${phone.trim()}*\nInterested Course: *${selectedCourse}*\nMessage: ${message.trim() || 'Please call me back regarding new batch admission.'}`
    );
    window.open(`https://wa.me/91${settings.whatsappPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left 6 cols: Driving School Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <LearnerBadge size="lg" className="shadow-xl" />
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {settings.name}
                </h3>
                <p className="text-amber-300 font-semibold text-xs sm:text-sm uppercase tracking-wider">
                  "{settings.tagline}"
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
              Visit our office and training ground at Kaduvakuzhy, Chengaroor P.O., Mallappally. Get complete guidance for your Learner’s License, ground training, and road test.
            </p>

            <div className="space-y-4 pt-2 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Office & Ground Address:</div>
                  <div className="text-slate-300 text-xs">{settings.address}</div>
                  <div className="text-slate-400 text-xs">{settings.city} - {settings.pincode}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Admission Hotlines:</div>
                  <div className="text-amber-300 font-mono font-bold text-sm">
                    <a href={`tel:${settings.primaryPhone}`} className="hover:underline">{settings.primaryPhone}</a>
                    <span className="text-slate-400 mx-2">/</span>
                    <a href={`tel:${settings.secondaryPhone}`} className="hover:underline">{settings.secondaryPhone}</a>
                  </div>
                  <div className="text-[11px] text-slate-400">Available 6:00 AM – 8:00 PM Daily</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Operating Hours:</div>
                  <div className="text-slate-300 text-xs">Practical Driving: 06:30 AM – 06:30 PM (Mon – Sat)</div>
                  <div className="text-slate-400 text-xs">Sunday: Special Batches by Appointment</div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <a
                href={`https://wa.me/91${settings.whatsappPhone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp: {settings.whatsappPhone}</span>
              </a>

              <a
                href={settings.googleMapsUrl || 'https://www.google.com/maps/place/Thanima+Iykkarayil+Motor+Driving+School/@9.4362596,76.6413042,101m/data=!3m1!1e3!4m8!3m7!1s0x3b0625e130d716c1:0xf434ddbb4440fbd8!8m2!3d9.4361345!4d76.6414822!9m1!1b1!16s%2Fg%2F11ns5khhs7?entry=ttu'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                title="View Thanima Iykkarayil MDS on Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Open in Google Maps (153 Reviews)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Right 6 cols: Quick WhatsApp Admission Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="mb-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  Quick Admission Inquiry
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in your details and we will connect with you immediately with batch availability.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Mohan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9562879877"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Course</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Combo Pack (LMV Car + Bike)">Combo Pack (LMV Car + MCWG Bike)</option>
                    <option value="LMV Only (Car - Four Wheeler)">LMV Only (Car - Four Wheeler)</option>
                    <option value="MCWG Only (Two Wheeler with Gear)">MCWG Only (Two Wheeler with Gear)</option>
                    <option value="MCWOG (Scooter Non-Gear)">MCWOG (Scooter Non-Gear)</option>
                    <option value="License Holder Refresher Course">License Holder Refresher Course</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Timing / Note</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Morning 6:30 AM batch, or Weekend only"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry to Thanima MDS (WhatsApp)</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
