import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL as string;

mongoose.connection.once('open', () => {
  console.log('MongoDB Connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.log('Error with MongoDB', err);
});

const SIGS = [
  'SIGINT',
  'SIGBREAK',
  'SIGTERM'
] as const;

SIGS.forEach((SIG) => {
  process.on(SIG, () => {
    mongoose.connection.close(() => {
      console.log(`Mongodb connection closed On ${SIG}`);
      process.exit(1);
    });
  });
});

export const startDBConnection = async () => {
  await mongoose.connect(MONGODB_URL);
};
