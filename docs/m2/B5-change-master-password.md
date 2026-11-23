# M2-B5 — Master password change

**Owner:** JCesarC · **Branch:** `feat/m2-b5-change-master-password` · **Depends on:** B2 merged ·
**Roadmap:** ZK-09

## Goal

Let a signed-in user change their master password without re-encrypting the vault. The client
re-wraps the same `userKey` with a key derived from the new password (see §7 of
[SECURITY-DESIGN.md](../SECURITY-DESIGN.md)). The server verifies the current credentials, swaps the
stored credentials atomically and signs out every other session.

## What B2 gives you

- **User fields:**
  - `authVerifier`: `bcrypt(authHash)`, never returned by the API.
  - `kdf`: `{ name, iterations, salt }`.
  - `protectedUserKey`: an `EncString`.
- **Validators** (`application/auth/AuthValidator.ts`): `authHashSchema`, `kdfSchema`, plus
  `encStringSchema` (`application/shared/encString.ts`).
- **Hashing:** `AuthService.hashAuthHash()` and `AuthService.verifyAuthHash()`.
- **Sessions:** `SessionService.start(userId)`, the refresh-token cookie sink pattern in
  `AuthController`, and the lockout helpers in `UserRepository` (`registerFailedLogin`,
  `resetFailedLogins`).

## Contract

`POST /api/v1/auth/change-master-password`. It requires `Authorization: Bearer`, so it is **not**
public. The `/auth` rate limit and the origin check apply automatically.

Request:

```json
{
  "currentAuthHash": "<base64, 32 bytes>",
  "newAuthHash": "<base64, 32 bytes>",
  "kdf": { "name": "PBKDF2-SHA256", "iterations": 600000, "salt": "<base64, 16 bytes>" },
  "protectedUserKey": { "v": 1, "alg": "A256GCM", "iv": "…", "ct": "…" }
}
```

Responses:

| Status | When |
|---|---|
| `200 { accessToken, tokenType, expiresIn }` + new refresh cookie | Changed |
| `400 VALIDATION_ERROR` | Invalid shape; `newAuthHash` equal to `currentAuthHash`; or `kdf.iterations < 600000` |
| `400 VALIDATION_ERROR` | The account has no `authVerifier` (Google-only) |
| `401 INVALID_CREDENTIALS` | `currentAuthHash` is wrong (counts toward the account lockout) |
| `401 UNAUTHORIZED` | Missing or invalid access token |

## Implementation plan

1. **Validator:** `changeMasterPasswordSchema` in `AuthValidator.ts`. Use
   `Joi.invalid(Joi.ref('currentAuthHash'))` on `newAuthHash`.
2. **Repository:**
   - `IUserRepository.replaceCredentials(userId, { authVerifier, kdf, protectedUserKey })` updates the
     three fields in a single `updateOne`, so they can never get out of sync.
   - `IRefreshTokenRepository.revokeAllForUser(userId)`.
3. **Use case** `ChangeMasterPasswordUseCase` (`application/auth/UseCases/ChangeMasterPassword.ts`):
   1. Load the user.
   2. If there is no `authVerifier`, throw `ValidationError`.
   3. If the account is locked, throw `InvalidCredentialsError` (same behavior as login).
   4. Verify `currentAuthHash`. If it fails, call `registerFailedLogin` and throw
      `InvalidCredentialsError`.
   5. Hash `newAuthHash` and call `replaceCredentials`.
   6. Call `revokeAllForUser`, then `resetFailedLogins`.
   7. Return `SessionService.start(userId)` (a fresh access token and refresh token).
4. **Controller:**
   - Add `changeMasterPassword(@Body() body, @Inject() userId, @Inject() sendRefreshToken)` to
     `AuthController`.
   - Mark the method itself with `@Security('bearer')`: the class has no security, so only this
     operation is protected in the spec.
   - Document 200/400/401 with examples.
5. **Handler and router:** `authRouter.post('/change-master-password', …)`. Because the route is not in
   `PUBLIC_ROUTES`, `authenticate()` already protects it.
6. **Docs:** regenerate the spec, update the README API overview, and tick ZK-09 for the back end.

## Tests (`__tests__/integration/change-master-password.spec.ts`)

Register users through the B2 test helper. It produces `authHash`, `kdf` and `protectedUserKey` the
way a client would.

- **Success:**
  - Returns `200` and a new cookie.
  - Login with the old `authHash` fails (`401`); login with the new one succeeds.
  - `GET /users/me/keys` returns the new `kdf` and `protectedUserKey`.
- **Other sessions are revoked:** a refresh with a cookie from a second login made before the change
  returns `401`.
- **Wrong current hash:** `401`, and nothing changes in the database.
- **Lockout:** 5 wrong attempts lock the account. While it is locked, even the correct
  `currentAuthHash` returns `401`.
- **Validation:**
  - `newAuthHash` equal to `currentAuthHash`.
  - `iterations: 1000`.
  - A malformed `protectedUserKey`.
  - Unknown fields.
- **No token:** `401`.
- **Google-only account** (no `authVerifier`): `400`.

## Acceptance criteria

- [ ] Every test above passes, and the rest of the suite stays green.
- [ ] The credentials update is a single database write.
- [ ] The spec documents the operation as bearer-protected with all its responses.
- [ ] Typecheck, lint and build pass, with no code comments.

## Pitfalls

- Never log or return `authHash`, `authVerifier` or `protectedUserKey` values in errors. The logger
  redaction covers `secret`/`token`-like keys, but not these names: add `authHash`,
  `currentAuthHash`, `newAuthHash` and `authVerifier` to `REDACTED_PATHS` if B2 has not done it.
- Revoke the old sessions **before** issuing the new one, otherwise the new family gets revoked too.
- Do not reuse the login lockout message in a way that tells the user whether the account exists; the
  user is authenticated here, so a plain `INVALID_CREDENTIALS` is fine.

<details>
<summary>Hint: atomic credentials update</summary>

```ts
async replaceCredentials(userId: string, credentials: { authVerifier: string; kdf: Kdf; protectedUserKey: EncString }) {
  await UserModel.updateOne({ _id: userId }, { $set: credentials });
}
```

</details>

<details>
<summary>Hint: revoking every session</summary>

```ts
async revokeAllForUser(userId: string): Promise<void> {
  await RefreshTokenModel.updateMany({ userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
}
```

</details>
