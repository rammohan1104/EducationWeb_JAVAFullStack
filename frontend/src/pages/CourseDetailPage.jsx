import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  BarChart,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  Video,
  Users,
  QrCode,
  Copy,
  Check,
  Upload,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import api from '../api/client';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent } = useAuth();

  const [course, setCourse] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // UPI Payment Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const upiVpa = '9392199829@axl';

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const [courseRes, batchesRes] = await Promise.all([
          api.get(`/courses/public/${id}`),
          api.get(`/courses/public/${id}/batches`),
        ]);

        if (courseRes.success && courseRes.data) {
          setCourse(courseRes.data);
        }
        if (batchesRes.success && batchesRes.data) {
          setBatches(batchesRes.data);
          if (batchesRes.data.length > 0) {
            setSelectedBatch(batchesRes.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingFile(true);
    setErrorMsg('');
    try {
      const res = await api.postFormData('/files/upload', formData);
      if (res.success && res.data) {
        setScreenshotUrl(res.data.fileUrl);
      }
    } catch (err) {
      setErrorMsg('Failed to upload payment screenshot. You can still submit UTR.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setErrorMsg('Please enter a valid 12-digit UTR/Transaction number');
      return;
    }

    setSubmittingPayment(true);
    setErrorMsg('');
    try {
      const payload = {
        courseId: course.id,
        batchId: selectedBatch ? selectedBatch.id : null,
        amount: course.fees,
        utrNumber: utrNumber.trim(),
        screenshotUrl: screenshotUrl || null,
        upiId: upiVpa,
      };

      const res = await api.post('/student/payments/submit', payload);
      if (res.success) {
        setSuccessMsg(
          'Payment submitted successfully! Your admission is under verification by our team.'
        );
        setTimeout(() => {
          setModalOpen(false);
          navigate('/student/payments');
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment submission failed. Please try again.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="w-12 h-12 border-4 border-orange-300 border-t-[#ff693b] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-black">
        <h2 className="text-2xl font-black font-heading text-black">Course Not Found</h2>
        <Link to="/courses" className="mt-4 text-[#ff693b] font-bold hover:underline">
          Return to Course Catalog
        </Link>
      </div>
    );
  }

  // QR Code URL helper with Vedantu color accent
  const upiQrString = `upi://pay?pa=${upiVpa}&pn=EduManage%20Pro&am=${course.fees}&cu=INR&tn=Course_${course.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    upiQrString
  )}&bgcolor=ffffff&color=ea580c`;

  return (
    <div className="min-h-screen bg-transparent text-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-black mb-6 font-bold">
          <Link to="/" className="hover:text-[#ff693b]">Home</Link>
          <span>/</span>
          <Link to="/courses" className="hover:text-[#ff693b]">Courses</Link>
          <span>/</span>
          <span className="text-[#ff693b] font-black truncate">{course.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: Course Overview & Syllabus & Batches */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header Card */}
            <div className="bg-white p-8 rounded-3xl border-2 border-orange-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-[#ff693b] text-white shadow-xs">
                  {course.category || 'Intermediate'}
                </span>
                <span className="flex items-center gap-1 text-xs text-black font-bold bg-orange-50 px-3 py-1 rounded-xl border border-orange-300">
                  <Clock className="w-3.5 h-3.5 text-[#ff693b]" /> {course.duration}
                </span>
                <span className="flex items-center gap-1 text-xs text-black font-bold bg-orange-50 px-3 py-1 rounded-xl border border-orange-300">
                  <BarChart className="w-3.5 h-3.5 text-sky-600" /> {course.level}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-black mb-4 leading-tight font-heading">
                {course.title}
              </h1>
              <p className="text-black text-base sm:text-lg leading-relaxed font-semibold">
                {course.description || course.shortDescription}
              </p>
            </div>

            {/* Available Batches & Schedules */}
            <div className="p-8 rounded-3xl bg-white border-2 border-orange-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-300 flex items-center justify-center text-[#ff693b]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black font-heading">Available Batches & Schedules</h2>
                  <p className="text-xs text-black font-semibold">Select your preferred cohort timing</p>
                </div>
              </div>

              {batches.length === 0 ? (
                <p className="text-sm text-black font-bold">New batches will be announced shortly.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {batches.map((batch) => {
                    const isSelected = selectedBatch?.id === batch.id;
                    return (
                      <div
                        key={batch.id}
                        onClick={() => setSelectedBatch(batch)}
                        className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                          isSelected
                            ? 'bg-orange-50 border-orange-400 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-black text-black uppercase tracking-wider">
                              {batch.batchCode}
                            </span>
                            <h4 className="text-base font-black text-black mt-0.5 font-heading">{batch.batchName}</h4>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-[#ff693b] bg-[#ff693b]' : 'border-slate-400 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>

                        <div className="mt-4 space-y-1.5 text-xs text-black font-bold">
                          <p className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-black" />
                            <span>{batch.scheduleTime || 'Flexible online schedule'}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-black" />
                            <span>Starts: {batch.startDate || 'Immediate Batch'}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-black" />
                            <span>Max Capacity: {batch.maxCapacity || 50} Students</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detailed Syllabus */}
            {course.syllabus && (
              <div className="p-8 rounded-3xl bg-white border-2 border-orange-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-black font-heading">Course Curriculum & Syllabus</h2>
                    <p className="text-xs text-black font-semibold">Comprehensive structured learning modules</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {course.syllabus.split('\n').map((module, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200 flex items-center gap-3"
                    >
                      <div className="w-7 h-7 rounded-xl bg-orange-200 text-black font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-bold text-black">{module}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right 1 Col: Enrollment & Payment Card */}
          <div className="space-y-6">
            <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border-2 border-orange-200">
              <div className="relative rounded-2xl overflow-hidden mb-6 h-48">
                <img
                  src={
                    course.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <span className="text-xs font-black text-white">
                    Includes Certificate & NCERT Study Material
                  </span>
                </div>
              </div>

              {/* Price & Guarantee */}
              <div className="mb-6">
                <span className="text-xs text-black font-black uppercase tracking-wider">Total Enrollment Fee</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-black font-heading">
                    ₹{Number(course.fees).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-emerald-900 font-black bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    One-time / Verified
                  </span>
                </div>
              </div>

              {/* Selected Batch Summary */}
              <div className="p-3.5 rounded-2xl bg-orange-50 border-2 border-orange-200 text-xs mb-6 space-y-1">
                <span className="text-black font-bold">Selected Batch Cohort:</span>
                <p className="text-black font-black">
                  {selectedBatch ? `${selectedBatch.batchName} (${selectedBatch.scheduleTime || 'Regular'})` : 'No Batch Selected'}
                </p>
              </div>

              {/* Enrollment Action */}
              {isAuthenticated ? (
                isStudent ? (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full py-4 rounded-2xl font-black text-base text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Pay via UPI & Enroll</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-sky-100 border border-sky-300 text-center text-xs text-black font-bold">
                    You are logged in as Admin. Access this course from the Admin Portal.
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/register"
                    className="w-full py-4 rounded-2xl font-black text-base text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/25 transition flex items-center justify-center gap-2"
                  >
                    <span>Register to Enroll</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full py-3 rounded-2xl font-black text-xs text-black bg-orange-50 border-2 border-orange-200 hover:bg-orange-100 flex items-center justify-center transition"
                  >
                    Already registered? Sign In
                  </Link>
                </div>
              )}

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-orange-100 space-y-2.5 text-xs text-black font-bold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Manual UTR & Receipt Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-sky-700 shrink-0" />
                  <span>Full Access to Recorded & Live Video Classes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Downloadable Study Notes & Assignments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MANUAL UPI PAYMENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-2 border-orange-300 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 text-black">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#ff693b]">
                  Step 2: Instant UPI Payment
                </span>
                <h3 className="text-2xl font-black text-black mt-1 font-heading">Submit UTR Verification</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-black flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-100 border border-rose-300 text-black text-xs flex items-center gap-2 mb-4 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-black text-sm flex items-center gap-2 mb-4 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* UPI QR & VPA Box */}
            <div className="p-5 rounded-2xl bg-orange-50 border-2 border-orange-300 text-center mb-6">
              <p className="text-xs text-black mb-3 font-bold">
                Scan QR using Google Pay, PhonePe, Paytm, or BHIM:
              </p>
              <div className="w-48 h-48 mx-auto bg-white p-2 rounded-2xl shadow-sm border-2 border-orange-300 mb-3 flex items-center justify-center">
                <img src={qrCodeUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
              </div>

              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs text-black font-bold">UPI ID:</span>
                <code className="text-xs font-mono font-black text-black bg-white px-2.5 py-1 rounded-lg border border-orange-300 shadow-xs">
                  {upiVpa}
                </code>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg bg-white border border-orange-300 hover:bg-orange-100 text-black cursor-pointer shadow-xs font-bold"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-[#ff693b]" />}
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-orange-200 flex justify-between items-center text-xs text-black font-bold">
                <span>Amount to Pay:</span>
                <span className="text-base font-black text-black font-heading">
                  ₹{Number(course.fees).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  12-Digit UTR / Transaction Reference ID <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 482910482910"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black placeholder-slate-500 font-bold text-sm focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  Payment Receipt Screenshot (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-orange-100 hover:bg-orange-200 border-2 border-orange-300 text-xs font-black text-black flex items-center gap-2 transition">
                    <Upload className="w-4 h-4 text-[#ff693b]" />
                    <span>{uploadingFile ? 'Uploading...' : 'Choose Screenshot'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingFile}
                    />
                  </label>
                  {screenshotUrl && (
                    <span className="text-xs text-emerald-800 font-black flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Screenshot Attached
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingPayment || uploadingFile}
                className="w-full mt-4 py-3.5 rounded-2xl font-black text-sm text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer"
              >
                {submittingPayment ? 'Verifying & Submitting...' : 'Submit Payment For Verification'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
