import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  MapPin,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  Key,
} from 'lucide-react';
import api from '../../api/client';

export const StudentProfilePage = () => {
  const { user, updateCurrentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // 16 fields profile state
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    parentName: '',
    parentPhone: '',
    dateOfBirth: '',
    gender: 'Male',
    qualification: '',
    collegeName: '',
    passingYear: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    profilePhotoUrl: '',
  });

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/student/profile');
        if (res.success && res.data) {
          setProfile({
            fullName: res.data.fullName || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            alternatePhone: res.data.alternatePhone || '',
            parentName: res.data.parentName || '',
            parentPhone: res.data.parentPhone || '',
            dateOfBirth: res.data.dateOfBirth || '',
            gender: res.data.gender || 'Male',
            qualification: res.data.qualification || '',
            collegeName: res.data.collegeName || '',
            passingYear: res.data.passingYear || '',
            address: res.data.address || '',
            city: res.data.city || '',
            state: res.data.state || '',
            pincode: res.data.pincode || '',
            profilePhotoUrl: res.data.profilePhotoUrl || '',
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      const res = await api.put('/student/profile', profile);
      if (res.success && res.data) {
        setProfileSuccess('16-Field Student Profile updated successfully!');
        updateCurrentUser(res.data);
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setPassError('Please fill all password fields');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }

    setChangingPass(true);
    setPassSuccess('');
    setPassError('');
    try {
      const res = await api.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      if (res.success) {
        setPassSuccess('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPassError(err.message || 'Failed to change password. Ensure old password is correct.');
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-[#ff693b] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Student Profile & Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
          Review and update your university-grade 16-field record and security credentials
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-8">
        {/* Profile Messages */}
        {profileSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}
        {profileError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2 font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        {/* Section 1: Personal & Photo */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-orange-100 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-[#ff693b] uppercase tracking-wider flex items-center gap-2 font-heading">
            <User className="w-4 h-4" />
            <span>1. Identity & Personal Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name (As per records)
              </label>
              <input
                type="text"
                required
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                required
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Profile Photo URL (or Avatar)
              </label>
              <input
                type="text"
                name="profilePhotoUrl"
                placeholder="https://images.unsplash.com/..."
                value={profile.profilePhotoUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Parents */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-orange-100 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2 font-heading">
            <Phone className="w-4 h-4" />
            <span>2. Contact & Guardian Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Phone Number
              </label>
              <input
                type="tel"
                required
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alternate Phone Number
              </label>
              <input
                type="tel"
                name="alternatePhone"
                value={profile.alternatePhone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Parent / Guardian Full Name
              </label>
              <input
                type="text"
                required
                name="parentName"
                value={profile.parentName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Parent / Guardian Contact Phone
              </label>
              <input
                type="tel"
                required
                name="parentPhone"
                value={profile.parentPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Address & Location */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-orange-100 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wider flex items-center gap-2 font-heading">
            <MapPin className="w-4 h-4" />
            <span>3. Address & Location</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Permanent Residential Address
            </label>
            <input
              type="text"
              required
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
              <input
                type="text"
                required
                name="city"
                value={profile.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
              <input
                type="text"
                required
                name="state"
                value={profile.state}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Pincode</label>
              <input
                type="text"
                required
                name="pincode"
                value={profile.pincode}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Academic Background */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-orange-100 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2 font-heading">
            <Building className="w-4 h-4" />
            <span>4. Academic Background</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Qualification
              </label>
              <input
                type="text"
                required
                name="qualification"
                value={profile.qualification}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                College / University
              </label>
              <input
                type="text"
                required
                name="collegeName"
                value={profile.collegeName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Passing Year
              </label>
              <input
                type="text"
                required
                name="passingYear"
                value={profile.passingYear}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#ff693b] hover:bg-[#ea580c] shadow-md shadow-orange-500/25 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{savingProfile ? 'Saving Changes...' : 'Save 16-Field Profile'}</span>
        </button>
      </form>

      {/* Security & Password Change */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-orange-100 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2 font-heading">
          <Lock className="w-4 h-4" />
          <span>Security & Change Password</span>
        </h3>

        {passSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{passSuccess}</span>
          </div>
        )}
        {passError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2 font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
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
                className="w-full px-4 py-3 rounded-2xl bg-orange-50/20 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#ff693b] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={changingPass}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
          >
            {changingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfilePage;
