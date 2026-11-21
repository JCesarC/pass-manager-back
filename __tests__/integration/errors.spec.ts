import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';
import { API, createAuthenticatedUser } from '../helpers/auth';

const newUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  password: 'correct horse battery staple',
};

describe('error handling', () => {
  const app = createApp();

  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it('returns a JSON 404 for unknown routes', async () => {
    const response = await request(app).get('/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { code: 'NOT_FOUND', message: 'Route GET /does-not-exist not found.' },
    });
  });

  it('rejects malformed JSON with 400', async () => {
    const response = await request(app)
      .post(`${API}/auth/login`)
      .set('Content-Type', 'application/json')
      .send('{"email":');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('reports every validation problem', async () => {
    const response = await request(app).post(`${API}/auth/register`).send({ email: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    const paths = response.body.error.details.map((detail: { path: string }) => detail.path);
    expect(paths).toEqual(expect.arrayContaining(['email', 'firstName', 'lastName', 'password']));
  });

  it('returns 409 when the email is already registered', async () => {
    await request(app).post(`${API}/auth/register`).send(newUser).expect(201);

    const response = await request(app).post(`${API}/auth/register`).send(newUser);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('CONFLICT');
  });

  it('returns the same 401 for a wrong password and an unknown email', async () => {
    await request(app).post(`${API}/auth/register`).send(newUser).expect(201);

    const wrongPassword = await request(app)
      .post(`${API}/auth/login`)
      .send({ email: newUser.email, password: 'wrong password' });
    const unknownEmail = await request(app)
      .post(`${API}/auth/login`)
      .send({ email: 'nobody@example.com', password: 'whatever' });

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.body).toEqual(unknownEmail.body);
    expect(wrongPassword.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('logs in with 200', async () => {
    await request(app).post(`${API}/auth/register`).send(newUser).expect(201);

    const response = await request(app)
      .post(`${API}/auth/login`)
      .send({ email: newUser.email, password: newUser.password });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(newUser.email);
    expect(response.body.user.password).toBeUndefined();
  });

  it('never leaks internal error details', async () => {
    const user = await createAuthenticatedUser(app);
    const response = await request(app)
      .delete(`${API}/notes/not-an-object-id`)
      .set('Authorization', user.authHeader);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(JSON.stringify(response.body)).not.toMatch(/CastError|stack|mongoose/i);
  });

  it('returns 404 when deleting a note that does not exist', async () => {
    const user = await createAuthenticatedUser(app);
    const response = await request(app)
      .delete(`${API}/notes/64b7f0f0f0f0f0f0f0f0f0f0`)
      .set('Authorization', user.authHeader);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
