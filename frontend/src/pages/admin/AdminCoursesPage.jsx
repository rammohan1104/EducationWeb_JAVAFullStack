import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Check,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  Loader2,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Target,
  Stethoscope,
} from 'lucide-react';
import api from '../../api/client';

const SUBJECT_PRESETS = [
  {
    name: 'Mathematics (+1 / +2)',
    category: 'Mathematics (+1 / +2)',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    icon: Calculator,
    color: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Physics (+1 / +2)',
    category: 'Physics (+1 / +2)',
    url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
    icon: Atom,
    color: 'from-blue-600 to-indigo-700',
  },
  {
    name: 'Chemistry (+1 / +2)',
    category: 'Chemistry (+1 / +2)',
    url: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80',
    icon: FlaskConical,
    color: 'from-teal-500 to-emerald-700',
  },
  {
    name: 'Biology (+1 / +2)',
    category: 'Biology (+1 / +2)',
    url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
    icon: Dna,
    color: 'from-emerald-500 to-green-700',
  },
  {
    name: 'JEE Main & Advanced',
    category: 'JEE Main & Advanced',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    icon: Target,
    color: 'from-orange-600 to-red-600',
  },
  {
    name: 'NEET UG (Medical)',
    category: 'NEET UG',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    icon: Stethoscope,
    color: 'from-cyan-600 to-blue-700',
  },
];

export const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Mathematics (+1 / +2)',
    description: '',
    shortDescription: '',
    duration: '1 Year (Academic Session)',
    fees: '',
    level: 'Class 11 (+1)',
    thumbnailUrl: SUBJECT_PRESETS[0].url,
    syllabus: '',
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      if (res.success && res.data) {
        setCourses(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      category: 'Mathematics (+1 / +2)',
      description: '',
      shortDescription: '',
      duration: '1 Year (Academic Session)',
      fees: '',
      level: 'Class 11 (+1)',
      thumbnailUrl: SUBJECT_PRESETS[0].url,
      syllabus: '',
      isActive: true,
    });
    setUploadSuccess(false);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      category: course.category || 'Mathematics (+1 / +2)',
      description: course.description || '',
      shortDescription: course.shortDescription || '',
      duration: course.duration || '1 Year (Academic Session)',
      fees: course.fees || '',
      level: course.level || 'Class 11 (+1)',
      thumbnailUrl: course.thumbnailUrl || SUBJECT_PRESETS[0].url,
      syllabus: course.syllabus || '',
      isActive: course.isActive !== undefined ? course.isActive : true,
    });
    setUploadSuccess(false);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB limit. Please choose a smaller picture.');
      return;
    }

    const data = new FormData();
    data.append('file', file);

    setUploadingImage(true);
    setErrorMsg('');
    try {
      const res = await api.postFormData('/files/upload?subfolder=courses', data);
      if (res.success && res.data && res.data.fileUrl) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: res.data.fileUrl }));
        setUploadSuccess(true);
      } else {
        // Fallback: Read as base64 data URL for local storage preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, thumbnailUrl: reader.result }));
          setUploadSuccess(true);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('API file upload failed, falling back to FileReader Data URL:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, thumbnailUrl: reader.result }));
        setUploadSuccess(true);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.thumbnailUrl) {
      setErrorMsg('Please select or upload a course picture/thumbnail.');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    try {
      if (editingCourse) {
        await api.put(`/admin/courses/${editingCourse.id}`, formData);
      } else {
        await api.post('/admin/courses', formData);
      }
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course program?')) return;
    try {
      await api.delete(`/admin/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.level?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-black text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#ff693b]" />
            <span>Intermediate (+1 / +2) Curriculum Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black font-heading">
            Course & Subject Management
          </h1>
          <p className="text-xs sm:text-sm text-black font-semibold mt-1">
            Create, edit Maths, Physics, Chemistry, Biology courses, upload cover photos, manage fees and publish active batches
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl font-black text-xs text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/20 transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Subject Course</span>
        </button>
      </div>

      {/* Search filter */}
      <div className="p-4 rounded-2xl bg-white border-2 border-orange-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-black" />
        <input
          type="text"
          placeholder="Filter courses by Subject (Maths, Physics, Chemistry, Biology), Class (+1, +2), or Stream (MPC, BiPC)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-black placeholder-slate-600 font-medium focus:outline-none"
        />
      </div>

      {/* Courses Table */}
      {loading ? (
        <div className="h-64 rounded-3xl bg-orange-50 animate-pulse border border-orange-100" />
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border-2 border-orange-200 text-center max-w-xl mx-auto shadow-sm">
          <BookOpen className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <h3 className="text-lg font-black text-black font-heading">No course curriculums found</h3>
          <p className="text-xs text-black font-semibold mt-1 mb-4">
            Click the button below to add your first Intermediate (+1, +2) course with cover picture.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-2xl text-xs font-black text-white bg-[#ff693b] hover:bg-[#ea580c]"
          >
            + Add New Course
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-orange-200 overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-orange-100 text-black uppercase font-black tracking-wider border-b-2 border-orange-200">
                <tr>
                  <th className="px-6 py-4">Course & Cover Photo</th>
                  <th className="px-6 py-4">Subject Stream</th>
                  <th className="px-6 py-4">Grade & Duration</th>
                  <th className="px-6 py-4">Fee (INR)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 text-black font-medium">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-orange-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            c.thumbnailUrl ||
                            SUBJECT_PRESETS[0].url
                          }
                          alt={c.title}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-200 shrink-0 shadow-xs"
                        />
                        <div>
                          <h4 className="font-black text-black text-sm font-heading">{c.title}</h4>
                          <p className="text-[11px] text-black font-semibold line-clamp-1">{c.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-orange-100 text-black font-black text-[11px] border border-orange-300">
                        {c.category || 'Mathematics'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-black font-black font-heading">{c.duration}</div>
                      <div className="text-[11px] text-orange-900 font-black">{c.level}</div>
                    </td>
                    <td className="px-6 py-4 font-black text-black text-sm font-heading">
                      ₹{Number(c.fees).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      {c.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 font-black">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-700 font-bold">
                          <XCircle className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-black transition cursor-pointer border border-orange-300"
                          title="Edit Course"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 transition cursor-pointer border border-rose-300"
                          title="Delete Course"
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

      {/* CREATE / EDIT MODAL WITH COURSE PHOTO UPLOAD & PRESETS */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-2 border-orange-300 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-black">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#ff693b]">
                  {editingCourse ? 'Edit Curriculum' : 'Add New Intermediate Course'}
                </span>
                <h3 className="text-xl font-black text-black mt-0.5 font-heading">
                  {editingCourse ? `Edit: ${editingCourse.title}` : 'Create Intermediate (+1 / +2) Program'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-black hover:text-slate-700 font-black cursor-pointer p-1"
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* COURSE PICTURE (COVER PHOTO) SELECTOR / UPLOAD */}
              <div className="p-5 rounded-3xl bg-orange-50 border-2 border-orange-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-black uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#ff693b]" />
                    <span>Course Cover Picture / Thumbnail (Required)</span>
                  </label>
                  {uploadSuccess && (
                    <span className="text-emerald-800 text-xs font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Photo Selected!
                    </span>
                  )}
                </div>

                {/* Live Preview and Upload Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Image Preview */}
                  <div className="relative h-32 rounded-2xl overflow-hidden border-2 border-orange-300 bg-slate-100 group shadow-xs">
                    {formData.thumbnailUrl ? (
                      <img
                        src={formData.thumbnailUrl}
                        alt="Course Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = SUBJECT_PRESETS[0].url;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-black text-xs font-bold">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span>No Photo Selected</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-bold">
                      Live Preview
                    </div>
                  </div>

                  {/* Upload from Computer Button */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-4 py-2.5 rounded-2xl bg-white border-2 border-orange-300 hover:border-[#ff693b] text-black hover:text-[#ff693b] font-black text-xs shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#ff693b]" />
                            <span>Uploading Picture...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-[#ff693b]" />
                            <span>Upload Photo from Computer</span>
                          </>
                        )}
                      </button>
                      <span className="text-[11px] text-black font-bold">PNG, JPG, WebP up to 5MB</span>
                    </div>

                    {/* Direct Image URL input */}
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-3.5 h-3.5 text-black shrink-0" />
                      <input
                        type="url"
                        placeholder="Or paste direct image URL (https://...)"
                        value={formData.thumbnailUrl}
                        onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border-2 border-orange-200 text-black text-xs font-medium focus:outline-none focus:border-[#ff693b]"
                      />
                    </div>
                  </div>
                </div>

                {/* 1-Click Subject Presets */}
                <div>
                  <span className="block text-[11px] font-black text-black mb-2 uppercase tracking-wide">
                    Or select 1-click subject photo preset:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {SUBJECT_PRESETS.map((preset) => {
                      const isSelected = formData.thumbnailUrl === preset.url;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              thumbnailUrl: preset.url,
                              category: preset.category,
                            }));
                            setUploadSuccess(true);
                          }}
                          className={`p-2 rounded-2xl border-2 text-left transition flex flex-col items-center gap-1.5 cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'border-[#ff693b] bg-white ring-2 ring-[#ff693b]/20 shadow-xs'
                              : 'border-orange-200 bg-white/80 hover:bg-white hover:border-orange-300'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200">
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-black text-black text-center line-clamp-1">
                            {preset.name.split(' ')[0]}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#ff693b] text-white rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5">Course Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 11 & 12 Mathematics: Pure & Applied Calculus Masterclass"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Subject Stream & Fees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1.5">Subject Stream / Domain</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-bold focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="Mathematics (+1 / +2)">Mathematics (+1 / +2)</option>
                    <option value="Physics (+1 / +2)">Physics (+1 / +2)</option>
                    <option value="Chemistry (+1 / +2)">Chemistry (+1 / +2)</option>
                    <option value="Biology (+1 / +2)">Biology (+1 / +2)</option>
                    <option value="MPC Stream (Maths, Physics, Chem)">MPC Stream (Maths, Physics, Chem)</option>
                    <option value="BiPC Stream (Bio, Physics, Chem)">BiPC Stream (Bio, Physics, Chem)</option>
                    <option value="PCMB (All 4 Subjects)">PCMB (All 4 Subjects)</option>
                    <option value="JEE Main & Advanced">JEE Main & Advanced</option>
                    <option value="NEET UG (Medical)">NEET UG (Medical)</option>
                    <option value="State Board & CBSE (+1 / +2)">State Board & CBSE (+1 / +2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1.5">Course Fee (INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 14999"
                    value={formData.fees}
                    onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-bold focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Duration & Grade Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1.5">Academic Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Year (Academic Session)"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-bold focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1.5">Target Grade / Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-bold focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="Class 11 (+1)">Class 11 (+1)</option>
                    <option value="Class 12 (+2)">Class 12 (+2)</option>
                    <option value="Class 11 & 12 (2-Year Integrated)">Class 11 & 12 (2-Year Integrated)</option>
                    <option value="Dropper / Repeater (JEE & NEET)">Dropper / Repeater (JEE & NEET)</option>
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5">Short Summary (Catalog Cards)</label>
                <input
                  type="text"
                  placeholder="e.g. Complete NCERT & State Board syllabus coverage with chapter-wise DPPs and mock tests"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5">Full Course Overview & Pedagogy</label>
                <textarea
                  rows={3}
                  placeholder="Detailed course description, interactive learning methodology, test series details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Syllabus Breakdown */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  Chapter / Syllabus Breakdown (1 topic per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Chapter 1: Sets, Relations & Functions&#10;Chapter 2: Trigonometry & Inverse Trig&#10;Chapter 3: Limits, Continuity & Differentiability&#10;Chapter 4: Integral Calculus & Differential Equations&#10;Chapter 5: Vectors & 3D Geometry"
                  value={formData.syllabus}
                  onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100 font-mono font-medium"
                />
              </div>

              {/* Publish Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#ff693b] bg-white border-slate-400 focus:ring-[#ff693b]"
                />
                <label htmlFor="isActiveCheck" className="text-xs text-black font-black cursor-pointer">
                  Publish immediately (Visible in Intermediate Course Catalog)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-black text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#ff693b] hover:bg-[#ea580c] text-white font-black text-xs shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;
