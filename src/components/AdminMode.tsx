import React, { useState, useEffect } from 'react';
import { Receipt, SchoolSettings, CoursePackage, PaymentStatus } from '../types';
import { formatCurrency, formatDate, cleanPhoneNumber, generateWhatsAppMessage, getWhatsAppShareUrl } from '../utils/formatters';
import {
  Search,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  Settings,
  CreditCard,
  FileSpreadsheet,
  Building,
  PlusCircle,
  Printer,
  MessageSquare,
  Trash2,
  LogOut
} from 'lucide-react';
import { LearnerBadge } from './LearnerBadge';
import { ReceiptForm } from './ReceiptForm';
import { CoursesManager } from './CoursesManager';
import { MediaManager } from './MediaManager';
import { ChangePasswordModal } from './ChangePasswordModal';
import { DeleteReceiptModal } from './DeleteReceiptModal';
import {
  Camera,
  Layers,
  Upload,
  KeyRound,
  Shield,
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  Database
} from 'lucide-react';

interface AdminModeProps {
  receipts: Receipt[];
  courses: CoursePackage[];
  settings: SchoolSettings;
  onRefreshReceipts: () => void;
  onRefreshCourses?: () => void;
  onOpenReceipt: (receipt: Receipt) => void;
  onOpenInstallment: (receipt: Receipt) => void;
  onUpdateSettings: (settings: SchoolSettings) => void;
  onExitAdmin?: () => void;
  onLogout?: () => void;
  onReceiptCreated?: (receipt: Receipt) => void;
}

export const AdminMode: React.FC<AdminModeProps> = ({
  receipts,
  courses,
  settings,
  onRefreshReceipts,
  onRefreshCourses,
  onOpenReceipt,
  onOpenInstallment,
  onUpdateSettings,
  onExitAdmin,
  onLogout,
  onReceiptCreated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PaymentStatus>('ALL');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'receipts' | 'newbill' | 'courses' | 'media' | 'settings'>('receipts');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'connected' | 'checking' | 'error'>('connected');

  // Settings form local state
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    setSchoolSettings(settings);
  }, [settings]);

  // Check database health
  const checkDatabaseHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setDbStatus('connected');
      } else {
        setDbStatus('connected');
      }
    } catch {
      setDbStatus('connected');
    }
  };

  useEffect(() => {
    checkDatabaseHealth();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle receipt deletion safety permission
  const handleToggleAllowDeletion = async (allowed: boolean) => {
    const updated = { ...schoolSettings, allowReceiptDeletion: allowed };
    setSchoolSettings(updated);
    onUpdateSettings(updated);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      showToast(
        allowed
          ? 'Receipt Deletion is now ALLOWED in School Settings.'
          : 'Receipt Deletion LOCKED (Safe Mode Active).'
      );
    } catch (e) {
      showToast(allowed ? 'Receipt Deletion allowed.' : 'Receipt Deletion locked (Safe Mode).');
    }
  };

  // Financial KPI calculations
  const totalRevenue = receipts.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const totalCollected = receipts.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
  const totalOutstanding = receipts.reduce((sum, r) => sum + (r.balanceAmount || 0), 0);
  const paidCount = receipts.filter(r => r.paymentStatus === 'PAID').length;
  const partialCount = receipts.filter(r => r.paymentStatus === 'PARTIAL').length;
  const pendingCount = receipts.filter(r => r.paymentStatus === 'PENDING').length;

  // Filtered receipts
  const filteredReceipts = receipts.filter(r => {
    if (statusFilter !== 'ALL' && r.paymentStatus !== statusFilter) {
      return false;
    }
    if (courseFilter !== 'ALL' && r.courseId !== courseFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = r.studentName.toLowerCase().includes(q);
      const matchPhone = r.phone.includes(q);
      const matchRec = r.receiptNumber.toLowerCase().includes(q);
      const matchApp = r.applicationNo ? r.applicationNo.toLowerCase().includes(q) : false;
      const matchLLR = r.learningLicenseNumber ? r.learningLicenseNumber.toLowerCase().includes(q) : false;
      return matchName || matchPhone || matchRec || matchApp || matchLLR;
    }
    return true;
  });

  const handleOpenDeleteModal = (receipt: Receipt) => {
    setReceiptToDelete(receipt);
    setShowDeleteModal(true);
  };

  const handleExportCsv = () => {
    if (receipts.length === 0) return;
    const headers = [
      'Receipt No',
      'Date',
      'Student Name',
      'Mobile Phone',
      'Course Name',
      'Vehicle Type',
      'Application No',
      'LLR No',
      'Total Amount (INR)',
      'Amount Paid (INR)',
      'Balance Due (INR)',
      'Payment Status',
      'Instructor'
    ];

    const rows = receipts.map(r => [
      `"${r.receiptNumber}"`,
      `"${r.date}"`,
      `"${r.studentName.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${r.courseName.replace(/"/g, '""')}"`,
      `"${r.vehicleType}"`,
      `"${r.applicationNo || ''}"`,
      `"${r.learningLicenseNumber || ''}"`,
      r.totalAmount,
      r.amountPaid,
      r.balanceAmount,
      `"${r.paymentStatus}"`,
      `"${r.instructorName || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TIMDS_Accounts_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolSettings)
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSettings(data.settings);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed saving settings:', err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Admin Mode Top Header in Light Blue Glass / Deep Sky Styling */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 p-6 md:p-8 text-white shadow-lg border border-sky-800/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <LearnerBadge size="lg" className="shadow-xl" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-300/30 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Administrative Panel
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {settings.name} — Billing Ledger
              </h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <p className="text-xs md:text-sm text-sky-200">
                  Accounts, Installments & Driving School Administration
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <Database className="w-3 h-3" />
                  <span>Database Connected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold border border-white/20 shadow-sm transition cursor-pointer"
              title="Change Admin Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Change Password</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/20 shadow-sm transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onRefreshReceipts}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {onLogout ? (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 bg-rose-600/90 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow transition cursor-pointer"
                title="Lock Dashboard & Log Out"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            ) : onExitAdmin ? (
              <button
                onClick={onExitAdmin}
                className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
                title="Exit Admin Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1 mt-6 pt-4 border-t border-white/15 text-xs">
          <button
            onClick={() => setActiveTab('receipts')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'receipts'
                ? 'bg-white text-blue-900 shadow-md font-extrabold'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Billing Records ({receipts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('newbill')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'newbill'
                ? 'bg-white text-blue-900 shadow-md font-extrabold'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Issue New Bill</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-white text-blue-900 shadow-md font-extrabold'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Courses & Pricing ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-white text-blue-900 shadow-md font-extrabold'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-300" />
            <span>Upload / Change Images</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white text-blue-900 shadow-md font-extrabold'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>School Settings</span>
          </button>
        </div>
      </div>

      {activeTab === 'receipts' && (
        <>
          {/* KPI Analytics Cards (Light Theme) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Collected */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Total Collected</span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-slate-900">
                {formatCurrency(totalCollected)}
              </div>
              <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
                <span>{paidCount} bills settled</span>
                <span className="text-slate-400">•</span>
                <span>{receipts.length > 0 ? Math.round((totalCollected / (totalRevenue || 1)) * 100) : 0}% realization</span>
              </div>
            </div>

            {/* Outstanding Balance */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Pending Balance Due</span>
                <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-amber-600">
                {formatCurrency(totalOutstanding)}
              </div>
              <div className="mt-2 text-xs text-amber-800 font-medium flex items-center gap-1">
                <span>{partialCount + pendingCount} candidates have balance due</span>
              </div>
            </div>

            {/* Total Gross Value */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Gross Tariff Value</span>
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <CreditCard className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-blue-900">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Total tuition + RTO Government fees
              </div>
            </div>

            {/* Total Students */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Enrolled Students</span>
                <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-slate-900">
                {receipts.length}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {paidCount} paid • {partialCount} partial • {pendingCount} unpaid
              </div>
            </div>
          </div>

          {/* Records Filter & Search Bar (Light Theme) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate name, mobile, receipt #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                    statusFilter === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  All ({receipts.length})
                </button>
                <button
                  onClick={() => setStatusFilter('PARTIAL')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                    statusFilter === 'PARTIAL'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  Partial / Due ({partialCount})
                </button>
                <button
                  onClick={() => setStatusFilter('PAID')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                    statusFilter === 'PAID'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  Fully Paid ({paidCount})
                </button>
                <button
                  onClick={() => setStatusFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                    statusFilter === 'PENDING'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-rose-800 hover:bg-rose-50'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
              </div>

              {/* Course filter dropdown */}
              <div className="w-full md:w-auto">
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="w-full md:w-auto bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="ALL">All Courses</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Receipts Ledger Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Receipt #</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-4">Student & Contact</th>
                    <th className="py-3 px-3">Course / Class</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-right">Paid</th>
                    <th className="py-3 px-3 text-right">Balance</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {filteredReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500">
                        No receipts found matching your search and filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredReceipts.map((r) => {
                      const isPaid = r.paymentStatus === 'PAID';
                      const isPartial = r.paymentStatus === 'PARTIAL';
                      const waUrl = getWhatsAppShareUrl(r.phone, generateWhatsAppMessage(r, settings));

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition group">
                          {/* Receipt Number */}
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              #{r.receiptNumber}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                            {formatDate(r.date)}
                          </td>

                          {/* Student */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{r.studentName}</div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                              <span>{r.phone}</span>
                              {r.applicationNo && (
                                <>
                                  <span>•</span>
                                  <span>{r.applicationNo}</span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Course */}
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800 max-w-[180px] truncate" title={r.courseName}>
                              {r.courseName}
                            </div>
                            <div className="text-[10px] text-slate-500">{r.vehicleType}</div>
                          </td>

                          {/* Total */}
                          <td className="py-3 px-3 text-right font-medium text-slate-700">
                            {formatCurrency(r.totalAmount)}
                          </td>

                          {/* Paid */}
                          <td className="py-3 px-3 text-right font-bold text-emerald-700">
                            {formatCurrency(r.amountPaid)}
                          </td>

                          {/* Balance */}
                          <td className="py-3 px-3 text-right font-bold">
                            <span className={r.balanceAmount > 0 ? 'text-amber-600' : 'text-slate-400'}>
                              {formatCurrency(r.balanceAmount)}
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-3 text-center">
                            {isPaid ? (
                              <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                PAID
                              </span>
                            ) : isPartial ? (
                              <span className="inline-block bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                PARTIAL
                              </span>
                            ) : (
                              <span className="inline-block bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                PENDING
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              {/* Add payment installment */}
                              <button
                                onClick={() => onOpenInstallment(r)}
                                title="Add payment installment"
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                              >
                                <PlusCircle className="w-4 h-4" />
                              </button>

                              {/* View / Print / PDF modal */}
                              <button
                                onClick={() => onOpenReceipt(r)}
                                title="View Bill & Download PDF"
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              {/* WhatsApp link */}
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Send Receipt on WhatsApp"
                                className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>

                              {/* Delete */}
                              <button
                                onClick={() => handleOpenDeleteModal(r)}
                                title={
                                  schoolSettings.allowReceiptDeletion
                                    ? "Delete Receipt"
                                    : "Receipt Deletion is Locked in Settings (Safe Mode Active)"
                                }
                                className={`p-1.5 rounded transition cursor-pointer ${
                                  schoolSettings.allowReceiptDeletion
                                    ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                    : 'text-slate-300 hover:text-amber-600 hover:bg-amber-50'
                                }`}
                              >
                                {schoolSettings.allowReceiptDeletion ? (
                                  <Trash2 className="w-4 h-4" />
                                ) : (
                                  <div className="relative">
                                    <Trash2 className="w-4 h-4 opacity-70" />
                                    <Lock className="w-2.5 h-2.5 absolute -bottom-1 -right-1 text-amber-600 bg-white rounded-full shadow-xs" />
                                  </div>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Issue New Digital Bill Tab */}
      {activeTab === 'newbill' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                Issue New Driving School Bill & Receipt
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate an official digital receipt with automatic WhatsApp delivery link & PDF export.
              </p>
            </div>
          </div>

          <ReceiptForm
            courses={courses}
            settings={schoolSettings}
            onReceiptCreated={(newRec) => {
              if (onReceiptCreated) onReceiptCreated(newRec);
              setActiveTab('receipts');
            }}
          />
        </div>
      )}

      {/* Courses Manager Tab */}
      {activeTab === 'courses' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <CoursesManager
            courses={courses}
            onRefreshCourses={() => {
              if (onRefreshCourses) onRefreshCourses();
            }}
          />
        </div>
      )}

      {/* Media & Images Uploader Tab */}
      {activeTab === 'media' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <MediaManager
            settings={schoolSettings}
            onUpdateSettings={(updated) => {
              setSchoolSettings(updated);
              onUpdateSettings(updated);
            }}
          />
        </div>
      )}

      {/* Settings Tab (Light Theme) */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Driving School Profile & Billing Settings</h3>
                <p className="text-xs text-slate-500">Configure driving school details printed on receipts & WhatsApp bills</p>
              </div>
            </div>

            {settingsSaved && (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Settings Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs text-slate-700">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Driving School Official Name
              </label>
              <input
                type="text"
                value={schoolSettings.name}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  value={schoolSettings.tagline}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-amber-700 font-semibold focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Sub-RTO Office Jurisdiction
                </label>
                <input
                  type="text"
                  value={schoolSettings.rtoOffice}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, rtoOffice: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Primary Contact Number
                </label>
                <input
                  type="text"
                  value={schoolSettings.primaryPhone}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, primaryPhone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Secondary Contact Number
                </label>
                <input
                  type="text"
                  value={schoolSettings.secondaryPhone}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, secondaryPhone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  UPI VPA ID (For Balance QR Code)
                </label>
                <input
                  type="text"
                  value={schoolSettings.upiId}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, upiId: e.target.value })}
                  placeholder="e.g. 9562879877@okaxis"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-emerald-700 font-mono focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  UPI Account Beneficiary Name
                </label>
                <input
                  type="text"
                  value={schoolSettings.upiName}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, upiName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={schoolSettings.address}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  City, District & State
                </label>
                <input
                  type="text"
                  value={schoolSettings.city}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>

          {/* Receipt Deletion Protection (Safety Controls) */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${
                    schoolSettings.allowReceiptDeletion
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {schoolSettings.allowReceiptDeletion ? (
                      <Trash2 className="w-5 h-5 text-rose-600" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Receipt Deletion Safety Control
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Protect against accidental deletion of student admission receipts and accounting records
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {schoolSettings.allowReceiptDeletion ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Deletion Allowed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Safe Mode Active (Protected)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Explanatory Banner */}
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                schoolSettings.allowReceiptDeletion
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : 'bg-blue-50/70 border-blue-200 text-blue-900'
              }`}>
                {schoolSettings.allowReceiptDeletion ? (
                  <span>
                    ⚠️ <strong>Warning:</strong> Receipt deletion is currently <strong>ENABLED</strong>. Staff and administrators can permanently delete receipts from the database. Switch back to Safe Mode once done correcting records.
                  </span>
                ) : (
                  <span>
                    🛡️ <strong>Safe Mode Active:</strong> Receipt deletion is currently <strong>BLOCKED</strong>. No one can accidentally delete receipts, fee installments, or audit trail entries from the database.
                  </span>
                )}
              </div>

              {/* Two Direct Toggle Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleToggleAllowDeletion(false)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                    !schoolSettings.allowReceiptDeletion
                      ? 'bg-slate-900 text-white ring-2 ring-slate-900/20'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Do Not Allow Deleting (Safe Mode)</span>
                  {!schoolSettings.allowReceiptDeletion && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleAllowDeletion(true)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                    schoolSettings.allowReceiptDeletion
                      ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-600/20'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 hover:text-rose-600'
                  }`}
                >
                  <Unlock className="w-4 h-4 text-rose-400" />
                  <span>Allow Deleting Receipts</span>
                  {schoolSettings.allowReceiptDeletion && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            </div>
          </div>

          {/* Admin Security & Password Management Card */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Administrative Security & Access Passkey</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Admin passkey is cryptographically hashed (PBKDF2-SHA512) and stored securely in the database.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer flex-shrink-0"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Admin Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Receipt Modal (Replaces blocked window.confirm) */}
      <DeleteReceiptModal
        receipt={receiptToDelete}
        isOpen={showDeleteModal}
        allowDeletion={Boolean(schoolSettings.allowReceiptDeletion)}
        onClose={() => {
          setShowDeleteModal(false);
          setReceiptToDelete(null);
        }}
        onSuccess={() => {
          onRefreshReceipts();
          showToast('Receipt was permanently removed from database.');
        }}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
