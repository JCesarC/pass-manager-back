import { Request, Response } from 'express';
import multer from 'multer';

import { createMulterStorage } from '../../../services/multer';

export const uploadHandler = (req: Request, res: Response, folder: string) => {
  const multerUpload = multer({
    storage: createMulterStorage(folder)
  }).array('upload', 3);

  multerUpload(req, res, (error) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ error: 'Error uploading files', errorMessage: `${error.message}` });
    }

    console.log(`Successfully uploaded ${req.files?.length} files!`);
    res.status(201).json({ error: false, message: `Successfully uploaded ${req.files?.length} files!` });
  });
};
