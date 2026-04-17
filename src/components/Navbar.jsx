import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar({ onAuthClick }) {
  const { isLoggedIn, user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-strong" id="main-navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          <div className="navbar__logo-wrapper">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="navbar__logo-svg">
              <path d="M16 2L2 26H30L16 2Z" fill="url(#logo-grad-1)" fillOpacity="0.8" />
              <path d="M16 8L7 23H25L16 8Z" fill="url(#logo-grad-2)" />
              <defs>
                <linearGradient id="logo-grad-1" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--accent-cyan)" />
                  <stop offset="1" stopColor="var(--accent-magenta)" />
                </linearGradient>
                <linearGradient id="logo-grad-2" x1="16" y1="8" x2="16" y2="23" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fff" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="navbar__name">Altezza</span>
        </Link>

        <div className="navbar__links">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="navbar__link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Dashboard
              </Link>
              <div className="navbar__user">
                <div className="navbar__avatar">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="navbar__username">{user?.name}</span>
              </div>
              <button className="navbar__logout" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </>
          ) : (
            <button className="navbar__auth-btn btn-primary" onClick={onAuthClick}>
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
