import { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar(){
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) =>
    `navbar-link ${isActive ? 'navbar-link--active' : ''}`;
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return(
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span className="navbar-logo-icon">
            <svg viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
              <line x1="8" y1="9" x2="16" y2="9"/>
              <line x1="8" y1="13" x2="13" y2="13"/>
            </svg>
          </span>

          <span className="navbar-logo-text"> Inflingo</span>
        </NavLink>

        <nav className={`navbar-links ${isOpen ? 'navbar-links--open' : ''}`}>
          <NavLink to="/" end className={linkClass} onClick={() => setIsOpen(false)}> Home </NavLink>
          <NavLink to="/categories/academics" className={linkClass} onClick={() => setIsOpen(false)}> Categories </NavLink>
          <NavLink to="/saved" className={linkClass} onClick={() => setIsOpen(false)}>Saved</NavLink>
          {isAuthenticated && (
            <NavLink to="/admin" className={linkClass} onClick={() => setIsOpen(false)}>Admin</NavLink>
          )}

          {/* Mobile-only auth action, shown inside the dropdown */}
          {isAuthenticated ? (
            <button className="navbar-link navbar-link--mobile-cta" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <NavLink to="/login" className="navbar-link navbar-link--mobile-cta" onClick={() => setIsOpen(false)}>
              Sign In
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <button className="navbar-cta" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <NavLink to="/login" className="navbar-cta">Sign In</NavLink>
          )}

          <button className="navbar-toggle"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;