import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, AlertCircle, CheckCircle2, Clock, QrCode, ExternalLink } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';

export const StudentPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/student/payments');
        if (res.success && res.data) {
          setPayments(res.data);
        }
      } catch (err) {
        console.error('Error fetching student payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-8 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black font-heading">
            UPI Payment Receipts & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-black font-semibold mt-1">
            Monitor the status of your 12-digit UTR submissions and course fee approvals
          </p>
        </div>
        <Link
          to="/courses"
          className="px-5 py-2.5 rounded-2xl font-black text-xs text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/20 transition self-start sm:self-auto"
        >
          + Enroll In Another Course
        </Link>
      </div>

      {/* Info Notice */}
      <div className="p-5 rounded-3xl bg-orange-50 border-2 border-orange-200 flex items-start gap-4">
        <CreditCard className="w-5 h-5 text-[#ff693b] shrink-0 mt-0.5" />
        <div className="text-xs text-black space-y-1">
          <p className="font-black text-black font-heading">How Manual UPI Verification Works:</p>
          <p className="font-semibold leading-relaxed">
            When you pay via UPI QR code or VPA (<code className="font-black text-black bg-white px-1.5 py-0.5 rounded border border-orange-300">9392199829@axl</code>) and submit your 12-digit UTR reference, our finance administrator verifies the receipt. Once verified, your course status turns <span className="text-emerald-800 font-black">APPROVED</span> and full batch classroom access is unlocked immediately.
          </p>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-orange-50 animate-pulse border border-orange-100" />
      ) : payments.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border-2 border-orange-200 text-center max-w-lg mx-auto shadow-sm">
          <CreditCard className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <h3 className="text-lg font-black text-black font-heading">No payment records found</h3>
          <p className="text-xs text-black font-semibold mt-1 mb-4">
            Select a course from the catalog to submit your first UPI payment verification.
          </p>
          <Link
            to="/courses"
            className="px-5 py-2.5 rounded-2xl text-xs font-black text-white bg-[#ff693b] hover:bg-[#ea580c]"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-orange-200 overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-orange-100 border-b-2 border-orange-200 text-black font-black uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Receipt ID</th>
                  <th className="px-6 py-4">Course & Batch</th>
                  <th className="px-6 py-4">UTR Reference</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Verification Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 text-black font-medium">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-orange-50/60 transition">
                    <td className="px-6 py-4 font-mono font-black text-black">
                      #{pay.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-black font-heading">{pay.course?.title}</div>
                      {pay.batch && (
                        <div className="text-[11px] text-orange-900 font-black">
                          {pay.batch.batchName} ({pay.batch.batchCode})
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-black">
                      {pay.utrNumber}
                    </td>
                    <td className="px-6 py-4 font-black text-black font-heading text-sm">
                      ₹{Number(pay.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-black font-semibold">
                      {new Date(pay.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={pay.status} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      {pay.status === 'APPROVED' ? (
                        <span className="text-emerald-800 font-black">
                          Verified by Admin on {pay.verifiedAt ? new Date(pay.verifiedAt).toLocaleDateString() : 'Active'}
                        </span>
                      ) : pay.status === 'REJECTED' ? (
                        <span className="text-rose-800 font-black">
                          {pay.rejectionReason || 'UTR mismatch. Please contact support.'}
                        </span>
                      ) : (
                        <span className="text-black font-bold">
                          Pending Admin Verification
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPaymentsPage;
