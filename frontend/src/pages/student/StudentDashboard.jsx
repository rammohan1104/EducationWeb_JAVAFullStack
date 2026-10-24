import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Calendar,
  CreditCard,
  Bell,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Video,
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enrollRes, payRes] = await Promise.all([
          api.get('/student/enrollments'),
          api.get('/student/payments'),
        ]);

        if (enrollRes.success && enrollRes.data) {
          setEnrollments(enrollRes.data);
          if (enrollRes.data.length > 0) {
            const firstCourseId = enrollRes.data[0].course?.id;
            if (firstCourseId) {
              const annRes = await api.get(`/learning/courses/${firstCourseId}/announcements`);
              if (annRes.success && annRes.data) {
                setAnnouncements(annRes.data);
              }
            }
          }
        }

        if (payRes.success && payRes.data) {
          setPayments(payRes.data);
        }
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const activeEnrollments = enrollments.filter((e) => e.status === 'ENROLLED' || e.status === 'ACTIVE');
  const pendingPayments = payments.filter((p) => p.status === 'PENDING');

  return (
    <div className="space-y-8 text-black">
      {/* Welcome Banner */}
      <div className="relative p-8 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-[#ff693b] to-amber-500 text-white shadow-md shadow-orange-500/20">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-100 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-orange-200" />
              <span>Student Learning Headquarters</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">
              Hello, {user?.fullName || 'Student'}! 👋
            </h1>
            <p className="text-orange-100 text-sm max-w-xl font-semibold">
              Welcome to your dedicated dashboard. Track your course progress, attend batch video lectures, and submit assignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="px-5 py-3 rounded-2xl font-black text-sm text-[#ff693b] bg-white hover:bg-orange-50 shadow-sm transition"
            >
              Browse More Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ff693b] flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-black font-black uppercase tracking-wider">Enrolled Courses</p>
            <h3 className="text-2xl font-black text-black mt-0.5 font-heading">{activeEnrollments.length}</h3>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-black font-black uppercase tracking-wider">Active Batches</p>
            <h3 className="text-2xl font-black text-black mt-0.5 font-heading">
              {enrollments.filter((e) => e.batch).length}
            </h3>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ff693b] flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-black font-black uppercase tracking-wider">Pending Approvals</p>
            <h3 className="text-2xl font-black text-black mt-0.5 font-heading">{pendingPayments.length}</h3>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-black font-black uppercase tracking-wider">Profile Status</p>
            <h3 className="text-sm font-black text-emerald-900 mt-0.5">Verified Student</h3>
          </div>
        </div>
      </div>

      {/* Pending Payment Alert if any */}
      {pendingPayments.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />
            <div>
              <h4 className="text-sm font-black text-amber-950 font-heading">
                You have {pendingPayments.length} payment(s) awaiting Admin UTR verification
              </h4>
              <p className="text-xs text-black font-bold mt-0.5">
                Your course classroom access will activate automatically as soon as the admin verifies your 12-digit UTR.
              </p>
            </div>
          </div>
          <Link
            to="/student/payments"
            className="px-4 py-2 rounded-xl bg-[#ff693b] hover:bg-[#ea580c] text-white font-black text-xs shrink-0 transition"
          >
            View Receipts
          </Link>
        </div>
      )}

      {/* Main Grid: My Active Courses + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-black flex items-center gap-2 font-heading">
              <BookOpen className="w-5 h-5 text-[#ff693b]" />
              <span>My Enrolled Courses & Batches</span>
            </h2>
            <Link
              to="/student/courses"
              className="text-xs font-black text-[#ff693b] hover:text-[#ea580c] flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="h-48 rounded-3xl bg-orange-50 animate-pulse border border-orange-100" />
          ) : enrollments.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border-2 border-orange-200 text-center">
              <BookOpen className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <h3 className="text-base font-black text-black font-heading">You have not enrolled in any courses yet</h3>
              <p className="text-xs text-black font-semibold mt-1 mb-4">
                Explore our Intermediate (+1, +2) curriculum and enroll to gain full classroom & batch access.
              </p>
              <Link
                to="/courses"
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-sm uppercase tracking-wider"
              >
                Browse Course Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enr) => (
                <div
                  key={enr.id}
                  className="p-5 rounded-3xl bg-white border-2 border-orange-200 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        enr.course?.thumbnailUrl ||
                        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={enr.course?.title}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={enr.status} size="sm" />
                        {enr.batch && (
                          <span className="text-xs font-black text-orange-950 bg-orange-100 border border-orange-300 px-2 py-0.5 rounded-lg">
                            Batch: {enr.batch.batchName} ({enr.batch.scheduleTime || 'Regular'})
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-black text-black leading-tight font-heading">
                        {enr.course?.title}
                      </h4>
                      <p className="text-xs text-black font-semibold mt-1">
                        Enrolled on {new Date(enr.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/student/classroom/${enr.course?.id}`}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-sm flex items-center justify-center gap-2 shrink-0"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Enter Classroom Hub</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Announcements & Live Updates */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-black flex items-center gap-2 font-heading">
            <Bell className="w-5 h-5 text-amber-600" />
            <span>Faculty Notices</span>
          </h2>

          <div className="p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-sm space-y-4">
            {announcements.length === 0 ? (
              <p className="text-xs text-black font-bold">
                No recent announcements. Check your course classrooms for new updates.
              </p>
            ) : (
              announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black">{ann.title}</span>
                    <span className="text-[10px] text-black font-bold">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-black font-medium leading-relaxed">{ann.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
