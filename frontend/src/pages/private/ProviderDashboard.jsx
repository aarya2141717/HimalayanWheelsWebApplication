import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehicleAPI } from '../../services/api';
import '../../css/dashboard.css';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myVehicles, setMyVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: 'Bike',
    price: '',
    specs: '',
    description: '',
    image: null,
  });

  // Hardcoded sample vehicles
  const hardcodedVehicles = [
    {
      id: 'sample-1',
      name: 'Royal Enfield Himalayan',
      type: 'Bike',
      price: 1500,
      image: null,
      available: true,
      specs: '411cc, Adventure Bike',
      totalBookings: 12,
      revenue: 18000,
      isHardcoded: true,
    },
    {
      id: 'sample-2',
      name: 'KTM Duke 390',
      type: 'Bike',
      price: 1800,
      image: null,
      available: true,
      specs: '373cc, Sport Bike',
      totalBookings: 8,
      revenue: 14400,
      isHardcoded: true,
    },
  ];

  // Fetch vehicles from backend
  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const response = await vehicleAPI.getMyVehicles();
      const dbVehicles = response.data || [];
      // Combine hardcoded + real vehicles
      setMyVehicles([...hardcodedVehicles, ...dbVehicles]);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Show only hardcoded if backend fails
      setMyVehicles(hardcodedVehicles);
    }
  };

  const getVehicleImageUrl = (vehicle) => {
    // If vehicle has image from database
    if (vehicle.image && !vehicle.isHardcoded) {
      return `http://localhost:5000${vehicle.image}`;
    }
    
    // Hardcoded vehicle images
    const imageMap = {
      'Royal Enfield Himalayan': '/images/royalenfield himalayan.png',
      'KTM Duke 390': '/images/ktmduke390.png',
      'Honda Activa': '/images/hondaactiva.png',
      'Mahindra Thar': '/images/mahindrathar.png',
      'Maruti Suzuki Swift': '/images/marutisuzukiswift.png',
    };
    
    return imageMap[vehicle.name] || '/images/background_image.png';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setNewVehicle({ ...newVehicle, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('name', newVehicle.name);
      formData.append('type', newVehicle.type);
      formData.append('price', newVehicle.price);
      formData.append('specs', newVehicle.specs);
      formData.append('description', newVehicle.description);
      if (newVehicle.image) {
        formData.append('image', newVehicle.image);
      }

      const response = await vehicleAPI.addVehicle(formData);
      
      // Add new vehicle to state (remove hardcoded ones if adding real ones)
      setMyVehicles([...hardcodedVehicles, ...myVehicles.filter(v => !v.isHardcoded), response.data.vehicle]);
      
      // Reset form
      setShowAddVehicleModal(false);
      setNewVehicle({ name: '', type: 'Bike', price: '', specs: '', description: '', image: null });
      setImagePreview(null);
      
      alert('Vehicle added successfully! 🎉');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert(error.response?.data?.message || 'Failed to add vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id) => {
    // Don't allow toggling hardcoded vehicles
    if (id.toString().startsWith('sample-')) {
      alert('Cannot modify sample vehicles');
      return;
    }

    try {
      await vehicleAPI.toggleAvailability(id);
      setMyVehicles(
        myVehicles.map((v) => (v.id === id ? { ...v, available: !v.available } : v))
      );
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update availability');
    }
  };

  const handleDeleteVehicle = async (id) => {
    // Don't allow deleting hardcoded vehicles
    if (id.toString().startsWith('sample-')) {
      alert('Cannot delete sample vehicles');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      await vehicleAPI.deleteVehicle(id);
      setMyVehicles(myVehicles.filter((v) => v.id !== id));
      alert('Vehicle deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle');
    }
  };

  const stats = {
    totalVehicles: myVehicles.length,
    activeBookings: bookings.filter((b) => b.status === 'Confirmed').length,
    totalRevenue: myVehicles.reduce((sum, v) => sum + (parseFloat(v.revenue) || 0), 0),
    availableVehicles: myVehicles.filter((v) => v.available).length,
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Provider Dashboard 🚗</h1>
          <p className="header-subtitle">
            {user?.companyName || 'Your Company'} - Manage your fleet
          </p>
        </div>
        <div className="user-badge provider-badge">
          <span className="badge-icon">🏢</span>
          <span className="badge-text">Provider</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            🚗
          </div>
          <div className="stat-content">
            <h3>{stats.totalVehicles}</h3>
            <p>Total Vehicles</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            📅
          </div>
          <div className="stat-content">
            <h3>{stats.activeBookings}</h3>
            <p>Active Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            💰
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            ✓
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
                    src={getVehicleImageUrl(vehicle)}
                    alt={vehicle.name}
                    className="vehicle-image"
                    onError={(e) => {
                      e.target.src = '/images/background_image.png';
                    }}
                  />
                  {vehicle.isHardcoded && (
                    <span className="sample-badge">Sample</span>
                  )}
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
                      <span className="stat-value">{vehicle.totalBookings || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Revenue</span>
                      <span className="stat-value">₹{(parseFloat(vehicle.revenue) || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="vehicle-footer">
                    <div className="vehicle-price">
                      <span className="price-label">₹{vehicle.price}</span>
                      <span className="price-period">/day</span>
                    </div>
                    <div className="vehicle-actions">
                      {!vehicle.isHardcoded && (
                        <>
                          <button
                            className="btn-toggle"
                            onClick={() => toggleAvailability(vehicle.id)}
                            title={vehicle.available ? 'Mark as unavailable' : 'Mark as available'}
                          >
                            {vehicle.available ? '🔓' : '🔒'}
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            title="Delete vehicle"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {myVehicles.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
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
                      <span>📅 {booking.bookingDate}</span>
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
              <button className="action-btn" onClick={() => navigate('/')}>
                <span>🏠</span>
                View Homepage
              </button>
              <button className="action-btn">
                <span>📊</span>
                View Reports
              </button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="sidebar-card help-card">
            <div className="help-icon">💡</div>
            <h4>Pro Tip</h4>
            <p>Keep your vehicles well-maintained and available to maximize bookings and revenue</p>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowAddVehicleModal(false)}>
          <div className="modal-content vehicle-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Vehicle</h2>
              <button
                className="modal-close"
                onClick={() => !loading && setShowAddVehicleModal(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddVehicle}>
              <div className="modal-body">
                {/* Image Upload Section */}
                <div className="form-group image-upload-section">
                  <label>Vehicle Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id="vehicleImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="vehicleImage" className="image-upload-label">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                      ) : (
                        <div className="image-upload-placeholder">
                          <span className="upload-icon">📷</span>
                          <span>Click to upload image</span>
                          <span className="upload-hint">PNG, JPG, GIF up to 5MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Vehicle Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Honda City"
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
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price per Day (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g., 2000"
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
                      placeholder="e.g., 1.5L Petrol, Automatic"
                      value={newVehicle.specs}
                      onChange={(e) => setNewVehicle({ ...newVehicle, specs: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Brief description of the vehicle (optional)"
                    value={newVehicle.description}
                    onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddVehicleModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Vehicle'}
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
