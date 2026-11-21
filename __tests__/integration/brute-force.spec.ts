import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import UserModel from '../../src/infrastructure/persistance/mongoose/database/users/models/UserSchema';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';
import { API, createAuthenticatedUser, TestUser } from '../helpers/auth';

describe('brute-force protection', () => {
  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  describe('rate limiting', () => {
    it('limits authentication requests per IP and reports when to retry', async () => {
      const app = createApp({ rateLimits: { auth: { windowMinutes: 15, max: 3 } } });
      const attempt = () =>
        request(app).post(`${API}/auth/login`).send({ email: 'jane@example.com', password: 'guess' });

      for (let i = 0; i < 3; i += 1) {
        expect((await attempt()).status).toBe(401);
      }
      const limited = await attempt();

      expect(limited.status).toBe(429);
      expect(limited.body.error.code).toBe('RATE_LIMITED');
      expect(limited.headers['retry-after']).toBeDefined();
    });

    it('applies a separate, more generous limit to the rest of the API', async () => {
      const app = createApp({
        rateLimits: { auth: { windowMinutes: 15, max: 100 }, api: { windowMinutes: 15, max: 2 } },
      });

      await request(app).get(`${API}/notes`).expect(401);
      await request(app).get(`${API}/notes`).expect(401);
      await request(app).get(`${API}/notes`).expect(429);
    });
  });

  describe('account lockout', () => {
    const app = createApp();
    let user: TestUser;

    const login = (password: string) =>
      request(app).post(`${API}/auth/login`).send({ email: user.email, password });

    beforeEach(async () => {
      user = await createAuthenticatedUser(app);
    });

    it('locks the account after 5 consecutive failures, even for the right password', async () => {
      for (let i = 0; i < 5; i += 1) {
        await login('wrong password').expect(401);
      }

      const withRightPassword = await login(user.password);
      const stored = await UserModel.findById(user.id);

      expect(withRightPassword.status).toBe(401);
      expect(stored?.lockUntil?.getTime()).toBeGreaterThan(Date.now());
    });

    it('answers a locked account exactly like wrong credentials (no enumeration)', async () => {
      for (let i = 0; i < 5; i += 1) {
        await login('wrong password').expect(401);
      }

      const locked = await login(user.password);
      const unknown = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: 'nobody@example.com', password: 'whatever' });

      expect(locked.body).toEqual(unknown.body);
    });

    it('unlocks after the lockout period', async () => {
      for (let i = 0; i < 5; i += 1) {
        await login('wrong password').expect(401);
      }
      await UserModel.updateOne({ _id: user.id }, { $set: { lockUntil: new Date(Date.now() - 1000) } });

      await login(user.password).expect(200);
    });

    it('resets the counter after a successful sign-in', async () => {
      for (let i = 0; i < 4; i += 1) {
        await login('wrong password').expect(401);
      }
      await login(user.password).expect(200);
      await login('wrong password').expect(401);

      await login(user.password).expect(200);
    });

    it('never exposes the lockout fields', async () => {
      await login('wrong password').expect(401);

      const response = await request(app).get(`${API}/users/me`).set('Authorization', user.authHeader);

      expect(response.body.user.failedLoginAttempts).toBeUndefined();
      expect(response.body.user.lockUntil).toBeUndefined();
    });
  });
});
