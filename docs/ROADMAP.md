# Roadmap — Pass Manager v2

> Backlog produced from the code audit of November 2026.
> Supersedes `todo.md`, which is kept as a historical record.
>
> **Goal:** a **zero-knowledge** password manager with a public demo, automated tests and CI,
> built to be the centerpiece of a portfolio.
>
> **Conventions**
> - Every item becomes a GitHub issue and a small PR: `type(scope): description` (Conventional Commits).
> - `[BACK]` = this repo · `[FRONT]` = `pass-manager` · `[BOTH]` = both repos.
> - Priority: **P0** blocks the demo · **P1** required to look professional · **P2** differentiator.
> - A milestone is closed only when it meets its **Definition of Done (DoD)**.

---

## Scope decisions

| Keep | Frozen (out of the MVP) | Remove |
|---|---|---|
| Auth, Users, Vaults/Items | Roles and modules (super admin) | Notes with public images on S3 |
| Fields / FieldTypes (if simplified into "item types") | Phone login | Empty scaffolding files |
| Swagger / OpenAPI | WebSockets | Unused `aws-sdk` v2, `swagger-jsdoc`, `winston` |

**Notes** become an encrypted item type ("Secure note") inside the vault instead of a separate module.

---

## M0 — Cleanup and healthy baseline

**DoD:** `docker compose up` starts the API and MongoDB from scratch following the README; `npm audit --omit=dev` reports no critical or high vulnerabilities; no empty files remain.

**Status:** DoD met on branch `chore/m0-cleanup` (production audit: 0 vulnerabilities). Only CHORE-08 is pending.

Found and fixed during M0 (not in the original audit): `IModule` extended the DOM `Document` type; Mongoose `strictQuery` is now explicit; tsoa only generates the spec (the unused generated routes were removed); a stale front-end bundle served at `/` was removed.

### Bugs

- [x] **BUG-01** `[BACK]` Environment variable mismatch: the code reads `MONGODB_URL` while `.env.template` declares `MONGO_URL`.
- [x] **BUG-02** `[BACK]` `BaseRepository.query/queryOne` (and the copy in `VaultRepository`) call `find({ query })`; it must be `find(query)`.
- [x] **BUG-03** `[BACK]` The user model is registered as `'Users'` but references point to `'User'`, so `populate` fails.
- [x] **BUG-04** `[BACK]` `roles` in `UserSchema` is a single ObjectId whose `ref` is a model object, while the validator expects an array. (Roles are frozen; make the shape consistent.)
- [x] **BUG-05** `[BACK]` OAuth `callbackURL` and `failureRedirect` are missing the `/v1` prefix, so Google sign-in is broken.
- [x] **BUG-06** `[BACK]` `authRouter.use('/login')` accepts any HTTP method; it must be `post`.
- [x] **BUG-07** `[BACK]` `createVault` persists the request body without validation. *(Validated now; taking the owner from the token is SEC-02.)*
- [x] **BUG-08** `[BACK]` `email` has no unique index (race condition on registration).
- [x] **BUG-09** `[BACK]` `stopServer` exits with code 0 after an `uncaughtException`/`unhandledRejection`; it must exit with a non-zero code.

### Maintenance

- [x] **CHORE-01** Remove the ~60 empty files and unused folders (`sessions`, `redis`, empty `health`, empty logger…).
- [x] **CHORE-02** Upgrade to Node 22 LTS, TypeScript 5, Jest 30, ESLint 9 (flat config); add `.nvmrc` and `engines`. *(Mongoose 8 and tsoa 6 moved to ARCH-06: tsoa cannot resolve Mongoose's generic `Document` types until ARCH-01 is done.)*
- [x] **CHORE-03** Tidy dependencies: drop `aws-sdk` v2, `swagger-jsdoc`, `winston`, `esbuild`, `uuid` if unused; move `@faker-js/faker` and `ts-node-dev` to devDependencies.
- [x] **CHORE-04** Replace webpack with `tsc`: a Node API does not need bundling.
- [x] **CHORE-05** Centralized configuration validated at startup instead of reading `process.env` at import time in each module.
- [x] **CHORE-06** Multi-stage `Dockerfile` + `docker-compose.yml` (API + MongoDB).
- [x] **CHORE-07** Remove personal data from the Swagger examples and use fake data.
- [ ] **CHORE-08** Delete the 15 remote branches already merged into `main`. *(Pending owner approval.)*
- [x] **CHORE-09** Initial v2 README: what it is, stack, how to run it, environment variables.

---

## M1 — Backend security baseline

**DoD:** no non-public endpoint answers without a token; an automated test proves that user A cannot read, edit or delete user B's resources.

**Status:** DoD met on branch `feat/m1-security-baseline`: `authentication.spec.ts` checks every protected route and `authorization.spec.ts` proves cross-user isolation for users, notes, vaults and field values (102 integration tests in total). SEC-13…15 and FE-01 were found during M1 and remain open.

- [x] **SEC-01** Global authentication with an explicit allowlist of public routes (`/auth/register`, `/auth/login`, `/health`, `/docs`).
- [x] **SEC-02** Ownership-based access control: the `userId` always comes from the token, never from the body or params. Applies to vaults, items, notes and fieldValues.
- [x] **SEC-03** Remove the global `GET /users` and `GET /vaults` (or restrict them to a future admin role); replace them with `GET /me/...`.
- [x] **SEC-04** Tokens: short-lived access token (~15 min) + rotating refresh token in an `httpOnly; Secure; SameSite=Strict` cookie; revoking logout; `Authorization: Bearer` header.
- [x] **SEC-05** Rate limiting on `/auth/*` (e.g. `express-rate-limit`) and progressive lockout on failed attempts.
- [x] **SEC-06** Per-environment CORS allowlist; body size limit on `express.json` (e.g. 100 kb); review helmet defaults.
- [x] **SEC-07** OAuth: never send the token in the query string; use a one-time code or a cookie; the front-end URL comes from config.
- [x] **SEC-08** Central error middleware: a single shape (`{ error: { code, message } }`), no internal messages leaked, correct HTTP codes (login → 200, delete → 204 without body).
- [x] **SEC-09** Structured logger (pino) redacting `password`, `token`, `authorization` and `data`; remove every `console.log`. *(Request bodies are never logged, so `data` cannot leak.)*
- [x] **SEC-10** Validate **every** body and param (including `ObjectId`s and pagination with a maximum `limit`).
- [x] **SEC-11** Uploads disabled until M2. If they come back: private, signed URLs, type/size limits, encrypted on the client. *(Removed entirely, with their dependencies.)*
- [x] **SEC-12** Mass assignment on registration: the user validator accepts `roles`, `active`, `verified` and `provider` from the client. Registration must only accept profile fields and credentials.
- [ ] **SEC-13** `POST /fields` lets any authenticated user add entries to the global field catalog. Make fields per-user or admin-only (decide together with ZK-06).
- [ ] **SEC-14** If the front end is deployed on another site (`COOKIE_SAME_SITE=none`), add CSRF protection to `/auth/refresh` and `/auth/logout` (e.g. a required custom header or a double-submit token).
- [ ] **SEC-15** Rate limits use an in-memory store: switch to a shared store (e.g. Redis) before running more than one API instance.
- [ ] **FE-01** `[FRONT]` Adopt the M1 API contract: `Authorization: Bearer`, `POST /auth/refresh` with `credentials: 'include'`, `GET /users/me`, the `{ error: { code, message } }` format and the `/auth/callback?code=` Google flow.

---

## M2 — Zero-knowledge core (the portfolio centerpiece)

**DoD:** a full database dump does not allow recovering any secret; the design document explains why.

- [ ] **ZK-01** `[BOTH]` Write `docs/SECURITY-DESIGN.md`: threat model, key derivation, ciphertext format and what the server can see (ADR-001).
- [ ] **ZK-02** `[FRONT]` Key derivation: master password + salt → Argon2id (WASM) or PBKDF2-SHA256 with ≥ 600k iterations, producing `encKey` (never leaves the browser) and `authHash` (sent to the server).
- [ ] **ZK-03** `[BACK]` The server stores `bcrypt/argon2(authHash)`, never the master password; registration and login adapted.
- [ ] **ZK-04** `[FRONT]` Per-item AES-256-GCM encryption (WebCrypto), random IV per item, schema version inside the payload.
- [ ] **ZK-05** `[BACK]` `VaultItem { owner, type, encryptedData, iv, version, createdAt, updatedAt }` model; the backend never knows the content.
- [ ] **ZK-06** `[BOTH]` Item types: login, secure note, card (replaces or simplifies the generic Fields/FieldValues).
- [ ] **ZK-07** `[FRONT]` Local search over the decrypted in-memory data.
- [ ] **ZK-08** `[FRONT]` Auto-lock on inactivity (wipes the key from memory) and self-clearing clipboard.
- [ ] **ZK-09** `[BOTH]` Master password change with vault re-encryption.
- [ ] **ZK-10** `[FRONT]` Known-answer tests for KDF and encryption (round-trip; tampered ciphertext → failure).

---

## M3 — Quality and CI

**DoD:** CI green on every PR; coverage ≥ 70 % in `application/` and `domain/`.

- [ ] **QA-01** Use-case unit tests with mocked repositories.
- [ ] **QA-02** Integration tests with `supertest` + `mongodb-memory-server` (auth, item CRUD, cross-user authorization).
- [ ] **QA-03** GitHub Actions: lint → typecheck → tests → `npm audit` → Docker image build.
- [ ] **QA-04** Dependabot / Renovate + CodeQL.
- [ ] **QA-05** Husky + lint-staged + commitlint (Conventional Commits).
- [ ] **QA-06** A single source of truth for OpenAPI: either use tsoa's generated routes or remove tsoa. No two routing systems. *(Generated routes were removed in M0; decide whether to adopt them or replace tsoa.)*
- [ ] **QA-07** Format the whole codebase with Prettier in a single `style:` commit and reconcile the ESLint formatting rules (`indent`, `quotes`, `semi`) with Prettier. Also drop `fixToUnknown` from `no-explicit-any`: `eslint --fix` silently rewrites `any` to `unknown` and breaks types.

## M3.5 — Architectural consistency

- [ ] **ARCH-01** The domain does not depend on Mongoose: plain entities/interfaces and mappers in infrastructure.
- [ ] **ARCH-02** A single composition root: everything is resolved from the Inversify container (no `new Repository()` in controllers or handlers).
- [ ] **ARCH-03** Infrastructure never imports from presentation (today `passportConfig` imports a controller).
- [ ] **ARCH-04** Base `UseCase<I, O>` interface with a single method name (today both `exec` and `execute` exist).
- [ ] **ARCH-05** Document the structure in `docs/ARCHITECTURE.md` with a diagram (ADR-002).
- [ ] **ARCH-06** After ARCH-01: upgrade to Mongoose 8+ and tsoa 6+, move the tsoa CLI to devDependencies (runtime decorators from `@tsoa/runtime`) to shrink the Docker image (~520 MB today).

---

## M4 — Demo and presentation

**DoD:** a recruiter can open a public URL, use a demo account and understand the project by reading only the README.

- [ ] **DEMO-01** Deploy the API (Render / Fly.io / Railway) + MongoDB Atlas free tier.
- [ ] **DEMO-02** `[FRONT]` Deploy the front end (Vercel / Netlify) over HTTPS.
- [ ] **DEMO-03** Demo account with fake data that is reset periodically.
- [ ] **DEMO-04** Final README: CI badges, demo GIF, diagram, "Security model" section, technical decisions, lessons learned.
- [ ] **DEMO-05** `/health` endpoint (liveness + database connectivity).
- [ ] **DEMO-06** `v2.0.0` release + `CHANGELOG.md` telling the evolution since v1.

---

## M5 — Differentiators (optional, in this order)

- [ ] **FEAT-01** `[FRONT]` Configurable password generator + strength meter (zxcvbn).
- [ ] **FEAT-02** `[BOTH]` Breached-password check with HaveIBeenPwned k-anonymity (only the 5-character SHA-1 prefix is sent).
- [ ] **FEAT-03** `[BOTH]` TOTP two-factor authentication for login.
- [ ] **FEAT-04** `[BOTH]` Encrypted vault export/import (JSON) and CSV import from Bitwarden/Chrome.
- [ ] **FEAT-05** `[BACK]` Per-user security log (sign-ins, master password changes, devices).
- [ ] **FEAT-06** `[BOTH]` Item sharing between users with public-key cryptography (advanced).
- [ ] **FEAT-07** Browser extension with autofill (advanced).

---

## Out of scope (for now)

Super-admin roles and modules · phone login · WebSockets · Redis ·
notes with public images · any AI feature that processes user secrets.
