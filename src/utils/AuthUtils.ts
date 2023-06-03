import bcrypt from 'bcrypt';

const SALTS = 10;

export const hashPassword = (password: string) : string => {
  const hashedPassword = bcrypt.hashSync(password, SALTS);
  return hashedPassword;
};

export const comparePassword = (password: string, hashedPassword: string): boolean => {
  const isValidPassword = bcrypt.compareSync(hashedPassword, password);
  console.log('isValidPassword: ', isValidPassword);
  return isValidPassword;
};
