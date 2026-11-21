import { MongoMemoryServer } from 'mongodb-memory-server';

declare global {
  var __MONGOD__: MongoMemoryServer | undefined;
}

/** Starts one in-memory MongoDB for the whole test run. */
export default async function globalSetup(): Promise<void> {
  const mongod = await MongoMemoryServer.create();
  globalThis.__MONGOD__ = mongod;
  // Inherited by the Jest workers, which are spawned after this runs.
  process.env.MONGODB_URL = mongod.getUri();
}
