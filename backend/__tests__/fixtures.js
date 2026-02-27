import jwt from 'jsonwebtoken';

/**
 * Mock Data Fixtures for Testing
 * Contains reusable test data for all test files
 */

export const mockUsers = {
  providerUser: {
    id: 1,
    fullName: 'John Provider',
    email: 'provider@test.com',
    phone: '9800000001',
    password: 'hashedPassword123',
    securityQuestion: 'What is your favorite color?',
    securityAnswer: 'hashedAnswerBlue',
    role: 'user',
    accountType: 'PROVIDER',
    companyName: 'Swift Rentals',
    companyAddress: 'Kathmandu, Nepal',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  customerUser: {
    id: 2,
    fullName: 'Jane Customer',
    email: 'customer@test.com',
    phone: '9800000002',
    password: 'hashedPassword456',
    securityQuestion: 'What is your pet name?',
    securityAnswer: 'hashedAnswerFluffy',
    role: 'user',
    accountType: 'CUSTOMER',
    companyName: null,
    companyAddress: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  adminUser: {
    id: 3,
    fullName: 'Admin User',
    email: 'admin@test.com',
    phone: '9800000003',
    password: 'hashedAdminPassword',
    securityQuestion: 'Admin question?',
    securityAnswer: 'hashedAdminAnswer',
    role: 'admin',
    accountType: 'PROVIDER',
    companyName: 'Admin Company',
    companyAddress: 'Admin Address',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const mockVehicles = {
  bike: {
    id: 1,
    name: 'Honda CB 500',
    type: 'Bike',
    price: '250.00',
    specs: 'CC: 500, Fuel: Petrol',
    available: true,
    providerId: 1,
    image: '/uploads/vehicles/bike1.jpg',
    description: 'A reliable bike for city rides',
    totalBookings: 5,
    revenue: '1250.00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  scooter: {
    id: 2,
    name: 'Vespa Primavera',
    type: 'Scooter',
    price: '150.00',
    specs: 'CC: 300, Fuel: Petrol',
    available: true,
    providerId: 1,
    image: '/uploads/vehicles/scooter1.jpg',
    description: 'Comfortable scooter for daily commute',
    totalBookings: 8,
    revenue: '1200.00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  car: {
    id: 3,
    name: 'Toyota Corolla',
    type: 'Car',
    price: '500.00',
    specs: 'Displacement: 1500cc, Fuel: Petrol',
    available: true,
    providerId: 1,
    image: '/uploads/vehicles/car1.jpg',
    description: 'Spacious and fuel-efficient car',
    totalBookings: 12,
    revenue: '6000.00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  suv: {
    id: 4,
    name: 'Hyundai Creta',
    type: 'SUV',
    price: '800.00',
    specs: '1500cc 6MT, 4WD available',
    available: false,
    providerId: 1,
    image: '/uploads/vehicles/suv1.jpg',
    description: 'Premium SUV with excellent comfort',
    totalBookings: 20,
    revenue: '16000.00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const mockBookings = {
  booking1: {
    id: 1,
    vehicleId: 1,
    customerId: 2,
    providerId: 1,
    startDate: '2026-03-01',
    endDate: '2026-03-05',
    totalPrice: '1250.00',
    status: 'CONFIRMED',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

/**
 * Generate JWT Test Token
 */
export const generateTestToken = (userId, role = 'user', accountType = 'PROVIDER') => {
  return jwt.sign(
    {
      id: userId,
      role: role,
      accountType: accountType,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

/**
 * Create authorization header
 */
export const getAuthHeader = (token) => {
  return {
    authorization: `Bearer ${token}`,
  };
};

/**
 * Test data for new vehicles (for POST requests)
 */
export const newVehicleData = {
  valid: {
    name: 'Bajaj Auto 150',
    type: 'Bike',
    price: '200',
    specs: 'CC: 150, Fuel: Petrol',
    description: 'Entry-level bike for beginners',
  },
  invalid: {
    name: '', // Invalid: empty name
    type: 'InvalidType', // Invalid: wrong enum type
    price: 'invalid', // Invalid: string instead of number
    specs: 'CC: 150',
    description: 'Missing required fields',
  },
  missingRequired: {
    // Missing name and type
    price: '300',
    specs: 'CC: 250',
    description: 'Missing mandatory fields',
  },
};

/**
 * Test data for user signup
 */
export const signupData = {
  valid: {
    fullName: 'New User',
    email: 'newuser@test.com',
    phone: '9800000099',
    password: 'SecurePass123!',
    securityQuestion: 'Favorite movie?',
    securityAnswer: 'Avatar',
    accountType: 'CUSTOMER',
  },
  validProvider: {
    fullName: 'New Provider',
    email: 'newprovider@test.com',
    phone: '9800000098',
    password: 'SecurePass123!',
    securityQuestion: 'Favorite color?',
    securityAnswer: 'Blue',
    accountType: 'PROVIDER',
    companyName: 'New Rental Co',
    companyAddress: 'Pokhara, Nepal',
  },
  invalid: {
    fullName: 'No Email User',
    // Missing email
    phone: '9800000097',
    password: 'pass123',
    securityQuestion: 'Question?',
    securityAnswer: 'Answer',
    accountType: 'CUSTOMER',
  },
};

/**
 * Test data for login
 */
export const loginData = {
  valid: {
    email: 'provider@test.com',
    password: 'testPassword123',
  },
  invalid: {
    email: 'nonexistent@test.com',
    password: 'wrongPassword',
  },
  missingEmail: {
    password: 'somePassword',
  },
  missingPassword: {
    email: 'provider@test.com',
  },
};

/**
 * Test data for password reset
 */
export const resetPasswordData = {
  valid: {
    email: 'provider@test.com',
    newPassword: 'NewSecurePass456!',
  },
  invalidEmail: {
    email: 'nonexistent@test.com',
    newPassword: 'NewPass123',
  },
};

/**
 * Test data for security answer verification
 */
export const securityData = {
  valid: {
    email: 'provider@test.com',
    securityAnswer: 'Blue',
  },
  invalid: {
    email: 'provider@test.com',
    securityAnswer: 'WrongAnswer',
  },
};
