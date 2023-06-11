import { S3Client } from '@aws-sdk/client-s3';

const {
  AWS_ACCESS_KEY_ID = '',
  AWS_SECRET_ACCESS_KEY = '',
  MACRO_SPACE_ENDPOINT_URL = '',
} = process.env;

export const s3Config = new S3Client({
  endpoint: MACRO_SPACE_ENDPOINT_URL,
  region: 'sfo3',
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID, // Access key pair. You can create access key pairs using the control panel or API.
    secretAccessKey: AWS_SECRET_ACCESS_KEY // Secret access key defined through an environment variable.
  }
});
