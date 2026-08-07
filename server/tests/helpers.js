const request = require('supertest');
const app = require('../src/app');

let counter = 0;

async function registerAndLogin(overrides = {}) {
  counter += 1;
  const email = overrides.email || `user${Date.now()}${counter}@test.com`;
  const res = await request(app).post('/api/auth/register').send({
    name: overrides.name || 'Test User',
    email,
    password: overrides.password || 'password123',
  });
  return { cookie: res.headers['set-cookie'], user: res.body.user, token: res.body.token };
}

module.exports = { request, app, registerAndLogin };
