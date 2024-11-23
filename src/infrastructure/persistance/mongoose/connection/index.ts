import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL as string;

class MongoDBClient {
  private client: typeof mongoose;

  constructor() {
    this.client = mongoose;

    this.client.connection.once('open', () => {
      console.log('MongoDB Connection ready!');
    });

    this.client.connection.on('error', (err) => {
      console.log('Error with MongoDB', err);
    });

    this.client.connection.on('close', () => {
      console.log('MongoDB Connection Closed successfully!');
    });

    const SIGS = [
      'SIGINT',
      'SIGBREAK',
      'SIGTERM'
    ] as const;

    SIGS.forEach((SIG) => {
      process.on(SIG, () => {
        console.log('Closing db connection...');
        this.forceCloseDBConnection();
      });
    });
  }

  async startDBConnection(): Promise<void> {
    await this.client.connect(MONGODB_URL);
  }

  async closeDBConnection(): Promise<void> {
    await this.client.connection.close();
  }

  forceCloseDBConnection(): void {
    this.client.connection.close(true);
  }
}

export default MongoDBClient;
