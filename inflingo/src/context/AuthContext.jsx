import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = localStorage.getItem('inflingo-token');
      const user = localStorage.getItem('inflingo-user');
      return token && user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  const signup = async ({ name, email, password, course, department, year }) => {
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, course, department, year: parseInt(year) }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error };

      // auto-login after signup
      const user = {
        name: data.name || name,
        email,
        role: data.role || 'student',
        course: data.course || course,
        department: data.department || department,
        year: data.year || year,
      };
      localStorage.setItem('inflingo-token', data.token);
      localStorage.setItem('inflingo-user', JSON.stringify(user));
      setCurrentUser(user);

      return { success: true };
    } catch {
      return { success: false, message: 'Something went wrong' };
    }
  };

  // ADMIN SIGNUP — mirrors signup(), but hits /auth/admin-signup and includes adminKey
  const adminSignup = async ({ name, email, password, adminKey }) => {
    try {
      const res = await fetch(`${API}/auth/admin-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, adminKey }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error };

      // auto-login after signup
      const user = {
        name: data.name || name,
        email,
        role: data.role || 'admin',
        course: data.course,
        department: data.department,
        year: data.year,
      };
      localStorage.setItem('inflingo-token', data.token);
      localStorage.setItem('inflingo-user', JSON.stringify(user));
      setCurrentUser(user);

      return { success: true };
    } catch {
      return { success: false, message: 'Something went wrong' };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error };

      const user = {
        name: data.name,
        email,
        role: data.role,
        course: data.course,
        department: data.department,
        year: data.year,
      };
      localStorage.setItem('inflingo-token', data.token);
      localStorage.setItem('inflingo-user', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    } catch {
      return { success: false, message: 'Something went wrong' };
    }
  };

  const logout = () => {
    localStorage.removeItem('inflingo-token');
    localStorage.removeItem('inflingo-user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        isCR: currentUser?.role === 'cr',
        isEventManager: currentUser?.role === 'event_manager',
        canPost: ['admin', 'cr', 'event_manager'].includes(currentUser?.role),
        signup,
        adminSignup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}