import React, { useState } from 'react';
import { Receipt, SchoolSettings } from '../types';
import { PrintableReceipt } from './PrintableReceipt';
import { exportReceiptToPdf } from '../utils/pdfExport';
import { formatCurrency } from '../utils/formatters';
import {
  Download,
  Printer,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  QrCode
} from 'lucide-react';
import { LearnerBadge } from './LearnerBadge';

interface CustomerBillPageProps {
  receipt: Receipt;
  settings: SchoolSettings;
  onBackToHome?: () => void;
}

export const CustomerBillPage: React.FC<CustomerBillPageProps> = ({
  receipt,
  settings,
  onBackToHome,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    const filename = `Receipt_${receipt.receiptNumber}_${receipt.studentName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    await exportReceiptToPdf('customer-bill-receipt', filename);
    setIsExportingPdf(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleContactWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi ${settings.name}, I am ${receipt.studentName} (Receipt #${receipt.receiptNumber}). I have a query regarding my driving class.`
    );
    window.open(`https://wa.me/91${settings.whatsappPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-800 flex flex-col py-6 px-3 sm:px-6">
      {/* Top Customer Navigation Header */}
      <div className="max-w-4xl mx-auto w-full mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <LearnerBadge size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                {settings.name}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                Official Bill
              </span>
            </div>
            <p className="text-xs text-blue-700 font-semibold mt-0.5">
              "{settings.tagline}" • {settings.address}
            </p>
          </div>
        </div>

        {/* Quick Help Contacts */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${settings.primaryPhone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-mono">{settings.primaryPhone}</span>
          </a>

          <button
            onClick={handleContactWhatsApp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Support</span>
          </button>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="max-w-4xl mx-auto w-full mb-6 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-blue-600/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded border border-white/20 font-mono">
              #{receipt.receiptNumber}
            </span>
            <span className="text-xs text-blue-100">
              Issued to <strong className="text-white">{receipt.studentName}</strong>
            </span>
          </div>
          <div className="text-sm font-semibold flex items-center justify-center sm:justify-start gap-2">
            {receipt.paymentStatus === 'PAID' ? (
              <span className="flex items-center gap-1 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Payment Cleared in Full</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-300">
                <AlertCircle className="w-4 h-4" />
                <span>Balance Due: {formatCurrency(receipt.balanceAmount)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Download & Print Actions */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-blue-700" />
            <span>{isExportingPdf ? 'Exporting PDF...' : 'Download Official PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1 text-xs text-blue-200 hover:text-white px-2 py-2 transition cursor-pointer"
              title="Return to Main Portal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>

      {/* The Printable Digital Bill Document */}
      <div className="max-w-4xl mx-auto w-full flex justify-center shadow-lg rounded-2xl overflow-hidden mb-8">
        <PrintableReceipt
          receipt={receipt}
          settings={settings}
          elementId="customer-bill-receipt"
        />
      </div>

      {/* Customer Info Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 space-y-1 pb-8">
        <p>
          This is an official computer-generated receipt issued by <strong>{settings.name}</strong>.
        </p>
        <p>
          Office: {settings.address}, {settings.city} • Sub RTO: {receipt.rtoOffice || settings.rtoOffice}
        </p>
      </div>
    </div>
  );
};
