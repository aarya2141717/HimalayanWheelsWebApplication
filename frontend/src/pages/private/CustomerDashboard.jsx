import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehicleAPI, bookingAPI } from '../../services/api';
import '../../css/dashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [myBookings, setMyBookings] = useState([]);
  const [stats, setStats] = useState({
    activeBookings: 0,
    totalSpent: 0,
    availableVehicles: 0,
    totalBookings: 0,
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    bookingDate: '',
    returnDate: '',
  });
  const [loading, setLoading] = useState(false);

  // Inline date picker component with visible trigger buttons
  const DatePickers = ({ bookingForm, setBookingForm }) => {
    const startRef = useRef(null);
    const endRef = useRef(null);
    const openStart = () => startRef.current?.showPicker?.();
    const openEnd = () => endRef.current?.showPicker?.();
    return (
      <>
        <div className="form-group">
          <label>Pickup Date</label>
          <div style={{ position: 'relative' }}>
            <input
              ref={startRef}
              type="date"
              className="form-control date-input"
              value={bookingForm.bookingDate}
              onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
            <button type="button" className="date-picker-button" onClick={openStart}>Pick date</button>
          </div>
        </div>
        <div className="form-group">
          <label>Return Date</label>
          <div style={{ position: 'relative' }}>
            <input
              ref={endRef}
              type="date"
              className="form-control date-input"
              value={bookingForm.returnDate}
              onChange={(e) => setBookingForm({ ...bookingForm, returnDate: e.target.value })}
              min={bookingForm.bookingDate || new Date().toISOString().split('T')[0]}
            />
            <button type="button" className="date-picker-button" onClick={openEnd}>Pick date</button>
          </div>
        </div>
      </>
    );
  };

  // Fetch data on mount
  useEffect(() => {
    fetchVehicles();
    fetchBookings();
    fetchStats();
  }, []);

  // Default vehicles (ensure they also appear even if DB is empty)
  const defaultVehicles = [
    { name: 'Royal Enfield Himalayan', type: 'Bike', price: 1500, specs: '411cc, Adventure Bike', description: 'Adventure bike' },
    { name: 'Mahindra Thar', type: 'SUV', price: 5000, specs: '4WD, 5 Seater', description: 'Rugged SUV' },
    { name: 'KTM Duke 390', type: 'Bike', price: 1800, specs: '373cc, Sport Bike', description: 'Performance bike' },
    { name: 'Honda Activa', type: 'Scooter', price: 800, specs: '110cc, Automatic', description: 'City scooter' },
    { name: 'Maruti Suzuki Swift', type: 'Car', price: 3000, specs: 'Manual, 5 Seater', description: 'Compact car' },
  ];

  const fetchVehicles = async () => {
    try {
      const response = await vehicleAPI.getAllVehicles();
      const dbVehicles = response.data || [];
      // Merge defaults + db (avoid duplicates by name)
      const namesInDb = new Set(dbVehicles.map(v => v.name));
      const merged = [
        ...dbVehicles,
        ...defaultVehicles.filter(v => !namesInDb.has(v.name))
      ];
      setVehicles(merged);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getCustomerBookings();
      setMyBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await bookingAPI.getBookingStats();
      const vehicleResponse = await vehicleAPI.getAllVehicles();
      const availableVehicles = vehicleResponse.data?.filter(v => v.available).length || 0;
      
      setStats({
        activeBookings: response.data.activeBookings || 0,
        totalSpent: response.data.totalRevenue || 0,
        availableVehicles: availableVehicles,
        totalBookings: response.data.totalBookings || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getVehicleImageUrl = (vehicle) => {
    if (vehicle?.image) {
      const img = vehicle.image;
      if (typeof img === 'string') {
        if (img.startsWith('http')) return img;
        if (img.startsWith('/uploads')) return `http://localhost:5000${img}`;
        return `http://localhost:5000/uploads/vehicles/${img}`;
      }
    }
    const map = {
      'Royal Enfield Himalayan': '/images/royalenfield himalayan.png',
      'Mahindra Thar': '/images/mahindrathar.png',
      'KTM Duke 390': '/images/ktmduke390.png',
      'Honda Activa': '/images/hondaactiva.png',
      'Maruti Suzuki Swift': '/images/marutisuzukiswift.png',
    };
    return map[vehicle?.name] || '/images/background_image.png';
  };

  const handleBookNow = (vehicle) => {
    setSelectedVehicle(vehicle);
    setBookingForm({
      bookingDate: '',
      returnDate: '',
    });
    setShowBookingModal(true);
  };

  const calculateDays = () => {
    if (bookingForm.bookingDate && bookingForm.returnDate) {
      const start = new Date(bookingForm.bookingDate);
      const end = new Date(bookingForm.returnDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const calculateTotalCost = () => {
    const days = calculateDays();
    return days * (selectedVehicle?.price || 0);
  };

  const handleConfirmBooking = async () => {
    if (!bookingForm.bookingDate || !bookingForm.returnDate) {
      alert('Please select both pickup and return dates');
      return;
    }

    if (new Date(bookingForm.returnDate) <= new Date(bookingForm.bookingDate)) {
      alert('Return date must be after pickup date');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        vehicleId: selectedVehicle.id,
        bookingDate: bookingForm.bookingDate,
        returnDate: bookingForm.returnDate,
        totalCost: calculateTotalCost(),
      };

      await bookingAPI.createBooking(bookingData);
      alert('🎉 Booking created successfully!');
      setShowBookingModal(false);
      fetchBookings();
      fetchStats();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setBookingForm({
      bookingDate: booking.bookingDate?.split('T')[0] || '',
      returnDate: booking.returnDate?.split('T')[0] || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateBooking = async () => {
    if (!bookingForm.bookingDate || !bookingForm.returnDate) {
      alert('Please select both dates');
      return;
    }

    setLoading(true);
    try {
      const days = calculateDays();
      const totalCost = days * (selectedBooking.vehicle?.price || 0);

      await bookingAPI.updateBooking(selectedBooking.id, {
        bookingDate: bookingForm.bookingDate,
        returnDate: bookingForm.returnDate,
        totalCost: totalCost,
      });

      alert('✅ Booking updated successfully!');
      setShowEditModal(false);
      fetchBookings();
      fetchStats();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(error.response?.data?.message || 'Failed to update booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingAPI.cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      fetchBookings();
      fetchStats();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || vehicle.type === filterType;
    return matchesSearch && matchesFilter && vehicle.available;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'status-confirmed';
      case 'Pending':
        return 'status-pending';
      case 'Cancelled':
        return 'status-cancelled';
      case 'Completed':
        return 'status-completed';
      default:
        return 'status-active';
    }
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
            📋
          </div>
          <div className="stat-content">
            <h3>{stats.activeBookings}</h3>
            <p>Active Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
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
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            📊
          </div>
          <div className="stat-content">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
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
                    src={getVehicleImageUrl(vehicle)} 
                    alt={vehicle.name}
                    className="vehicle-image"
                    onError={(e) => {
                      e.target.src = '/images/background_image.png';
                    }}
                  />
                  <span className="vehicle-type-badge">{vehicle.type}</span>
                </div>
                <div className="vehicle-info">
                  <h3>{vehicle.name}</h3>
                  <p className="vehicle-specs">{vehicle.specs || vehicle.description}</p>
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
            <h3 className="sidebar-title">My Bookings ({myBookings.length})</h3>
            {myBookings.length > 0 ? (
              <div className="bookings-list">
                {myBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <span className="booking-vehicle">{booking.vehicle?.name || 'Vehicle'}</span>
                      <span className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-dates">
                      <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                      <span>→</span>
                      <span>{new Date(booking.returnDate).toLocaleDateString()}</span>
                    </div>
                    <div className="booking-cost">₹{booking.totalCost?.toLocaleString() || 0}</div>
                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                      <div className="booking-actions">
                        <button 
                          className="btn-edit-booking"
                          onClick={() => handleEditBooking(booking)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-cancel-booking"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
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
              <button className="action-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <span>🔝</span>
                Back to Top
              </button>
              <button className="action-btn" onClick={() => navigate('/')}>
                <span>🏠</span>
                Homepage
              </button>
              <button className="action-btn" onClick={() => navigate('/feedback')}>
                <span>💬</span>
                Feedback
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
                  src={getVehicleImageUrl(selectedVehicle)} 
                  alt={selectedVehicle.name}
                  className="preview-image"
                  onError={(e) => {
                    e.target.src = '/images/background_image.png';
                  }}
                />
                <div className="preview-info">
                  <h3>{selectedVehicle.name}</h3>
                  <p>{selectedVehicle.specs || selectedVehicle.description}</p>
                  <p className="preview-price">₹{selectedVehicle.price}/day</p>
                </div>
              </div>
              <div className="booking-form">
                <DatePickers 
                  bookingForm={bookingForm} 
                  setBookingForm={setBookingForm} 
                />
                <div className="price-summary">
                  <div className="summary-row">
                    <span>Price per day</span>
                    <span>₹{selectedVehicle.price}</span>
                  </div>
                  <div className="summary-row">
                    <span>Number of days</span>
                    <span>{calculateDays()} days</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Cost</span>
                    <span>₹{calculateTotalCost().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowBookingModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleConfirmBooking}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Booking</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="vehicle-preview">
                <img 
                  src={getVehicleImageUrl(selectedBooking.vehicle)} 
                  alt={selectedBooking.vehicle?.name}
                  className="preview-image"
                  onError={(e) => {
                    e.target.src = '/images/background_image.png';
                  }}
                />
                <div className="preview-info">
                  <h3>{selectedBooking.vehicle?.name}</h3>
                  <p className="preview-price">₹{selectedBooking.vehicle?.price}/day</p>
                </div>
              </div>
              <div className="booking-form">
                <div className="form-group">
                  <label>Pickup Date</label>
                  <input 
                    type="date" 
                    className="form-control date-input" 
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Return Date</label>
                  <input 
                    type="date" 
                    className="form-control date-input" 
                    value={bookingForm.returnDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, returnDate: e.target.value })}
                    min={bookingForm.bookingDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="price-summary">
                  <div className="summary-row">
                    <span>Price per day</span>
                    <span>₹{selectedBooking.vehicle?.price}</span>
                  </div>
                  <div className="summary-row">
                    <span>Number of days</span>
                    <span>{calculateDays()} days</span>
                  </div>
                  <div className="summary-row total">
                    <span>Updated Total</span>
                    <span>₹{(calculateDays() * (selectedBooking.vehicle?.price || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleUpdateBooking}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
