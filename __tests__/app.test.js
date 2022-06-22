const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'test@test.com',
  password: 'testpassword',
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('creates a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send(mockUser);
    expect(res.body.email).toBe('test@test.com');
  });
  it('signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send(mockUser);
    expect(res.status).toEqual(200);
  });
  it('signs out an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    await request(app)
      .post('/api/v1/users/sessions')
      .send(mockUser);
    const res = await request(app).delete('/api/v1/users/sessions');
    expect(res.status).toEqual(200);
    expect(res.body.message).toBe('Signed out successfully!');
  });
  it('returns a list of secrets on GET', async () => {
    const res = await request(app).get('/api/v1/secrets');
    expect(res.status).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
  afterAll(() => {
    pool.end();
  });
});
