import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      console.log('Login successful:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      alert('Login successful! Welcome back!');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Invalid credentials. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="logo-container">
            <img 
              src="/images/logo.png" 
              alt="Himalayan Wheels" 
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2340916c"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="24" font-weight="bold">HW</text></svg>';
              }}
            />
          </div>
          <h2>Welcome Back!</h2>
          <p>Sign in to continue your journey</p>
        </div>

        {/* Form */}
        <div className="auth-form-container">
          {errors.general && (
            <div className="alert-custom">
              {errors.general}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group-custom">
            <label className="form-label-custom">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="your.email@example.com"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          {/* Password Field */}
          <div className="form-group-custom">
            <label className="form-label-custom">Password</label>
            <div className="input-group-custom">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-toggle-btn"
              >
                <img 
                  src={showPassword ? '/images/visibility_on.png' : '/images/visibility_off.png'}
                  alt={showPassword ? 'Hide password' : 'Show password'}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.textContent = showPassword ? '👁️' : '👁️‍🗨️';
                  }}
                />
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          {/* Forgot Password */}
          <div className="forgot-password-link">
            <a href="/forgot-password" className="link-custom">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-submit-custom"
          >
            {loading ? (
              <>
                <span>Logging in...</span>
              </>
            ) : (
              'Log In'
            )}
          </button>

          {/* Divider */}
          <div className="divider-text">
            <span>OR</span>
          </div>

          {/* Sign Up Link */}
          <div className="link-text">
            Don't have an account?{' '}
            <a href="/signup" className="link-custom">
              Sign up here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;