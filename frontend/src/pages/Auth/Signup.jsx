console.log("ACTIVE SIGNUP: Auth/Signup.jsx");

import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import './Auth.css';

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your favorite food?",
  "What was the name of your first school?",
  "What is your favorite movie?",
];

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.securityQuestion) {
      newErrors.securityQuestion = 'Please select a security question';
    }

    if (!formData.securityAnswer.trim()) {
      newErrors.securityAnswer = 'Security answer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const response = await authAPI.signup(formData);
      console.log('Signup successful:', response.data);
      alert('Signup successful! Welcome to Himalayan Wheels!');
      window.location.href = '/login';
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
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
          <h2>Join Himalayan Wheels</h2>
          <p>Create your account to start your adventure</p>
        </div>

        {/* Form */}
        <div className="auth-form-container scrollable">
          {/* Full Name */}
          <div className="form-group-custom">
            <label className="form-label-custom">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div className="form-group-custom">
            <label className="form-label-custom">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              placeholder="98XXXXXXXX"
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>

          {/* Password */}
          <div className="form-group-custom">
            <label className="form-label-custom">Password</label>
            <div className="input-group-custom">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Create a strong password"
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

          {/* Confirm Password */}
          <div className="form-group-custom">
            <label className="form-label-custom">Confirm Password</label>
            <div className="input-group-custom">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="eye-toggle-btn"
              >
                <img 
                  src={showConfirmPassword ? '/images/visibility_on.png' : '/images/visibility_off.png'}
                  alt={showConfirmPassword ? 'Hide password' : 'Show password'}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.textContent = showConfirmPassword ? '👁️' : '👁️‍🗨️';
                  }}
                />
              </button>
            </div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          {/* Security Question Section */}
          <div className="security-section">
            <h3 className="security-title">🔒 Security Question (for password recovery)</h3>

            <div className="form-group-custom">
              <label className="form-label-custom">Choose a Security Question</label>
              <select
                name="securityQuestion"
                value={formData.securityQuestion}
                onChange={handleChange}
                className={`form-select ${errors.securityQuestion ? 'is-invalid' : ''}`}
              >
                <option value="">Select a question...</option>
                {SECURITY_QUESTIONS.map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
              </select>
              {errors.securityQuestion && <div className="error-message">{errors.securityQuestion}</div>}
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Your Answer</label>
              <input
                type="text"
                name="securityAnswer"
                value={formData.securityAnswer}
                onChange={handleChange}
                className={`form-control ${errors.securityAnswer ? 'is-invalid' : ''}`}
                placeholder="Enter your answer"
                disabled={!formData.securityQuestion}
              />
              {errors.securityAnswer && <div className="error-message">{errors.securityAnswer}</div>}
              <div className="help-text">
                💡 Remember this answer - you'll need it to recover your password
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-submit-custom"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <div className="link-text">
            Already have an account?{' '}
            <a href="/login" className="link-custom">
              Log in here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;