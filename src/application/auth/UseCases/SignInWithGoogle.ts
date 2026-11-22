import { IGoogleProfile } from '../../../domain/auth/models/IGoogleProfileModel';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';
import { UnauthorizedError } from '../../shared';

export class SignInWithGoogleUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(profile: IGoogleProfile): Promise<string> {
    const { email, email_verified: emailVerified } = profile._json;
    if (!email || !emailVerified) {
      throw new UnauthorizedError('The Google account email is not verified.');
    }

    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) return existingUser._id.toString();

    const created = await this.userRepository.create({
      email,
      firstName: profile.name?.givenName || email,
      lastName: profile.name?.familyName || '-',
      displayName: profile.displayName,
      photoURL: profile._json.picture,
      active: true,
      verified: true,
      provider: 'google',
    });
    return created._id.toString();
  }
}
