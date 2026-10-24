import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Video,
  FileText,
  CheckSquare,
  MessageSquare,
  Bell,
  Play,
  Download,
  Send,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Award,
  Upload,
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/client';

export const CourseClassroomPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('videos'); // videos | notes | assignments | chat | announcements
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active Video Player state
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Chat message input
  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Assignment submission modal
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFileUrl, setSubmissionFileUrl] = useState('');
  const [uploadingSubFile, setUploadingSubFile] = useState(false);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [subFeedback, setSubFeedback] = useState('');

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const [courseRes, videosRes, notesRes, assignRes, subRes, annRes, enrollRes] =
          await Promise.all([
            api.get(`/courses/public/${courseId}`),
            api.get(`/learning/courses/${courseId}/videos`),
            api.get(`/learning/courses/${courseId}/notes`),
            api.get(`/learning/courses/${courseId}/assignments`),
            api.get('/learning/student/submissions'),
            api.get(`/learning/courses/${courseId}/announcements`),
            api.get('/student/enrollments'),
          ]);

        if (courseRes.success && courseRes.data) setCourse(courseRes.data);
        if (videosRes.success && videosRes.data) {
          setVideos(videosRes.data);
          if (videosRes.data.length > 0) setSelectedVideo(videosRes.data[0]);
        }
        if (notesRes.success && notesRes.data) setNotes(notesRes.data);
        if (assignRes.success && assignRes.data) setAssignments(assignRes.data);
        if (subRes.success && subRes.data) setSubmissions(subRes.data);
        if (annRes.success && annRes.data) setAnnouncements(annRes.data);

        // Find assigned batch for chat
        if (enrollRes.success && enrollRes.data) {
          const currentEnroll = enrollRes.data.find(
            (e) => String(e.course?.id) === String(courseId)
          );
          if (currentEnroll?.batch?.id) {
            setBatchId(currentEnroll.batch.id);
            fetchBatchMessages(currentEnroll.batch.id);
          }
        }
      } catch (err) {
        console.error('Error loading classroom data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClassroomData();
  }, [courseId]);

  const fetchBatchMessages = async (bId) => {
    try {
      const res = await api.get(`/learning/batches/${bId}/messages`);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Error loading batch chat:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !batchId) return;

    setSendingMsg(true);
    try {
      const res = await api.post(`/learning/batches/${batchId}/messages`, {
        message: chatInput.trim(),
      });
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setChatInput('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setSubmittingAssignment(true);
    setSubFeedback('');
    try {
      const payload = {
        assignmentId: selectedAssignment.id,
        submissionText: submissionText.trim(),
        attachmentUrl: submissionFileUrl || null,
      };
      const res = await api.post('/learning/assignments/submit', payload);
      if (res.success) {
        setSubFeedback('Assignment submitted successfully for instructor review!');
        // Refresh submissions
        const subRes = await api.get('/learning/student/submissions');
        if (subRes.success && subRes.data) setSubmissions(subRes.data);
        setTimeout(() => {
          setSelectedAssignment(null);
          setSubmissionText('');
          setSubmissionFileUrl('');
          setSubFeedback('');
        }, 1800);
      }
    } catch (err) {
      setSubFeedback('Submission error: ' + err.message);
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingSubFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subfolder', 'assignments');

      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success && res.data?.fileUrl) {
        setSubmissionFileUrl(res.data.fileUrl);
      }
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setUploadingSubFile(false);
    }
  };

  // Convert YouTube standard URL to Embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            to="/student/courses"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Interactive Classroom Hub
            </span>
            <h1 className="text-2xl font-black text-slate-900 font-heading">{course?.title}</h1>
          </div>
        </div>
      </div>

      {/* Classroom Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'videos', label: 'Video Lectures', icon: Video, count: videos.length },
          { id: 'notes', label: 'Study Notes & PDFs', icon: FileText, count: notes.length },
          { id: 'assignments', label: 'Assignments & Tasks', icon: CheckSquare, count: assignments.length },
          { id: 'chat', label: 'Batch Community Chat', icon: MessageSquare, count: messages.length },
          { id: 'announcements', label: 'Notices', icon: Bell, count: announcements.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: VIDEO LECTURES */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-4">
            {selectedVideo ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200 shadow-md">
                  {selectedVideo.videoUrl?.includes('youtube') || selectedVideo.videoUrl?.includes('youtu.be') ? (
                    <iframe
                      src={getEmbedUrl(selectedVideo.videoUrl)}
                      title={selectedVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      src={selectedVideo.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    ></video>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Module Lecture {selectedVideo.orderIndex || 1}
                    </span>
                    <span className="text-xs text-slate-500">{selectedVideo.duration || '45 mins'}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1 font-heading">{selectedVideo.title}</h2>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                    {selectedVideo.description || 'Comprehensive module lecture recording.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center shadow-xs">
                <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No video lectures available yet.</p>
              </div>
            )}
          </div>

          {/* Playlist */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Play className="w-4 h-4 text-indigo-600" />
              <span>Lecture Playlist ({videos.length})</span>
            </h3>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {videos.map((vid, idx) => {
                const isSelected = selectedVideo?.id === vid.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition flex items-center gap-3 border ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate font-heading">{vid.title}</h4>
                      <span className="text-[11px] text-slate-500">{vid.duration || 'Session'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NOTES & RESOURCES */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full p-12 rounded-3xl bg-white border border-slate-200 text-center shadow-xs">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No study notes uploaded yet for this course.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1 font-heading">{note.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {note.description || 'Downloadable lecture slides and cheat sheets.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{note.fileType || 'PDF Resource'}</span>
                  {note.fileUrl && (
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {assignments.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center shadow-xs">
              <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No assignments posted for this course yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((asgn) => {
                const sub = submissions.find((s) => s.assignment?.id === asgn.id);
                return (
                  <div
                    key={asgn.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-700 uppercase">
                          Max Marks: {asgn.maxMarks || 100}
                        </span>
                        {sub ? (
                          <StatusBadge status={sub.status} size="sm" />
                        ) : (
                          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            PENDING SUBMISSION
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mb-2 font-heading">{asgn.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {asgn.description}
                      </p>

                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Due: {asgn.dueDate || 'Flexible'}</span>
                      </div>
                    </div>

                    {/* Submission status or button */}
                    <div className="pt-4 border-t border-slate-100">
                      {sub ? (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                          <div className="flex justify-between items-center text-emerald-700 font-bold">
                            <span>Status: {sub.status}</span>
                            {sub.obtainedMarks !== null && (
                              <span>Marks: {sub.obtainedMarks} / {asgn.maxMarks}</span>
                            )}
                          </div>
                          {sub.feedback && (
                            <p className="text-slate-600">
                              <span className="text-slate-500 font-bold">Faculty Feedback:</span>{' '}
                              {sub.feedback}
                            </p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedAssignment(asgn)}
                          className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Submit Solution</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BATCH COMMUNITY CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col h-[600px]">
          <div className="pb-4 border-b border-slate-100 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Cohort Batch Discussion</h3>
              <p className="text-xs text-slate-500">Ask questions, share solutions and collaborate</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Room
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs font-medium">
                No messages yet. Be the first to start the batch conversation!
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.sender?.id === user?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-slate-500">
                        {isMe ? 'You' : m.sender?.fullName || 'Student'}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                          : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder="Type your question or message for the cohort..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={sendingMsg || !chatInput.trim()}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center shadow-xs">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No announcements posted for this course yet.</p>
            </div>
          ) : (
            announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-amber-700 font-heading">{ann.title}</h4>
                  <span className="text-xs text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{ann.content}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ASSIGNMENT SUBMISSION MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Assignment Submission
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 font-heading">{selectedAssignment.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {subFeedback && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs mb-4 font-medium">
                {subFeedback}
              </div>
            )}

            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Solution Code / Text Explanation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste your code explanation or git repository link here..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Attach Solution File / Project ZIP (Optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                />
                {submissionFileUrl && (
                  <span className="text-xs text-emerald-700 font-semibold mt-1 block">File attached successfully</span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssignment || uploadingSubFile}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  {submittingAssignment ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseClassroomPage;
