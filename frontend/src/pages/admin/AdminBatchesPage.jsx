import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, CheckCircle2, XCircle, Users, Clock } from 'lucide-react';
import api from '../../api/client';

export const AdminBatchesPage = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    batchName: '',
    batchCode: '',
    scheduleTime: 'Mon - Fri (7:00 PM - 9:00 PM IST)',
    startDate: '',
    endDate: '',
    maxCapacity: 50,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [batchesRes, coursesRes] = await Promise.all([
        api.get('/admin/batches'),
        api.get('/admin/courses'),
      ]);

      if (batchesRes.success && batchesRes.data) setBatches(batchesRes.data);
      if (coursesRes.success && coursesRes.data) {
        setCourses(coursesRes.data);
        if (coursesRes.data.length > 0 && !formData.courseId) {
          setFormData((prev) => ({ ...prev, courseId: coursesRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching batches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingBatch(null);
    setFormData({
      courseId: courses[0]?.id || '',
      batchName: 'Alpha Evening Cohort',
      batchCode: `BATCH-${Math.floor(100 + Math.random() * 900)}`,
      scheduleTime: 'Mon - Fri (7:00 PM - 9:00 PM IST)',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      maxCapacity: 50,
      isActive: true,
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (batch) => {
    setEditingBatch(batch);
    setFormData({
      courseId: batch.course?.id || '',
      batchName: batch.batchName,
      batchCode: batch.batchCode,
      scheduleTime: batch.scheduleTime || '',
      startDate: batch.startDate || '',
      endDate: batch.endDate || '',
      maxCapacity: batch.maxCapacity || 50,
      isActive: Boolean(batch.isActive),
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      if (editingBatch) {
        await api.put(`/admin/batches/${editingBatch.id}`, formData);
      } else {
        await api.post('/admin/batches', formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save batch');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (batchId) => {
    if (!window.confirm('Are you sure you want to delete this batch cohort?')) return;
    try {
      await api.delete(`/admin/batches/${batchId}`);
      setBatches((prev) => prev.filter((b) => b.id !== batchId));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Batch Allocation & Schedules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Organize student cohorts, set timing windows, and manage classroom capacities
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Batch</span>
        </button>
      </div>

      {/* Batches Table */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
      ) : (
        <div className="rounded-3xl border border-slate-200/80 overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Batch Code & Name</th>
                  <th className="px-6 py-4">Associated Course</th>
                  <th className="px-6 py-4">Schedule Timing</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-indigo-700 text-[11px] block">
                        {b.batchCode}
                      </span>
                      <span className="font-bold text-slate-900 text-sm font-heading">{b.batchName}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {b.course?.title || 'General Course'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        {b.scheduleTime || 'Flexible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {b.startDate || 'Immediate'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-bold text-slate-900">
                        <Users className="w-3.5 h-3.5 text-indigo-600" /> {b.maxCapacity || 50} Seats
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {b.isActive ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          title="Edit Batch"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                          title="Delete Batch"
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

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  {editingBatch ? 'Edit Batch Cohort' : 'Create Batch Cohort'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Configure schedule timing and link course</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Course</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Batch Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Batch Alpha 2026"
                    value={formData.batchName}
                    onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Batch Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JAVAFULL-B1"
                    value={formData.batchCode}
                    onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Schedule Timing</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mon - Fri (7:00 PM - 9:00 PM IST)"
                  value={formData.scheduleTime}
                  onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Student Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="batchActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-100 border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="batchActiveCheck" className="text-xs text-slate-700 font-bold cursor-pointer">
                  Batch is Active & Accepting Enrollments
                </label>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  {saving ? 'Saving...' : editingBatch ? 'Update Batch' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBatchesPage;
