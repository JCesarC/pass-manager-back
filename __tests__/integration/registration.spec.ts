import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import UserModel from '../../src/infrastructure/persistance/mongoose/database/users/models/UserSchema';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';

const API = '/api/v1';

const validUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  password: 'correct horse battery staple',
};

describe('registration', () => {
  const app = createApp();

  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it('creates an inactive, unverified user without roles', async () => {
    const response = await request(app).post(`${API}/auth/register`).send(validUser);

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({
      email: validUser.email,
      displayName: validUser.firstName,
      roles: [],
      active: false,
      verified: false,
    });
    expect(response.body.user.password).toBeUndefined();
  });

  it.each([
    ['roles', ['admin']],
    ['active', true],
    ['verified', true],
    ['provider', 'google'],
  ])('rejects the server-controlled field "%s"', async (field, value) => {
    const response = await request(app)
      .post(`${API}/auth/register`)
      .send({ ...validUser, [field]: value });

    expect(response.status).toBe(400);
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: field })]),
    );
    expect(await UserModel.countDocuments()).toBe(0);
  });

  it.each([
    ['too short', 'short'],
    ['longer than bcrypt can hash', 'x'.repeat(73)],
  ])('rejects a password that is %s', async (_reason, password) => {
    const response = await request(app)
      .post(`${API}/auth/register`)
      .send({ ...validUser, password });

    expect(response.status).toBe(400);
  });

  it('does not let password-less (Google) accounts sign in with a password', async () => {
    await UserModel.create({
      email: 'google@example.com',
      firstName: 'G',
      lastName: 'User',
      provider: 'google',
    });

    const response = await request(app)
      .post(`${API}/auth/login`)
      .send({ email: 'google@example.com', password: '' });
    const withPassword = await request(app)
      .post(`${API}/auth/login`)
      .send({ email: 'google@example.com', password: 'anything' });

    expect(response.status).toBe(400);
    expect(withPassword.status).toBe(401);
  });
});
