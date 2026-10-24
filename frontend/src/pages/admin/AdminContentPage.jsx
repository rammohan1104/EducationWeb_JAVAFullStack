import React, { useState, useEffect } from 'react';
import {
  Video,
  FileText,
  CheckSquare,
  Bell,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  Clock,
  Eye,
  Award,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';

export const AdminContentPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [activeTab, setActiveTab] = useState('videos'); // videos | notes | assignments | announcements
  const [loading, setLoading] = useState(true);

  // Content lists for selected course
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Modals
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [annModalOpen, setAnnModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  // Video Form
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '45 mins',
    orderIndex: 1,
  });

  // Note Form
  const [noteForm, setNoteForm] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileType: 'PDF',
  });

  // Assignment Form
  const [assignForm, setAssignForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: 100,
  });

  // Announcement Form
  const [annForm, setAnnForm] = useState({
    title: '',
    content: '',
  });

  // Grade Form
  const [gradeMarks, setGradeMarks] = useState(100);
  const [gradeFeedback, setGradeFeedback] = useState('Excellent solution!');

  useEffect(() => {
    fetchInitialCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseContent(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchInitialCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      if (res.success && res.data && res.data.length > 0) {
        setCourses(res.data);
        setSelectedCourseId(res.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching courses for LMS:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseContent = async (cId) => {
    try {
      const [vRes, nRes, aRes, annRes, subRes] = await Promise.all([
        api.get(`/learning/courses/${cId}/videos`),
        api.get(`/learning/courses/${cId}/notes`),
        api.get(`/learning/courses/${cId}/assignments`),
        api.get(`/learning/courses/${cId}/announcements`),
        api.get('/learning/student/submissions'), // Fetches submissions
      ]);

      if (vRes.success) setVideos(vRes.data || []);
      if (nRes.success) setNotes(nRes.data || []);
      if (aRes.success) setAssignments(aRes.data || []);
      if (annRes.success) setAnnouncements(annRes.data || []);
      if (subRes.success) setSubmissions(subRes.data || []);
    } catch (err) {
      console.error('Error loading course learning content:', err);
    }
  };

  // Add Video
  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/learning/courses/${selectedCourseId}/videos`, videoForm);
      if (res.success) {
        setVideos((prev) => [...prev, res.data]);
        setVideoModalOpen(false);
        setVideoForm({ title: '', description: '', videoUrl: '', duration: '45 mins', orderIndex: videos.length + 2 });
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Add Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/learning/courses/${selectedCourseId}/notes`, noteForm);
      if (res.success) {
        setNotes((prev) => [...prev, res.data]);
        setNoteModalOpen(false);
        setNoteForm({ title: '', description: '', fileUrl: '', fileType: 'PDF' });
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Add Assignment
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/learning/courses/${selectedCourseId}/assignments`, assignForm);
      if (res.success) {
        setAssignments((prev) => [...prev, res.data]);
        setAssignModalOpen(false);
        setAssignForm({ title: '', description: '', dueDate: '', maxMarks: 100 });
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Add Announcement
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/learning/courses/${selectedCourseId}/announcements`, annForm);
      if (res.success) {
        setAnnouncements((prev) => [res.data, ...prev]);
        setAnnModalOpen(false);
        setAnnForm({ title: '', content: '' });
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Grade Submission
  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      const res = await api.put(`/learning/submissions/${selectedSub.id}/grade`, {
        obtainedMarks: gradeMarks,
        feedback: gradeFeedback,
      });
      if (res.success) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === selectedSub.id ? res.data : s))
        );
        setGradeModalOpen(false);
        setSelectedSub(null);
      }
    } catch (err) {
      alert('Grading error: ' + err.message);
    }
  };

  const handleFileUpload = async (e, setUrlField) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subfolder', 'notes');

      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success && res.data?.fileUrl) {
        setUrlField(res.data.fileUrl);
      }
    } catch (err) {
      console.error('File upload failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">LMS Curriculum & Content</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Upload recorded video lectures, study PDFs, create assignments, and broadcast notices
          </p>
        </div>

        {/* Course Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Course:</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'videos', label: 'Video Lectures', icon: Video, count: videos.length },
          { id: 'notes', label: 'Study Notes & PDFs', icon: FileText, count: notes.length },
          { id: 'assignments', label: 'Assignments & Grading', icon: CheckSquare, count: assignments.length },
          { id: 'announcements', label: 'Broadcast Notices', icon: Bell, count: announcements.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VIDEOS */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 font-heading">Course Video Playlist</h3>
            <button
              onClick={() => setVideoModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video Lecture</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((vid) => (
              <div key={vid.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[11px] text-sky-700 font-bold uppercase mb-1">
                    <span>Lecture #{vid.orderIndex}</span>
                    <span className="text-slate-500">{vid.duration}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-heading">{vid.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{vid.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <a
                    href={vid.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-700 hover:text-indigo-800 flex items-center gap-1 font-bold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Watch Video
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 font-heading">Study Resources & Documentation</h3>
            <button
              onClick={() => setNoteModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Study Note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note) => (
              <div key={note.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-purple-700 font-bold uppercase block mb-1">
                    {note.fileType || 'PDF Resource'}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 font-heading">{note.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{note.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-700 hover:text-indigo-800 flex items-center gap-1 font-bold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Download File
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS & GRADING */}
      {activeTab === 'assignments' && (
        <div className="space-y-8">
          {/* Assignments list */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 font-heading">Active Assignments</h3>
              <button
                onClick={() => setAssignModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Assignment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {assignments.map((asgn) => (
                <div key={asgn.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-sky-700">Max Marks: {asgn.maxMarks}</span>
                    <span className="text-slate-500 font-medium">Due: {asgn.dueDate || 'Flexible'}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-heading">{asgn.title}</h4>
                  <p className="text-xs text-slate-500">{asgn.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Student Submissions Table */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Student Submissions & Evaluation Queue</span>
            </h3>

            {submissions.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-500 shadow-xs">
                No student submissions received yet.
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200/80 overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4">Student</th>
                      <th className="px-5 py-4">Assignment</th>
                      <th className="px-5 py-4">Submission Details</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Marks</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-4 font-bold text-slate-900 font-heading">
                          {sub.student?.fullName || sub.student?.email}
                        </td>
                        <td className="px-5 py-4 text-indigo-700 font-bold">
                          {sub.assignment?.title}
                        </td>
                        <td className="px-5 py-4 max-w-xs truncate font-mono text-[11px] text-slate-600">
                          {sub.submissionText}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={sub.status} size="sm" />
                        </td>
                        <td className="px-5 py-4 font-extrabold text-slate-900 font-heading">
                          {sub.obtainedMarks !== null ? `${sub.obtainedMarks} pts` : '-'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setGradeMarks(sub.obtainedMarks || 90);
                              setGradeFeedback(sub.feedback || 'Great implementation!');
                              setGradeModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs cursor-pointer"
                          >
                            Evaluate
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
      )}

      {/* TAB 4: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 font-heading">Course Announcements</h3>
            <button
              onClick={() => setAnnModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-bold text-amber-700 font-heading">{ann.title}</h4>
                  <span className="text-xs text-slate-500 font-medium">{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-heading">Add Video Lecture</h3>
            <form onSubmit={handleAddVideo} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 01. Introduction to Spring Boot Architecture"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Video Embed / URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Duration</label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Order Index</label>
                  <input
                    type="number"
                    value={videoForm.orderIndex}
                    onChange={(e) => setVideoForm({ ...videoForm, orderIndex: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setVideoModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer">Save Video</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTE MODAL */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-heading">Upload Study Note / PDF</h3>
            <form onSubmit={handleAddNote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Spring Boot & JPA Cheatsheet"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Upload PDF / Material File</label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, (url) => setNoteForm({ ...noteForm, fileUrl: url }))}
                  className="w-full text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-bold cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Or Direct File URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={noteForm.fileUrl}
                  onChange={(e) => setNoteForm({ ...noteForm, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={noteForm.description}
                  onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setNoteModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGNMENT MODAL */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-heading">Create New Assignment</h3>
            <form onSubmit={handleAddAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build a RESTful Order API in Spring Boot"
                  value={assignForm.title}
                  onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={assignForm.dueDate}
                    onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={assignForm.maxMarks}
                    onChange={(e) => setAssignForm({ ...assignForm, maxMarks: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Problem Statement & Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={assignForm.description}
                  onChange={(e) => setAssignForm({ ...assignForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setAssignModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer">Create Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {annModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-heading">Post Course Announcement</h3>
            <form onSubmit={handleAddAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Live Q&A and Doubt Clearance Session this Friday"
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Announcement Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Details regarding the schedule, links, or instructions..."
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setAnnModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer">Broadcast Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVALUATION / GRADING MODAL */}
      {gradeModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">Evaluate Student Submission</h3>
            <p className="text-xs text-indigo-700 font-semibold mb-4">{selectedSub.student?.fullName} • {selectedSub.assignment?.title}</p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-4">
              <span className="text-slate-600 block mb-1 font-bold">Student Submitted Code / Link:</span>
              <pre className="text-slate-800 font-mono whitespace-pre-wrap">{selectedSub.submissionText}</pre>
              {selectedSub.attachmentUrl && (
                <a href={selectedSub.attachmentUrl} target="_blank" rel="noreferrer" className="text-sky-700 font-bold flex items-center gap-1 mt-2">
                  <ExternalLink className="w-3.5 h-3.5" /> View Attached File
                </a>
              )}
            </div>

            <form onSubmit={handleGradeSubmission} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Marks Awarded (out of {selectedSub.assignment?.maxMarks || 100})
                </label>
                <input
                  type="number"
                  required
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Feedback / Notes</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setGradeModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer">Submit Evaluation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContentPage;
