export interface IOAuthCode {
  codeHash: string;
  userId: string;
  expiresAt: Date;
}
