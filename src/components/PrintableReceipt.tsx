import React from 'react';
import { Receipt, SchoolSettings } from '../types';
import { formatCurrency, formatDate, formatDateTime, generateUpiQrUrl } from '../utils/formatters';
import { LearnerBadge } from './LearnerBadge';
import { Phone, MapPin, CheckCircle2, AlertCircle, Clock, ShieldCheck, QrCode } from 'lucide-react';

interface PrintableReceiptProps {
  receipt: Receipt;
  settings: SchoolSettings;
  elementId?: string;
  isPrintMode?: boolean;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({
  receipt,
  settings,
  elementId = 'printable-receipt',
  isPrintMode = false,
}) => {
  const isPaid = receipt.paymentStatus === 'PAID';
  const isPartial = receipt.paymentStatus === 'PARTIAL';
  const qrUrl = generateUpiQrUrl(
    settings.upiId,
    settings.upiName,
    receipt.balanceAmount > 0 ? receipt.balanceAmount : receipt.totalAmount,
    `TIMDS Fee ${receipt.receiptNumber}`
  );

  return (
    <div
      id={elementId}
      className={`bg-white text-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-200 w-full max-w-3xl mx-auto ${
        isPrintMode ? 'p-0 shadow-none border-none' : ''
      }`}
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Header Banner - Gradient Style with Blue & Dark Slate */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white p-6 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <LearnerBadge size="lg" className="shadow-lg" />
            <div>
              <div className="inline-block px-2.5 py-0.5 mb-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-200 border border-blue-400/30">
                Govt. Recognized Driving School
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
                {settings.name}
              </h1>
              <p className="text-xs md:text-sm font-semibold tracking-wider text-amber-300 uppercase mt-0.5">
                "{settings.tagline}"
              </p>
            </div>
          </div>

          {/* Quick contact badge */}
          <div className="text-right text-xs text-slate-200 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-white/15 flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>{settings.city}</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-amber-200 text-sm mt-0.5">
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>{settings.primaryPhone} / {settings.secondaryPhone}</span>
            </div>
          </div>
        </div>

        {/* Receipt sub-bar */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">Receipt / Tax Invoice No:</span>
            <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white tracking-wide">
              #{receipt.receiptNumber}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-200">
            <span>Issue Date: <strong className="text-white">{formatDate(receipt.date)}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">RTO: <strong className="text-white">{receipt.rtoOffice || settings.rtoOffice}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 space-y-6 bg-slate-50/50">
        {/* Student & Course Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Information Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 rounded-l" />
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Student Admission Profile
              </h3>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Active Candidate
              </span>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Student Full Name:</span>
                <span className="font-bold text-slate-900">{receipt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Mobile (WhatsApp):</span>
                <span className="font-semibold text-slate-800 font-mono">{receipt.phone || 'N/A'}</span>
              </div>
              {receipt.email && (
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Email Address:</span>
                  <span className="text-slate-700 text-xs">{receipt.email}</span>
                </div>
              )}
              {receipt.address && (
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Address:</span>
                  <span className="text-slate-700 text-right text-xs max-w-[200px] truncate" title={receipt.address}>
                    {receipt.address}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-slate-100 text-xs text-slate-600">
                <span>Blood Group: <strong className="text-slate-800">{receipt.bloodGroup || 'Not specified'}</strong></span>
                <span>Age / Sex: <strong className="text-slate-800">{receipt.age || '-'} / {receipt.gender || '-'}</strong></span>
              </div>
            </div>
          </div>

          {/* Training & License Details Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-600 rounded-l" />
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Training & License Details
              </h3>
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Class Enrolled
              </span>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Course Package:</span>
                <span className="font-bold text-blue-900">{receipt.courseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Vehicle Type:</span>
                <span className="font-semibold text-slate-800">{receipt.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Batch Slot:</span>
                <span className="text-slate-800 font-medium text-xs">{receipt.batchTiming || 'Flexible Morning/Evening'}</span>
              </div>
              {receipt.learningLicenseNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Learner's Lic (LLR):</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{receipt.learningLicenseNumber}</span>
                </div>
              )}
              {receipt.applicationNo && (
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Sarathi / App No:</span>
                  <span className="font-mono text-slate-700 text-xs">{receipt.applicationNo}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-slate-100 text-xs text-slate-600">
                <span>Instructor: <strong className="text-slate-800">{receipt.instructorName || 'Authorized Staff'}</strong></span>
                <span>Sub-RTO: <strong className="text-slate-800">{receipt.rtoOffice || 'Mallappally'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Billing & Payment Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Fee Statement & Particulars
            </span>
            <span className="text-xs text-slate-500">Official Driving School Tariff</span>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Item Description</th>
                <th className="py-2.5 px-4 text-center">Category</th>
                <th className="py-2.5 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{receipt.courseName}</div>
                  <div className="text-xs text-slate-500">Ground training, road driving & vehicle test preparation</div>
                </td>
                <td className="py-3 px-4 text-center text-xs">
                  <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">Training</span>
                </td>
                <td className="py-3 px-4 text-right font-medium text-slate-800">
                  {formatCurrency(receipt.courseFee)}
                </td>
              </tr>

              {receipt.rtoGovtFee > 0 && (
                <tr>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">RTO Government Fees & Slot Booking</div>
                    <div className="text-xs text-slate-500">LLR test, smart card DL application & test ground charges</div>
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">Govt RTO</span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-800">
                    {formatCurrency(receipt.rtoGovtFee)}
                  </td>
                </tr>
              )}

              {receipt.discount > 0 && (
                <tr className="bg-emerald-50/50">
                  <td className="py-2.5 px-4 text-emerald-800">
                    <div className="font-semibold">Special Concession / Discount</div>
                  </td>
                  <td className="py-2.5 px-4 text-center text-xs">
                    <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">Discount</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-emerald-700">
                    -{formatCurrency(receipt.discount)}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-medium">
              <tr>
                <td colSpan={2} className="py-2.5 px-4 text-right font-bold text-slate-700">
                  Total Course Package Amount:
                </td>
                <td className="py-2.5 px-4 text-right font-extrabold text-slate-900 text-base">
                  {formatCurrency(receipt.totalAmount)}
                </td>
              </tr>
              <tr className="bg-blue-50/50 border-t border-slate-200">
                <td colSpan={2} className="py-2.5 px-4 text-right font-bold text-blue-900">
                  Total Amount Paid (Received):
                </td>
                <td className="py-2.5 px-4 text-right font-extrabold text-emerald-700 text-base">
                  {formatCurrency(receipt.amountPaid)}
                </td>
              </tr>
              <tr className="border-t border-slate-200 bg-amber-50/40">
                <td colSpan={2} className="py-2.5 px-4 text-right font-bold text-slate-800">
                  Outstanding Balance Due:
                </td>
                <td className="py-2.5 px-4 text-right font-black text-rose-700 text-lg">
                  {formatCurrency(receipt.balanceAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment History & Installments Log */}
        {receipt.installments && receipt.installments.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Payment Installment History ({receipt.installments.length})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-1.5 px-2">Date</th>
                    <th className="py-1.5 px-2">Payment Mode</th>
                    <th className="py-1.5 px-2">Reference / Notes</th>
                    <th className="py-1.5 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receipt.installments.map((inst, idx) => (
                    <tr key={inst.id || idx}>
                      <td className="py-2 px-2 font-medium text-slate-700">{formatDate(inst.date)}</td>
                      <td className="py-2 px-2">
                        <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {inst.paymentMode}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-500">
                        {inst.referenceNo ? <span className="font-mono text-slate-700 mr-2">{inst.referenceNo}</span> : null}
                        {inst.notes || 'Payment recorded'}
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-slate-900">
                        {formatCurrency(inst.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Status & UPI QR clearance banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Status Badge */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            {isPaid ? (
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : isPartial ? (
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-8 h-8" />
              </div>
            )}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Payment Verification Status
              </div>
              <div className="text-lg font-black tracking-tight">
                {isPaid && <span className="text-emerald-700">PAID IN FULL (CLEARED)</span>}
                {isPartial && <span className="text-amber-700">PARTIAL PAYMENT RECEIVED</span>}
                {!isPaid && !isPartial && <span className="text-rose-700">PAYMENT PENDING</span>}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isPaid
                  ? 'All tuition and RTO charges have been cleared. Ready for license test.'
                  : `Remaining balance of ${formatCurrency(receipt.balanceAmount)} payable before RTO test date.`}
              </p>
            </div>
          </div>

          {/* UPI Quick Pay QR Code for Balance or Receipt verification */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 mb-1">
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span>{receipt.balanceAmount > 0 ? 'Scan to Pay Balance' : 'Driving School UPI'}</span>
            </div>
            <img
              src={qrUrl}
              alt="UPI Payment QR"
              className="w-24 h-24 rounded border border-slate-200 p-0.5 bg-white shadow-inner"
              loading="lazy"
            />
            <div className="text-[10px] font-mono text-slate-500 mt-1 truncate max-w-[170px]" title={settings.upiId}>
              {settings.upiId}
            </div>
          </div>
        </div>

        {/* Terms & Seal Section */}
        <div className="border-t border-slate-200 pt-4 flex flex-col md:flex-row items-start justify-between gap-6 text-xs text-slate-500">
          <div className="max-w-md space-y-1">
            <div className="font-bold text-slate-700 flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Terms & Important Information:
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500">
              <li>Carry this fee receipt and valid Learner’s License during training sessions.</li>
              <li>Fee once paid is non-refundable and non-transferable.</li>
              <li>Test slot scheduling is contingent on clearance of all pending dues.</li>
            </ul>
          </div>

          {/* Official Seal / Signature Stamp */}
          <div className="flex flex-col items-center justify-center text-center self-end md:self-center pr-4">
            <div className="w-32 h-14 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 text-[10px] italic bg-slate-50/50 mb-1">
              <div className="text-center">
                <span className="font-bold text-blue-900/60 block uppercase text-[9px] tracking-wider">THANIMA IYKARAYIL MDS</span>
                <span className="text-[8px] text-slate-400">Authorized Signatory</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-600">Authorized Signatory Stamp</span>
          </div>
        </div>

        {/* Footer timestamp */}
        <div className="text-center border-t border-slate-100 pt-2 text-[10px] text-slate-400">
          This is a computer-generated digital receipt issued by {settings.name}, Mallappally. Record created on {formatDateTime(receipt.createdAt)}.
        </div>
      </div>
    </div>
  );
};
