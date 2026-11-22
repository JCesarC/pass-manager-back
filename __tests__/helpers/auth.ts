import { Express } from 'express';
import request from 'supertest';

export const API = '/api/v1';

let sequence = 0;

export interface TestUser {
  id: string;
  email: string;
  password: string;
  accessToken: string;
  authHeader: string;
  refreshCookie: string;
}

export const getRefreshCookie = (setCookie: string[] | string | undefined): string => {
  const cookies = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  const cookie = cookies.find((value) => value.startsWith('pm_refresh_token='));
  return cookie ? cookie.split(';')[0] : '';
};

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
    accessToken: login.body.accessToken,
    authHeader: `Bearer ${login.body.accessToken}`,
    refreshCookie: getRefreshCookie(login.headers['set-cookie']),
  };
};
