import { injectable } from 'inversify';

import { IOAuthCode } from '../../../../../../domain/auth/interfaces';
import { IOAuthCodeRepository } from '../../../../../../domain/auth/repository/IOAuthCodeRepository';
import OAuthCodeModel from '../models/OAuthCodeSchema';

@injectable()
export class OAuthCodeRepository implements IOAuthCodeRepository {
  async create(code: IOAuthCode): Promise<void> {
    await OAuthCodeModel.create(code);
  }

  async consume(codeHash: string): Promise<string | null> {
    const code = await OAuthCodeModel.findOneAndDelete({ codeHash, expiresAt: { $gt: new Date() } });
    return code?.userId ?? null;
  }
}
