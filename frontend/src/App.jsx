import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCoursesPage from './pages/student/StudentCoursesPage';
import CourseClassroomPage from './pages/student/CourseClassroomPage';
import StudentPaymentsPage from './pages/student/StudentPaymentsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminBatchesPage from './pages/admin/AdminBatchesPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminContentPage from './pages/admin/AdminContentPage';

const AppLayout = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password';

  const isDashboardRoute =
    location.pathname.startsWith('/student') || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Show Navbar on non-dashboard or public pages */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Sidebar inside authenticated dashboard pages */}
        {isDashboardRoute && isAuthenticated && (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        )}

        {/* Content Area */}
        <main className={`flex-1 ${isDashboardRoute ? 'p-4 sm:p-8 max-w-7xl mx-auto w-full' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/courses" element={<CourseCatalogPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Student Portal Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Navigate to="/student/dashboard" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/classroom/:courseId"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <CourseClassroomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/payments"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentPaymentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Portal Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Navigate to="/admin/dashboard" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/batches"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminBatchesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminPaymentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminContentPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Footer (shown on public pages) */}
      {!isDashboardRoute && !isAuthPage && <Footer />}
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
};

export default App;
