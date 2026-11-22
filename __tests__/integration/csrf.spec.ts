import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';
import { API, createAuthenticatedUser, TestUser } from '../helpers/auth';

describe('cross-site request protection on cookie endpoints', () => {
  const app = createApp();
  let user: TestUser;

  const login = (headers: Record<string, string>) =>
    request(app)
      .post(`${API}/auth/login`)
      .set(headers)
      .send({ email: user.email, password: user.password });

  beforeAll(connectTestDb);
  beforeEach(async () => {
    user = await createAuthenticatedUser(app);
  });
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it.each([
    ['login', 'post', '/auth/login'],
    ['refresh', 'post', '/auth/refresh'],
    ['logout', 'post', '/auth/logout'],
    ['OAuth code exchange', 'post', '/auth/oauth/exchange'],
  ] as const)('rejects %s requests from another site', async (_name, method, path) => {
    const response = await request(app)
      [method](`${API}${path}`)
      .set('Origin', 'https://evil.example')
      .set('Cookie', user.refreshCookie)
      .send({});

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });

  it('accepts requests from the API\'s own origin (front end served by the API)', async () => {
    await login({ Host: 'vault.example.test', Origin: 'http://vault.example.test' }).expect(200);
  });

  it('accepts requests from a configured front-end origin', async () => {
    await login({ Origin: 'http://localhost:5173' }).expect(200);
  });

  it('falls back to the Referer header when Origin is missing', async () => {
    await login({ Referer: 'https://evil.example/page' }).expect(403);
    await login({ Referer: 'http://localhost:5173/login' }).expect(200);
  });

  it('accepts non-browser clients that send neither header', async () => {
    await login({}).expect(200);
  });

  it('rejects opaque origins', async () => {
    await login({ Origin: 'null' }).expect(403);
  });
});
