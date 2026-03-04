import { jest } from '@jest/globals';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import Vehicle from '../../models/Vehicle.js';
import vehicleRoutes from '../../routes/vehicleRoutes.js';

describe('Vehicle routes (essential)', () => {
  let app;
  let token;
  let adminToken;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    token = jwt.sign({ id: 1, role: 'user', accountType: 'PROVIDER' }, process.env.JWT_SECRET);
    adminToken = jwt.sign({ id: 99, role: 'admin', accountType: 'CUSTOMER' }, process.env.JWT_SECRET);

    app = express();
    app.use(express.json());
    app.use('/api/vehicles', vehicleRoutes);
  });

  test('GET /api/vehicles returns available vehicles', async () => {
    Vehicle.findAll = jest.fn().mockResolvedValue([{ id: 1, name: 'Bike A', available: true }]);
    const res = await request(app).get('/api/vehicles');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test('GET /api/vehicles/my-vehicles returns 401 without token', async () => {
    const res = await request(app).get('/api/vehicles/my-vehicles');
    expect(res.status).toBe(401);
  });

  test('GET /api/vehicles/my-vehicles returns provider list with token', async () => {
    Vehicle.findAll = jest.fn().mockResolvedValue([{ id: 2, providerId: 1 }]);
    const res = await request(app)
      .get('/api/vehicles/my-vehicles')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/vehicles creates new vehicle', async () => {
    Vehicle.create = jest.fn().mockResolvedValue({ id: 5, name: 'Ntorq' });
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ntorq', type: 'Scooter', price: 150 });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Vehicle added successfully');
  });

  test('POST /api/vehicles allows admin to create vehicle', async () => {
    Vehicle.create = jest.fn().mockResolvedValue({ id: 6, name: 'Admin Added Car' });
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Admin Added Car', type: 'Car', price: 250 });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Vehicle added successfully');
  });

  test('PUT /api/vehicles/:id returns 404 for non-existent id', async () => {
    Vehicle.findOne = jest.fn().mockResolvedValue(null);
    const res = await request(app)
      .put('/api/vehicles/999')
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 180 });

    expect(res.status).toBe(404);
  });

  test('DELETE /api/vehicles/:id deletes existing vehicle', async () => {
    Vehicle.findOne = jest.fn().mockResolvedValue({ destroy: jest.fn().mockResolvedValue(true) });
    const res = await request(app)
      .delete('/api/vehicles/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Vehicle deleted successfully');
  });
});
