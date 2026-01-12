import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../css/dashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [myBookings, setMyBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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

  // Sample vehicle data (replace with API call later)
  useEffect(() => {
    const sampleVehicles = [
      {
        id: 1,
        name: 'Royal Enfield Himalayan',
        type: 'Bike',
        price: 1500,
        image: getVehicleImage('Royal Enfield Himalayan'),
        available: true,
        provider: 'Mountain Rides',
        specs: '411cc, Adventure Bike',
      },
      {
        id: 2,
        name: 'Mahindra Thar',
        type: 'SUV',
        price: 5000,
        image: '/images/mahindrathar.png',
        available: true,
        provider: 'Himalayan Rentals',
        specs: '4WD, 5 Seater',
      },
      {
        id: 3,
        name: 'KTM Duke 390',
        type: 'Bike',
        price: 1800,
        image: '/images/ktmduke390.png',
        available: true,
        provider: 'Speed Wheels',
        specs: '373cc, Sport Bike',
      },
      {
        id: 4,
        name: 'Toyota Fortuner',
        type: 'SUV',
        price: 7000,
        image: '/images/background_image.png',
        available: false,
        provider: 'Premium Auto',
        specs: '4WD, 7 Seater',
      },
      {
        id: 5,
        name: 'Honda Activa',
        type: 'Scooter',
        price: 800,
        image: '/images/hondaactiva.png',
        available: true,
        provider: 'City Rentals',
        specs: '110cc, Automatic',
      },
      {
        id: 6,
        name: 'Maruti Suzuki Swift',
        type: 'Car',
        price: 3000,
        image: '/images/marutisuzukiswift.png',
        available: true,
        provider: 'Easy Drives',
        specs: 'Manual, 5 Seater',
      },
    ];
    setVehicles(sampleVehicles);

    // Sample bookings
    const sampleBookings = [
      {
        id: 1,
        vehicleName: 'Royal Enfield Himalayan',
        bookingDate: '2026-01-05',
        returnDate: '2026-01-08',
        status: 'Active',
        totalCost: 4500,
      },
    ];
    setMyBookings(sampleBookings);
  }, []);

  const handleBookNow = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowBookingModal(true);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || vehicle.type === filterType;
    return matchesSearch && matchesFilter && vehicle.available;
  });

  const stats = {
    activeBookings: myBookings.filter((b) => b.status === 'Active').length,
    totalSpent: myBookings.reduce((sum, b) => sum + b.totalCost, 0),
    availableVehicles: vehicles.filter((v) => v.available).length,
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome Back, {user?.fullName}! 👋</h1>
          <p className="header-subtitle">Find your perfect ride for the next adventure</p>
        </div>
        <div className="user-badge customer-badge">
          <span className="badge-icon">👤</span>
          <span className="badge-text">Customer</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            📅
          </div>
          <div className="stat-content">
            <h3>{stats.activeBookings}</h3>
            <p>Active Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            💰
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalSpent.toLocaleString()}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            🚗
          </div>
          <div className="stat-content">
            <h3>{stats.availableVehicles}</h3>
            <p>Available Vehicles</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search vehicles by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterType === 'Bike' ? 'active' : ''}`}
            onClick={() => setFilterType('Bike')}
          >
            🏍️ Bikes
          </button>
          <button
            className={`filter-btn ${filterType === 'Car' ? 'active' : ''}`}
            onClick={() => setFilterType('Car')}
          >
            🚗 Cars
          </button>
          <button
            className={`filter-btn ${filterType === 'SUV' ? 'active' : ''}`}
            onClick={() => setFilterType('SUV')}
          >
            🚙 SUVs
          </button>
          <button
            className={`filter-btn ${filterType === 'Scooter' ? 'active' : ''}`}
            onClick={() => setFilterType('Scooter')}
          >
            🛵 Scooters
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Available Vehicles */}
        <div className="main-section">
          <div className="section-header">
            <h2>Available Vehicles</h2>
            <span className="section-badge">{filteredVehicles.length} vehicles</span>
          </div>

          <div className="vehicles-grid">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
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
                  <h3>{vehicle.name}</h3>
                  <p className="vehicle-provider">by {vehicle.provider}</p>
                  <p className="vehicle-specs">{vehicle.specs}</p>
                  <div className="vehicle-footer">
                    <div className="vehicle-price">
                      <span className="price-label">₹{vehicle.price}</span>
                      <span className="price-period">/day</span>
                    </div>
                    <button
                      className="btn-book-now"
                      onClick={() => handleBookNow(vehicle)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No vehicles found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar-section">
          {/* My Bookings */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">My Bookings</h3>
            {myBookings.length > 0 ? (
              <div className="bookings-list">
                {myBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <span className="booking-vehicle">{booking.vehicleName}</span>
                      <span className={`booking-status status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-dates">
                      <span>📅 {booking.bookingDate}</span>
                      <span>→</span>
                      <span>{booking.returnDate}</span>
                    </div>
                    <div className="booking-cost">₹{booking.totalCost.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-bookings">
                <p>No active bookings</p>
                <span className="empty-icon">📋</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-btn">
                <span>📜</span>
                Booking History
              </button>
              <button className="action-btn">
                <span>👤</span>
                My Profile
              </button>
              <button className="action-btn">
                <span>💬</span>
                Support
              </button>
            </div>
          </div>

          {/* Help Card */}
          <div className="sidebar-card help-card">
            <div className="help-icon">💡</div>
            <h4>Need Help?</h4>
            <p>Contact our support team for assistance</p>
            <button className="btn-help">Get Support</button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedVehicle && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book {selectedVehicle.name}</h2>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="vehicle-preview">
                <img 
                  src={selectedVehicle.image} 
                  alt={selectedVehicle.name}
                  className="preview-image"
                  onError={(e) => {
                    e.target.src = '/images/background_image.png';
                  }}
                />
                <div className="preview-info">
                  <h3>{selectedVehicle.name}</h3>
                  <p>{selectedVehicle.specs}</p>
                  <p className="preview-provider">Provider: {selectedVehicle.provider}</p>
                </div>
              </div>
              <div className="booking-form">
                <div className="form-group">
                  <label>Pickup Date</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="form-group">
                  <label>Return Date</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="price-summary">
                  <div className="summary-row">
                    <span>Price per day</span>
                    <span>₹{selectedVehicle.price}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Estimated Total</span>
                    <span>₹{selectedVehicle.price}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowBookingModal(false)}>
                Cancel
              </button>
              <button className="btn-primary">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
