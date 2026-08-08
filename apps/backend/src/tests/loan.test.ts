import request from 'supertest';
import app from '../app';
import { sequelize } from '../database';

afterAll(async () => {
  await sequelize.close();
});

describe('Loan Endpoints Integration Tests', () => {
  

  it('GET /api/v1/creditos/:id - Should return a loan with pending balance and schedule', async () => {
    const response = await request(app).get('/api/v1/creditos/1');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('amount');
    expect(response.body.data).toHaveProperty('pendingBalance');
    expect(response.body.data).toHaveProperty('paymentSchedule');
  });

  it('GET /api/v1/creditos/:id - Should return 400 Validation Error for non-numeric ID', async () => {
    const response = await request(app).get('/api/v1/creditos/abc');
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('ValidationError');
    expect(response.body.message[0].message).toBe('ID must be a numeric string');
  });

  it('GET /api/v1/clientes/:clientId/creditos - Should return paginated history', async () => {
    const response = await request(app).get('/api/v1/clientes/1/creditos?page=1&limit=5');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('total');
    expect(response.body.data).toHaveProperty('totalPages');
    expect(Array.isArray(response.body.data.data)).toBe(true);
    expect(response.body.data.limit).toBe(5);
  });

});