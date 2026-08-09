import request from 'supertest';
import app from '../app';
import { sequelize } from '../database';

afterAll(async () => {
  await sequelize.close();
});

describe('Loan Endpoints Integration Tests', () => {
  let newLoanId: number;

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


  it('POST /api/v1/creditos - Should create a loan and generate the schedule', async () => {
    const response = await request(app)
      .post('/api/v1/creditos')
      .send({
        clientId: 1,
        amount: 10000,
        termMonths: 12,
        annualRate: 20
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.amount).toBe("10000.00");
    expect(response.body.data.paymentSchedule).toHaveLength(12);
    
    newLoanId = response.body.data.id;
  });

  it('POST /api/v1/creditos - Should return 400 Validation Error for invalid terms', async () => {
    const response = await request(app)
      .post('/api/v1/creditos')
      .send({
        clientId: 1,
        amount: 5000,
        termMonths: 2,
        annualRate: 50
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Term must be between 3 and 60 months' }),
        expect.objectContaining({ message: 'Rate must be between 5% and 40%' })
      ])
    );
  });

let firstInstallmentAmount: number;
it('POST /api/v1/creditos - Should create a loan and generate the schedule', async () => {
  const response = await request(app)
    .post('/api/v1/creditos')
    .send({
      clientId: 1,
      amount: 10000,
      termMonths: 12,
      annualRate: 20,
    });

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.data.amount).toBe("10000.00");
  expect(response.body.data.paymentSchedule).toHaveLength(12);

  newLoanId = response.body.data.id;
  firstInstallmentAmount = Number(
    response.body.data.paymentSchedule[0].installmentAmount
  );
});

it('GET /api/v1/creditos/:id/estado-cuenta - Should return account statement', async () => {
  const response = await request(app)
    .get(`/api/v1/creditos/${newLoanId}/estado-cuenta`);


  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);

  const statement = response.body.data;

  expect(statement.loanId).toBe(newLoanId);
});
});