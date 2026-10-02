import React, { useState } from 'react';
import { Receipt, PaymentMode } from '../types';
import { formatCurrency } from '../utils/formatters';
import { X, CreditCard, Check, AlertCircle } from 'lucide-react';

interface InstallmentModalProps {
  receipt: Receipt;
  isOpen: boolean;
  onClose: () => void;
  onPaymentAdded: (updatedReceipt: Receipt) => void;
}

export const InstallmentModal: React.FC<InstallmentModalProps> = ({
  receipt,
  isOpen,
  onClose,
  onPaymentAdded,
}) => {
  const [amount, setAmount] = useState<number>(receipt.balanceAmount > 0 ? receipt.balanceAmount : 1000);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('GPay / UPI');
  const [referenceNo, setReferenceNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('Subsequent installment');
  const [receivedBy, setReceivedBy] = useState('Staff Desk');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/receipts/${receipt.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          paymentMode,
          referenceNo,
          date,
          notes,
          receivedBy
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to record payment');
      }

      onPaymentAdded(data.receipt);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error recording installment payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-700 to-slate-900 border-b border-blue-800 text-white">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-base">Record Payment Installment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm text-slate-800">
          {/* Receipt Info Badge */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Student:</span>
              <span className="font-bold text-slate-900">{receipt.studentName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Receipt No:</span>
              <span className="font-mono font-semibold text-blue-700">#{receipt.receiptNumber}</span>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-slate-200">
              <span className="text-slate-500">Total Course Fee:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(receipt.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Already Paid:</span>
              <span className="font-semibold text-emerald-700">{formatCurrency(receipt.amountPaid)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-amber-800">Current Balance Due:</span>
              <span className="text-amber-800">{formatCurrency(receipt.balanceAmount)}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Amount Received (₹)*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-bold">₹</span>
              <input
                type="number"
                min="1"
                max={receipt.totalAmount * 2}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold text-base focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            {receipt.balanceAmount > 0 && amount !== receipt.balanceAmount && (
              <button
                type="button"
                onClick={() => setAmount(receipt.balanceAmount)}
                className="text-[11px] text-blue-700 hover:text-blue-800 mt-1 underline cursor-pointer"
              >
                Set to full outstanding balance ({formatCurrency(receipt.balanceAmount)})
              </button>
            )}
          </div>

          {/* Mode & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
              >
                <option value="GPay / UPI">GPay / UPI</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer / NEFT</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Debit/Credit Card</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Reference / UTR */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              UPI Reference / Cheque No / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. UPI Ref 382910481239 or Hand Cash"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Remark
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Installment 2 before road test"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Record {formatCurrency(amount)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
