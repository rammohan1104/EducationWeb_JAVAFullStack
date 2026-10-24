import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Verification modal state
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [selectedStatus]);

  const fetchPayments = async () => {
    try {
      const url =
        selectedStatus === 'ALL'
          ? '/admin/payments'
          : `/admin/payments?status=${selectedStatus}`;
      const res = await api.get(url);
      if (res.success && res.data) {
        setPayments(res.data);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (approved) => {
    if (!selectedPayment) return;
    if (!approved && !rejectionReason.trim()) {
      alert('Please enter a reason for rejecting the payment receipt');
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        approved,
        rejectionReason: approved ? null : rejectionReason.trim(),
      };
      const res = await api.put(`/admin/payments/${selectedPayment.id}/verify`, payload);
      if (res.success) {
        setSelectedPayment(null);
        setIsRejecting(false);
        setRejectionReason('');
        fetchPayments();
      }
    } catch (err) {
      alert('Verification error: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const statuses = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black font-heading">
            Manual UPI Payment Approvals
          </h1>
          <p className="text-xs sm:text-sm text-black font-semibold mt-1">
            Audit 12-digit UTR references, inspect payment screenshots, and automatically unlock course enrollments
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer border-2 ${
                selectedStatus === st
                  ? 'bg-[#ff693b] text-white border-[#ff693b] shadow-sm'
                  : 'bg-white text-black border-orange-200 hover:bg-orange-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-orange-50 animate-pulse border border-orange-100" />
      ) : payments.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border-2 border-orange-200 text-center shadow-sm">
          <CreditCard className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <p className="text-black font-bold text-sm">No payment records found for {selectedStatus} filter.</p>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-orange-200 overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-orange-100 text-black uppercase font-black tracking-wider border-b-2 border-orange-200">
                <tr>
                  <th className="px-6 py-4">Receipt ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course & Batch</th>
                  <th className="px-6 py-4">12-Digit UTR</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 text-black font-medium">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-orange-50/60 transition">
                    <td className="px-6 py-4 font-mono font-black text-black">#{p.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-black text-black font-heading">
                        {p.student?.fullName || p.student?.email}
                      </div>
                      <div className="text-[11px] text-black font-semibold">{p.student?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-black">{p.course?.title}</div>
                      {p.batch && (
                        <div className="text-[11px] text-orange-900 font-bold">{p.batch.batchName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-black">
                      {p.utrNumber}
                    </td>
                    <td className="px-6 py-4 font-black text-black text-sm font-heading">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-black font-semibold">
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedPayment(p);
                          setIsRejecting(false);
                          setRejectionReason('');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 border border-orange-300 text-black font-black text-xs inline-flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#ff693b]" />
                        <span>Inspect & Verify</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED VERIFICATION MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-2 border-orange-300 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 text-black">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#ff693b]">
                  Payment Audit # {selectedPayment.id}
                </span>
                <h3 className="text-xl font-black text-black mt-0.5 font-heading">
                  Verify UPI Transaction
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-black hover:text-slate-700 font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-black font-bold">Student:</span>
                  <span className="text-black font-black">
                    {selectedPayment.student?.fullName} ({selectedPayment.student?.email})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-bold">Student Phone:</span>
                  <span className="text-black font-bold">{selectedPayment.student?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-bold">Target Course:</span>
                  <span className="text-[#ea580c] font-black">{selectedPayment.course?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-bold">Allocated Batch:</span>
                  <span className="text-black font-black">
                    {selectedPayment.batch ? selectedPayment.batch.batchName : 'Default Cohort'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                  <span className="text-black font-black">Amount Paid:</span>
                  <span className="text-base font-black text-emerald-800 font-heading">
                    ₹{Number(selectedPayment.amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black font-black">12-Digit UTR:</span>
                  <span className="font-mono text-sm font-black text-black bg-white px-2 py-0.5 rounded border border-orange-300">
                    {selectedPayment.utrNumber}
                  </span>
                </div>
              </div>

              {/* Screenshot preview if available */}
              {selectedPayment.screenshotUrl ? (
                <div>
                  <span className="text-black block mb-1 font-black">Payment Receipt Screenshot:</span>
                  <a
                    href={selectedPayment.screenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl overflow-hidden border-2 border-orange-200 max-h-48 relative group"
                  >
                    <img
                      src={selectedPayment.screenshotUrl}
                      alt="Receipt Screenshot"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-bold gap-1 text-xs">
                      <ExternalLink className="w-4 h-4" /> View Full Image
                    </div>
                  </a>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-black text-xs font-bold text-center">
                  No screenshot uploaded by student (Verified via UTR Reference).
                </div>
              )}

              {/* Rejection Note Form if Active */}
              {isRejecting && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-black text-rose-700">
                    Reason for Rejecting Payment <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. UTR number is invalid or amount mismatch..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white border-2 border-rose-300 text-black placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                {selectedPayment.status === 'PENDING' ? (
                  <>
                    {!isRejecting ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsRejecting(true)}
                          disabled={processing}
                          className="px-4 py-2.5 rounded-2xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-black text-xs cursor-pointer"
                        >
                          Reject Payment
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerify(true)}
                          disabled={processing}
                          className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Enroll Student</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsRejecting(false)}
                          className="px-4 py-2 rounded-2xl bg-slate-200 text-black font-black text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerify(false)}
                          disabled={processing}
                          className="px-5 py-2 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs"
                        >
                          Confirm Rejection
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-black font-black text-xs">
                    This payment is already <span className="uppercase">{selectedPayment.status}</span>.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
