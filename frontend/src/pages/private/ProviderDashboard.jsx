import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../css/dashboard.css';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myVehicles, setMyVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: 'Bike',
    price: '',
    specs: '',
  });

  // Helper function to get image path
  const getVehicleImage = (vehicleName) => {
    const imageMap = {
      'Royal Enfield Himalayan': '/images/royalenfield himalayan.png',
      'Mahindra Thar': '/images/mahindrathar.png',
      'KTM Duke 390': '/images/ktmduke390.png',
      'Honda Activa': '/images/hondaactiva.png',
      'Maruti Suzuki Swift': '/images/marutisuzukiswift.png',
    };
    return imageMap[vehicleName] || '/images/background_image.png';
  };

  // Sample data (replace with API call later)
  useEffect(() => {
    const sampleVehicles = [
      {
        id: 1,
        name: 'Royal Enfield Himalayan',
        type: 'Bike',
        price: 1500,
        image: '/images/royalenfield himalayan.png',
        available: true,
        specs: '411cc, Adventure Bike',
        totalBookings: 12,
        revenue: 18000,
      },
      {
        id: 2,
        name: 'KTM Duke 390',
        type: 'Bike',
        price: 1800,
        image: '/images/ktmduke390.png',
        available: true,
        specs: '373cc, Sport Bike',
        totalBookings: 8,
        revenue: 14400,
      },
      {
        id: 3,
        name: 'Honda Activa',
        type: 'Scooter',
        price: 800,
        image: '/images/hondaactiva.png',
        available: false,
        specs: '110cc, Automatic',
        totalBookings: 15,
        revenue: 12000,
      },
    ];
    setMyVehicles(sampleVehicles);

    const sampleBookings = [
      {
        id: 1,
        customerName: 'John Doe',
        vehicleName: 'Royal Enfield Himalayan',
        bookingDate: '2026-01-10',
        returnDate: '2026-01-13',
        status: 'Confirmed',
        amount: 4500,
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        vehicleName: 'KTM Duke 390',
        bookingDate: '2026-01-12',
        returnDate: '2026-01-14',
        status: 'Pending',
        amount: 3600,
      },
    ];
    setBookings(sampleBookings);
  }, []);

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const vehicle = {
      id: Date.now(),
      ...newVehicle,
      price: parseFloat(newVehicle.price),
      image: getVehicleImage(newVehicle.name) || '/images/background_image.png',
      available: true,
      totalBookings: 0,
      revenue: 0,
    };
    setMyVehicles([...myVehicles, vehicle]);
    setShowAddVehicleModal(false);
    setNewVehicle({ name: '', type: 'Bike', price: '', specs: '' });
  };

  const toggleAvailability = (id) => {
    setMyVehicles(
      myVehicles.map((v) => (v.id === id ? { ...v, available: !v.available } : v))
    );
  };

  const stats = {
    totalVehicles: myVehicles.length,
    activeBookings: bookings.filter((b) => b.status === 'Confirmed').length,
    totalRevenue: myVehicles.reduce((sum, v) => sum + v.revenue, 0),
    availableVehicles: myVehicles.filter((v) => v.available).length,
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Provider Dashboard </h1>
          <p className="header-subtitle">
            {user?.companyName || 'Your Company'} - Manage your fleet
          </p>
        </div>
        <div className="user-badge provider-badge">
          <span className="badge-icon"></span>
          <span className="badge-text">Provider</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            
          </div>
          <div className="stat-content">
            <h3>{stats.totalVehicles}</h3>
            <p>Total Vehicles</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            
          </div>
          <div className="stat-content">
            <h3>{stats.activeBookings}</h3>
            <p>Active Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            
          </div>
          <div className="stat-content">
            <h3>{stats.availableVehicles}</h3>
            <p>Available Now</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* My Vehicles Section */}
        <div className="main-section">
          <div className="section-header">
            <h2>My Vehicles</h2>
            <button
              className="btn-add-vehicle"
              onClick={() => setShowAddVehicleModal(true)}
            >
              + Add Vehicle
            </button>
          </div>

          <div className="vehicles-grid">
            {myVehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card provider-vehicle">
                <div className="vehicle-image-container">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="vehicle-image"
                    onError={(e) => {
                      e.target.src = '/images/background_image.png';
                    }}
                  />
                </div>
                <div className="vehicle-info">
                  <div className="vehicle-header-row">
                    <h3>{vehicle.name}</h3>
                    <span className={`availability-badge ${vehicle.available ? 'available' : 'unavailable'}`}>
                      {vehicle.available ? '✓ Available' : '✗ Rented'}
                    </span>
                  </div>
                  <p className="vehicle-specs">{vehicle.specs}</p>
                  <div className="vehicle-stats-row">
                    <div className="stat-item">
                      <span className="stat-label">Bookings</span>
                      <span className="stat-value">{vehicle.totalBookings}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Revenue</span>
                      <span className="stat-value">₹{vehicle.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="vehicle-footer">
                    <div className="vehicle-price">
                      <span className="price-label">₹{vehicle.price}</span>
                      <span className="price-period">/day</span>
                    </div>
                    <div className="vehicle-actions">
                      <button
                        className="btn-toggle"
                        onClick={() => toggleAvailability(vehicle.id)}
                        title={vehicle.available ? 'Mark as unavailable' : 'Mark as available'}
                      >
                        {vehicle.available ? '🔓' : '🔒'}
                      </button>
                      <button className="btn-edit" title="Edit vehicle">
                        
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {myVehicles.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>No vehicles yet</h3>
              <p>Add your first vehicle to start earning</p>
              <button
                className="btn-primary"
                onClick={() => setShowAddVehicleModal(true)}
              >
                Add Vehicle
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar-section">
          {/* Recent Bookings */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Recent Bookings</h3>
            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <span className="booking-customer">{booking.customerName}</span>
                      <span className={`booking-status status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-vehicle-name">{booking.vehicleName}</div>
                    <div className="booking-dates">
                      <span> {booking.bookingDate}</span>
                      <span>→</span>
                      <span>{booking.returnDate}</span>
                    </div>
                    <div className="booking-cost">₹{booking.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-bookings">
                <p>No bookings yet</p>
                <span className="empty-icon">📋</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="quick-actions">
              <button
                className="action-btn"
                onClick={() => setShowAddVehicleModal(true)}
              >
                <span>➕</span>
                Add Vehicle
              </button>
              <button className="action-btn">
                <span></span>
                View Reports
              </button>
              <button className="action-btn">
                <span></span>
                Company Profile
              </button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="sidebar-card help-card">
            <div className="help-icon"></div>
            <h4>Pro Tip</h4>
            <p>Keep your vehicles well-maintained and available to maximize bookings</p>
          </div>
        </div>
      </div>

      {/* Homepage CTA */}
      <section className="homepage-cta">
        <div className="cta-text">
          <h2>Showcase on the homepage</h2>
          <p>Visit the homepage to see how your vehicles appear to customers and adjust your offerings.</p>
          <div className="cta-actions">
            <button className="btn-primary" onClick={() => navigate('/')}>Go to homepage</button>
            <button className="btn-secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button>
          </div>
        </div>
        <div className="cta-visual"></div>
      </section>

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="modal-overlay" onClick={() => setShowAddVehicleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Vehicle</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddVehicleModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddVehicle}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Vehicle Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Royal Enfield Himalayan"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Vehicle Type *</label>
                  <select
                    className="form-control"
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                    required
                  >
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Car">Car</option>
                    <option value="SUV">SUV</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price per Day (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g., 1500"
                    value={newVehicle.price}
                    onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Specifications *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., 411cc, Adventure Bike"
                    value={newVehicle.specs}
                    onChange={(e) => setNewVehicle({ ...newVehicle, specs: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddVehicleModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
