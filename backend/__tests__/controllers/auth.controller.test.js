import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  login,
  resetPassword,
  signup,
  verifySecurity,
} from '../../controllers/authController.js';
import User from '../../models/User.js';

describe('Auth controller (essential)', () => {
  let req;
  let res;

  beforeEach(() => {
    process.env.JWT_SECRET = 'auth-secret';
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  test('signup returns 201 and token', async () => {
    User.create = jest.fn().mockResolvedValue({
      id: 1,
      role: 'user',
      accountType: 'CUSTOMER',
      dataValues: { id: 1, fullName: 'Test', email: 'test@a.com', role: 'user', accountType: 'CUSTOMER' },
    });
    req.body = { fullName: 'Test', email: 'test@a.com', password: 'abc123', accountType: 'CUSTOMER' };

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Signup successful' }));
  });

  test('login returns 200 for valid credentials', async () => {
    req.body = { email: 'user@a.com', password: 'secret' };
    User.findOne = jest.fn().mockResolvedValue({
      id: 2,
      email: 'user@a.com',
      password: '$2b$hash',
      role: 'user',
      accountType: 'CUSTOMER',
      dataValues: { id: 2, email: 'user@a.com', role: 'user', accountType: 'CUSTOMER', password: '$2b$hash' },
    });
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue('token123');

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Login successful', token: 'token123' }));
  });

  test('login returns 400 for missing credentials', async () => {
    req.body = { email: '' };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('login returns 401 for invalid password', async () => {
    req.body = { email: 'user@a.com', password: 'wrong' };
    User.findOne = jest.fn().mockResolvedValue({ password: '$2b$hash', role: 'user', accountType: 'CUSTOMER', dataValues: {} });
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('verifySecurity returns 401 for wrong answer', async () => {
    req.body = { email: 'user@a.com', securityAnswer: 'wrong' };
    User.findOne = jest.fn().mockResolvedValue({ securityAnswer: '$2b$hash' });
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await verifySecurity(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('resetPassword returns 404 for non-existent user', async () => {
    req.body = { email: 'none@a.com', newPassword: 'newpass' };
    User.findOne = jest.fn().mockResolvedValue(null);

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
