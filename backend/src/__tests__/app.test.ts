import request from 'supertest';
import app from '../app'; 

jest.mock('../services/notification.service', () => ({
  sendNotificationIfEnabled: jest.fn().mockResolvedValue(true),
}));

jest.mock('../utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

jest.setTimeout(10000);

describe('Backend API Integration Tests', () => {
  it('should return 404 or health status for unknown routes', async () => {
    const response = await request(app).get('/api/non-existent-route');
    expect(response.status).toBe(404);
  });
});