import React, { useState } from 'react';
import { Receipt } from '../types';
import { Search, X, FileText, Phone, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

interface BillLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReceipt: (receipt: Receipt) => void;
}

export const BillLookupModal: React.FC<BillLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectReceipt,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Receipt[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/receipts?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.receipts || []);
      } else {
        setError('Could not retrieve billing records. Please check the number or contact office.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-base">Find My Digital Bill & PDF</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Enrolled student at Thanima Iykarayil MDS? Enter your registered mobile number or receipt number to access your official digital bill.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Mobile No. (e.g. 9562879877) or Bill #"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50 cursor-pointer flex-shrink-0"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {results !== null && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                <span>Matching Records ({results.length})</span>
                {results.length > 0 && <span>Click to view & download</span>}
              </div>

              {results.length === 0 ? (
                <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  No billing record found for "{query}". Please verify the number or contact our office at 9562879877.
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {results.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        onSelectReceipt(r);
                        onClose();
                      }}
                      className="p-3.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-400 rounded-xl transition cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                            #{r.receiptNumber}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">{r.studentName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {r.courseName} • Issued {formatDate(r.date)}
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-2">
                        <div>
                          <div className="text-xs font-bold text-emerald-700">{formatCurrency(r.amountPaid)} Paid</div>
                          {r.balanceAmount > 0 ? (
                            <div className="text-[10px] font-semibold text-amber-700">Due: {formatCurrency(r.balanceAmount)}</div>
                          ) : (
                            <div className="text-[10px] font-semibold text-emerald-700">Fully Settled</div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
