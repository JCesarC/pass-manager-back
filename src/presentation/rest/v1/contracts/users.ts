import { IUserModel } from '../../../../domain/users/interfaces';

type UserDocument = IUserModel & { _id?: unknown; createdAt?: Date; updatedAt?: Date };

export interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
  roles: string[];
  active: boolean;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  user: UserProfile;
}

export const presentUser = (user: UserDocument): UserProfile => ({
  _id: String(user._id),
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  displayName: user.displayName,
  photoURL: user.photoURL,
  provider: user.provider,
  roles: (user.roles ?? []).map(String),
  active: Boolean(user.active),
  verified: Boolean(user.verified),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
