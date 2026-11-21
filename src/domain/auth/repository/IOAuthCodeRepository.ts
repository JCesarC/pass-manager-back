import { IOAuthCode } from '../interfaces';

export interface IOAuthCodeRepository {
  create(code: IOAuthCode): Promise<void>;
  /** Atomically deletes an unexpired code and returns its user id, or null. */
  consume(codeHash: string): Promise<string | null>;
}
