import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import NoteModel from '../../src/infrastructure/persistance/mongoose/database/notes/models/NoteSchema';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';
import { API, createAuthenticatedUser, TestUser } from '../helpers/auth';

/**
 * Milestone M1 Definition of Done: user B can never read, edit or delete
 * user A's resources, and cannot create resources on A's behalf.
 */
describe('authorization between users', () => {
  const app = createApp();
  let alice: TestUser;
  let bob: TestUser;

  beforeAll(connectTestDb);
  beforeEach(async () => {
    alice = await createAuthenticatedUser(app, 'alice');
    bob = await createAuthenticatedUser(app, 'bob');
  });
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  describe('notes', () => {
    let aliceNoteId: string;

    beforeEach(async () => {
      const created = await request(app)
        .post(`${API}/notes`)
        .set('Authorization', alice.authHeader)
        .send({ title: 'Alice secret', body: 'only for Alice' })
        .expect(201);
      aliceNoteId = created.body._id;
    });

    it('assigns new notes to the authenticated user', async () => {
      const note = await NoteModel.findById(aliceNoteId);

      expect(note?.user.toString()).toBe(alice.id);
    });

    it('lets the owner read, update and delete their note', async () => {
      const auth = { Authorization: alice.authHeader };

      await request(app).get(`${API}/notes/${aliceNoteId}`).set(auth).expect(200);
      const updated = await request(app)
        .put(`${API}/notes/${aliceNoteId}`)
        .set(auth)
        .send({ title: 'Renamed' })
        .expect(200);
      await request(app).delete(`${API}/notes/${aliceNoteId}`).set(auth).expect(204);

      expect(updated.body.title).toBe('Renamed');
      expect(await NoteModel.countDocuments()).toBe(0);
    });

    it('does not list another user\'s notes', async () => {
      const response = await request(app).get(`${API}/notes`).set('Authorization', bob.authHeader);

      expect(response.status).toBe(200);
      expect(response.body.notes).toEqual([]);
      expect(response.body.totalPages).toBe(0);
    });

    it.each([
      ['read', 'get', undefined],
      ['update', 'put', { title: 'Hacked by Bob' }],
      ['delete', 'delete', undefined],
    ] as const)('cannot %s another user\'s note (404, not 403)', async (_action, method, body) => {
      const response = await request(app)
        [method](`${API}/notes/${aliceNoteId}`)
        .set('Authorization', bob.authHeader)
        .send(body);

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');

      const note = await NoteModel.findById(aliceNoteId);
      expect(note?.title).toBe('Alice secret');
    });

    it('cannot create a note on behalf of another user', async () => {
      const response = await request(app)
        .post(`${API}/notes`)
        .set('Authorization', bob.authHeader)
        .send({ title: 'Spoofed', user: alice.id });

      expect(response.status).toBe(400);
      expect(await NoteModel.countDocuments({ user: alice.id })).toBe(1);
    });
  });
});
