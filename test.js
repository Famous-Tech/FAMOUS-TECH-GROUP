const request = require('supertest');
const app = require('./index');

describe('GET /', () => {
  it('responds with 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /api/submit', () => {
  it('responds with 200 for valid input', async () => {
    const response = await request(app)
      .post('/api/submit')
      .send({ name: 'John Doe', email: 'john@example.com', service: 'web', details: 'Details' });
    expect(response.statusCode).toBe(200);
  });

  it('responds with 400 for invalid input', async () => {
    const response = await request(app)
      .post('/api/submit')
      .send({ name: 'John Doe', email: 'invalid-email', service: 'Service', details: 'Details' });
    expect(response.statusCode).toBe(400);
  });
});

describe('GET /api/track_visitors', () => {
  it('responds with 200', async () => {
    const response = await request(app).get('/api/track_visitors');
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /api/admins', () => {
  it('responds with 200', async () => {
    const response = await request(app).get('/api/admins');
    expect(response.statusCode).toBe(200);
  });
});