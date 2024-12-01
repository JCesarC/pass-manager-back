import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL as string;

mongoose.connection.once('open', () => {
  console.log('MongoDB Connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.log('Error with MongoDB', err);
});

mongoose.connection.on('close', () => {
  console.log('MongoDB Connection Closed sucessfully!');
});

// const SIGS = [
//   'SIGINT',
//   'SIGBREAK',
//   'SIGTERM'
// ] as const;

// SIGS.forEach((SIG) => {
//   process.on(SIG, () => {
//     console.log('Closing db connection...');
//     mongoose.connection.close(true);
//   });
// });

export const startDBConnection = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions;
  await mongoose.connect(MONGODB_URL, options);
};

export const closeDBConnection = async () => {
  await mongoose.connection.close();
};

export const forceCloseDBConnection = () => {
  mongoose.connection.close(true);
};
