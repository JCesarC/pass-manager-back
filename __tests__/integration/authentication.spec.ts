import jwt from 'jsonwebtoken';
import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';
import { API, createAuthenticatedUser } from '../helpers/auth';

const SECRET = process.env.JWT_SECRET as string;
const claims = { issuer: 'pass-manager-api', audience: 'pass-manager' };

describe('authentication', () => {
  const app = createApp();

  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it.each([
    ['GET', '/users/me'],
    ['GET', '/vaults'],
    ['POST', '/vaults'],
    ['GET', '/notes'],
    ['POST', '/notes'],
    ['PUT', '/notes/64b7f0f0f0f0f0f0f0f0f0f0'],
    ['DELETE', '/notes/64b7f0f0f0f0f0f0f0f0f0f0'],
    ['GET', '/fields'],
    ['POST', '/fields'],
    ['GET', '/fieldValues'],
    ['POST', '/fieldValues'],
    ['GET', '/does-not-exist'],
  ])('%s %s requires an access token', async (method, path) => {
    const response = await request(app)[method.toLowerCase() as 'get'](`${API}${path}`);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('keeps registration and login public', async () => {
    const register = await request(app).post(`${API}/auth/register`).send({});
    const login = await request(app).post(`${API}/auth/login`).send({});

    expect(register.status).toBe(400);
    expect(login.status).toBe(400);
  });

  it('accepts a valid Bearer token', async () => {
    const user = await createAuthenticatedUser(app);

    const response = await request(app).get(`${API}/users/me`).set('Authorization', user.authHeader);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(user.email);
  });

  describe('rejects', () => {
    let userId: string;
    let accessToken: string;

    beforeEach(async () => {
      ({ id: userId, accessToken } = await createAuthenticatedUser(app));
    });

    it.each<[string, () => string]>([
      ['a token without the Bearer scheme', () => accessToken],
      ['a different scheme', () => `Basic ${accessToken}`],
      ['a malformed token', () => 'Bearer not.a.jwt'],
      ['an expired token', () => `Bearer ${jwt.sign({}, SECRET, { ...claims, subject: userId, expiresIn: -10 })}`],
      ['a token signed with another secret', () => `Bearer ${jwt.sign({}, 'another-secret-that-is-long-enough!!', { ...claims, subject: userId })}`],
      ['a token for another audience', () => `Bearer ${jwt.sign({}, SECRET, { issuer: claims.issuer, audience: 'other', subject: userId })}`],
      ['an unsigned token (alg: none)', () => `Bearer ${jwt.sign({}, '', { ...claims, subject: userId, algorithm: 'none' })}`],
      ['a token without subject', () => `Bearer ${jwt.sign({}, SECRET, claims)}`],
    ])('%s', async (_case, header) => {
      const response = await request(app).get(`${API}/users/me`).set('Authorization', header());

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });
});
