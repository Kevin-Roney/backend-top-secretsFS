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
  it('returns a list of secrets for logged in user', async() => {
    const agent = request.agent(app);
    const expected = 'Secret 1';
    let res = await agent
      .get('/api/v1/secrets');
    expect(res.status).toEqual(401);
    await agent
      .post('/api/v1/users')
      .send(mockUser);
    await agent
      .post('/api/v1/users/sessions')
      .send(mockUser);
    res = await agent 
      .get('/api/v1/secrets');
    expect(res.body[0].title).toEqual(expected);
  });
  it('creates a new secret', async () => {
    const agent = request.agent(app);
    const expected = 'Secret 2';
    let res = await agent
      .get('/api/v1/secrets');
    expect(res.status).toEqual(401);
    await agent
      .post('/api/v1/users')
      .send(mockUser);
    await agent
      .post('/api/v1/users/sessions')
      .send(mockUser);
    res = await agent 
      .post('/api/v1/secrets')
      .send({ title: 'Secret 2', description: 'Secret 2 description' });
    expect(res.body.title).toEqual(expected);
  });
  afterAll(() => {
    pool.end();
  });
});
