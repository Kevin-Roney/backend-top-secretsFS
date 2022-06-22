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
      .post('/users')
      .send(mockUser);
    expect(res.body.user.email).toEqual('test@test.com');
  });
  afterAll(() => {
    pool.end();
  });
});
