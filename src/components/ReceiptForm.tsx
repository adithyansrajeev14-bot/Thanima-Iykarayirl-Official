import React, { useState } from 'react';
import { CoursePackage, SchoolSettings, Receipt, PaymentMode, PaymentInstallment } from '../types';
import { formatCurrency } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Car,
  Sparkles,
  CreditCard,
  User,
  Clock,
  FileText,
  CheckCircle,
  ShieldCheck,
  Send,
  Phone,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { LearnerBadge } from './LearnerBadge';

interface ReceiptFormProps {
  courses: CoursePackage[];
  settings: SchoolSettings;
  onReceiptCreated: (receipt: Receipt) => void;
}

export const ReceiptForm: React.FC<ReceiptFormProps> = ({
  courses,
  settings,
  onReceiptCreated,
}) => {
  // Form State
  const defaultCourse = courses[0] || {
    id: 'course-combo',
    name: 'Combo Pack (LMV Car + MCWG Bike)',
    category: 'COMBO',
    vehicleType: 'Car + Motorcycle with Gear',
    defaultFee: 11500,
    defaultRtoFee: 1500,
  };

  const [selectedCourseId, setSelectedCourseId] = useState(defaultCourse.id);
  const [courseFee, setCourseFee] = useState<number>(defaultCourse.defaultFee || 11500);
  const [rtoGovtFee, setRtoGovtFee] = useState<number>(defaultCourse.defaultRtoFee || 1500);
  const [discount, setDiscount] = useState<number>(0);

  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState<string>('20');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');

  const [batchTiming, setBatchTiming] = useState('06:30 AM - 07:30 AM (Morning)');
  const [instructorName, setInstructorName] = useState('Arun Iykarayil');
  const [rtoOffice, setRtoOffice] = useState(settings.rtoOffice || 'Sub RTO Mallappally (KL-28)');
  const [applicationNo, setApplicationNo] = useState('');
  const [learningLicenseNumber, setLearningLicenseNumber] = useState('');

  // Payment State
  const totalAmount = Math.max(0, Number(courseFee) + Number(rtoGovtFee) - Number(discount));
  const [initialPayment, setInitialPayment] = useState<number>(totalAmount);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('GPay / UPI');
  const [referenceNo, setReferenceNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('Admission registration');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick course selection
  const handleSelectCourse = (course: CoursePackage) => {
    setSelectedCourseId(course.id);
    setCourseFee(course.defaultFee);
    setRtoGovtFee(course.defaultRtoFee);
    const newTotal = Math.max(0, course.defaultFee + course.defaultRtoFee - discount);
    setInitialPayment(newTotal);
  };

  const balanceAmount = Math.max(0, totalAmount - initialPayment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMessage('Please enter the student’s full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter the student’s WhatsApp mobile number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const activeCourse = courses.find(c => c.id === selectedCourseId) || defaultCourse;

    const payload = {
      date,
      studentName: studentName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      age: age ? Number(age) : undefined,
      gender,
      bloodGroup,
      courseId: activeCourse.id,
      courseName: activeCourse.name,
      vehicleType: activeCourse.vehicleType,
      batchTiming,
      instructorName,
      rtoOffice,
      applicationNo: applicationNo.trim(),
      learningLicenseNumber: learningLicenseNumber.trim(),
      courseFee: Number(courseFee),
      rtoGovtFee: Number(rtoGovtFee),
      discount: Number(discount),
      initialPayment: Number(initialPayment),
      paymentMode,
      referenceNo: referenceNo.trim(),
      paymentNote: notes,
      notes,
    };

    try {
      let receiptToEmit: Receipt | null = null;
      try {
        const response = await fetch('/api/receipts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.receipt) {
            receiptToEmit = data.receipt;
          }
        }
      } catch (networkErr) {
        console.warn('Backend API unavailable, creating receipt in local store:', networkErr);
      }

      // If backend was unreachable or returned error, generate local receipt
      if (!receiptToEmit) {
        const localSeq = Date.now().toString().slice(-4);
        const year = new Date().getFullYear();
        const installments: PaymentInstallment[] = [];
        if (Number(initialPayment) > 0) {
          installments.push({
            id: `inst_${Date.now()}`,
            date: date || new Date().toISOString().split('T')[0],
            amount: Number(initialPayment),
            paymentMode: paymentMode,
            referenceNo: referenceNo.trim(),
            notes: notes || 'Admission payment',
            receivedBy: 'Staff Desk'
          });
        }
        const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
        receiptToEmit = {
          id: `rec_${Date.now()}`,
          receiptNumber: `TIMDS-${year}-${localSeq}`,
          createdAt: new Date().toISOString(),
          date: date || new Date().toISOString().split('T')[0],
          studentName: studentName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          age: age ? Number(age) : undefined,
          gender,
          bloodGroup,
          courseId: selectedCourseId,
          courseName: currentCourse ? currentCourse.name : 'Driving Course',
          vehicleType: currentCourse ? currentCourse.vehicleType : 'LMV',
          batchTiming,
          learningLicenseNumber: learningLicenseNumber.trim(),
          applicationNo: applicationNo.trim(),
          rtoOffice: settings.rtoOffice,
          instructorName: 'Arun Iykarayil',
          courseFee: Number(courseFee),
          rtoGovtFee: Number(rtoGovtFee),
          discount: Number(discount),
          totalAmount,
          amountPaid: Number(initialPayment),
          balanceAmount,
          paymentStatus: initialPayment >= totalAmount ? 'PAID' : initialPayment > 0 ? 'PARTIAL' : 'PENDING',
          installments,
          notes,
          status: 'Active'
        };
      }

      // Confetti burst for successful receipt generation
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }

      onReceiptCreated(receiptToEmit);

      // Reset form slightly for next student
      setStudentName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setApplicationNo('');
      setLearningLicenseNumber('');
      setReferenceNo('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving receipt to database');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Top Banner Card - Modern Blue & Gray Gradient Design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 p-6 md:p-8 text-white shadow-lg border border-blue-600/30 mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <LearnerBadge size="xl" className="shadow-2xl ring-4 ring-white/30" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/15 text-blue-100 border border-white/20 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Digital Receipt Generator
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                {settings.name}
              </h1>
              <p className="text-amber-300 font-semibold text-sm md:text-base tracking-wide mt-1">
                "{settings.tagline}"
              </p>
              <p className="text-blue-100 text-xs mt-1">
                {settings.address} • Hotline: {settings.primaryPhone} / {settings.secondaryPhone}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-xs space-y-1.5 max-w-xs text-slate-100 shadow-sm">
            <div className="font-bold text-white flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Automated Digital Bill
            </div>
            <p className="text-blue-100 leading-relaxed">
              Generate an official digital receipt, send instant WhatsApp notification, export printable PDF, and track balance payments seamlessly.
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center justify-between shadow-sm">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-800 font-bold">✕</button>
        </div>
      )}

      {/* Main Grid: Form + Live Invoice Summary */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Course Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">1. Select Driving Course Package</h2>
              </div>
              <span className="text-xs text-slate-500">Choose package or customize fees</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {courses.map((c) => {
                const isSelected = selectedCourseId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCourse(c)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20 text-slate-900 shadow-sm'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                          {c.category}
                        </span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="font-bold text-sm text-slate-900 mt-1">{c.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.description}</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Standard Package:</span>
                      <span className="font-extrabold text-blue-700 text-sm">
                        {formatCurrency(c.defaultFee + c.defaultRtoFee)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fee Adjustments */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tuition / Training Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={courseFee}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCourseFee(val);
                    setInitialPayment(Math.max(0, val + rtoGovtFee - discount));
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  RTO Govt & Test Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={rtoGovtFee}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRtoGovtFee(val);
                    setInitialPayment(Math.max(0, courseFee + val - discount));
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-700 mb-1">
                  Discount / Concession (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setDiscount(val);
                    setInitialPayment(Math.max(0, courseFee + rtoGovtFee - val));
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-emerald-700 font-bold text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Student Admission Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">2. Student Profile & Admission Details</h2>
              </div>
              <span className="text-xs text-slate-500">Official DL registration data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Mohan / Ananya Nair"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-700 mb-1 flex items-center justify-between">
                  <span>WhatsApp Mobile No. <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-slate-500">For direct receipt</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">+91</span>
                  <input
                    type="tel"
                    required
                    placeholder="9562879877"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address / Place
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kaduvakuzhy, Chengaroor P.O., Mallappally"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age & Gender
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="16"
                    max="90"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group (Mandatory for DL)
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
                >
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Training Schedule & License References */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">3. Training Batch & License Records</h2>
              </div>
              <span className="text-xs text-slate-500">Timings & Sarathi RTO</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Batch Slot / Training Timing
                </label>
                <select
                  value={batchTiming}
                  onChange={(e) => setBatchTiming(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                >
                  <option value="06:30 AM - 07:30 AM (Morning)">06:30 AM - 07:30 AM (Morning)</option>
                  <option value="07:30 AM - 08:30 AM (Morning)">07:30 AM - 08:30 AM (Morning)</option>
                  <option value="08:30 AM - 09:30 AM (Morning)">08:30 AM - 09:30 AM (Morning)</option>
                  <option value="04:30 PM - 05:30 PM (Evening)">04:30 PM - 05:30 PM (Evening)</option>
                  <option value="05:30 PM - 06:30 PM (Evening)">05:30 PM - 06:30 PM (Evening)</option>
                  <option value="Weekend Special (Sat & Sun)">Weekend Special (Sat & Sun)</option>
                  <option value="Flexible Timings">Flexible Timings</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instructor Assigned
                </label>
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  placeholder="e.g. Arun Iykarayil / Suresh"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Learner's License No. (If already issued)
                </label>
                <input
                  type="text"
                  placeholder="e.g. KL28/0014292/2026"
                  value={learningLicenseNumber}
                  onChange={(e) => setLearningLicenseNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sarathi / Parivahan Application No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. APP-9921448"
                  value={applicationNo}
                  onChange={(e) => setApplicationNo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Payment Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">4. Payment & Billing Settlement</h2>
              </div>
              <span className="text-xs text-emerald-700 font-semibold">Payment Tracking</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount Received Now (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount * 2}
                  value={initialPayment}
                  onChange={(e) => setInitialPayment(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-emerald-700 font-bold text-base focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                />

                {/* Quick preset buttons */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setInitialPayment(totalAmount)}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-1 rounded cursor-pointer transition"
                  >
                    Full ({formatCurrency(totalAmount)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInitialPayment(Math.round(totalAmount / 2))}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-1 rounded cursor-pointer transition"
                  >
                    50% ({formatCurrency(Math.round(totalAmount / 2))})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInitialPayment(5000)}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-1 rounded cursor-pointer transition"
                  >
                    ₹5,000
                  </button>
                  <button
                    type="button"
                    onClick={() => setInitialPayment(2000)}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-1 rounded cursor-pointer transition"
                  >
                    ₹2,000
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                >
                  <option value="GPay / UPI">GPay / PhonePe / UPI</option>
                  <option value="Cash">Cash at Office</option>
                  <option value="Bank Transfer">Bank Transfer / NEFT / IMPS</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Card">Debit / Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UPI UTR / Cheque / Transaction Ref. No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref / Cash receipt"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Billing Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Invoice Summary & Direct Submit */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Live Invoice Summary
              </h3>
              <span className="text-[11px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                DRAFT BILL
              </span>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900 truncate max-w-[160px]">
                  {studentName || '— (Name Pending)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">WhatsApp:</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {phone ? `+91 ${phone}` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Course:</span>
                <span className="font-semibold text-blue-700 truncate max-w-[160px]">
                  {courses.find(c => c.id === selectedCourseId)?.name || 'Course'}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Course Tuition Fee:</span>
                  <span>{formatCurrency(Number(courseFee))}</span>
                </div>
                {Number(rtoGovtFee) > 0 && (
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>RTO Govt Fee:</span>
                    <span>{formatCurrency(Number(rtoGovtFee))}</span>
                  </div>
                )}
                {Number(discount) > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-medium">
                    <span>Concession Discount:</span>
                    <span>-{formatCurrency(Number(discount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Course Fee:</span>
                  <span className="text-base text-blue-700">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Payment Status Preview */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Amount Paid Today:</span>
                  <span className="text-emerald-700 font-bold">{formatCurrency(Number(initialPayment))}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Balance Pending:</span>
                  <span className={balanceAmount > 0 ? 'text-amber-700 text-sm' : 'text-emerald-700 text-sm'}>
                    {formatCurrency(balanceAmount)}
                  </span>
                </div>

                <div className="pt-2 text-center">
                  {balanceAmount === 0 && totalAmount > 0 ? (
                    <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      ✓ Paid in Full
                    </span>
                  ) : initialPayment > 0 ? (
                    <span className="inline-block bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      ⏳ Partial Payment (Advance)
                    </span>
                  ) : (
                    <span className="inline-block bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      ⚠️ Payment Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span>Generating Bill...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Generate & Send Digital Bill</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-500 text-center">
                Instant WhatsApp delivery & printable PDF
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
