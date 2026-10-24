import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, Clock, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';

export const StudentCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/student/enrollments');
        if (res.success && res.data) {
          setEnrollments(res.data);
        }
      } catch (err) {
        console.error('Error loading enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <div className="space-y-8 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black font-heading">My Enrolled Courses</h1>
          <p className="text-xs sm:text-sm text-black font-semibold mt-1">
            Access your active courses, video lectures, notes, assignments, and cohort chats
          </p>
        </div>
        <Link
          to="/courses"
          className="px-5 py-2.5 rounded-2xl font-black text-xs text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/20 transition self-start sm:self-auto"
        >
          + Enroll in New Course
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-3xl bg-orange-50 animate-pulse border border-orange-100" />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border-2 border-orange-200 text-center max-w-xl mx-auto shadow-sm">
          <BookOpen className="w-14 h-14 text-orange-400 mx-auto mb-4" />
          <h3 className="text-xl font-black text-black font-heading">No active enrollments found</h3>
          <p className="text-sm text-black font-semibold mt-2 mb-6 leading-relaxed">
            You haven't enrolled in any courses yet. Once you choose a course and submit your UPI payment, your enrolled courses will appear here.
          </p>
          <Link
            to="/courses"
            className="px-6 py-3 rounded-2xl font-black text-sm text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/25 transition"
          >
            Browse All Courses & Batches
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enr) => {
            const course = enr.course;
            return (
              <div
                key={enr.id}
                className="bg-white rounded-3xl border-2 border-orange-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={
                        course?.thumbnailUrl ||
                        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={course?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={enr.status} size="sm" />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-black text-black line-clamp-1 mb-2 font-heading">
                      {course?.title}
                    </h3>

                    {enr.batch ? (
                      <div className="p-3 rounded-2xl bg-orange-50 border-2 border-orange-200 text-xs text-black space-y-1 mb-4">
                        <span className="text-[10px] uppercase font-black text-orange-900">Allocated Batch:</span>
                        <p className="font-black text-black font-heading">
                          {enr.batch.batchName} ({enr.batch.batchCode})
                        </p>
                        <p className="text-[11px] text-black font-semibold flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-black" />
                          <span>{enr.batch.scheduleTime || 'Regular Timings'}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-black font-bold mb-4">
                        Cohort batch assignment in progress
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-orange-100 mt-2 flex items-center justify-between">
                  <span className="text-xs font-black text-black">
                    {enr.status === 'ENROLLED' ? 'Active Classroom' : 'Admission Pending'}
                  </span>

                  {enr.status === 'ENROLLED' ? (
                    <Link
                      to={`/student/classroom/${course?.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-sm flex items-center gap-1 transition"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Enter Class</span>
                    </Link>
                  ) : (
                    <Link
                      to="/student/payments"
                      className="text-xs font-black text-[#ff693b] hover:underline"
                    >
                      View Payment Status →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentCoursesPage;
