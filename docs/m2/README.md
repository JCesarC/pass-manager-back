# M2 — Zero-knowledge core: work plan

The contract for this milestone is [SECURITY-DESIGN.md](../SECURITY-DESIGN.md) (decision record:
[ADR-001](../adr/001-client-side-encryption.md)). Read it before starting any task.

**Definition of Done (from the roadmap):** a full database dump does not allow recovering any secret,
and the design document explains why.

## Back-end tasks

| ID | Task | Owner | Depends on | Guide |
|---|---|---|---|---|
| M2-B1 | Security design, ADR and this plan (ZK-01) | Claude | — | this PR |
| M2-B2 | Auth v2: shared `EncString` schema, prelogin, register/login with `authHash`, KDF and wrapped key storage, `GET`/`PUT /users/me/keys` (ZK-03) | Claude | B1 | — |
| M2-B3 | Encrypted vault items API: `/vault-items` CRUD, client ids, revisions (ZK-05, ZK-06) | JCesarC | B1, B2 step 1 | [B3](B3-vault-items.md) |
| M2-B4 | Remove the legacy modules (vaults, fields, field values, notes, roles) and their collections | JCesarC | B3 | [B4](B4-remove-legacy-modules.md) |
| M2-B5 | Master password change endpoint (ZK-09) | JCesarC | B2 | [B5](B5-change-master-password.md) |
| M2-B6 | DoD suite: simulated client crypto, database dump assertions, test vectors; README security model | Claude | B2, B3 | — |

```
B1 ──▶ B2 (step 1: EncString schema) ──▶ B3 ──▶ B4
        └──────────▶ B2 (rest) ──▶ B5
                         B2 + B3 ──▶ B6
```

B2 lands the shared `EncString` validator first, in a small PR, so B3 can start right away.

## Front-end tasks (`pass-manager` repo)

ZK-02 (KDF), ZK-04 (item encryption), ZK-06 (item types UI), ZK-07 (local search), ZK-08 (lock and
clipboard), ZK-09 (master password change UI) and ZK-10 (known-answer tests). The front end builds and
tests its crypto module against the test vectors in §9 of the design first; the flows follow as the
endpoints above land.

## Workflow

- One branch per task: `feat/m2-b3-vault-items`, `refactor/m2-b4-remove-legacy`,
  `feat/m2-b5-change-master-password`.
- Small Conventional Commits, in English, with no AI attribution and no code comments; document
  endpoints with tsoa decorators.
- Before opening a PR: `npm run typecheck && npm run lint && npm test && npm run build`. Commit the
  regenerated `public/swagger.json`.
- Use the PR template, then ask Claude for a review.
