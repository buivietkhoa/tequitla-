require('./setup');
const { request, app } = require('./helpers');
const User = require('../src/models/User');

describe('Auth flow', () => {
  test('registers, logs in, and rejects the wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'a@test.com', password: 'secret123' })
      .expect(201);

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'a@test.com', password: 'wrong-password' })
      .expect(401);

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'a@test.com', password: 'secret123' })
      .expect(200);
  });

  test('rejects registration with invalid email or too-short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'not-an-email', password: '123' })
      .expect(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  test('forgot-password responds identically for existing and unknown emails', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'known@test.com', password: 'secret123' })
      .expect(201);

    const known = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'known@test.com' })
      .expect(200);
    const unknown = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'unknown@test.com' })
      .expect(200);

    expect(known.body.message).toBe(unknown.body.message);

    const user = await User.findOne({ email: 'known@test.com' }).select('+resetPasswordToken');
    expect(user.resetPasswordToken).toBeTruthy();
  });

  test('reset-password rejects an invalid token', async () => {
    await request(app)
      .post('/api/auth/reset-password/not-a-real-token')
      .send({ password: 'newpassword1' })
      .expect(400);
  });

  test('reset-password with a valid token changes the password and old password stops working', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'reset@test.com', password: 'oldpassword1' })
      .expect(201);
    await request(app).post('/api/auth/forgot-password').send({ email: 'reset@test.com' }).expect(200);

    const loggedEmail = warnSpy.mock.calls.map((args) => args.join(' ')).join('\n');
    const match = loggedEmail.match(/dat-lai-mat-khau\/([a-f0-9]+)/);
    warnSpy.mockRestore();
    expect(match).toBeTruthy();
    const rawToken = match[1];

    await request(app)
      .post(`/api/auth/reset-password/${rawToken}`)
      .send({ password: 'newpassword1' })
      .expect(200);

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'reset@test.com', password: 'oldpassword1' })
      .expect(401);
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'reset@test.com', password: 'newpassword1' })
      .expect(200);
  });
});
