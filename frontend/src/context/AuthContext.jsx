import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('edumanage_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('edumanage_user');
    const savedToken = localStorage.getItem('edumanage_token');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data) {
      const authData = response.data;
      setToken(authData.token);
      setUser(authData);
      localStorage.setItem('edumanage_token', authData.token);
      localStorage.setItem('edumanage_user', JSON.stringify(authData));
      return authData;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (registrationData) => {
    const response = await api.post('/auth/register', registrationData);
    if (response.success && response.data) {
      const authData = response.data;
      setToken(authData.token);
      setUser(authData);
      localStorage.setItem('edumanage_token', authData.token);
      localStorage.setItem('edumanage_user', JSON.stringify(authData));
      return authData;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('edumanage_token');
    localStorage.removeItem('edumanage_user');
  };

  const updateCurrentUser = (updatedProfile) => {
    if (user) {
      const newUser = {
        ...user,
        fullName: updatedProfile.fullName || user.fullName,
        profilePhotoUrl: updatedProfile.profilePhotoUrl || user.profilePhotoUrl,
        profile: updatedProfile,
      };
      setUser(newUser);
      localStorage.setItem('edumanage_user', JSON.stringify(newUser));
    }
  };

  const role = user?.role ? user.role.replace('ROLE_', '') : null;

  const value = {
    user,
    token,
    loading,
    role,
    isAuthenticated: !!token && !!user,
    isAdmin: role === 'ADMIN',
    isStudent: role === 'STUDENT',
    login,
    register,
    logout,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
