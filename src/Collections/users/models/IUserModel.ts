
export interface IUserModel {
  email: string;
  firtName: string;
  secondName?: string;
  lastName: string;
  secondLastName?: string;
  roles?: string [];
  phone? : string;
  active: boolean;
  displayName: string,
  photoURL: string,
};
