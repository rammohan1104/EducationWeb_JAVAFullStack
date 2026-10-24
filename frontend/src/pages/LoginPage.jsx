import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter email and password');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const authData = await login(email.trim(), password);
      if (from) {
        navigate(from, { replace: true });
      } else if (authData.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@edumanage.com');
      setPassword('admin123');
    } else {
      setEmail('student@edumanage.com');
      setPassword('student123');
    }
    setErrorMsg('');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-transparent px-4 py-12 relative overflow-hidden text-black">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/60 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-sm border-2 border-orange-200 relative text-black">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 via-[#ff693b] to-amber-400 p-0.5 shadow-md shadow-orange-500/25 mx-auto mb-4">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#ff693b]" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black font-heading">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-black font-semibold mt-1.5">
            Sign in to access your student classroom or admin portal
          </p>
        </div>

        {/* Quick Fill Credentials Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-orange-50 border-2 border-orange-200 text-xs">
          <p className="text-black font-black text-[11px] mb-2.5 uppercase tracking-wider text-center">
            ⚡ Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('student')}
              className="px-3 py-2 rounded-xl bg-white hover:bg-orange-100 border border-orange-300 text-black font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#ff693b]" />
              <span>Student Demo</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="px-3 py-2 rounded-xl bg-white hover:bg-sky-50 border border-sky-300 text-black font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-100 border border-rose-300 text-black text-xs flex items-center gap-2 mb-6 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-black mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black text-black">Password</label>
              <a href="#forgot" className="text-xs font-black text-[#ff693b] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl font-black text-sm text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-orange-100 text-center">
          <p className="text-xs text-black font-semibold">
            Don't have an intermediate student account?{' '}
            <Link to="/register" className="text-[#ff693b] font-black hover:underline">
              Create Student Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
