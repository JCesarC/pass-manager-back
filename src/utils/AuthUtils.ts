import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALTS = 10;
const EXPIRATION_TIME = '1h';
const JWT_SECRET = process.env.JWT_SECRET as string;

export const hashPassword = (password: string) : string => {
  const hashedPassword = bcrypt.hashSync(password, SALTS);
  return hashedPassword;
};

export const comparePassword = (password: string, hashedPassword: string, ): boolean => {
  const isValidPassword = bcrypt.compareSync(password, hashedPassword);
  return isValidPassword;
};

export const generateToken = (email: string) => {
  const token = jwt.sign({ email }, JWT_SECRET, {
    expiresIn: EXPIRATION_TIME
  });
  return token;
};
