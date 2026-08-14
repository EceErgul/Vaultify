import request from 'supertest';
import app from '../app';

jest.setTimeout(10000);

jest.mock('../services/notification.service', () => ({
  sendNotificationIfEnabled: jest.fn().mockResolvedValue(true),
}));

jest.mock('../utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

describe('Auth API Integration Tests', () => {
  const testUser = {
    full_name: 'Test User',
    email: `testuser_${Date.now()}@vaultify.com`,
    password: 'Password123!'
  };

  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect([200, 201]).toContain(response.status);
  });

  it('should login with the registered user and return a token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
  });

  it('should fail login with incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword123!',
      });

    expect(response.status).toBe(401);
  });
});