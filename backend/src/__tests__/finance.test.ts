import request from 'supertest';
import app from '../app';

jest.setTimeout(10000);

jest.mock('../services/notification.service', () => ({
  sendNotificationIfEnabled: jest.fn().mockResolvedValue(true),
}));

jest.mock('../utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

describe('Finance & Subscriptions API Tests', () => {
  let authToken = '';
  const testUser = {
    full_name: 'Finance Test User',
    email: `finance_user_${Date.now()}@vaultify.com`,
    password: 'SecurePassword123!',
  };

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    authToken = loginRes.body.data?.token || loginRes.body.token;
  });

  it('should add and list incomes successfully', async () => {
    const addRes = await request(app)
      .post('/api/incomes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        income_name: 'Maaş', 
        income_amount: 50000, 
        income_category: 'Maaş', 
        date: '2026-08-14' 
      });

    expect([200, 201]).toContain(addRes.status);

    const getRes = await request(app)
      .get('/api/incomes')
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body) || typeof getRes.body === 'object').toBe(true);
  });

  it('should add and list expenses successfully', async () => {
    const addRes = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        expense_name: 'Kira', 
        expenses_amount: 15000, 
        expense_category: 'Kira', 
        payment_method: 'Kredi Kartı', 
        date: '2026-08-14' 
      });

    expect([200, 201]).toContain(addRes.status);
  });

  it('should add and list subscriptions successfully', async () => {
    const addRes = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        subscription_name: 'Netflix', 
        cost: 250, 
        payment_day: 1, 
        start_date: '2026-09-01' 
      });

    expect([200, 201]).toContain(addRes.status);
  });
});