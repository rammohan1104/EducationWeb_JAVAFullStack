import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  CreditCard,
  Video,
  FileText,
  Bell,
  CheckSquare,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard & Metrics', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Course Management', path: '/admin/courses', icon: BookOpen },
    { name: 'Batch Allocation', path: '/admin/batches', icon: Calendar },
    { name: 'Student Directory', path: '/admin/students', icon: Users },
    { name: 'Payment Approvals', path: '/admin/payments', icon: CreditCard, highlight: true },
    { name: 'Learning & Content Hub', path: '/admin/content', icon: Video },
  ];

  const studentLinks = [
    { name: 'My Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Enrolled Courses', path: '/student/courses', icon: BookOpen },
    { name: 'UPI Payments & Receipts', path: '/student/payments', icon: CreditCard },
    { name: '16-Field Student Profile', path: '/student/profile', icon: User },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-orange-100 min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 shrink-0 shadow-[2px_0_12px_-4px_rgba(255,105,59,0.03)]">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/80 flex items-center gap-3">
          <img
            src={
              user?.profilePhotoUrl ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
            }
            alt="avatar"
            className="w-10 h-10 rounded-xl object-cover border border-orange-300 shrink-0"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-800 truncate leading-tight font-heading">
              {user?.fullName || user?.email}
            </h4>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 mt-1 rounded-full uppercase tracking-wider ${
                isAdmin
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'bg-orange-100 text-orange-800 border border-orange-200'
              }`}
            >
              {isAdmin ? 'System Admin' : 'Enrolled Student'}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {isAdmin ? 'Administration' : 'Learning Portal'}
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-50 text-[#ff693b] font-bold border border-orange-200 shadow-xs'
                      : 'text-slate-600 hover:text-[#ff693b] hover:bg-orange-50/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.name}</span>
                {link.highlight && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-orange-100 space-y-2">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-50/80 to-amber-50/40 border border-orange-200/70">
          <div className="flex items-center gap-2 text-orange-800 text-xs font-bold mb-1 font-heading">
            <Sparkles className="w-3.5 h-3.5 text-[#ff693b]" />
            <span>Vedantu-Grade Portal</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Live interactive batches with instant UPI verification flow.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
