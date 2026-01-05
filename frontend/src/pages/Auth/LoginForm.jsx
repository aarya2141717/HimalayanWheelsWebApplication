import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import '../../css/auth.css';

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');

    try {
      const response = await authAPI.login(data);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="logo-container">
            <img src="/images/logo.png" alt="Himalayan Wheels" />
          </div>
          <h2>Welcome Back!</h2>
          <p>Sign in to continue your journey</p>
        </div>

        {/* Form Body */}
        <div className="auth-form-container">
          {apiError && (
            <div className="alert-custom">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="form-group-custom">
              <label className="form-label-custom">Email Address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="your.email@example.com"
                {...register('email')}
              />
              {errors.email && (
                <div className="error-message">{errors.email.message}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group-custom">
              <label className="form-label-custom">Password</label>
              <div className="input-group-custom">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? '/images/visibility_on.png' : '/images/visibility_off.png'}
                    alt="Toggle password visibility"
                  />
                </button>
              </div>
              {errors.password && (
                <div className="error-message">{errors.password.message}</div>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="forgot-password-link">
              <a href="#" className="link-custom">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-submit-custom"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider-text">
            <span>Don't have an account?</span>
          </div>

          {/* Sign Up Link */}
          <div className="link-text">
            <button
              type="button"
              className="link-custom"
              onClick={() => navigate('/signup')}
            >
              Create a New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
