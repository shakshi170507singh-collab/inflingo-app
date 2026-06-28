import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const API = 'http://localhost:3000/api';

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
      return { success: true };
    } catch (err) {
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

      // Save token and full user info
      localStorage.setItem('inflingo-token', data.token);
      localStorage.setItem('inflingo-user', JSON.stringify({
        name: data.name,
        email,
        role: data.role,
        course: data.course,
        department: data.department,
        year: data.year
      }));
      setCurrentUser({
        name: data.name,
        email,
        role: data.role,
        course: data.course,
        department: data.department,
        year: data.year
      });
      return { success: true };
    } catch (err) {
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