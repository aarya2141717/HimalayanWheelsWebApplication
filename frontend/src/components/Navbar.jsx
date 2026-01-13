import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthenticated = Boolean(user);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #40916c 100%)' }}>
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center gap-2" href={isAuthenticated ? '/dashboard' : '/' } style={{ fontWeight: '700', fontSize: '1.3rem' }}>
          🏔️ Himalayan Wheels
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <span className="nav-link d-flex align-items-center gap-2">
                    <span style={{
                      background: 'rgba(255,255,255,0.2)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {user?.role === 'admin' ? '🔐 Admin' : user?.accountType === 'PROVIDER' ? '🏢 Provider' : '👤 Customer'}
                    </span>
                    <strong>{user?.fullName || user?.email}</strong>
                  </span>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/dashboard">
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/feedback">
                    Feedback
                  </a>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/signup">
                    Sign Up
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
