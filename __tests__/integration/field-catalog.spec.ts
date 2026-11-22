import request from 'supertest';

import { createApp } from '../../src/presentation/rest/app';
import { SeedFieldCatalogUseCase } from '../../src/application/Fields/Usecases';
import { DEFAULT_FIELDS } from '../../src/domain/fields/defaultFieldCatalog';
import FieldModel from '../../src/infrastructure/persistance/mongoose/database/Fields/models/FieldSchema';
import FieldTypeModel from '../../src/infrastructure/persistance/mongoose/database/FieldsTypes/models/FieldTypeSchema';
import { FieldRepository } from '../../src/infrastructure/persistance/mongoose/database/Fields/repository/FieldRepository';
import { FieldTypeRepository } from '../../src/infrastructure/persistance/mongoose/database/FieldsTypes/repository/FieldTypeRepository';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../helpers/db';
import { API, createAuthenticatedUser, TestUser } from '../helpers/auth';

describe('field catalog', () => {
  const app = createApp();
  const seed = () =>
    new SeedFieldCatalogUseCase(new FieldTypeRepository(FieldTypeModel), new FieldRepository(FieldModel)).exec();
  let user: TestUser;

  beforeAll(connectTestDb);
  beforeEach(async () => {
    user = await createAuthenticatedUser(app);
  });
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it('is seeded with the default fields', async () => {
    await seed();

    const response = await request(app).get(`${API}/fields`).set('Authorization', user.authHeader).expect(200);

    expect(response.body.map((field: { name: string }) => field.name).sort()).toEqual(
      DEFAULT_FIELDS.map((field) => field.name).sort(),
    );
  });

  it('can be seeded repeatedly without duplicates', async () => {
    await seed();
    await seed();

    expect(await FieldModel.countDocuments()).toBe(DEFAULT_FIELDS.length);
  });

  it('cannot be modified by users', async () => {
    const response = await request(app)
      .post(`${API}/fields`)
      .set('Authorization', user.authHeader)
      .send({ name: 'Injected', type: '64b7f0f0f0f0f0f0f0f0f0f0' });

    expect(response.status).toBe(404);
    expect(await FieldModel.countDocuments({ name: 'Injected' })).toBe(0);
  });
});
