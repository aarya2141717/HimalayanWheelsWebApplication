import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../css/dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    // Sample admin data (replace with API call later)
    setStats({
      totalUsers: 45,
      totalVehicles: 23,
      totalBookings: 128,
      totalRevenue: 1250000,
    });

    setRecentUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', type: 'CUSTOMER', joined: '2026-01-10' },
      { id: 2, name: 'Himalayan Rentals', email: 'rentals@company.com', type: 'PROVIDER', joined: '2026-01-09' },
      { id: 3, name: 'Jane Smith', email: 'jane@example.com', type: 'CUSTOMER', joined: '2026-01-08' },
    ]);

    setRecentBookings([
      { id: 1, customer: 'John Doe', vehicle: 'Royal Enfield Himalayan', amount: 4500, date: '2026-01-10' },
      { id: 2, customer: 'Jane Smith', vehicle: 'KTM Duke 390', amount: 3600, date: '2026-01-09' },
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard </h1>
          <p className="header-subtitle">Manage your entire platform</p>
        </div>
        <div className="user-badge provider-badge">
          <span className="badge-icon"></span>
          <span className="badge-text">Administrator</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            👥
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            
          </div>
          <div className="stat-content">
            <h3>{stats.totalVehicles}</h3>
            <p>Total Vehicles</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            
          </div>
          <div className="stat-content">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Users */}
        <div className="main-section">
          <div className="section-header">
            <h2>Recent Users</h2>
            <button className="btn-add-vehicle">View All Users</button>
          </div>

          <div className="sidebar-card">
            <div className="bookings-list">
              {recentUsers.map((user) => (
                <div key={user.id} className="booking-item">
                  <div className="booking-header">
                    <span className="booking-customer">{user.name}</span>
                    <span className={`booking-status ${user.type === 'PROVIDER' ? 'status-confirmed' : 'status-active'}`}>
                      {user.type}
                    </span>
                  </div>
                  <div className="booking-vehicle-name">{user.email}</div>
                  <div className="booking-dates">
                    <span>Joined: {user.joined}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar-section">
          {/* Recent Bookings */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Recent Bookings</h3>
            {recentBookings.length > 0 ? (
              <div className="bookings-list">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <span className="booking-customer">{booking.customer}</span>
                    </div>
                    <div className="booking-vehicle-name">{booking.vehicle}</div>
                    <div className="booking-dates">
                      <span> {booking.date}</span>
                    </div>
                    <div className="booking-cost">₹{booking.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-bookings">
                <p>No bookings yet</p>
                <span className="empty-icon"></span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Admin Actions</h3>
            <div className="quick-actions">
              <button className="action-btn">
                <span>👥</span>
                Manage Users
              </button>
              <button className="action-btn">
                <span></span>
                Manage Vehicles
              </button>
              <button className="action-btn">
                <span></span>
                View Reports
              </button>
              <button className="action-btn">
                <span></span>
                System Settings
              </button>
            </div>
          </div>

          {/* Admin Info Card */}
          <div className="sidebar-card help-card">
            <div className="help-icon"></div>
            <h4>Admin Access</h4>
            <p>You have full system access to manage all users, vehicles, and bookings.</p>
          </div>
        </div>
      </div>

      {/* Homepage CTA */}
      <section className="homepage-cta">
        <div className="cta-text">
          <h2>Review the public experience</h2>
          <p>Jump back to the homepage to verify branding, featured vehicles, and entry points for new users.</p>
          <div className="cta-actions">
            <button className="btn-primary" onClick={() => navigate('/')}>Go to homepage</button>
            <button className="btn-secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button>
          </div>
        </div>
        <div className="cta-visual">🏔️</div>
      </section>
    </div>
  );
};

export default AdminDashboard;
