import React, { useState } from 'react';
import type { Receipt } from '../types';
import { Trash2, AlertTriangle, ShieldAlert, X, Check, ArrowRight } from 'lucide-react';

interface DeleteReceiptModalProps {
  receipt: Receipt | null;
  isOpen: boolean;
  allowDeletion: boolean;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
  onOpenSettings?: () => void;
}

export const DeleteReceiptModal: React.FC<DeleteReceiptModalProps> = ({
  receipt,
  isOpen,
  allowDeletion,
  onClose,
  onSuccess,
  onOpenSettings,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !receipt) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/receipts/${receipt.id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success || res.status === 200)) {
        onSuccess(receipt.id);
        onClose();
      } else {
        setError(data.message || 'Server rejected receipt deletion. Please check School Settings.');
      }
    } catch (err: any) {
      // Local fallback removal if offline/backend unreachable
      try {
        const raw = localStorage.getItem('timds_receipts');
        if (raw) {
          const list: Receipt[] = JSON.parse(raw);
          const filtered = list.filter((r) => r.id !== receipt.id);
          localStorage.setItem('timds_receipts', JSON.stringify(filtered));
        }
        onSuccess(receipt.id);
        onClose();
      } catch (e) {
        setError('Network error while deleting receipt from database.');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 text-white ${
            allowDeletion
              ? 'bg-gradient-to-r from-rose-700 via-rose-800 to-slate-900'
              : 'bg-gradient-to-r from-amber-600 to-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {allowDeletion ? (
              <Trash2 className="w-5 h-5 text-rose-200" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            )}
            <h3 className="font-extrabold text-sm tracking-tight">
              {allowDeletion ? 'Delete Driving School Receipt' : 'Receipt Deletion Locked'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Receipt Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Receipt Number
              </span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {receipt.receiptNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Student Name:</span>
              <span className="font-bold text-slate-900">{receipt.studentName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Course:</span>
              <span className="font-semibold text-slate-800">{receipt.courseName}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-600">Total Amount:</span>
              <span className="font-extrabold text-slate-900">
                ₹{receipt.totalAmount.toLocaleString('en-IN')} (Paid: ₹{receipt.amountPaid.toLocaleString('en-IN')})
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Safety Check: If Deletion is Locked in School Settings */}
          {!allowDeletion ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Deletion Protection is ACTIVE (Safe Mode)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Receipt deletion is currently <strong>disabled</strong> in School Settings for accounting and tax record safety.
                </p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  To permanently remove this record, switch <strong>"Allow Deleting Receipts"</strong> to ON inside the <strong>School Settings</strong> tab.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSettings();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition cursor-pointer"
                  >
                    <span>Configure in Settings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Deletion is ALLOWED */
            <div className="space-y-4">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-[11px] leading-relaxed">
                  <span className="font-bold text-rose-950 block">Permanent Action Warning:</span>
                  <span>
                    Are you sure you want to permanently erase this receipt from the database? This action cannot be reversed.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={deleting}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deleting ? 'Deleting from Database...' : 'Yes, Permanently Delete'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
