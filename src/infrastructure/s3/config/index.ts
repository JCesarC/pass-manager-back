import { S3Client } from '@aws-sdk/client-s3';

import { env } from '../../shared/config';

export const s3Config = new S3Client({
  endpoint: env.S3_ENDPOINT_URL || undefined,
  region: env.S3_REGION || undefined,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  }
});
