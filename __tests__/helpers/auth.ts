import { Express } from 'express';
import request from 'supertest';

export const API = '/api/v1';

let sequence = 0;

export interface TestUser {
  id: string;
  email: string;
  password: string;
  accessToken: string;
  /** Ready-to-use Authorization header value. */
  authHeader: string;
}

/** Registers a fresh user and signs in, returning its credentials and token. */
export const createAuthenticatedUser = async (app: Express, name = 'user'): Promise<TestUser> => {
  sequence += 1;
  const email = `${name}.${sequence}@example.com`;
  const password = 'correct horse battery staple';

  await request(app)
    .post(`${API}/auth/register`)
    .send({ firstName: name, lastName: 'Test', email, password })
    .expect(201);

  const login = await request(app).post(`${API}/auth/login`).send({ email, password }).expect(200);

  return {
    id: login.body.user._id,
    email,
    password,
    accessToken: login.body.token,
    authHeader: `Bearer ${login.body.token}`,
  };
};
