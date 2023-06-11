import multerS3 from 'multer-s3';
import path from 'path';

import { generateUniqueId } from '../../utils';
import { s3Config } from '../s3/config';

//* TODO: Configure cacheTime with cacheControl
export const createMulterStorage = (folder: string) => {
  const storage = multerS3({
    s3: s3Config,
    bucket: 'macrodstorage',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (request, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = generateUniqueId() + ext;
      cb(null, `macrodetails/${folder}/${fileName}`);
    }
  });
  return storage;
};
