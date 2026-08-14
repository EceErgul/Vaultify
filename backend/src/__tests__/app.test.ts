import request from 'supertest';
import app from '../app'; 

jest.setTimeout(10000);

describe('Backend API Integration Tests', () => {
  it('should return 404 or health status for unknown routes', async () => {
    const response = await request(app).get('/api/non-existent-route');
    expect(response.status).toBe(404);
  });
});