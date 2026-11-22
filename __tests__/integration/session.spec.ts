import jwt, { JwtPayload } from 'jsonwebtoken';
import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import RefreshTokenModel from '../../src/infrastructure/persistance/mongoose/database/refreshTokens/models/RefreshTokenSchema';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';
import { API, createAuthenticatedUser, getRefreshCookie, TestUser } from '../helpers/auth';

describe('session (access + refresh tokens)', () => {
  const app = createApp();
  let user: TestUser;

  const refresh = (cookie: string) => request(app).post(`${API}/auth/refresh`).set('Cookie', cookie);

  beforeAll(connectTestDb);
  beforeEach(async () => {
    user = await createAuthenticatedUser(app);
  });
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  describe('login', () => {
    it('returns a 15-minute Bearer access token', async () => {
      const response = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: user.email, password: user.password })
        .expect(200);

      const payload = jwt.decode(response.body.accessToken) as JwtPayload;
      expect(response.body).toMatchObject({ tokenType: 'Bearer', expiresIn: 900 });
      expect((payload.exp ?? 0) - (payload.iat ?? 0)).toBe(900);
      expect(payload.sub).toBe(user.id);
    });

    it('sets the refresh token only as a hardened, path-scoped cookie', async () => {
      const response = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: user.email, password: user.password })
        .expect(200);

      const setCookie = ([] as string[]).concat(response.headers['set-cookie'] ?? []).join(';');
      expect(setCookie).toMatch(/pm_refresh_token=/);
      expect(setCookie).toMatch(/HttpOnly/i);
      expect(setCookie).toMatch(/SameSite=Strict/i);
      expect(setCookie).toMatch(/Path=\/api\/v1\/auth/);
      expect(JSON.stringify(response.body)).not.toMatch(/refresh/i);
    });

    it('stores only a hash of the refresh token', async () => {
      const raw = user.refreshCookie.split('=')[1];
      const stored = await RefreshTokenModel.find().lean();

      expect(stored).toHaveLength(1);
      expect(stored[0].tokenHash).not.toBe(raw);
      expect(stored[0].tokenHash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('refresh', () => {
    it('issues a new access token and rotates the refresh token', async () => {
      const response = await refresh(user.refreshCookie).expect(200);
      const rotatedCookie = getRefreshCookie(response.headers['set-cookie']);

      expect(rotatedCookie).not.toBe('');
      expect(rotatedCookie).not.toBe(user.refreshCookie);
      await request(app)
        .get(`${API}/users/me`)
        .set('Authorization', `Bearer ${response.body.accessToken}`)
        .expect(200);
    });

    it('rejects a request without the cookie', async () => {
      const response = await request(app).post(`${API}/auth/refresh`);

      expect(response.status).toBe(401);
    });

    it('rejects an unknown refresh token', async () => {
      await refresh('pm_refresh_token=forged').expect(401);
    });

    it('revokes the whole session when a rotated token is reused', async () => {
      const first = await refresh(user.refreshCookie).expect(200);
      const legitimateCookie = getRefreshCookie(first.headers['set-cookie']);

      await refresh(user.refreshCookie).expect(401);

      await refresh(legitimateCookie).expect(401);
    });

    it('rejects an expired refresh token', async () => {
      await RefreshTokenModel.updateMany({}, { $set: { expiresAt: new Date(Date.now() - 1000) } });

      await refresh(user.refreshCookie).expect(401);
    });

    it('clears the cookie when the refresh fails', async () => {
      const response = await refresh('pm_refresh_token=forged').expect(401);
      const setCookie = ([] as string[]).concat(response.headers['set-cookie'] ?? []).join(';');

      expect(setCookie).toMatch(/pm_refresh_token=;/);
    });
  });

  describe('logout', () => {
    it('revokes the session and clears the cookie', async () => {
      const response = await request(app)
        .post(`${API}/auth/logout`)
        .set('Cookie', user.refreshCookie)
        .expect(204);

      const setCookie = ([] as string[]).concat(response.headers['set-cookie'] ?? []).join(';');
      expect(setCookie).toMatch(/pm_refresh_token=;/);
      await refresh(user.refreshCookie).expect(401);
    });

    it('succeeds without a session (idempotent)', async () => {
      await request(app).post(`${API}/auth/logout`).expect(204);
    });

    it('does not affect other sessions of the same user', async () => {
      const otherDevice = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: user.email, password: user.password })
        .expect(200);

      await request(app).post(`${API}/auth/logout`).set('Cookie', user.refreshCookie).expect(204);

      await refresh(getRefreshCookie(otherDevice.headers['set-cookie'])).expect(200);
    });
  });
});
