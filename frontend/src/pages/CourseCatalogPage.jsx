import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, BarChart, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import api from '../api/client';

export const CourseCatalogPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get('/courses/public');
        if (res.success && res.data) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const categories = [
    { label: 'All Subjects', value: 'ALL' },
    { label: 'Mathematics (+1/+2)', value: 'Mathematics' },
    { label: 'Physics (+1/+2)', value: 'Physics' },
    { label: 'Chemistry (+1/+2)', value: 'Chemistry' },
    { label: 'Biology (+1/+2)', value: 'Biology' },
    { label: 'MPC Stream', value: 'MPC' },
    { label: 'BiPC Stream', value: 'BiPC' },
    { label: 'JEE & NEET', value: 'JEE' },
  ];

  const levels = [
    { label: 'All Grades', value: 'ALL' },
    { label: 'Class 11 (+1)', value: 'Class 11' },
    { label: 'Class 12 (+2)', value: 'Class 12' },
    { label: 'Droppers / Entrance', value: 'Dropper' },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' ||
      course.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      course.title?.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesLevel =
      selectedLevel === 'ALL' ||
      course.level?.toLowerCase().includes(selectedLevel.toLowerCase());

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-transparent text-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-300 text-black text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#ff693b]" />
            <span>Intermediate (+1 / +2) Curriculum 2026-27</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-black font-heading">
            Class 11 (+1) & Class 12 (+2) Course Catalog
          </h1>
          <p className="text-black text-base sm:text-lg font-semibold mt-3">
            Choose from comprehensive Mathematics, Physics, Chemistry, and Biology courses aligned with NCERT, State Intermediate Boards, JEE Main, and NEET UG.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-sm mb-12 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="Search by subject (Maths, Physics, Chemistry, Biology), chapter, or exam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-orange-50/30 border-2 border-orange-200 text-black placeholder-slate-600 font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100 text-sm"
              />
            </div>
          </div>

          {/* Subject Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-orange-100">
            <span className="text-xs font-black text-black mr-2">Subject:</span>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-[#ff693b] text-white shadow-xs'
                    : 'bg-orange-50 text-black hover:bg-orange-100 border border-orange-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-orange-50 animate-pulse border border-orange-100" />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-orange-200 max-w-xl mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-orange-400 mx-auto mb-3" />
            <h3 className="text-lg font-black text-black font-heading">No subject courses match your filter</h3>
            <p className="text-xs text-black font-semibold mt-1">Try clearing filters or searching for Maths, Physics, Chemistry, or Biology.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedLevel('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-black text-white bg-[#ff693b] hover:bg-[#ea580c]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl overflow-hidden border-2 border-orange-200 shadow-sm hover:shadow-md hover:border-orange-400 transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        course.thumbnailUrl ||
                        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 px-3 py-1 text-xs font-black uppercase rounded-xl bg-white text-black shadow-xs">
                      {course.category}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[11px] font-black rounded-lg bg-black text-white">
                      {course.level || 'Class 11 & 12'}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-black font-bold mb-2.5">
                      <span className="flex items-center gap-1 font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#ff693b]" /> {course.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-black text-orange-800">
                        NCERT Aligned
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-black group-hover:text-[#ff693b] transition font-heading line-clamp-2 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-black font-medium line-clamp-3 leading-relaxed">
                      {course.shortDescription || course.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-orange-100 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-black font-bold block">Academic Tuition</span>
                    <h4 className="text-xl font-black text-black font-heading">
                      ₹{Number(course.fees).toLocaleString('en-IN')}
                    </h4>
                  </div>

                  <Link
                    to={`/courses/${course.id}`}
                    className="px-4 py-2.5 rounded-2xl text-xs font-black text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-sm shadow-orange-500/20 transition flex items-center gap-1.5"
                  >
                    <span>View Batches</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalogPage;
