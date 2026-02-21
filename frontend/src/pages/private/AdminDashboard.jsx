import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehicleAPI, bookingAPI } from '../../services/api';
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
  const [allBookings, setAllBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all bookings
      const bookingsRes = await bookingAPI.getAllBookings();
      setAllBookings(bookingsRes.data || []);

      // Fetch all vehicles
      const vehiclesRes = await vehicleAPI.getAllVehicles();
      setVehicles(vehiclesRes.data || []);

      // Fetch stats
      const statsRes = await bookingAPI.getBookingStats();
      
      setStats({
        totalUsers: 0, // We don't have a user count API yet
        totalVehicles: vehiclesRes.data?.length || 0,
        totalBookings: statsRes.data.totalBookings || 0,
        totalRevenue: statsRes.data.totalRevenue || 0,
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleStatusChange = (booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const updateStatus = async (newStatus) => {
    try {
      await bookingAPI.updateBookingStatus(selectedBooking.id, newStatus);
      alert('✅ Booking status updated successfully!');
      setShowStatusModal(false);
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update booking status');
    }
  };

  const openEditVehicle = (vehicle) => {
    setEditVehicle({ ...vehicle, image: null });
    setShowEditVehicleModal(true);
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
      if (editVehicle.image) formData.append('image', editVehicle.image);
      await vehicleAPI.updateVehicle(editVehicle.id, formData);
      await fetchData();
      setShowEditVehicleModal(false);
      alert('Vehicle updated successfully');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Failed to update vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleAPI.deleteVehicle(id);
      await fetchData();
      alert('Vehicle deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle');
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
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers || 'N/A'}</h3>
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
        {/* All Bookings */}
        <div className="main-section">
          <div className="section-header">
            <h2>All Bookings</h2>
            <span className="section-badge">{allBookings.length} total</span>
          </div>

          <div className="sidebar-card">
            <div className="bookings-list">
              {allBookings.length > 0 ? (
                allBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <span className="booking-customer">{booking.customer?.fullName || 'Customer'}</span>
                      <span className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-vehicle-name">{booking.vehicle?.name || 'Vehicle'}</div>
                    <div className="booking-dates">
                      <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                      <span>to</span>
                      <span>{new Date(booking.returnDate).toLocaleDateString()}</span>
                    </div>
                    <div className="booking-cost">₹{booking.totalCost?.toLocaleString() || 0}</div>
                    <div className="booking-provider">Provider: {booking.provider?.fullName || 'N/A'}</div>
                    <div className="booking-actions" style={{ marginTop: '0.75rem' }}>
                      <button className="btn-edit-booking" onClick={() => handleStatusChange(booking)}>Change status</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-bookings">
                  <p>No bookings yet</p>
                  <span className="empty-icon"></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar-section">
          {/* All Vehicles */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">All Vehicles ({vehicles.length})</h3>
            {vehicles.length > 0 ? (
              <div className="bookings-list">
                {vehicles.slice(0, 5).map((vehicle) => (
                  <div key={vehicle.id} className="booking-item">
                    <div className="booking-header">
                      <span className="booking-vehicle">{vehicle.name}</span>
                      <span className={`booking-status ${vehicle.available ? 'status-confirmed' : 'status-cancelled'}`}>
                        {vehicle.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="booking-vehicle-name">{vehicle.type}</div>
                    <div className="booking-cost">₹{vehicle.price}/day</div>
                    <div className="booking-actions" style={{ marginTop: '0.75rem' }}>
                      <button className="btn-edit-booking" onClick={() => openEditVehicle(vehicle)}>Edit</button>
                      <button className="btn-cancel-booking" onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-bookings">
                <p>No vehicles yet</p>
                <span className="empty-icon"></span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Admin Actions</h3>
            <div className="quick-actions">
              <button className="action-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button>
              <button className="action-btn" onClick={() => navigate('/')}>Go to homepage</button>
              <button className="action-btn" onClick={() => window.location.reload()}>Refresh data</button>
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

      {/* Status Change Modal */}
      {showStatusModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Booking Status</h2>
              <button className="modal-close" onClick={() => setShowStatusModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Customer:</strong> {selectedBooking.customer?.fullName}</p>
              <p><strong>Vehicle:</strong> {selectedBooking.vehicle?.name}</p>
              <p><strong>Current Status:</strong> {selectedBooking.status}</p>
              <div style={{ marginTop: '1.5rem' }}>
                <h4>Select New Status:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }} onClick={() => updateStatus('Confirmed')}>Confirmed</button>
                  <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }} onClick={() => updateStatus('Pending')}>Pending</button>
                  <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} onClick={() => updateStatus('Completed')}>Completed</button>
                  <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }} onClick={() => updateStatus('Cancelled')}>Cancelled</button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowStatusModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditVehicleModal && editVehicle && (
        <div className="modal-overlay" onClick={() => !loading && setShowEditVehicleModal(false)}>
          <div className="modal-content vehicle-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Vehicle</h2>
              <button className="modal-close" onClick={() => !loading && setShowEditVehicleModal(false)} disabled={loading}>×</button>
            </div>
            <form onSubmit={handleUpdateVehicle}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Vehicle Name *</label>
                    <input type="text" value={editVehicle.name} onChange={(e) => setEditVehicle({ ...editVehicle, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Vehicle Type *</label>
                    <select value={editVehicle.type} onChange={(e) => setEditVehicle({ ...editVehicle, type: e.target.value })} required>
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
                    <input type="number" min="0" step="0.01" value={editVehicle.price} onChange={(e) => setEditVehicle({ ...editVehicle, price: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Specs</label>
                    <input type="text" value={editVehicle.specs || ''} onChange={(e) => setEditVehicle({ ...editVehicle, specs: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="3" value={editVehicle.description || ''} onChange={(e) => setEditVehicle({ ...editVehicle, description: e.target.value })} />
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

export default AdminDashboard;
