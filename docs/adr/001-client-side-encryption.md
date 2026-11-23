# ADR-001: Client-side encryption with a wrapped user key

- **Status:** accepted
- **Date:** 2026-11-23
- **Milestone:** M2

## Context

Until M1 the API stored vault data in plain text and verified a password that it received in clear.
Anyone with database access, or with control of the server, could read every secret. For a password
manager that is the main risk to remove.

## Decision

1. All vault content is encrypted and decrypted **in the browser** with AES-256-GCM (WebCrypto). The
   server only stores `EncString` values (see [SECURITY-DESIGN.md](../SECURITY-DESIGN.md)).
2. The master password never leaves the browser. It is stretched with PBKDF2-SHA256 (600 000
   iterations, per-user random salt) into a `masterKey`. HKDF then splits it into an `authHash`, used to
   authenticate, and a `wrapKey`, used for encryption. The two cannot be derived from each other.
3. Items are encrypted with a random **`userKey`**, not with a password-derived key. The server stores
   `userKey` only wrapped by `wrapKey`.
4. The server stores `bcrypt(authHash)`, never `authHash` itself.
5. Ciphertexts are bound to their context with AAD (user, item id, type).

## Alternatives considered

- **Server-side encryption with a server key:** simpler, but anyone who controls the server can still
  read everything. Rejected because it is not zero-knowledge.
- **Encrypting items directly with the password-derived key:** a master password change would require
  downloading, decrypting and re-encrypting the whole vault in one transaction. Rejected in favor of
  key wrapping.
- **Argon2id instead of PBKDF2:** stronger against GPUs, but it is not native in WebCrypto and would
  need a WASM dependency. PBKDF2 at 600k iterations follows current OWASP guidance; the KDF is stored
  per user so it can migrate to Argon2id later.
- **SRP / OPAQUE (PAKE):** avoids sending any password-derived value. Stronger, but complex and with
  few audited JavaScript libraries. `authHash` sent over TLS and stored with bcrypt is the pragmatic
  trade-off (the same model as Bitwarden).

## Consequences

- **Positive:** a database dump or a passive server compromise exposes no secrets. Master password
  changes are cheap and atomic.
- **Negative:**
  - Forgotten master password means lost data; there is no recovery.
  - Search, sorting and validation of content can only happen on the client.
  - Pre-M2 data cannot be migrated and is dropped.
- **Follow-ups:** user key rotation, Argon2id, and master password change for Google-only accounts.
