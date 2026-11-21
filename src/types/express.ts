export {};

declare module 'express-serve-static-core' {
  interface Request {
    /** Set by the authentication middleware for every non-public route. */
    auth?: { userId: string };
  }
}
