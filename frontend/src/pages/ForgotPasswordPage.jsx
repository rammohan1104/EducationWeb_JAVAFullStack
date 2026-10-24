import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Key, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../api/client';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset with token
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      if (res.success) {
        setSuccessMsg(res.data || 'Password reset token generated! Please check details below.');
        if (res.data && res.data.includes('token is: ')) {
          const extractedToken = res.data.split('token is: ')[1];
          setResetToken(extractedToken);
        }
        setStep(2);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to initiate password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/reset-password', {
        token: resetToken.trim(),
        newPassword,
      });
      if (res.success) {
        setSuccessMsg('Password has been reset successfully! You can now log in.');
        setStep(3);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-transparent px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-orange-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Reset Password</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            {step === 1
              ? 'Enter your registered email to request a reset token'
              : step === 2
              ? 'Enter the security token and your new password'
              : 'Password Updated'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 mb-6 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 mb-6 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-orange-50/30 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Sending Request...' : 'Generate Reset Token'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Reset Security Token
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Paste reset token here"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-orange-50/30 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/30 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/30 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/25 transition"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#ff693b]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
