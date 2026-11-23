# M2-B4 — Remove the legacy modules

**Owner:** JCesarC · **Branch:** `refactor/m2-b4-remove-legacy` · **Depends on:** B3 merged

## Goal

Before M2 the API stored secrets in plain text through vaults, fields, field values and notes. With
encrypted vault items (B3) those modules are obsolete and contradict the zero-knowledge model:
`secureNote` replaces notes, and custom fields live inside the encrypted payload. Roles and modules
were frozen in M0 and were never used. Removing all of them leaves a smaller, honest codebase.

## Scope

**Remove** (domain, application, infrastructure, presentation, IoC bindings, `TYPES` symbols, contracts,
tests):

| Module | Main locations |
|---|---|
| Vaults | `domain/vaults`, `application/vaults`, `database/vaults`, `web/vaults`, `contracts/vaults.ts` |
| Fields and field types (including the startup seed) | `domain/fields`, `application/Fields`, `database/Fields`, `database/FieldsTypes`, `web/Fields`, `contracts/fields.ts`, `SeedFieldCatalogUseCase` in `server.ts` |
| Field values | `domain/fieldValues`, `application/FieldValues`, `database/FieldValues`, `web/FieldValues` |
| Notes | `domain/notes`, `application/notes`, `database/notes`, `web/notes`, `contracts/notes.ts` |
| Roles and modules | `domain/roles`, `domain/modules`, `database/roles`, and `roles` in `UserSchema`, `IUserModel` and `UserProfile` |

**Keep:** `OwnedRepository` and `IOwnedRepository` (used by vault items) and `validateObjectIdParams`
(delete it only if nothing uses it any more).

**Add:** a one-off script that drops the legacy collections.

## Implementation plan

1. **Delete module by module**, one commit each. Run `npm run typecheck` after each deletion and follow
   the errors to every import, router mount, IoC setup and `TYPES` entry.
2. **Tests:**
   - Delete `field-catalog.spec.ts`.
   - Rewrite the parts of `authorization.spec.ts`, `input-validation.spec.ts` and `errors.spec.ts`
     that used notes or vaults so they use `/vault-items`. The cross-user guarantees must stay covered:
     they are the M1 DoD.
   - Update the route list in `authentication.spec.ts`.
3. **`roles`:** remove it from the user schema, the model interface, the presenter and the docs. Keep
   the registration test that proves clients cannot send `roles`; it must still return `400`.
4. **Script** `scripts/drop-legacy-collections.ts`, exposed as `npm run db:drop-legacy`:
   - It connects with `MONGODB_URL`.
   - It drops `vaults`, `fields`, `fieldtypes`, `fieldvalues`, `notes` and `roles` only when they
     exist, and prints what it did.
   - It refuses to run without `--confirm`.
   - Run it with `ts-node`; it is not part of the build.
5. **Docs:**
   - README: the API overview and project structure.
   - ROADMAP: mark this task and note SEC-13 as superseded.
   - Regenerate `public/swagger.json`.

## Acceptance criteria

- [ ] `grep -ri "vault\b\|fieldValue\|FieldType\|notes\|roles" src` only finds vault items or unrelated
      words.
- [ ] The suite is green and still proves cross-user isolation through `/vault-items`.
- [ ] The OpenAPI spec only contains auth, users and vault items.
- [ ] `npm run db:drop-legacy -- --confirm` works against the Docker MongoDB and is idempotent.
- [ ] Every commit compiles on its own.

## Pitfalls

- The route list in `authentication.spec.ts` must not reference removed routes, or it will test 401 on
  routes that no longer exist.
- `UserRepository.getFilteredUserData` and `presentUser` must stop referring to `roles`.
- The ESLint `no-unused-vars` rule will flag leftover imports; fix them, don't disable the rule.
- Do not drop the `users`, `refreshtokens` or `oauthcodes` collections.

<details>
<summary>Hint: drop script</summary>

```ts
import mongoose from 'mongoose';

import { env } from '../src/infrastructure/shared/config';

const LEGACY = ['vaults', 'fields', 'fieldtypes', 'fieldvalues', 'notes', 'roles'];

const run = async () => {
  if (!process.argv.includes('--confirm')) {
    console.error('Refusing to run without --confirm');
    process.exit(1);
  }
  await mongoose.connect(env.MONGODB_URL);
  const existing = (await mongoose.connection.db!.listCollections().toArray()).map((c) => c.name);
  for (const name of LEGACY.filter((n) => existing.includes(n))) {
    await mongoose.connection.db!.dropCollection(name);
    console.log(`dropped ${name}`);
  }
  await mongoose.disconnect();
};

run();
```

</details>
