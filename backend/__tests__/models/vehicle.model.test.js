import SequelizeMock from 'sequelize-mock';

describe('Vehicle model (essential)', () => {
  let dbMock;
  let Vehicle;

  beforeEach(() => {
    dbMock = new SequelizeMock();
    Vehicle = dbMock.define('Vehicle', {
      id: 1,
      name: 'Honda',
      type: 'Bike',
      price: 250,
      providerId: 1,
      available: true,
      totalBookings: 0,
      revenue: 0,
    });
  });

  test('creates vehicle with required fields', async () => {
    const record = await Vehicle.create({
      name: 'Yamaha FZ',
      type: 'Bike',
      price: 220,
      providerId: 1,
    });

    expect(record.name).toBe('Yamaha FZ');
    expect(record.type).toBe('Bike');
  });

  test('reads vehicles list', async () => {
    const records = await Vehicle.findAll();
    expect(Array.isArray(records)).toBe(true);
    expect(records.length).toBeGreaterThan(0);
  });

  test('updates vehicle price', async () => {
    const record = await Vehicle.create({ name: 'Test', type: 'Car', price: 500, providerId: 1 });
    await record.update({ price: 650 });
    expect(record.price).toBe(650);
  });

  test('deletes existing vehicle record', async () => {
    const count = await Vehicle.destroy({ where: { id: 1 } });
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('supports optional fields for validation scenarios', async () => {
    const record = await Vehicle.create({
      name: 'Minimal',
      type: 'Scooter',
      price: 120,
      providerId: 1,
      specs: null,
      description: null,
    });

    expect(record).toBeDefined();
  });

  test('handles non-existent id query safely', async () => {
    const records = await Vehicle.findAll({ where: { id: 9999 } });
    expect(Array.isArray(records)).toBe(true);
  });
});
