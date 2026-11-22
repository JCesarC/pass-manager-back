import { IOAuthCode } from '../interfaces';

export interface IOAuthCodeRepository {
  create(code: IOAuthCode): Promise<void>;
  consume(codeHash: string): Promise<string | null>;
}
