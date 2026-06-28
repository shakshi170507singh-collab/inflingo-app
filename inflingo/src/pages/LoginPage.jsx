import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const redirectTo = location.state?.from || '/';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login(form);
  if (result.success) {
    navigate(redirectTo, { replace: true });
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


        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to keep up with your notices.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit">Log in</button>
        </form>

        <p className="auth-switch">
          Do not have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
