import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  User,
  ShieldAlert,
} from 'lucide-react';
import api from '../../api/client';

export const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      if (res.success && res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (studentId, currentActive) => {
    try {
      const res = await api.patch(
        `/admin/students/${studentId}/status?isActive=${!currentActive}`
      );
      if (res.success) {
        setStudents((prev) =>
          prev.map((s) => (s.id === studentId ? { ...s, isActive: !currentActive } : s))
        );
      }
    } catch (err) {
      alert('Status change error: ' + err.message);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this student and their enrollments?'
      )
    )
      return;

    try {
      await api.delete(`/admin/students/${studentId}`);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      if (selectedStudent?.id === studentId) setSelectedStudent(null);
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  };

  const filteredStudents = students.filter((s) => {
    const term = searchQuery.toLowerCase();
    return (
      s.fullName?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.phone?.toLowerCase().includes(term) ||
      s.collegeName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Student Directory & Profiles</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Access full 16-field profiles, contact parents, and manage account statuses
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by student name, email, phone, or university..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
      ) : (
        <div className="rounded-3xl border border-slate-200/80 overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Phone / Contact</th>
                  <th className="px-6 py-4">College & Degree</th>
                  <th className="px-6 py-4">City / State</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            s.profilePhotoUrl ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                          }
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border border-indigo-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm font-heading">{s.fullName}</h4>
                          <p className="text-[11px] text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{s.phone}</div>
                      {s.parentPhone && (
                        <div className="text-[10px] text-slate-500">Parent: {s.parentPhone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{s.collegeName || 'Not specified'}</div>
                      <div className="text-[11px] text-indigo-700 font-semibold">
                        {s.qualification} ({s.passingYear || '2025'})
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {s.city ? `${s.city}, ${s.state}` : 'Not provided'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(s.id, s.isActive)}
                        className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full border transition cursor-pointer ${
                          s.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                        }`}
                        title="Click to toggle Active / Suspended"
                      >
                        {s.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Suspended
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>16-Fields</span>
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 16-FIELD PROFILE MODAL / DRAWER */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedStudent.profilePhotoUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                  }
                  alt="avatar"
                  className="w-14 h-14 rounded-2xl object-cover border border-indigo-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-indigo-700 font-medium">{selectedStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 16 fields grid */}
            <div className="space-y-6 text-xs">
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-indigo-700 uppercase tracking-wider font-heading">
                  Personal & Guardian
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">Gender:</span>
                    <span className="text-slate-900 font-semibold">{selectedStudent.gender || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date of Birth:</span>
                    <span className="text-slate-900 font-semibold">
                      {selectedStudent.dateOfBirth || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Student Phone:</span>
                    <span className="text-slate-900 font-semibold">{selectedStudent.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Alternate Phone:</span>
                    <span className="text-slate-900 font-semibold">
                      {selectedStudent.alternatePhone || 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Parent / Guardian:</span>
                    <span className="text-slate-900 font-semibold">
                      {selectedStudent.parentName || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Parent Contact:</span>
                    <span className="text-slate-900 font-semibold">
                      {selectedStudent.parentPhone || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-sky-700 uppercase tracking-wider font-heading">
                  Academic Credentials
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">Highest Qualification:</span>
                    <span className="text-slate-900 font-semibold">
                      {selectedStudent.qualification || 'N/A'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">College / University:</span>
                    <span className="text-slate-900 font-semibold">
                      {selectedStudent.collegeName || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Graduation Year:</span>
                    <span className="text-slate-900 font-semibold">
                      {selectedStudent.passingYear || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-purple-700 uppercase tracking-wider font-heading">
                  Permanent Address
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="col-span-full">
                    <span className="text-slate-500 block">Street Address:</span>
                    <span className="text-slate-900 font-semibold">{selectedStudent.address || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">City:</span>
                    <span className="text-slate-900 font-semibold">{selectedStudent.city || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">State:</span>
                    <span className="text-slate-900 font-semibold">{selectedStudent.state || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pincode:</span>
                    <span className="text-slate-900 font-semibold">{selectedStudent.pincode || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentsPage;
