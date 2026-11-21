/** Single-use code handed to the front end after a social sign-in (stored hashed). */
export interface IOAuthCode {
  codeHash: string;
  userId: string;
  expiresAt: Date;
}
