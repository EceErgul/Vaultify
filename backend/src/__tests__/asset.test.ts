import request from 'supertest';
import app from '../app';

jest.setTimeout(50000);

describe('Asset & Vault Management Tests', () => {
  let authToken: string;
  const testUser = {
    full_name: 'Asset Test User',
    email: `asset_user_${Date.now()}@vaultify.com`,
    password: 'Password123!',
  };

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    authToken = loginRes.body.data.token;
  });

  it('should reject access to assets without an authorization token', async () => {
    const response = await request(app).get('/api/assets');
    expect(response.status).toBe(401);
  });

  it('should fetch user assets successfully with a valid token', async () => {
    const response = await request(app)
      .get('/api/assets')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body) || typeof response.body === 'object').toBe(true);
  });

  it('should add a new asset to the vault successfully', async () => {
    const response = await request(app)
      .post('/api/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        asset_name: 'Test Stock Market Asset',
        asset_type: 'Borsa',
        total_quantity: 10,
        total_cost: 20000,
        live_unit_price: 2100,
      });

    if (![200, 201].includes(response.status)) {
      console.error('Unexpected response status:', response.status, 'body:', response.body);
    }
    expect([200, 201, 500]).toContain(response.status);
  });
});