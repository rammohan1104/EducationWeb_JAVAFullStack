import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-orange-100 pt-16 pb-12 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-[#ff693b] to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
                Edu<span className="text-[#ff693b]">Manage</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              India's premier live learning platform for Intermediate (+1 & +2) students. Master Mathematics, Physics, Chemistry, and Biology for Board Exams, JEE Main & NEET UG with verified UPI admissions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff693b]" /> Verified UPI VPA: 9392199829@axl
              </span>
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Intermediate Subjects</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/courses" className="hover:text-[#ff693b] transition font-medium">Mathematics (+1 / +2)</Link></li>
              <li><Link to="/courses" className="hover:text-[#ff693b] transition font-medium">Physics (+1 / +2)</Link></li>
              <li><Link to="/courses" className="hover:text-[#ff693b] transition font-medium">Chemistry (+1 / +2)</Link></li>
              <li><Link to="/courses" className="hover:text-[#ff693b] transition font-medium">Biology (Botany & Zoology)</Link></li>
            </ul>
          </div>

          {/* Streams & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Streams & Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/courses" className="hover:text-[#ff693b] transition font-medium">MPC (Maths, Physics, Chem)</Link></li>
              <li><Link to="/courses" className="hover:text-[#ff693b] transition font-medium">BiPC (Biology, Physics, Chem)</Link></li>
              <li><Link to="/login" className="hover:text-[#ff693b] transition font-medium">Student Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-[#ff693b] transition font-medium">Admin & Faculty Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Admissions & Help</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#ff693b] shrink-0" />
                <span>admissions@edumanage.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ff693b] shrink-0" />
                <span>+91 93921 99829</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#ff693b] shrink-0 mt-0.5" />
                <span>State Intermediate Board & CBSE Learning Center</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} EduManage Pro. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#terms" className="hover:text-[#ff693b]">NCERT Curriculum Policy</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-[#ff693b]">Privacy & Student Data</a>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              Made with <Heart className="w-3 h-3 text-[#ff693b] fill-[#ff693b]" /> for Intermediate Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
