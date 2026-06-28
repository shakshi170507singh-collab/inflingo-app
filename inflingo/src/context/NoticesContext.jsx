import { createContext, useContext, useState, useEffect } from 'react';

const NoticesContext = createContext(null);
const API = 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('inflingo-token');

export function NoticesProvider({ children }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API}/notices`, {
      headers: { Authorization: `Bearer ${token}` }
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

  const addNotice = async (notice) => {
    const res = await fetch(`${API}/notices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(notice),
    });
    const newNotice = await res.json();
    if (res.ok) setNotices((prev) => [newNotice, ...prev]);
    return newNotice;
  };

  const deleteNotice = async (id) => {
    await fetch(`${API}/notices/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const refetch = () => {
    setLoading(true);
    const token = getToken();
    fetch(`${API}/notices`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <NoticesContext.Provider value={{
      notices, loading, error, addNotice, deleteNotice, refetch
    }}>
      {children}
    </NoticesContext.Provider>
  );
}

export function useNotices() {
  const context = useContext(NoticesContext);
  if (!context) throw new Error('useNotices must be used within a NoticesProvider');
  return context;
}