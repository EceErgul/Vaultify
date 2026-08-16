import request from 'supertest';
import app from '../app'; 

jest.mock('../services/notification.service', () => ({
  sendNotificationIfEnabled: jest.fn().mockResolvedValue(true),
}));

jest.mock('../utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

jest.setTimeout(10000);

describe('Auth Password Reset Backend Tests', () => {
  it('should successfully request a password reset email', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'test@vaultify.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('should handle non-existent email securely (return 200 to prevent user enumeration)', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nonexistent@vaultify.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('should fail password reset with invalid or fake token (returns 400)', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: 'valid-reset-token-sample',
        newPassword: 'NewSecurePassword123!',
      });

    expect(response.status).toBe(400);
  });

  it('should fail password reset with empty or missing token', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: '',
        newPassword: 'NewSecurePassword123!',
      });

    expect(response.status).toBe(400);
  });
});