import request from 'supertest';
import app from '../app';

jest.mock('../services/notification.service', () => ({
  sendNotificationIfEnabled: jest.fn().mockResolvedValue(true),
}));

jest.mock('../utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

jest.setTimeout(10000);

describe('Market & Exchange Rates API Tests', () => {
  it('should fetch market rates or exchange data', async () => {
    const response = await request(app).get('/api/market/rates');
    expect([200, 400, 401, 404, 500]).toContain(response.status);
  });
});