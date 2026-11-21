/**
 * A refresh token as stored by the server. Only a SHA-256 hash of the
 * token is persisted; the raw value lives exclusively in the client's
 * httpOnly cookie.
 */
export interface IRefreshToken {
  userId: string;
  tokenHash: string;
  /** All tokens obtained by rotating the same login share a family. */
  familyId: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  replacedByHash?: string | null;
}
