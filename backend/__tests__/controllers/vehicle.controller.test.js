import { jest } from '@jest/globals';
import {
  addVehicle,
  deleteVehicle,
  getAllVehicles,
  toggleAvailability,
  updateVehicle,
} from '../../controllers/vehicleController.js';
import Vehicle from '../../models/Vehicle.js';

describe('Vehicle controller (essential)', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      file: null,
      user: { id: 1, role: 'user', accountType: 'PROVIDER' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  test('reads all available vehicles', async () => {
    Vehicle.findAll = jest.fn().mockResolvedValue([{ id: 1, name: 'Bike 1' }]);
    await getAllVehicles(req, res);

    expect(Vehicle.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Bike 1' }]);
  });

  test('returns 403 when non-provider tries create', async () => {
    req.user.accountType = 'CUSTOMER';
    await addVehicle(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('creates vehicle for provider', async () => {
    req.body = { name: 'New Bike', type: 'Bike', price: 200 };
    Vehicle.create = jest.fn().mockResolvedValue({ id: 10, ...req.body, providerId: 1 });

    await addVehicle(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(Vehicle.create).toHaveBeenCalled();
  });

  test('returns 404 for update with non-existent id', async () => {
    req.params.id = '999';
    Vehicle.findOne = jest.fn().mockResolvedValue(null);

    await updateVehicle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('deletes existing vehicle', async () => {
    req.params.id = '1';
    Vehicle.findOne = jest.fn().mockResolvedValue({ destroy: jest.fn().mockResolvedValue(true) });

    await deleteVehicle(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Vehicle deleted successfully' });
  });

  test('toggles availability on existing vehicle', async () => {
    req.params.id = '1';
    const vehicle = { available: true, save: jest.fn().mockResolvedValue(true) };
    Vehicle.findOne = jest.fn().mockResolvedValue(vehicle);

    await toggleAvailability(req, res);

    expect(vehicle.available).toBe(false);
    expect(vehicle.save).toHaveBeenCalled();
  });
});
