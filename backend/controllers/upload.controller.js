// controllers/upload.controller.js
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import Action from '../models/action.js'; // Adjust this import according to your action model

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

export const uploadFile = [
  upload.single('file'),
  asyncHandler(async (req, res) => {
    const { actionId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const action = await Action.findById(actionId);
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    const filePath = `/uploads/${file.filename}`;
    action.files.push({ path: filePath, name: file.originalname });
    await action.save();

    res.status(200).json({ message: 'File uploaded successfully', filePath });
  })
];

export const getFile = asyncHandler((req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});
