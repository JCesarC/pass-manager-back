import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';

const API = '/api/v1';

describe('input validation', () => {
  const app = createApp();

  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it('rejects route ids that are not ObjectIds before touching the database', async () => {
    const response = await request(app).put(`${API}/notes/123`).send({ title: 'x' });

    expect(response.status).toBe(400);
    expect(response.body.error.details).toEqual([{ path: 'id', message: '"id" must be a valid id' }]);
  });

  it.each([
    ['page=0', 'page'],
    ['page=abc', 'page'],
    ['limit=0', 'limit'],
    ['limit=1000', 'limit'],
  ])('rejects invalid pagination (%s)', async (query, path) => {
    const response = await request(app).get(`${API}/notes?${query}`);

    expect(response.status).toBe(400);
    expect(response.body.error.details[0].path).toBe(path);
  });

  it('applies pagination defaults', async () => {
    const response = await request(app).get(`${API}/notes`);

    expect(response.status).toBe(200);
    expect(response.body.currentPage).toBe(1);
  });

  it('rejects note updates without editable fields or with unknown ones', async () => {
    const id = '64b7f0f0f0f0f0f0f0f0f0f0';

    const empty = await request(app).put(`${API}/notes/${id}`).send({});
    const unknown = await request(app).put(`${API}/notes/${id}`).send({ user: id });

    expect(empty.status).toBe(400);
    expect(unknown.status).toBe(400);
  });
});
