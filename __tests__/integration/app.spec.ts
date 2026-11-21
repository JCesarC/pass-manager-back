import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import { connectTestDb, disconnectTestDb } from '../helpers/db';

describe('app', () => {
  const app = createApp();

  beforeAll(connectTestDb);
  afterAll(disconnectTestDb);

  it('serves the Swagger UI', async () => {
    const response = await request(app).get('/api/docs/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
  });

  it('returns 404 for unknown routes', async () => {
    const response = await request(app).get('/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/json/);
  });
});
