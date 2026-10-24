import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [statsRes, payRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/payments?status=PENDING'),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (payRes.success && payRes.data) {
          setPendingPayments(payRes.data);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const handleQuickApprove = async (paymentId) => {
    try {
      const res = await api.put(`/admin/payments/${paymentId}/verify`, {
        approved: true,
      });
      if (res.success) {
        setPendingPayments((prev) => prev.filter((p) => p.id !== paymentId));
        // Refresh stats
        const statsRes = await api.get('/admin/dashboard/stats');
        if (statsRes.success) setStats(statsRes.data);
      }
    } catch (err) {
      alert('Verification error: ' + err.message);
    }
  };

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 62000 },
    { month: 'Mar', revenue: 98000 },
    { month: 'Apr', revenue: 142000 },
    { month: 'May', revenue: 185000 },
    { month: 'Jun', revenue: stats ? Number(stats.totalRevenue || 220000) : 220000 },
  ];

  const pieData = [
    { name: 'Mathematics', value: 35, color: '#ff693b' },
    { name: 'Physics', value: 25, color: '#f59e0b' },
    { name: 'Chemistry', value: 25, color: '#ea580c' },
    { name: 'Biology', value: 15, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 text-black">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-black text-xs font-black uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#ff693b]" />
            <span>Master Control & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black font-heading">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-black font-semibold mt-1">
            Monitor admissions, track revenue collections, verify student payments, and manage curriculum health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/payments"
            className="px-4 py-2.5 rounded-2xl font-black text-xs text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            <span>Review {pendingPayments.length} Payments</span>
          </Link>
          <Link
            to="/admin/courses"
            className="px-4 py-2.5 rounded-2xl font-black text-xs text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-sm transition"
          >
            + New Course
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="p-5 rounded-3xl bg-white border-2 border-orange-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-black uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-black font-heading">
            ₹{stats ? Number(stats.totalRevenue || 0).toLocaleString('en-IN') : '0'}
          </h3>
          <p className="text-[11px] text-black font-bold">Verified UPI Collections</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border-2 border-orange-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-black">
            <span className="text-xs font-black uppercase tracking-wider">Total Students</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#ff693b]" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-black font-heading">{stats?.totalStudents || 0}</h3>
          <p className="text-[11px] text-black font-bold">Registered Profiles</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border-2 border-orange-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-sky-800">
            <span className="text-xs font-black uppercase tracking-wider">Active Courses</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-sky-700" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-black font-heading">{stats?.activeCourses || 0}</h3>
          <p className="text-[11px] text-black font-bold">Published Curriculums</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border-2 border-orange-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-black uppercase tracking-wider">Active Batches</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-black font-heading">{stats?.activeBatches || 0}</h3>
          <p className="text-[11px] text-black font-bold">Scheduled Cohorts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border-2 border-orange-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-black">
            <span className="text-xs font-black uppercase tracking-wider">Pending UTRs</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-[#ff693b]" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-black font-heading">{stats?.pendingPayments || 0}</h3>
          <p className="text-[11px] text-black font-bold">Requires Verification</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border-2 border-orange-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-black font-heading">Revenue Growth & Admissions</h3>
              <p className="text-xs text-black font-semibold">Monthly gross fee collection in INR (₹)</p>
            </div>
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
              +38% vs last month
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff693b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ff693b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#000000" fontSize={12} tickLine={false} />
                <YAxis stroke="#000000" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#000000',
                    borderRadius: '16px',
                    color: '#000000',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff693b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment Distribution */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-orange-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-black font-heading">Admissions by Domain</h3>
            <p className="text-xs text-black font-semibold">Student enrollment share across categories</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#000000',
                    borderRadius: '12px',
                    color: '#000000',
                    fontWeight: 'bold',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-black font-bold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Approval Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-orange-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-black flex items-center gap-2 font-heading">
              <CreditCard className="w-5 h-5 text-[#ff693b]" />
              <span>Pending UPI Payment Verifications</span>
            </h3>
            <p className="text-xs text-black font-semibold">Verify 12-digit UTR numbers to unlock student enrollments</p>
          </div>
          <Link
            to="/admin/payments"
            className="text-xs font-black text-[#ff693b] hover:text-[#ea580c] flex items-center gap-1"
          >
            <span>Open All Payments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingPayments.length === 0 ? (
          <div className="p-8 rounded-2xl bg-orange-50 border-2 border-orange-200 text-center text-xs text-black font-bold">
            ✅ All UPI payments verified. No pending items in queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-orange-100 text-black uppercase font-black tracking-wider border-b-2 border-orange-200">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Course / Batch</th>
                  <th className="px-4 py-3">UTR Reference</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 text-black font-medium">
                {pendingPayments.slice(0, 5).map((pay) => (
                  <tr key={pay.id} className="hover:bg-orange-50/60">
                    <td className="px-4 py-3 font-black text-black font-heading">
                      {pay.student?.fullName || pay.student?.email}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-black">{pay.course?.title}</div>
                      {pay.batch && (
                        <span className="text-[10px] text-orange-900 font-bold">{pay.batch.batchName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-black text-black">
                      {pay.utrNumber}
                    </td>
                    <td className="px-4 py-3 font-black text-black font-heading">
                      ₹{Number(pay.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-black font-semibold">
                      {new Date(pay.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleQuickApprove(pay.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-sm transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Enroll</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
