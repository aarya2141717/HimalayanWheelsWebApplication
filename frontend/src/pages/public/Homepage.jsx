import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    location: '',
    vehicleType: '',
    pickUpDate: '',
    dropOffDate: '',
  });

  const popularVehicles = [
    {
      id: 1, 
      name: 'Royal Enfield Himalayan',
      type: 'Bike',
      price: 1500,
      image: '/images/royalenfield himalayan.png',
    },
    {
      id: 2,
      name: 'Mahindra Thar',
      type: 'SUV',
      price: 5000,
      image: '/images/mahindrathar.png',
    },
    {
      id: 3,
      name: 'KTM Duke 390',
      type: 'Bike',
      price: 1800,
      image: '/images/ktmduke390.png',
    },
    {
      id: 4,
      name: 'Honda Activa',
      type: 'Scooter',
      price: 800,
      image: '/images/hondaactiva.png',
    },
  ];

  const features = [
    { icon: '🚗', title: 'Wide Range of Vehicles', desc: 'Bikes, cars, and SUVs for every need' },
    { icon: '💰', title: 'Affordable Pricing', desc: 'Competitive rates for all budgets' },
    { icon: '📱', title: 'Easy Online Booking', desc: 'Book in minutes from anywhere' },
    { icon: '🛡️', title: '24/7 Customer Support', desc: 'Always here to help you' },
    { icon: '🔧', title: 'Well-Maintained Vehicles', desc: 'Regularly serviced and inspected' },
  ];

  const steps = [
    { number: '1', title: 'Choose Vehicle', desc: 'Browse our wide selection of vehicles' },
    { number: '2', title: 'Book Online', desc: 'Complete booking in just a few clicks' },
    { number: '3', title: 'Drive & Explore', desc: 'Pick up and start your adventure' },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Tourist',
      rating: 5,
      comment: 'Amazing experience! The Royal Enfield was perfect for exploring the mountains.',
      image: '👤',
    },
    {
      name: 'Sarah Johnson',
      role: 'Traveler',
      rating: 5,
      comment: 'Great service and well-maintained vehicles. Highly recommended!',
      image: '👤',
    },
    {
      name: 'Amit Sharma',
      role: 'Local',
      rating: 5,
      comment: 'Affordable prices and excellent customer support. Will rent again!',
      image: '👤',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to login if not logged in, or dashboard if logged in
    navigate('/login');
  };

  const handleInputChange = (e) => {
    setSearchForm({
      ...searchForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="homepage">
      {/* Top Navigation Bar */}
      <nav className="homepage-navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/images/logo.png" alt="Himalayan Wheels" className="logo-img" />
            <span className="logo-text">Himalayan Wheels</span>
          </div>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#vehicles">Vehicles</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-actions">
            <button className="btn-nav btn-login" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn-nav btn-signup" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-background">
          <img src="/images/background_image.png" alt="Himalayan Landscape" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-headline">Explore Nepal with Comfort and Confidence</h1>
            <p className="hero-subtext">
              Discover the beauty of Nepal with our premium vehicle rental service. 
              Easy, affordable, and reliable transportation for your mountain adventures and city explorations.
            </p>
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-row">
              <div className="search-field">
                <label>📍 Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Pick-up location"
                  value={searchForm.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="search-field">
                <label>🚗 Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={searchForm.vehicleType}
                  onChange={handleInputChange}
                >
                  <option value="">All Types</option>
                  <option value="Bike">Bike</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                </select>
              </div>
              <div className="search-field">
                <label>📅 Pick-up Date</label>
                <input
                  type="date"
                  name="pickUpDate"
                  value={searchForm.pickUpDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="search-field">
                <label>📅 Drop-off Date</label>
                <input
                  type="date"
                  name="dropOffDate"
                  value={searchForm.dropOffDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <button type="submit" className="btn-search">
              🔍 Search Vehicles
            </button>
          </form>
        </div>
      </section>

      {/* Popular Vehicles Section */}
      <section id="vehicles" className="popular-vehicles-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Vehicles</h2>
            <p>Choose from our most loved vehicles</p>
          </div>
          <div className="vehicles-grid">
            {popularVehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card-home">
                <div className="vehicle-image-wrapper">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    onError={(e) => {
                      e.target.src = '/images/background_image.png';
                    }}
                  />
                </div>
                <div className="vehicle-card-content">
                  <h3>{vehicle.name}</h3>
                  <p className="vehicle-type">{vehicle.type}</p>
                  <div className="vehicle-price">
                    <span className="price-amount">₹{vehicle.price}</span>
                    <span className="price-period">/day</span>
                  </div>
                  <button className="btn-rent-now" onClick={() => navigate('/login')}>
                    Rent Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Himalayan Wheels</h2>
            <p>Your trusted partner for vehicle rentals in Nepal</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Rent a vehicle in three simple steps</p>
          </div>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {index < steps.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real experiences from real travelers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.image}</div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="homepage-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src="/images/logo.png" alt="Himalayan Wheels" className="footer-logo-img" />
                <h3>Himalayan Wheels</h3>
              </div>
              <p>Your trusted partner for vehicle rentals in Nepal. Explore with comfort and confidence.</p>
              <div className="social-icons">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="LinkedIn">💼</a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#vehicles">Vehicles</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <ul>
                <li>📍 Kathmandu, Nepal</li>
                <li>📞 +977-9800000000</li>
                <li>✉️ info@himalayanwheels.com</li>
                <li>🕒 Mon-Sat: 9AM - 6PM</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Vehicle Types</h4>
              <ul>
                <li><a href="#vehicles">Bikes</a></li>
                <li><a href="#vehicles">Scooters</a></li>
                <li><a href="#vehicles">Cars</a></li>
                <li><a href="#vehicles">SUVs</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Himalayan Wheels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
