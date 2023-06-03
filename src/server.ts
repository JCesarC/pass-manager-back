import http from 'http';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL as string;

console.log('Starting server...');

const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('MongoDB Connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.log('Error with MongoDB', err);
});

const startServer = async () => {
  await mongoose.connect(MONGODB_URL);

  server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
};

startServer();
