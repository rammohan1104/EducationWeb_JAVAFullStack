import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Building,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Account
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2: Personal
    gender: 'Male',
    dateOfBirth: '',
    parentName: '',
    parentPhone: '',
    // Step 3: Contact & Location
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Step 4: Academic (+1 / +2 Intermediate)
    qualification: 'Class 11 (+1) - MPC (Maths, Physics, Chem)',
    collegeName: '',
    passingYear: '2026',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = (step) => {
    setErrorMsg('');
    if (step === 1) {
      if (!formData.fullName.trim()) return 'Please enter your full name';
      if (!formData.email.trim()) return 'Please enter your email';
      if (!formData.password || formData.password.length < 6)
        return 'Password must be at least 6 characters long';
      if (formData.password !== formData.confirmPassword)
        return 'Passwords do not match';
    }
    if (step === 2) {
      if (!formData.phone.trim()) return 'Please enter your primary mobile number';
      if (!formData.dateOfBirth) return 'Please select your Date of Birth';
      if (!formData.parentName.trim()) return "Please enter Parent/Guardian's Name";
      if (!formData.parentPhone.trim()) return "Please enter Parent's Contact Number";
    }
    if (step === 3) {
      if (!formData.address.trim()) return 'Please enter your address';
      if (!formData.city.trim()) return 'Please enter your city';
      if (!formData.state.trim()) return 'Please enter your state';
      if (!formData.pincode.trim()) return 'Please enter your pincode';
    }
    if (step === 4) {
      if (!formData.collegeName.trim()) return 'Please enter your school or junior college name';
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(activeStep);
    if (error) {
      setErrorMsg(error);
      return;
    }
    setErrorMsg('');
    setActiveStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg('');
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateStep(4);
    if (error) {
      setErrorMsg(error);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        qualification: formData.qualification,
        collegeName: formData.collegeName,
        passingYear: formData.passingYear,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });

      setSuccessMsg('Registration successful! Redirecting to student dashboard...');
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-transparent px-4 py-12 text-black">
      <div className="max-w-3xl w-full bg-white p-6 sm:p-10 rounded-3xl shadow-sm border-2 border-orange-200">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="px-3.5 py-1 rounded-full bg-orange-100 text-black text-xs font-black uppercase tracking-wider border border-orange-300">
            Intermediate (+1 / +2) Admission Pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black mt-2 font-heading">
            Student Registration & Enrollment
          </h1>
          <p className="text-xs sm:text-sm text-black font-semibold mt-1">
            Fill in your authentic academic and personal information for verified Intermediate batch allocation
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { num: 1, title: 'Account' },
            { num: 2, title: 'Personal & Guardian' },
            { num: 3, title: 'Address & City' },
            { num: 4, title: 'Stream & Academics' },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-2.5 rounded-2xl border-2 text-center transition ${
                activeStep === s.num
                  ? 'bg-orange-100 border-orange-400 text-black shadow-xs font-black'
                  : activeStep > s.num
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-black'
                  : 'bg-slate-100 border-slate-200 text-slate-700 font-bold'
              }`}
            >
              <div className="text-xs font-black">Step {s.num}</div>
              <div className="text-[11px] font-bold truncate hidden sm:block">{s.title}</div>
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-100 border border-rose-300 text-black text-xs flex items-center gap-2 mb-6 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-black text-xs flex items-center gap-2 mb-6 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Account Credentials */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <input
                    type="text"
                    required
                    name="fullName"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                    <input
                      type="password"
                      required
                      name="password"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Confirm Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                    <input
                      type="password"
                      required
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Personal & Guardian */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Primary Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                    <input
                      type="tel"
                      required
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Date of Birth <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                    <input
                      type="date"
                      required
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-bold focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Alternate Phone Number
                  </label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    placeholder="Optional secondary number"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Parent / Guardian Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="parentName"
                    placeholder="e.g. Suresh Kumar"
                    value={formData.parentName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Parent / Guardian Contact <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="parentPhone"
                    placeholder="Parent mobile number"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Address & Location */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  Permanent / Residential Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-black" />
                  <textarea
                    required
                    rows={2}
                    name="address"
                    placeholder="House / Flat No, Street, Landmark"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    City <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    placeholder="e.g. Hyderabad / Vijayawada"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    State <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    placeholder="e.g. Telangana / Andhra Pradesh"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Pincode <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    placeholder="e.g. 500001"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Intermediate Academics */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  Target Grade & Subject Stream <span className="text-rose-600">*</span>
                </label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-bold focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                >
                  <option value="Class 11 (+1) - MPC (Maths, Physics, Chem)">Class 11 (+1) - MPC (Maths, Physics, Chemistry)</option>
                  <option value="Class 11 (+1) - BiPC (Biology, Physics, Chem)">Class 11 (+1) - BiPC (Biology, Physics, Chemistry)</option>
                  <option value="Class 12 (+2) - MPC (Maths, Physics, Chem)">Class 12 (+2) - MPC (Maths, Physics, Chemistry)</option>
                  <option value="Class 12 (+2) - BiPC (Biology, Physics, Chem)">Class 12 (+2) - BiPC (Biology, Physics, Chemistry)</option>
                  <option value="JEE Main & Advanced 2-Year Integrated">JEE Main & Advanced (2-Year Integrated)</option>
                  <option value="NEET UG Medical 2-Year Integrated">NEET UG Medical (2-Year Integrated)</option>
                  <option value="Repeater / Dropper Target Batch">Repeater / Dropper Target Batch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  School / Junior College Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <input
                    type="text"
                    required
                    name="collegeName"
                    placeholder="e.g. Sri Chaitanya / Narayana / Kendriya Vidyalaya / DPS"
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-medium focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  Intermediate Exam Passing Year <span className="text-rose-600">*</span>
                </label>
                <select
                  name="passingYear"
                  value={formData.passingYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 text-black text-sm font-bold focus:outline-none focus:border-[#ff693b] focus:ring-4 focus:ring-orange-100"
                >
                  {['2028', '2027', '2026', '2025', '2024'].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-orange-100 flex items-center justify-between">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-2xl text-sm font-black text-black bg-slate-200 border-2 border-slate-300 hover:bg-slate-300 transition cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {activeStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-2xl text-sm font-black text-white bg-[#ff693b] hover:bg-[#ea580c] transition shadow-md shadow-orange-500/25 flex items-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-2xl text-sm font-black text-white bg-[#ff693b] hover:bg-[#ea580c] transition shadow-md shadow-orange-500/25 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Creating Student Profile...' : 'Complete Enrollment Registration'}
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-black font-semibold">
          Already registered?{' '}
          <Link to="/login" className="font-black text-[#ff693b] hover:text-[#ea580c] underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
