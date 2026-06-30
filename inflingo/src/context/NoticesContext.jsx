import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NoticesContext = createContext(null);
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('inflingo-token');

export function NoticesProvider({ children }) {
  const { currentUser } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotices = useCallback(() => {
    const token = getToken();
    if (!token) {
      setNotices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API}/notices`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNotices(data);
        } else {
          setError('Failed to load notices');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch notices:', err);
        setError('Network error');
        setLoading(false);
      });
  }, []);

  // Re-fetch whenever the logged-in user changes (login/logout)
  useEffect(() => {
    fetchNotices();
  }, [currentUser, fetchNotices]);

  const addNotice = async (notice) => {
    const res = await fetch(`${API}/notices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(notice),
    });
    const newNotice = await res.json();
    if (res.ok) {
      setNotices((prev) => [newNotice, ...prev]);
      return newNotice;
    }
    // surface backend error message instead of returning a broken "success" object
    return { error: newNotice?.error || 'Failed to publish notice' };
  };

  const deleteNotice = async (id) => {
    const res = await fetch(`${API}/notices/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } else {
      console.error('Failed to delete notice');
    }
  };

  return (
    <NoticesContext.Provider
      value={{ notices, loading, error, addNotice, deleteNotice, refetch: fetchNotices }}
    >
      {children}
    </NoticesContext.Provider>
  );
}

export function useNotices() {
  const context = useContext(NoticesContext);
  if (!context) throw new Error('useNotices must be used within a NoticesProvider');
  return context;
}