import { IssuedRefreshToken } from '../../../../application/auth/services/RefreshTokenService';
import { UserProfile } from './users';

export interface AccessTokenResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface SessionResponse extends AccessTokenResponse {
  user: UserProfile;
}

export type RefreshTokenSink = (refreshToken: IssuedRefreshToken) => void;

export interface OAuthExchangeInput {
  code: string;
}
