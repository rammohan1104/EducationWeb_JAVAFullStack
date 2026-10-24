import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  LogOut,
  User,
  Menu,
  X,
  CreditCard,
  ChevronDown,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50">
      {/* Vedantu-style Top Announcement Ribbon */}
      <div className="bg-gradient-to-r from-orange-600 via-[#ff693b] to-amber-500 text-white text-xs py-1.5 px-4 font-semibold text-center flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>⚡ Admissions Open 2026-27 | Class 11 (+1) & Class 12 (+2) Live Batches for Maths, Physics, Chem & Bio</span>
      </div>

      <nav className="bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-[0_2px_15px_-3px_rgba(255,105,59,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-[#ff693b] to-amber-400 p-0.5 shadow-md shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-all duration-300">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#ff693b] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
                    EduManage<span className="text-[#ff693b]">Pro</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200 rounded-full uppercase tracking-wider">
                    INTER +1/+2
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Intermediate (+1 & +2) Maths, Physics, Chem & Bio
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-semibold transition-colors ${
                  isActive('/') ? 'text-[#ff693b]' : 'text-slate-700 hover:text-[#ff693b]'
                }`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`text-sm font-semibold transition-colors ${
                  isActive('/courses') ? 'text-[#ff693b]' : 'text-slate-700 hover:text-[#ff693b]'
                }`}
              >
                Courses & Batches
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-800 bg-sky-50 border border-sky-200/80 px-3.5 py-1.5 rounded-xl shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-sky-600" /> Admin Portal
                </Link>
              )}

              {isStudent && (
                <Link
                  to="/student/dashboard"
                  className="flex items-center gap-1.5 text-sm font-bold text-orange-700 hover:text-orange-800 bg-orange-50 border border-orange-200/80 px-3.5 py-1.5 rounded-xl shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#ff693b]" /> My Student Portal
                </Link>
              )}
            </div>

            {/* Right Action Menu */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-orange-50/70 border border-orange-200/80 hover:border-orange-300 hover:bg-orange-100/50 transition cursor-pointer"
                  >
                    <img
                      src={
                        user?.profilePhotoUrl ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                      }
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border border-orange-300"
                    />
                    <span className="text-sm font-bold text-slate-800 max-w-[120px] truncate">
                      {user?.fullName || user?.email}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-orange-100 shadow-xl py-2 z-50 divide-y divide-slate-100"
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-3">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase bg-orange-50 text-orange-700 border border-orange-200">
                          {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Student'}
                        </span>
                      </div>

                      <div className="py-1.5">
                        {isAdmin ? (
                          <>
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-[#ff693b] hover:bg-orange-50/60 font-medium"
                            >
                              <LayoutDashboard className="w-4 h-4 text-[#ff693b]" /> Admin Dashboard
                            </Link>
                            <Link
                              to="/admin/payments"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-[#ff693b] hover:bg-orange-50/60 font-medium"
                            >
                              <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Approvals
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/student/dashboard"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-[#ff693b] hover:bg-orange-50/60 font-medium"
                            >
                              <LayoutDashboard className="w-4 h-4 text-[#ff693b]" /> Student Dashboard
                            </Link>
                            <Link
                              to="/student/courses"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-[#ff693b] hover:bg-orange-50/60 font-medium"
                            >
                              <BookOpen className="w-4 h-4 text-sky-600" /> My Learning Classes
                            </Link>
                            <Link
                              to="/student/profile"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-[#ff693b] hover:bg-orange-50/60 font-medium"
                            >
                              <User className="w-4 h-4 text-purple-600" /> My 16-Field Profile
                            </Link>
                            <Link
                              to="/student/payments"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-[#ff693b] hover:bg-orange-50/60 font-medium"
                            >
                              <CreditCard className="w-4 h-4 text-amber-600" /> Payment Receipts
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-semibold transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-[#ff693b] transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/25 hover:shadow-orange-500/35 transition duration-200"
                  >
                    Join for Free
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-[#ff693b] hover:bg-orange-50"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#ff693b]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-orange-100 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-700 hover:text-[#ff693b]"
            >
              Home
            </Link>
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-700 hover:text-[#ff693b]"
            >
              Courses & Batches
            </Link>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-3 py-2">
                  <img
                    src={
                      user?.profilePhotoUrl ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                    }
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-orange-300"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user?.fullName || user?.email}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('ROLE_', '')}</p>
                  </div>
                </div>

                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm font-bold text-sky-700"
                  >
                    <ShieldCheck className="w-4 h-4" /> Admin Portal
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/student/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm font-bold text-slate-700"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#ff693b]" /> My Student Portal
                    </Link>
                    <Link
                      to="/student/courses"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm font-bold text-slate-700"
                    >
                      <BookOpen className="w-4 h-4 text-sky-600" /> My Learning Classes
                    </Link>
                    <Link
                      to="/student/payments"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm font-bold text-slate-700"
                    >
                      <CreditCard className="w-4 h-4 text-amber-600" /> Payments & UTR Receipts
                    </Link>
                  </>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left py-2 text-sm font-bold text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl text-sm font-bold text-slate-700 bg-slate-100"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl text-sm font-bold text-white bg-[#ff693b]"
                >
                  Join for Free
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
