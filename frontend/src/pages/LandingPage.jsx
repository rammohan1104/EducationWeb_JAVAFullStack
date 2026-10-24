import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  CreditCard,
  Users,
  Video,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Award,
  Zap,
  TrendingUp,
  Search,
  Star,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  BookOpen,
  Target,
  Clock,
  HelpCircle,
} from 'lucide-react';
import api from '../api/client';

export const LandingPage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses/public');
        if (response.success && response.data) {
          setFeaturedCourses(response.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const subjects = [
    {
      name: 'Mathematics',
      grades: 'Class 11 (+1) & 12 (+2)',
      desc: 'Calculus, Algebra, Coordinate Geometry, Vectors & Probability for CBSE, State Boards & JEE Main.',
      icon: Calculator,
      color: 'from-amber-500 to-orange-600',
      badge: 'MPC Stream',
      chapters: '24 NCERT Chapters',
      bgGlow: 'bg-orange-500/10',
      borderGlow: 'border-orange-200',
    },
    {
      name: 'Physics',
      grades: 'Class 11 (+1) & 12 (+2)',
      desc: 'Kinematics, Thermodynamics, Electromagnetism, Ray Optics & Modern Physics with real-life demonstrations.',
      icon: Atom,
      color: 'from-blue-600 to-indigo-600',
      badge: 'MPC & BiPC',
      chapters: '30 NCERT Chapters',
      bgGlow: 'bg-blue-500/10',
      borderGlow: 'border-blue-200',
    },
    {
      name: 'Chemistry',
      grades: 'Class 11 (+1) & 12 (+2)',
      desc: 'General Organic Chemistry (GOC), Reaction Roadmaps, Chemical Bonding, Coordination Compounds & Physical Numericals.',
      icon: FlaskConical,
      color: 'from-teal-500 to-emerald-600',
      badge: 'MPC & BiPC',
      chapters: '26 NCERT Chapters',
      bgGlow: 'bg-teal-500/10',
      borderGlow: 'border-teal-200',
    },
    {
      name: 'Biology',
      grades: 'Class 11 (+1) & 12 (+2)',
      desc: 'Complete Botany & Zoology, Cell Biology, Molecular Genetics, Human Physiology & Ecology for NEET 360/360.',
      icon: Dna,
      color: 'from-emerald-500 to-green-600',
      badge: 'BiPC Stream',
      chapters: '22 NCERT Chapters',
      bgGlow: 'bg-emerald-500/10',
      borderGlow: 'border-emerald-200',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-black overflow-hidden">
      {/* Background Decorative Gradients - Vedantu Warmth */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-orange-100/80 via-amber-100/60 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-80 right-0 w-[450px] h-[450px] bg-orange-100/50 blur-[130px] pointer-events-none -z-10" />

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-300 text-black text-xs font-black uppercase tracking-wider mb-8 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#ff693b]" />
            <span>Admissions Open for 2026-27 | Intermediate (+1 & +2)</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black max-w-5xl mx-auto leading-[1.15] mb-6 font-heading">
            Master in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff693b] via-orange-600 to-amber-600">
              Maths, Physics, Chemistry, Biology
            </span>
          </h1>

          {/* Subheading in clear black text */}
          <p className="text-lg sm:text-xl text-black font-semibold max-w-3xl mx-auto mb-10 leading-relaxed">
            India's most trusted online coaching hub for Class 11 (+1) & Class 12 (+2) students (MPC & BiPC streams). Master NCERT syllabus, Board Examinations, JEE Main & NEET with interactive live cohorts, chapter formula sheets, and 24/7 instant doubt clarification.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/courses"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explore +1 & +2 Courses</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base text-black bg-white border-2 border-orange-300 hover:bg-orange-50 shadow-sm transition duration-200 cursor-pointer"
            >
              Enroll as Student
            </Link>
          </div>

          {/* Key Metrics / Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-sm">
              <h3 className="text-2xl sm:text-3xl font-black text-black font-heading">99.2%</h3>
              <p className="text-xs sm:text-sm text-black font-bold mt-1">Board Exam Pass Rate</p>
            </div>
            <div className="p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-sm">
              <h3 className="text-2xl sm:text-3xl font-black text-[#ff693b] font-heading">4 Core</h3>
              <p className="text-xs sm:text-sm text-black font-bold mt-1">Maths, Phys, Chem, Bio</p>
            </div>
            <div className="p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-sm">
              <h3 className="text-2xl sm:text-3xl font-black text-amber-600 font-heading">100%</h3>
              <p className="text-xs sm:text-sm text-black font-bold mt-1">NCERT & Board Aligned</p>
            </div>
            <div className="p-6 rounded-3xl bg-white border-2 border-orange-200 shadow-sm">
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 font-heading">24/7</h3>
              <p className="text-xs sm:text-sm text-black font-bold mt-1">1-on-1 Doubt Solving</p>
            </div>
          </div>
        </section>

        {/* 4 CORE SUBJECTS SHOWCASE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-black bg-orange-100 px-3 py-1 rounded-full border border-orange-300">
              Complete Intermediate Spectrum
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black mt-3 font-heading">
              Choose Your Subject & Stream
            </h2>
            <p className="text-sm sm:text-base text-black font-semibold mt-2 max-w-2xl mx-auto">
              Tailored learning paths for MPC (Engineering) and BiPC (Medical) Intermediate students with dedicated chapter breakdowns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((sub) => {
              const Icon = sub.icon;
              return (
                <div
                  key={sub.name}
                  className="bg-white rounded-3xl border-2 border-orange-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sub.color} text-white flex items-center justify-center shadow-sm`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-100 text-black border border-orange-300">
                        {sub.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-black font-heading">{sub.name}</h3>
                    <p className="text-xs text-orange-800 font-bold mb-2">{sub.grades}</p>
                    <p className="text-xs text-black font-medium leading-relaxed mb-4">{sub.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-orange-100 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-black">{sub.chapters}</span>
                    <Link
                      to="/courses"
                      className="text-xs font-black text-[#ff693b] hover:text-[#ea580c] flex items-center gap-1"
                    >
                      <span>View Batches</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4 CORE VALUE PILLARS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-black bg-orange-100 px-3 py-1 rounded-full border border-orange-300">
              Why Intermediate Students Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black mt-3 font-heading">
              A Complete System Designed for 100% Score
            </h2>
            <p className="text-sm sm:text-base text-black font-semibold mt-2 max-w-2xl mx-auto">
              Everything you need to top your Intermediate (+1 & +2) Board Exams, JEE Main, and NEET
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-white border-2 border-orange-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ff693b] flex items-center justify-center mb-6">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-black mb-2 font-heading">Daily Interactive Live Hub</h3>
              <p className="text-xs sm:text-sm text-black font-medium leading-relaxed">
                Live interactive classes with two-way teacher dialogue, real-time quizzes, and instant chapter recordings.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border-2 border-orange-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-black mb-2 font-heading">NCERT DPPs & Formula Sheets</h3>
              <p className="text-xs sm:text-sm text-black font-medium leading-relaxed">
                Chapter-wise Daily Practice Problems (DPPs), solved Previous Year Questions (PYQs), and comprehensive formula handbooks.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border-2 border-orange-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-black mb-2 font-heading">24/7 Instant Doubt Resolution</h3>
              <p className="text-xs sm:text-sm text-black font-medium leading-relaxed">
                Dedicated subject matter experts ready to resolve your numerical questions, chemical reactions, and biology diagrams.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border-2 border-orange-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-black mb-2 font-heading">Verified UPI Admissions</h3>
              <p className="text-xs sm:text-sm text-black font-medium leading-relaxed">
                Secure QR Code fee payments with 12-digit UTR tracking and rapid admin approval to unlock your classroom hub.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURED INTERMEDIATE COURSES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#ff693b]">Featured Programs</span>
              <h2 className="text-3xl font-black text-black mt-1 font-heading">
                Top +1 & +2 Academic Batches
              </h2>
            </div>
            <Link
              to="/courses"
              className="text-sm font-black text-[#ff693b] hover:text-[#ea580c] flex items-center gap-1"
            >
              <span>Browse All Subjects & Batches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 rounded-3xl bg-orange-50 animate-pulse border border-orange-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border-2 border-orange-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          c.thumbnailUrl ||
                          'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white text-black shadow-sm">
                          {c.category || 'Mathematics'}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 text-white text-xs font-black font-heading">
                        {c.level || 'Class 11 & 12'}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-black text-black group-hover:text-[#ff693b] transition-colors line-clamp-2 mb-2 font-heading">
                        {c.title}
                      </h3>
                      <p className="text-xs text-black font-medium line-clamp-2 leading-relaxed mb-4">
                        {c.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between mb-4 pt-3 border-t border-orange-100">
                      <div>
                        <span className="text-[11px] text-black font-bold block">Course Fee</span>
                        <span className="text-lg font-black text-black font-heading">
                          ₹{Number(c.fees).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[12px] text-black font-bold">{c.duration}</span>
                    </div>

                    <Link
                      to={`/courses/${c.id}`}
                      className="w-full py-2.5 rounded-2xl font-black text-xs text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-sm flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Enroll in Batch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#ff693b] to-orange-600 text-white shadow-xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-black uppercase tracking-wider bg-black/20 text-white px-3 py-1 rounded-full">
                Early-Bird Intermediate Admission 2026
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-heading">
                Ready to Score 95%+ in Your Intermediate Exams?
              </h2>
              <p className="text-white text-sm sm:text-base font-semibold leading-relaxed">
                Join thousands of +1 and +2 students mastering Maths, Physics, Chemistry, and Biology with structured live batches and personal mentors.
              </p>
            </div>
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-white text-black font-black text-base hover:bg-orange-50 shadow-lg hover:shadow-xl transition shrink-0 cursor-pointer"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
