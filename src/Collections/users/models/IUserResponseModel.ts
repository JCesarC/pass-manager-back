export interface IUserResponseModel {
  _id: string;
  __v?: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  displayName: string,
  password: string,
  roles?: string [];
  phone? : string;
  photoURL?: string;
}
