import { MongoMemoryServer } from 'mongodb-memory-server';

declare global {
  var __MONGOD__: MongoMemoryServer | undefined;
}

export default async function globalSetup(): Promise<void> {
  const mongod = await MongoMemoryServer.create();
  globalThis.__MONGOD__ = mongod;
  process.env.MONGODB_URL = mongod.getUri();
}
