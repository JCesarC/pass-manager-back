import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import { SignInWithGoogleUseCase } from '../../src/application/auth/UseCases';
import { OAuthCodeService } from '../../src/application/auth/services/OAuthCodeService';
import { UnauthorizedError } from '../../src/application/shared';
import { IGoogleProfile } from '../../src/domain/auth/models/IGoogleProfileModel';
import { OAuthCodeRepository } from '../../src/infrastructure/persistance/mongoose/database/oauthCodes/repository/OAuthCodeRepository';
import OAuthCodeModel from '../../src/infrastructure/persistance/mongoose/database/oauthCodes/models/OAuthCodeSchema';
import { UserRepository } from '../../src/infrastructure/persistance/mongoose/database/users/repository/UserRepository';
import UserModel from '../../src/infrastructure/persistance/mongoose/database/users/models/UserSchema';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';
import { API, createAuthenticatedUser, getRefreshCookie } from '../helpers/auth';

const googleProfile = (overrides: Partial<IGoogleProfile['_json']> = {}) =>
  ({
    id: 'google-id',
    displayName: 'Jane Doe',
    name: { givenName: 'Jane', familyName: 'Doe' },
    _json: { email: 'jane@gmail.com', email_verified: true, picture: 'https://example.com/a.png', ...overrides },
  }) as unknown as IGoogleProfile;

describe('Google sign-in', () => {
  const app = createApp();
  const codes = new OAuthCodeService(new OAuthCodeRepository());
  const signIn = new SignInWithGoogleUseCase(new UserRepository());

  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  describe('identity', () => {
    it('creates a verified, password-less user for a new Google account', async () => {
      const userId = await signIn.execute(googleProfile());
      const user = await UserModel.findById(userId);

      expect(user).toMatchObject({ email: 'jane@gmail.com', provider: 'google', verified: true });
      expect(user?.password).toBeUndefined();
    });

    it('signs into the existing account with the same email', async () => {
      const existing = await createAuthenticatedUser(app, 'jane');
      await UserModel.updateOne({ _id: existing.id }, { email: 'jane@gmail.com' });

      const userId = await signIn.execute(googleProfile());

      expect(userId).toBe(existing.id);
      expect(await UserModel.countDocuments()).toBe(1);
    });

    it('rejects Google accounts whose email is not verified', async () => {
      await expect(signIn.execute(googleProfile({ email_verified: false }))).rejects.toBeInstanceOf(
        UnauthorizedError,
      );
      expect(await UserModel.countDocuments()).toBe(0);
    });
  });

  describe('code exchange', () => {
    const exchange = (code: string) => request(app).post(`${API}/auth/oauth/exchange`).send({ code });

    it('exchanges a code for a session, like login', async () => {
      const userId = await signIn.execute(googleProfile());
      const code = await codes.issue(userId);

      const response = await exchange(code).expect(200);

      expect(response.body).toMatchObject({ tokenType: 'Bearer', user: { email: 'jane@gmail.com' } });
      expect(getRefreshCookie(response.headers['set-cookie'])).not.toBe('');
      await request(app)
        .get(`${API}/users/me`)
        .set('Authorization', `Bearer ${response.body.accessToken}`)
        .expect(200);
    });

    it('stores only a hash of the code', async () => {
      const code = await codes.issue(await signIn.execute(googleProfile()));
      const stored = await OAuthCodeModel.find().lean();

      expect(stored).toHaveLength(1);
      expect(stored[0].codeHash).not.toBe(code);
    });

    it('accepts each code only once', async () => {
      const code = await codes.issue(await signIn.execute(googleProfile()));

      await exchange(code).expect(200);
      const replay = await exchange(code);

      expect(replay.status).toBe(401);
    });

    it('rejects expired and unknown codes', async () => {
      const code = await codes.issue(await signIn.execute(googleProfile()));
      await OAuthCodeModel.updateMany({}, { $set: { expiresAt: new Date(Date.now() - 1000) } });

      await exchange(code).expect(401);
      await exchange('x'.repeat(43)).expect(401);
    });

    it('rejects malformed codes', async () => {
      await exchange('not a code!').expect(400);
    });
  });

  describe('redirects', () => {
    it('sends failures back to the front end without leaking details', async () => {
      const response = await request(app).get(`${API}/auth/oauth/failure`);

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe(
        'http://localhost:5173/auth/callback?error=google_sign_in_failed',
      );
    });

    it('reports Google sign-in as unavailable when it is not configured', async () => {
      const response = await request(app).get(`${API}/auth/oauth/google`);

      expect(response.status).toBe(404);
    });
  });
});
