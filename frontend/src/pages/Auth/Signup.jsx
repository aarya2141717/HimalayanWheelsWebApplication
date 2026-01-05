import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

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
      window.location.href = '/';
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Signup Form - Full Screen */}
      <div style={styles.mainSection}>
        <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <img 
              src="/images/logo.png" 
              alt="Himalayan Wheels" 
              style={styles.logoImage}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h2 style={styles.title}>Join Himalayan Wheels</h2>
          <p style={styles.subtitle}>Create your account to start your adventure</p>
        </div>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={{...styles.input, ...(errors.fullName && styles.inputError)}}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && <p style={styles.errorText}>{errors.fullName}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{...styles.input, ...(errors.email && styles.inputError)}}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && <p style={styles.errorText}>{errors.email}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.756l2.73 1.365a1 1 0 001.27-1.27l-1.365-2.73a1 1 0 00.756-.502l4.493-1.498a1 1 0 00.684-.948V5a2 2 0 00-2-2h-12a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-2.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-.756.502l-1.365 2.73a1 1 0 01-1.27 1.27l-2.73-1.365a1 1 0 00-.756-.502L5 15.71V5z" />
                </svg>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{...styles.input, ...(errors.phone && styles.inputError)}}
                  placeholder="98XXXXXXXX"
                />
              </div>
              {errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{...styles.input, ...(errors.password && styles.inputError)}}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <img 
                    src={showPassword ? "/images/visibility_on.png" : "/images/visibility_off.png"}
                    alt="toggle password"
                    style={styles.eyeIcon}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </button>
              </div>
              {errors.password && <p style={styles.errorText}>{errors.password}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{...styles.input, ...(errors.confirmPassword && styles.inputError)}}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <img 
                    src={showConfirmPassword ? "/images/visibility_on.png" : "/images/visibility_off.png"}
                    alt="toggle password"
                    style={styles.eyeIcon}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </button>
              </div>
              {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}
            </div>

            <div style={styles.securitySection}>
              <div style={styles.securityHeader}>
                <svg style={styles.shieldIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 style={styles.securityTitle}>Security Question (for account recovery)</h3>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Select a Security Question</label>
                <select
                  name="securityQuestion"
                  value={formData.securityQuestion}
                  onChange={handleChange}
                  style={{...styles.select, ...(errors.securityQuestion && styles.inputError)}}
                >
                  <option value="">Choose a question...</option>
                  {SECURITY_QUESTIONS.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
                {errors.securityQuestion && <p style={styles.errorText}>{errors.securityQuestion}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Your Answer</label>
                <input
                  type="text"
                  name="securityAnswer"
                  value={formData.securityAnswer}
                  onChange={handleChange}
                  style={{...styles.input, ...(errors.securityAnswer && styles.inputError)}}
                  placeholder="Enter your answer"
                  disabled={!formData.securityQuestion}
                />
                {errors.securityAnswer && <p style={styles.errorText}>{errors.securityAnswer}</p>}
                <p style={styles.helpText}>
                  💡 Remember this answer - you'll need it to recover your password
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{...styles.submitButton, ...(loading && styles.submitButtonDisabled)}}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={styles.loginPrompt}>
            <p style={styles.loginText}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={styles.loginLink}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    margin: 0,
    padding: 0,
    width: '100%',
  },
  mainSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '2rem',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
  },
  card: {
    maxWidth: '550px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  header: {
    textAlign: 'center',
    padding: '3rem 2rem 2.5rem',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
    color: 'white',
  },
  iconContainer: {
    display: 'inline-block',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    marginBottom: '1.5rem',
  },
  logoImage: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '800',
    margin: '0 0 0.75rem',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '1rem',
    opacity: 0.9,
    margin: 0,
    fontWeight: '500',
  },
  formContainer: {
    padding: '2.5rem',
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  formGroup: {
    marginBottom: '1.75rem',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#374151',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    width: '20px',
    height: '20px',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '0.95rem 0.95rem 0.95rem 2.75rem',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    fontWeight: '500',
    backgroundColor: '#f9fafb',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  select: {
    width: '100%',
    padding: '0.95rem 0.95rem 0.95rem 2.75rem',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#f9fafb',
    boxSizing: 'border-box',
    fontWeight: '500',
  },
  eyeButton: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    width: '20px',
    height: '20px',
    opacity: 0.6,
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
    margin: '0.5rem 0 0',
    fontWeight: '600',
  },
  helpText: {
    color: '#6b7280',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
    margin: '0.5rem 0 0',
    fontWeight: '500',
  },
  securitySection: {
    paddingTop: '1.5rem',
    borderTop: '2px solid #e5e7eb',
    marginTop: '1.5rem',
    marginBottom: '1rem',
  },
  securityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  shieldIcon: {
    width: '22px',
    height: '22px',
    color: '#7e22ce',
    flexShrink: 0,
  },
  securityTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  submitButton: {
    width: '100%',
    padding: '1.1rem',
    backgroundColor: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
    backgroundImage: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(126, 34, 206, 0.3)',
    letterSpacing: '0.5px',
    marginTop: '1rem',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: '0 4px 12px rgba(126, 34, 206, 0.1)',
  },
  loginPrompt: {
    textAlign: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb',
    marginTop: '1.5rem',
  },
  loginText: {
    color: '#6b7280',
    fontSize: '0.9rem',
    margin: 0,
    fontWeight: '500',
  },
  loginLink: {
    background: 'none',
    border: 'none',
    color: '#7e22ce',
    textDecoration: 'none',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'color 0.3s ease',
    padding: 0,
  },
};

export default Signup;
