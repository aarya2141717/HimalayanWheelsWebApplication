import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehicleAPI, bookingAPI } from '../../services/api';
import '../../css/dashboard.css';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myVehicles, setMyVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeBookings: 0,
    totalRevenue: 0,
    availableVehicles: 0,
  });
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
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

  // Fetch vehicles and bookings from backend
  useEffect(() => {
    fetchMyVehicles();
    fetchMyBookings();
    fetchStats();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const response = await vehicleAPI.getMyVehicles();
      setMyVehicles(response.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await bookingAPI.getProviderBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [bookingStatsRes, vehiclesRes] = await Promise.all([
        bookingAPI.getBookingStats(),
        vehicleAPI.getMyVehicles(),
      ]);

      const vehicles = vehiclesRes.data || [];
      
      setStats({
        totalVehicles: vehicles.length,
        activeBookings: bookingStatsRes.data.activeBookings || 0,
        totalRevenue: bookingStatsRes.data.totalRevenue || 0,
        availableVehicles: vehicles.filter(v => v.available).length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getVehicleImageUrl = (vehicle) => {
    if (vehicle?.image) {
      const img = vehicle.image;
      if (img.startsWith('http')) return img;
      if (img.startsWith('/uploads')) return `http://localhost:5000${img}`;
      return `http://localhost:5000/uploads/vehicles/${img}`;
    }
    return '/images/background_image.png';
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
      
      // Refresh vehicles list
      await fetchMyVehicles();
      await fetchStats();
      
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
    try {
      await vehicleAPI.toggleAvailability(id);
      await fetchMyVehicles();
      await fetchStats();
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update availability');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      await vehicleAPI.deleteVehicle(id);
      await fetchMyVehicles();
      await fetchStats();
      alert('Vehicle deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle');
    }
  };

  const openEditVehicle = (vehicle) => {
    setEditVehicle({ ...vehicle, image: null });
    setEditImagePreview(getVehicleImageUrl(vehicle));
    setShowEditVehicleModal(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setEditVehicle({ ...editVehicle, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    if (!editVehicle) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editVehicle.name);
      formData.append('type', editVehicle.type);
      formData.append('price', editVehicle.price);
      formData.append('specs', editVehicle.specs || '');
      formData.append('description', editVehicle.description || '');
      if (editVehicle.image) {
        formData.append('image', editVehicle.image);
      }
      await vehicleAPI.updateVehicle(editVehicle.id, formData);
      await fetchMyVehicles();
      await fetchStats();
      setShowEditVehicleModal(false);
      alert('Vehicle updated successfully');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert(error.response?.data?.message || 'Failed to update vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, newStatus);
      alert('✅ Booking status updated!');
      await fetchMyBookings();
      await fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update booking status');
    }
  };

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
                      <button
                        className="btn-toggle"
                        onClick={() => toggleAvailability(vehicle.id)}
                        title={vehicle.available ? 'Make Unavailable' : 'Make Available'}
                      >
                        {vehicle.available ? 'Make Unavailable' : 'Make Available'}
                      </button>
                      <button
                        className="btn-edit-booking"
                        onClick={() => openEditVehicle(vehicle)}
                        title="Edit vehicle"
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-cancel-booking" 
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        title="Delete vehicle"
                      >
                        Delete
                      </button>
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
            <h3 className="sidebar-title">My Bookings ({bookings.length})</h3>
            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <span className="booking-customer">
                        👤 {booking.customer?.fullName || 'Customer'}
                      </span>
                      <span className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-vehicle-name">
                      🚗 {booking.vehicle?.name || 'Vehicle'}
                    </div>
                    <div className="booking-dates">
                      <span>📅 {new Date(booking.bookingDate).toLocaleDateString()}</span>
                      <span>→</span>
                      <span>{new Date(booking.returnDate).toLocaleDateString()}</span>
                    </div>
                    <div className="booking-cost">💰 ₹{booking.totalCost?.toLocaleString() || 0}</div>
                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                      <div className="booking-actions" style={{ marginTop: '0.75rem' }}>
                        <select 
                          className="status-select"
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            background: 'white',
                          }}
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="Confirmed">✅ Confirmed</option>
                          <option value="Completed">✔️ Completed</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
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
              <button className="action-btn" onClick={() => setShowAddVehicleModal(true)}>
                Add Vehicle
              </button>
              <button className="action-btn" onClick={() => navigate('/')}>Go to homepage</button>
              <button className="action-btn" onClick={() => window.location.reload()}>Refresh data</button>
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

      {/* Edit Vehicle Modal */}
      {showEditVehicleModal && editVehicle && (
        <div className="modal-overlay" onClick={() => !loading && setShowEditVehicleModal(false)}>
          <div className="modal-content vehicle-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Vehicle</h2>
              <button
                className="modal-close"
                onClick={() => !loading && setShowEditVehicleModal(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateVehicle}>
              <div className="modal-body">
                <div className="form-group image-upload-section">
                  <label>Vehicle Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id="editVehicleImage"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="editVehicleImage" className="image-upload-label">
                      {editImagePreview ? (
                        <img src={editImagePreview} alt="Preview" className="image-preview" />
                      ) : (
                        <div className="image-upload-placeholder">
                          <span>Click to upload image</span>
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
                      value={editVehicle.name}
                      onChange={(e) => setEditVehicle({ ...editVehicle, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Vehicle Type *</label>
                    <select
                      value={editVehicle.type}
                      onChange={(e) => setEditVehicle({ ...editVehicle, type: e.target.value })}
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
                    <label>Price per day (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editVehicle.price}
                      onChange={(e) => setEditVehicle({ ...editVehicle, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Specs</label>
                    <input
                      type="text"
                      value={editVehicle.specs || ''}
                      onChange={(e) => setEditVehicle({ ...editVehicle, specs: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={editVehicle.description || ''}
                    onChange={(e) => setEditVehicle({ ...editVehicle, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" type="button" onClick={() => setShowEditVehicleModal(false)} disabled={loading}>Cancel</button>
                <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
