import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test database URL if not already set
if (!process.env.DB_NAME) {
  process.env.DB_NAME = 'himalayan_wheels_test';
}
if (!process.env.DB_USER) {
  process.env.DB_USER = 'postgres';
}
if (!process.env.DB_PASS) {
  process.env.DB_PASS = 'postgres';
}
if (!process.env.DB_HOST) {
  process.env.DB_HOST = 'localhost';
}
if (!process.env.DB_PORT) {
  process.env.DB_PORT = '5432';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jest-secret-key-for-testing';
}

// Suppress console during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
