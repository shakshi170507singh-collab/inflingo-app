import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNotices } from '../context/NoticesContext';
import { CATEGORIES } from '../data/notices';
import './AdminPage.css';

const COURSES = ['BCA', 'B.Sc', 'BBA', 'B.Com', 'B.A', 'M.Sc', 'MCA', 'MBA', 'M.A'];
const YEARS = ['1', '2', '3'];

const emptyForm = {
  title: '',
  content: '',
  category: 'academics',
  source: '',
  targetCourses: [],
  targetYears: [],
};

function StudentView({ notices, currentUser, logout }) {
  const navigate = useNavigate();

  const counts = CATEGORIES.reduce((acc, c) => {
    acc[c.key] = notices.filter((n) => n.category === c.key).length;
    return acc;
  }, {});

  const analyticsCards = [
    { label: 'Total',      value: notices.length,        mod: 'purple' },
    { label: 'Exams',      value: counts.exams      ?? 0, mod: 'orange' },
    { label: 'Events',     value: counts.events     ?? 0, mod: 'green'  },
    { label: 'Placements', value: counts.placements ?? 0, mod: 'blue'   },
  ];

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>My Notices</h1>
          <p className="admin-subtitle">Welcome, {currentUser?.name || currentUser?.email}</p>
        </div>
        <button className="admin-logout" onClick={logout}>Log out</button>
      </div>

      <div className="admin-analytics">
        {analyticsCards.map((a) => (
          <div key={a.label} className={`analytics-card analytics-card--${a.mod}`}>
            <span className="label">{a.label}</span>
            <span className="value">{a.value}</span>
          </div>
        ))}
      </div>

      <div className="admin-list" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2>All notices ({notices.length})</h2>
        {notices.length === 0 ? (
          <div className="admin-empty">No notices posted yet</div>
        ) : (
          <ul className="admin-notice-list">
            {notices.map((n) => (
              <li
                key={n.id}
                className={`admin-notice-row admin-notice-row--${n.category}`}
                onClick={() => navigate(`/notice/${n.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="admin-notice-category">{n.category}</span>
                  <p className="admin-notice-title">{n.title}</p>
                  <p className="admin-notice-date">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function AdminView({ notices, loading, error, currentUser, logout }) {
  const { addNotice, deleteNotice } = useNotices();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleCourse = (course) => {
    setForm((prev) => {
      const has = prev.targetCourses.includes(course);
      return {
        ...prev,
        targetCourses: has
          ? prev.targetCourses.filter((c) => c !== course)
          : [...prev.targetCourses, course],
      };
    });
  };

  const toggleYear = (year) => {
    setForm((prev) => {
      const has = prev.targetYears.includes(year);
      return {
        ...prev,
        targetYears: has
          ? prev.targetYears.filter((y) => y !== year)
          : [...prev.targetYears, year],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setErrorMsg('Title and content are required.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const result = await addNotice({
        title: form.title,
        content: form.content,
        category: form.category,
        targetCourses: form.targetCourses.length > 0 ? form.targetCourses : ['ALL'],
        targetDepartment: 'ALL',
        targetYears: form.targetYears.length > 0 ? form.targetYears : ['ALL'],
      });
      if (result?.id) {
        setForm(emptyForm);
        setStatus('success');
        setTimeout(() => setStatus(null), 2500);
      } else {
        throw new Error(result?.error || 'Failed to publish');
      }
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const counts = CATEGORIES.reduce((acc, c) => {
    acc[c.key] = notices.filter((n) => n.category === c.key).length;
    return acc;
  }, {});

  const analyticsCards = [
    { label: 'Total',      value: notices.length,         mod: 'purple' },
    { label: 'Exams',      value: counts.exams      ?? 0, mod: 'orange' },
    { label: 'Events',     value: counts.events     ?? 0, mod: 'green'  },
    { label: 'Placements', value: counts.placements  ?? 0, mod: 'blue'  },
  ];

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">
            Signed in as {currentUser?.name || currentUser?.email}
          </p>
        </div>
        <button className="admin-logout" onClick={logout}>Log out</button>
      </div>

      <div className="admin-analytics">
        {analyticsCards.map((a) => (
          <div key={a.label} className={`analytics-card analytics-card--${a.mod}`}>
            <span className="label">{a.label}</span>
            <span className="value">{a.value}</span>
          </div>
        ))}
      </div>

      <div className="admin-layout">
        {/* Post form */}
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>Post a new notice</h2>

          {status === 'success' && (
            <div className="admin-success">✅ Notice published!</div>
          )}
          {status === 'error' && (
            <div className="admin-error">❌ {errorMsg}</div>
          )}

          <label className="admin-field">
            <span>Title</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Notice title"
              required
            />
          </label>

          <label className="admin-field">
            <span>Category</span>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Content</span>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Full notice text — dates, venue, links, contacts..."
              rows={7}
            />
          </label>

          <div className="admin-targeting">
            <div className="targeting-header">
              <span className="targeting-title">Target courses</span>
              <span className="targeting-preview">
                {form.targetCourses.length > 0 ? form.targetCourses.join(', ') : 'Everyone'}
              </span>
            </div>
            <div className="target-chips">
              {COURSES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`target-chip ${form.targetCourses.includes(c) ? 'target-chip--active' : ''}`}
                  onClick={() => toggleCourse(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-targeting">
            <div className="targeting-header">
              <span className="targeting-title">Target years</span>
              <span className="targeting-preview">
                {form.targetYears.length > 0 ? `Year ${form.targetYears.join(', ')}` : 'Everyone'}
              </span>
            </div>
            <div className="target-chips">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={`target-chip ${form.targetYears.includes(y) ? 'target-chip--active' : ''}`}
                  onClick={() => toggleYear(y)}
                >
                  Year {y}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="admin-submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Publishing...' : 'Publish notice'}
          </button>
        </form>

        {/* Notice list */}
        <div className="admin-list">
          <h2>All notices ({notices.length})</h2>

          {loading ? (
            <div className="admin-empty">Loading notices...</div>
          ) : error ? (
            <div className="admin-error">⚠️ {error}</div>
          ) : notices.length === 0 ? (
            <div className="admin-empty">No notices posted yet</div>
          ) : (
            <ul className="admin-notice-list">
              {notices.map((n) => (
                <li
                  key={n.id}
                  className={`admin-notice-row admin-notice-row--${n.category}`}
                >
                  <div
                    style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                    onClick={() => navigate(`/notice/${n.id}`)}
                  >
                    <span className="admin-notice-category">{n.category}</span>
                    <p className="admin-notice-title">{n.title}</p>
                    <p className="admin-notice-audience">
                      {n.targetCourses?.includes('ALL')
                        ? '👥 Everyone'
                        : `🎯 ${n.targetCourses?.join(', ')}${n.targetYears && !n.targetYears.includes('ALL') ? ` · Year ${n.targetYears.join(', ')}` : ''}`}
                    </p>
                    <p className="admin-notice-date">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="admin-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotice(n.id);
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

function AdminPage() {
  const { currentUser, logout } = useAuth();
  const { notices, loading, error } = useNotices();

  const isAdmin = ['admin', 'cr', 'event_manager'].includes(currentUser?.role);

  return (
    <>
      <Navbar />
      {isAdmin
        ? <AdminView notices={notices} loading={loading} error={error} currentUser={currentUser} logout={logout} />
        : <StudentView notices={notices} currentUser={currentUser} logout={logout} />
      }
    </>
  );
}

export default AdminPage;