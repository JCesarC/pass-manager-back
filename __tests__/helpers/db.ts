import mongoose from 'mongoose';

/** Connects each test file to its own database on the shared in-memory server. */
export const connectTestDb = async (): Promise<void> => {
  const dbName = `test_${process.env.JEST_WORKER_ID}_${Date.now()}`;
  await mongoose.connect(process.env.MONGODB_URL as string, { dbName });
};

export const clearTestDb = async (): Promise<void> => {
  const collections = await mongoose.connection.db?.collections();
  await Promise.all((collections ?? []).map((collection) => collection.deleteMany({})));
};

export const disconnectTestDb = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};
