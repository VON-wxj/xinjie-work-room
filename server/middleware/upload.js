import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import config from '../config.js';

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dateDir = new Date().toISOString().slice(0, 10);
    const dir = path.join(config.uploadDir, dateDir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('只允许上传图片文件'));
  },
});

export const uploadFile = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
});

// Compress uploaded image and convert to WebP
export async function compressImage(filePath) {
  try {
    const tmpPath = filePath + '.tmp';

    await sharp(filePath)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(tmpPath);

    // Replace original with compressed .webp version
    const ext = path.extname(filePath).toLowerCase();
    const newPath = ext ? filePath.slice(0, -ext.length) + '.webp' : filePath + '.webp';
    fs.unlinkSync(filePath);
    fs.renameSync(tmpPath, newPath);

    return newPath;
  } catch (err) {
    console.error('Image compression failed:', err.message);
    // Clean up tmp file if it exists (e.g. rename failed after unlink)
    const tmpPath = filePath + '.tmp';
    try { if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); } catch {}
    if (fs.existsSync(filePath)) return filePath;
    return null; // File was lost — caller should handle
  }
}
