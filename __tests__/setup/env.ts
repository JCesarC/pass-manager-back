process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-validation';
process.env.MONGODB_URL ??= 'mongodb://127.0.0.1:27017/unused';
process.env.AUTH_RATE_LIMIT_MAX = '10000';
process.env.API_RATE_LIMIT_MAX = '10000';
