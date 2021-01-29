import multer from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder),

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      try {
        const fileName = `${Date.now()}-${file.originalname}`;
        return callback(null, fileName);
      } catch (err) {
        throw new Error(err.message);
      }
    },
  }),
};
