import React from 'react';
import { useAuth } from '../../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';
import AdminDashboard from './AdminDashboard';

const Product = () => {
  const { user } = useAuth();

  // Redirect to appropriate dashboard based on user type
  if (!user) {
    return (
      <div className="container py-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  // Show admin dashboard if user is admin
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // Show dashboard based on account type
  if (user.accountType === 'PROVIDER') {
    return <ProviderDashboard />;
  }

  // Default to customer dashboard
  return <CustomerDashboard />;
};

export default Product;
