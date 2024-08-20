import multer from 'multer';
import path from 'path';

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // File name format: [actionId]-[assetId]-[timestamp]-[originalname]
    const { actionId, assetId } = req.body;
    const fileName = `${actionId || 'no-actionId'}-${assetId || 'no-assetId'}-${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

export default upload;
