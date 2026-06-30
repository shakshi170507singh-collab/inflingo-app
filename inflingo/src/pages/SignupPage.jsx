import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const COURSES = ['BSc', 'BCA', 'BCom', 'BBA', 'BA', 'MSc', 'MCA', 'MBA', 'MA'];
const YEARS_UG = ['1', '2', '3'];
const YEARS_PG = ['1', '2'];
const PG_COURSES = ['MSc', 'MCA', 'MBA', 'MA'];

function SignupPage() {
  const { signup, adminSignup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: 'student', course: '', department: '', year: '',
    adminKey: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const years = PG_COURSES.includes(form.course) ? YEARS_PG : YEARS_UG;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.role === 'student') {
      if (!form.course) return setError('Please select your course.');
      if (!form.department) return setError('Please enter your department.');
      if (!form.year) return setError('Please select your year.');
    }

    if (form.role === 'admin' && !form.adminKey) {
      return setError('Admin key is required.');
    }

    setLoading(true);

    let result;
    if (form.role === 'admin') {
      result = await adminSignup({
        name: form.name,
        email: form.email,
        password: form.password,
        adminKey: form.adminKey,
      });
    } else {
      result = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        course: form.course,
        department: form.department,
        year: form.year,
      });
    }

    setLoading(false);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-logo">
          <span className="auth-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              <line x1="8" y1="9" x2="16" y2="9" />
              <line x1="8" y1="13" x2="13" y2="13" />
            </svg>
          </span>
          <span className="auth-logo-text">Inflingo</span>
        </Link>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Track notices that matter to you.</p>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Name */}
          <label className="auth-field">
            <span>Name</span>
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange} placeholder="Your full name" required
            />
          </label>

          {/* Email */}
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@college.edu" required
            />
          </label>

          {/* Password */}
          <label className="auth-field">
            <span>Password</span>
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="At least 6 characters"
              required minLength={6}
            />
          </label>

          {/* Role */}
          <div className="auth-field">
            <span>I am a</span>
            <div className="role-options">
              <button
                type="button"
                className={`role-btn ${form.role === 'student' ? 'role-btn--active' : ''}`}
                onClick={() => setForm((p) => ({ ...p, role: 'student', course: '', year: '', department: '' }))}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className={`role-btn ${form.role === 'admin' ? 'role-btn--active' : ''}`}
                onClick={() => setForm((p) => ({ ...p, role: 'admin', course: '', year: '', department: '' }))}
              >
                📢 Admin
              </button>
            </div>
          </div>

          {/* Student fields */}
          {form.role === 'student' && (
            <>
              {/* Course */}
              <div className="auth-field">
                <span>Course</span>
                <div className="chip-grid">
                  {COURSES.map((c) => (
                    <button
                      key={c} type="button"
                      className={`chip ${form.course === c ? 'chip--active' : ''}`}
                      onClick={() => setForm((p) => ({ ...p, course: c, year: '' }))}
                    >{c}</button>
                  ))}
                </div>
              </div>

              {/* Department */}
              <label className="auth-field">
                <span>Department / Specialization</span>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science, Maths, AI/ML"
                  required
                />
              </label>

              {/* Year */}
              {form.course && (
                <div className="auth-field">
                  <span>Year</span>
                  <div className="chip-grid">
                    {years.map((y) => (
                      <button
                        key={y} type="button"
                        className={`chip ${form.year === y ? 'chip--active' : ''}`}
                        onClick={() => setForm((p) => ({ ...p, year: y }))}
                      >{y === '1' ? '1st Year' : y === '2' ? '2nd Year' : '3rd Year'}</button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Admin key */}
          {form.role === 'admin' && (
            <label className="auth-field">
              <span>Admin Secret Key</span>
              <input
                type="password"
                name="adminKey"
                value={form.adminKey}
                onChange={handleChange}
                placeholder="Enter admin key"
                required
              />
            </label>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}

export default SignupPage;