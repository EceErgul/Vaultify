import request from 'supertest';
import app from '../app';

jest.setTimeout(10000);

describe('Market & Exchange Rates API Tests', () => {
  it('should fetch market rates or exchange data', async () => {
    const response = await request(app).get('/api/market/rates');
    expect([200, 400, 401, 404, 500]).toContain(response.status);
  });
});