
export interface IUserModel {
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  displayName: string,
  password?: string,
  roles?: string [];
  phone? : string;
  photoURL?: string,
  provider?: string,
  verified?: boolean,
  failedLoginAttempts?: number,
  lockUntil?: Date | null
};
