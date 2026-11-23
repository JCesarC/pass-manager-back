# M2-B3 — Encrypted vault items API

**Owner:** JCesarC · **Branch:** `feat/m2-b3-vault-items` · **Roadmap:** ZK-05, ZK-06

## Goal

Store and serve vault items that the server cannot read. The API only sees an item's id, type,
revision, timestamps and an encrypted blob (`EncString`). It must keep the M1 guarantees (ownership,
validation, error format) and add optimistic concurrency.

## Before you start

- Read §4–§6 of [SECURITY-DESIGN.md](../SECURITY-DESIGN.md).
- Pull `main` after **B2 step 1** is merged. It provides `src/application/shared/encString.ts` with:
  - `EncString`: `{ v: 1; alg: 'A256GCM'; iv: string; ct: string }`
  - `encStringSchema`: a Joi schema that validates the version, the algorithm, base64, the 12-byte IV
    and a maximum size.
- Reuse the patterns that already exist: `OwnedRepository`, `validate()`, `asyncHandler`,
  `getAuthUserId`, contracts with presenters, and tsoa decorators. `notes` is the closest module to
  copy from (it gets removed in B4).

## Contract

Base path: `/api/v1/vault-items`. Every route requires `Authorization: Bearer`.

| Method & path | Body | Success | Errors |
|---|---|---|---|
| `GET /` (`?page&limit`, limit ≤ 100) | — | `200 { items: VaultItem[], totalPages, currentPage }`, oldest first | 400, 401 |
| `GET /{id}` | — | `200 VaultItem` | 400 (not a UUID), 401, 404 |
| `POST /` | `{ id: uuid v4, type, data: EncString }` | `201 VaultItem` with `revision: 1` | 400, 401, 409 (id already used) |
| `PUT /{id}` | `{ data: EncString, revision: number }` | `200 VaultItem` with `revision + 1` | 400, 401, 404, 409 (revision mismatch) |
| `DELETE /{id}` | — | `204` | 400, 401, 404 |

`VaultItem` response: `{ id, type, data, revision, createdAt, updatedAt }`. Never return the owner
field or `__v`.

### Rules

- `type` ∈ `login | secureNote | card` and is **immutable**: it is part of the AAD, so changing it would
  make the item undecryptable. `PUT` does not accept `type`.
- The client generates `id` (UUID v4). It becomes the document `_id`.
- An item that belongs to another user behaves exactly like a missing one (`404`).
- `PUT` succeeds only if the stored `revision` equals the one sent. Otherwise it returns
  `409 CONFLICT` with the message "The item was modified in another session."
- Unknown fields are rejected (`400`). The server never inspects `data` beyond `encStringSchema`.

## Implementation plan

1. **Domain** (`src/domain/vaultItems/`):
   - `VAULT_ITEM_TYPES` and the `VaultItemType` type.
   - `IVaultItemModel` (Mongoose `Document` with string `_id`, `owner`, `type`, `data`, `revision`).
   - `IVaultItemRepository`, which extends `IOwnedRepository` and adds
     `updateData(id, ownerId, expectedRevision, data)`.
2. **Infrastructure:**
   - Mongoose schema `VaultItem` with `_id: String`, `owner` (indexed), `type` (enum), `data` (subdocument
     without its own `_id`), `revision` (default 1) and timestamps.
   - `VaultItemRepository` extends `OwnedRepository` with owner field `'owner'`.
   - IoC binding and a `TYPES.IVaultItemRepository` symbol.
3. **Application** (`src/application/vaultItems/`):
   - `VaultItemValidator.ts`: `createVaultItemSchema` and `updateVaultItemSchema`.
   - Use cases: `ListVaultItems`, `GetVaultItem`, `CreateVaultItem`, `UpdateVaultItem`, `DeleteVaultItem`.
   - `UpdateVaultItem`:
     - When the conditional update matches nothing, check whether the item exists for that owner.
     - If it does not exist, throw `NotFoundError('Vault item')`.
     - If it exists, the revision is stale: throw `ConflictError`.
4. **Presentation:**
   - `contracts/vaultItems.ts`: `VaultItem`, `VaultItemPage` and `presentVaultItem`.
   - `validateUuidParams('id')`, a sibling of `validateObjectIdParams`.
   - `VaultItemController` with the full set of tsoa decorators (`@Tags('Vault items')`,
     `@Security('bearer')`, `@SuccessResponse`, `@Response` for 400/401/404/409, `@Example`,
     `@OperationId`).
   - The handler and the router, mounted in `v1/router` as `/vault-items`.
5. **Docs:** `npm run swagger` and the README API overview table.

## Tests (`__tests__/integration/vault-items.spec.ts`)

Use `createAuthenticatedUser` and a helper that builds a fake but well-formed `EncString`.

- **Happy path:** create, get, list (paginated), update (revision goes from 1 to 2), delete.
- **Concurrency:** updating with `revision: 1` after it became 2 returns `409`, and the stored data is
  unchanged.
- **Authorization:**
  - User B cannot get, update or delete user A's item (`404`).
  - B's list does not include it.
  - B cannot create an item with an id A already uses (`409`), and A's item is untouched.
- **Validation:**
  - Invalid UUIDs in the path or the body.
  - An unknown `type`.
  - `type` sent in a `PUT`.
  - An `EncString` with `v: 2`, an unknown `alg`, a non-base64 `ct`, an 8-byte IV or an oversized `ct`.
  - Unknown fields, and `limit=101`.
- **Privacy:** the raw MongoDB document contains no field other than `_id`, `owner`, `type`, `data`,
  `revision`, timestamps and `__v`.

## Acceptance criteria

- [ ] Every test above passes, and the rest of the suite stays green.
- [ ] `public/swagger.json` documents all five operations with examples and error responses.
- [ ] Typecheck, lint and build pass, and there are no code comments.
- [ ] The PR uses the template and lists the new endpoints.

## Pitfalls

- With string ids, Mongoose will not cast to `ObjectId`; make sure the schema says `_id: String`.
- A duplicate `_id` raises Mongo error `11000`. `errorHandler` already maps it to `409`, so you don't
  need to pre-check.
- `findOneAndUpdate` with `$set` and `$inc` must use `{ new: true, runValidators: true }`.
- Do not let presenters spread the whole document; map field by field.
- In `PUT`, validate `revision` as an integer ≥ 1.

<details>
<summary>Hint: validator</summary>

```ts
import Joi from 'joi';

import { encStringSchema } from '../shared/encString';
import { VAULT_ITEM_TYPES } from '../../domain/vaultItems';

export const createVaultItemSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  type: Joi.string().valid(...VAULT_ITEM_TYPES).required(),
  data: encStringSchema.required(),
});

export const updateVaultItemSchema = Joi.object({
  data: encStringSchema.required(),
  revision: Joi.number().integer().min(1).required(),
});
```

</details>

<details>
<summary>Hint: conditional update in the repository</summary>

```ts
async updateData(id: string, ownerId: string, expectedRevision: number, data: EncString) {
  return this.model.findOneAndUpdate(
    { _id: id, owner: ownerId, revision: expectedRevision },
    { $set: { data }, $inc: { revision: 1 } },
    { new: true, runValidators: true, projection: { __v: 0 } },
  );
}
```

</details>

<details>
<summary>Hint: telling 404 from 409 in the use case</summary>

```ts
const updated = await this.repository.updateData(itemId, ownerId, revision, data);
if (updated) return updated;

const exists = await this.repository.findOwnedById(itemId, ownerId);
if (!exists) throw new NotFoundError('Vault item');
throw new ConflictError('The item was modified in another session.');
```

</details>

<details>
<summary>Hint: test helper for a fake EncString</summary>

```ts
import { randomBytes } from 'crypto';

export const fakeEncString = (size = 64) => ({
  v: 1,
  alg: 'A256GCM',
  iv: randomBytes(12).toString('base64'),
  ct: randomBytes(size).toString('base64'),
});
```

</details>
