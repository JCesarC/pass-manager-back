import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import { connectTestDb, disconnectTestDb } from '../helpers/db';

describe('HTTP hardening', () => {
  const app = createApp();

  beforeAll(connectTestDb);
  afterAll(disconnectTestDb);

  it('allows the configured front-end origin with credentials', async () => {
    const response = await request(app)
      .options('/api/v1/auth/login')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST');

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('does not allow other origins', async () => {
    const response = await request(app)
      .options('/api/v1/auth/login')
      .set('Origin', 'https://evil.example')
      .set('Access-Control-Request-Method', 'POST');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('rejects JSON bodies larger than the limit with 413', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'jane@example.com', password: 'x'.repeat(200 * 1024) });

    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('sets security headers and hides the framework', async () => {
    const response = await request(app).get('/does-not-exist');

    expect(response.headers['x-powered-by']).toBeUndefined();
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-request-id']).toBeDefined();
  });
});
