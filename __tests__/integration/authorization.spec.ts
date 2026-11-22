import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import NoteModel from '../../src/infrastructure/persistance/mongoose/database/notes/models/NoteSchema';
import VaultModel from '../../src/infrastructure/persistance/mongoose/database/vaults/models/VaultSchema';
import FieldModel from '../../src/infrastructure/persistance/mongoose/database/Fields/models/FieldSchema';
import FieldTypeModel from '../../src/infrastructure/persistance/mongoose/database/FieldsTypes/models/FieldTypeSchema';
import FieldValueModel from '../../src/infrastructure/persistance/mongoose/database/FieldValues/models/FieldValueSchema';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';
import { API, createAuthenticatedUser, TestUser } from '../helpers/auth';

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

  describe('users', () => {
    it('only exposes the caller\'s own profile', async () => {
      const response = await request(app).get(`${API}/users/me`).set('Authorization', bob.authHeader);

      expect(response.status).toBe(200);
      expect(response.body.user._id).toBe(bob.id);
      expect(response.body.user.password).toBeUndefined();
    });

    it('does not offer a user listing', async () => {
      const response = await request(app).get(`${API}/users`).set('Authorization', bob.authHeader);

      expect(response.status).toBe(404);
    });
  });

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
  describe('vaults', () => {
    let aliceVaultId: string;

    beforeEach(async () => {
      const created = await request(app)
        .post(`${API}/vaults`)
        .set('Authorization', alice.authHeader)
        .send({ name: 'Email', data: 'alice-secret', dataFieldType: 'password' })
        .expect(201);
      aliceVaultId = created.body._id;
    });

    it('assigns new vaults to the authenticated user', async () => {
      const vault = await VaultModel.findById(aliceVaultId);

      expect(vault?.user.toString()).toBe(alice.id);
    });

    it('lets the owner read, update and delete their vault', async () => {
      const auth = { Authorization: alice.authHeader };

      await request(app).get(`${API}/vaults/${aliceVaultId}`).set(auth).expect(200);
      const updated = await request(app)
        .put(`${API}/vaults/${aliceVaultId}`)
        .set(auth)
        .send({ name: 'Personal email' })
        .expect(200);
      await request(app).delete(`${API}/vaults/${aliceVaultId}`).set(auth).expect(204);

      expect(updated.body.name).toBe('Personal email');
      expect(await VaultModel.countDocuments()).toBe(0);
    });

    it('does not list another user\'s vaults', async () => {
      const response = await request(app).get(`${API}/vaults`).set('Authorization', bob.authHeader);

      expect(response.status).toBe(200);
      expect(response.body.vaults).toEqual([]);
    });

    it.each([
      ['read', 'get', undefined],
      ['update', 'put', { name: 'Hacked by Bob' }],
      ['delete', 'delete', undefined],
    ] as const)('cannot %s another user\'s vault (404, not 403)', async (_action, method, body) => {
      const response = await request(app)
        [method](`${API}/vaults/${aliceVaultId}`)
        .set('Authorization', bob.authHeader)
        .send(body);

      expect(response.status).toBe(404);

      const vault = await VaultModel.findById(aliceVaultId);
      expect(vault?.name).toBe('Email');
    });

    it.each([
      ['user', () => alice.id],
      ['extraFields', () => ['64b7f0f0f0f0f0f0f0f0f0f0']],
    ])('rejects the server-controlled field "%s"', async (field, value) => {
      const response = await request(app)
        .post(`${API}/vaults`)
        .set('Authorization', bob.authHeader)
        .send({ name: 'Spoofed', data: 'x', dataFieldType: 'password', [field]: value() });

      expect(response.status).toBe(400);
    });

    describe('field values', () => {
      let fieldId: string;

      beforeEach(async () => {
        const type = await FieldTypeModel.create({ name: 'text' });
        const field = await FieldModel.create({ name: 'Recovery code', type: type._id });
        fieldId = field._id.toString();
      });

      it('lets the owner add a field value, returned with the vault', async () => {
        await request(app)
          .post(`${API}/fieldValues`)
          .set('Authorization', alice.authHeader)
          .send({ field: fieldId, value: '1234-5678', vault: aliceVaultId })
          .expect(201);

        const vault = await request(app)
          .get(`${API}/vaults/${aliceVaultId}`)
          .set('Authorization', alice.authHeader)
          .expect(200);

        expect(vault.body.extraFields).toHaveLength(1);
        expect(vault.body.extraFields[0].value).toBe('1234-5678');
      });

      it('cannot add a field value to another user\'s vault', async () => {
        const response = await request(app)
          .post(`${API}/fieldValues`)
          .set('Authorization', bob.authHeader)
          .send({ field: fieldId, value: 'injected', vault: aliceVaultId });

        expect(response.status).toBe(404);
        expect(await FieldValueModel.countDocuments()).toBe(0);
      });

      it('deletes the field values together with their vault', async () => {
        await request(app)
          .post(`${API}/fieldValues`)
          .set('Authorization', alice.authHeader)
          .send({ field: fieldId, value: '1234-5678', vault: aliceVaultId })
          .expect(201);

        await request(app)
          .delete(`${API}/vaults/${aliceVaultId}`)
          .set('Authorization', alice.authHeader)
          .expect(204);

        expect(await FieldValueModel.countDocuments()).toBe(0);
      });
    });
  });
});
