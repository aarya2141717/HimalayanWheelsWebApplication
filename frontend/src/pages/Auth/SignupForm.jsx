import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import '../../css/auth.css';

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your favorite food?",
  "What was the name of your first school?",
  "What is your favorite movie?",
];

// Zod validation schema
const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .regex(/^\d{10}$/, 'Phone number must be 10 digits')
      .refine((val) => !val.includes('-'), 'Phone number should not contain dashes'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    securityQuestion: z.string().min(1, 'Please select a security question'),
    securityAnswer: z.string().min(1, 'Security answer is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const securityQuestion = watch('securityQuestion');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');

    try {
      const response = await authAPI.signup(data);
      await signup(data);
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Signup failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container py-5">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="logo-container">
            <img src="/images/logo.png" alt="Himalayan Wheels" />
          </div>
          <h2>Join Himalayan Wheels</h2>
          <p>Create your account to start your adventure</p>
        </div>

        {/* Form Body */}
        <div className="auth-form-container scrollable">
          {apiError && (
            <div className="alert-custom">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="form-group-custom">
              <label className="form-label-custom">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                placeholder="Enter your full name"
                {...register('fullName')}
              />
              {errors.fullName && (
                <div className="error-message">{errors.fullName.message}</div>
              )}
            </div>

            {/* Email */}
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

            {/* Phone */}
            <div className="form-group-custom">
              <label className="form-label-custom">Phone Number</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="98XXXXXXXX"
                {...register('phone')}
              />
              {errors.phone && (
                <div className="error-message">{errors.phone.message}</div>
              )}
            </div>

            {/* Password */}
            <div className="form-group-custom">
              <label className="form-label-custom">Password</label>
              <div className="input-group-custom">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Create a strong password"
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

            {/* Confirm Password */}
            <div className="form-group-custom">
              <label className="form-label-custom">Confirm Password</label>
              <div className="input-group-custom">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Re-enter your password"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={showConfirmPassword ? '/images/visibility_on.png' : '/images/visibility_off.png'}
                    alt="Toggle password visibility"
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="error-message">{errors.confirmPassword.message}</div>
              )}
            </div>

            {/* Security Section */}
            <div className="security-section">
              <div className="security-header">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="security-title">Security Question</h3>
              </div>

              {/* Security Question */}
              <div className="form-group-custom">
                <label className="form-label-custom">Select a Security Question</label>
                <select
                  className={`form-select ${errors.securityQuestion ? 'is-invalid' : ''}`}
                  {...register('securityQuestion')}
                >
                  <option value="">Choose a question...</option>
                  {SECURITY_QUESTIONS.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
                {errors.securityQuestion && (
                  <div className="error-message">{errors.securityQuestion.message}</div>
                )}
              </div>

              {/* Security Answer */}
              <div className="form-group-custom">
                <label className="form-label-custom">Your Answer</label>
                <input
                  type="text"
                  className={`form-control ${errors.securityAnswer ? 'is-invalid' : ''}`}
                  placeholder="Enter your answer"
                  disabled={!securityQuestion}
                  {...register('securityAnswer')}
                />
                {errors.securityAnswer && (
                  <div className="error-message">{errors.securityAnswer.message}</div>
                )}
                <div className="help-text">
                  💡 Remember this answer - you'll need it to recover your password
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-submit-custom"
              style={{ marginTop: '1.5rem' }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider-text">
            <span>Already have an account?</span>
          </div>

          {/* Login Link */}
          <div className="link-text">
            <button
              type="button"
              className="link-custom"
              onClick={() => navigate('/login')}
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Signup;
