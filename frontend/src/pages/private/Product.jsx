import React from 'react';

const Product = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Dashboard - Products</h1>
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Available Vehicles</h5>
              <p className="card-text">This is where you would list vehicles or products fetched from the backend using `vehicleAPI`.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6>Quick Actions</h6>
              <p className="small text-muted">Add, edit or view bookings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
