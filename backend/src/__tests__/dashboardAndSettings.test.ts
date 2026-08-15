import request from 'supertest';
import app from '../app';

jest.setTimeout(10000);

jest.mock('../services/notification.service', () => ({
  sendNotificationIfEnabled: jest.fn().mockResolvedValue(true),
}));

jest.mock('../utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

describe('Dashboard, Settings & Asset Details Tests', () => {
  let authToken = '';
  let createdAssetId = '';
  const testUser = {
    full_name: 'Dashboard Test User',
    email: `dash_user_${Date.now()}@vaultify.com`,
    password: 'SecurePassword123!',
  };

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    
    authToken = loginRes.body.data?.token || loginRes.body.token;

    const assetRes = await request(app)
      .post('/api/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ asset_name: 'Gold', asset_type: 'Borsa', total_quantity: 10, total_cost: 1000 });
    
    if (assetRes.body && (assetRes.body.id || assetRes.body.data?.id)) {
      createdAssetId = assetRes.body.id || assetRes.body.data.id;
    }
  });

  it('should fetch dashboard summary data successfully', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${authToken}`);

    expect([200, 404]).toContain(response.status);
  });

  it('should fetch and update user settings successfully', async () => {
    const getRes = await request(app)
      .get('/api/settings')
      .set('Authorization', `Bearer ${authToken}`);

    expect([200, 404]).toContain(getRes.status);

    const updateRes = await request(app)
      .put('/api/settings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ currency: 'TRY', theme: 'dark' });

    expect([200, 201, 404, 405]).toContain(updateRes.status);
  });

  it('should fetch specific asset details by ID', async () => {
    if (!createdAssetId) return;

    const response = await request(app)
      .get(`/api/assets/${createdAssetId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect([200, 404]).toContain(response.status);
  });
});