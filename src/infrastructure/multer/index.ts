import path from 'path';

import multer from 'multer';
import multerS3 from 'multer-s3';

import { s3Config } from '../s3/config';

import { generateUniqueId } from '../shared/utils/uniqueIdGenerator';

//* TODO: Configure cacheTime with cacheControl
const createMulterStorage = (folder: string) => {
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

export const configMulterHandler = (folder: string) => {
  return multer({
    storage: createMulterStorage(folder)
  }).array('upload', 3);
};
