import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

const uploadDir = path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `dish-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif|avif)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error('Only image files are allowed (png, jpg, webp, gif, avif)'));
  },
});

// POST /api/upload — field name "image"
router.post('/', protect, admin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No image received' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

export default router;
