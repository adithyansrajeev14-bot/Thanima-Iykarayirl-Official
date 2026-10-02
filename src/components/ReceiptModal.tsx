import React, { useState } from 'react';
import { Receipt, SchoolSettings } from '../types';
import { PrintableReceipt } from './PrintableReceipt';
import { constructWhatsAppReceiptLink } from '../utils/formatters';
import { exportReceiptToPdf } from '../utils/pdfExport';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  PlusCircle,
  PhoneCall,
  MessageSquare,
  Globe,
  ExternalLink,
  Laptop
} from 'lucide-react';

interface ReceiptModalProps {
  receipt: Receipt;
  settings: SchoolSettings;
  isOpen: boolean;
  onClose: () => void;
  onOpenInstallmentModal?: (receipt: Receipt) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  receipt,
  settings,
  isOpen,
  onClose,
  onOpenInstallmentModal,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customPhone, setCustomPhone] = useState(receipt.phone || '');
  const [showCustomPhone, setShowCustomPhone] = useState(false);

  if (!isOpen) return null;

  // Use the helper to construct formatted message, online link, and WhatsApp Web link
  const {
    message,
    digitalReceiptUrl,
    whatsAppWebUrl,
    universalWhatsAppUrl,
  } = constructWhatsAppReceiptLink(receipt, settings, customPhone || receipt.phone);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Failed copying text:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(digitalReceiptUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Failed copying link:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    const filename = `Receipt_${receipt.receiptNumber}_${receipt.studentName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    await exportReceiptToPdf('printable-receipt-modal', filename);
    setIsExportingPdf(false);
  };

  const handleDirectWhatsApp = () => {
    window.open(universalWhatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppWeb = () => {
    window.open(whatsAppWebUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 border-b border-blue-800 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Official Digital Receipt
                <span className="text-xs font-mono font-normal bg-white/20 text-white px-2 py-0.5 rounded border border-white/20">
                  #{receipt.receiptNumber}
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Created on {new Date(receipt.createdAt).toLocaleString()} • {receipt.studentName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar with WhatsApp Web and Digital Bill Link */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-sm flex-shrink-0">
          {/* Primary Action: Send to WhatsApp & WhatsApp Web */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDirectWhatsApp}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all transform active:scale-95 cursor-pointer text-xs"
              title="Open in WhatsApp (App or Web)"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Send WhatsApp Bill</span>
            </button>

            <button
              onClick={handleWhatsAppWeb}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-3 py-2 rounded-lg transition text-xs cursor-pointer"
              title="Open directly in WhatsApp Web in browser"
            >
              <Laptop className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">WhatsApp Web</span>
              <span className="sm:hidden">Web</span>
            </button>

            <button
              onClick={() => setShowCustomPhone(!showCustomPhone)}
              className="text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-2 rounded-lg border border-slate-300 shadow-sm transition cursor-pointer"
              title="Change recipient number for WhatsApp"
            >
              <PhoneCall className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
              {showCustomPhone ? 'Hide Number' : 'Change Phone'}
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200 font-medium transition cursor-pointer"
              title="Copy public link to view this digital bill"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Globe className="w-3.5 h-3.5 text-blue-600" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Bill Link'}</span>
            </button>
          </div>

          {/* Export & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenInstallmentModal && (
              <button
                onClick={() => onOpenInstallmentModal(receipt)}
                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>+ Add Payment</span>
              </button>
            )}

            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium px-3 py-2 rounded-lg transition border border-slate-300 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Digital Bill Link Preview Banner */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-5 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-slate-700">
            <Globe className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="font-semibold text-slate-800 flex-shrink-0">Online Bill Link:</span>
            <span className="font-mono text-blue-800 text-[11px] truncate bg-white px-2 py-0.5 rounded border border-blue-200 select-all">
              {digitalReceiptUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyLink}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer"
            >
              {copiedLink ? 'Copied' : 'Copy'}
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={handleCopyText}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3 text-slate-400" />
              <span>{copiedText ? 'Copied Message!' : 'Copy WhatsApp Text'}</span>
            </button>
          </div>
        </div>

        {/* Optional Custom Phone Number Input Row */}
        {showCustomPhone && (
          <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex items-center gap-3 text-xs animate-in slide-in-from-top-2 duration-150">
            <span className="text-slate-700 font-medium">Recipient Mobile (with country code):</span>
            <input
              type="text"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              placeholder="e.g. 9562879877"
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs w-48 focus:border-blue-600 focus:outline-none"
            />
            <span className="text-slate-500 text-[11px]">
              Click "Send WhatsApp Bill" or "WhatsApp Web" to send
            </span>
          </div>
        )}

        {/* Scrollable Receipt Body */}
        <div className="p-4 md:p-6 overflow-y-auto bg-slate-100/70 flex justify-center">
          <PrintableReceipt
            receipt={receipt}
            settings={settings}
            elementId="printable-receipt-modal"
          />
        </div>
      </div>
    </div>
  );
};
