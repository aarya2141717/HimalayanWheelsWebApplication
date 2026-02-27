import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import express from 'express';
import request from 'supertest';
import User from '../../models/User.js';
import authRoutes from '../../routes/authRoutes.js';

describe('Auth routes (essential)', () => {
  let app;

  beforeAll(() => {
    process.env.JWT_SECRET = 'auth-routes-secret';
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  test('POST /api/auth/signup returns 201', async () => {
    User.create = jest.fn().mockResolvedValue({
      id: 1,
      role: 'user',
      accountType: 'CUSTOMER',
      dataValues: { id: 1, fullName: 'A', email: 'a@a.com', role: 'user', accountType: 'CUSTOMER' },
    });

    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'A',
      email: 'a@a.com',
      phone: '9800000000',
      password: '123456',
      securityQuestion: 'Q?',
      securityAnswer: 'A',
      accountType: 'CUSTOMER',
    });

    expect(res.status).toBe(201);
  });

  test('POST /api/auth/login returns 200 for valid credentials', async () => {
    User.findOne = jest.fn().mockResolvedValue({
      id: 2,
      password: '$2b$hash',
      role: 'user',
      accountType: 'CUSTOMER',
      dataValues: { id: 2, email: 'u@a.com', role: 'user', accountType: 'CUSTOMER', password: '$2b$hash' },
    });
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const res = await request(app).post('/api/auth/login').send({ email: 'u@a.com', password: 'ok' });
    expect(res.status).toBe(200);
  });

  test('POST /api/auth/login returns 400 for missing password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'u@a.com' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/verify-security returns 401 for wrong answer', async () => {
    User.findOne = jest.fn().mockResolvedValue({ securityAnswer: '$2b$hash' });
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    const res = await request(app)
      .post('/api/auth/verify-security')
      .send({ email: 'u@a.com', securityAnswer: 'wrong' });

    expect(res.status).toBe(401);
  });

  test('POST /api/auth/reset-password returns 200 on success', async () => {
    User.findOne = jest.fn().mockResolvedValue({ id: 2, email: 'u@a.com' });
    User.update = jest.fn().mockResolvedValue([1]);
    bcrypt.hash = jest.fn().mockResolvedValue('$2b$newhash');

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'u@a.com', newPassword: 'newpass' });

    expect(res.status).toBe(200);
  });

  test('POST /api/auth/security-question returns 404 for non-existent user', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/security-question')
      .send({ email: 'missing@a.com' });

    expect(res.status).toBe(404);
  });
});
