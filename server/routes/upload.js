import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import config from '../config.js';
import { adminAuth } from '../middleware/auth.js';
import { uploadImage, uploadFile, compressImage } from '../middleware/upload.js';

function toUrl(absolutePath) {
  // Convert absolute path to relative URL
  const relative = path.relative(config.uploadDir, absolutePath);
  return '/uploads/' + relative.replace(/\\/g, '/');
}

function safeResolve(filepath) {
  const resolved = path.resolve(config.uploadDir, filepath);
  // Ensure the resolved path stays within uploadDir
  if (!resolved.startsWith(config.uploadDir + path.sep) && resolved !== config.uploadDir) {
    return null;
  }
  return resolved;
}

const router = Router();

router.post('/image', adminAuth, uploadImage.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请选择图片' });
  }

  try {
    const compressedPath = await compressImage(req.file.path);
    const url = toUrl(compressedPath);
    return res.json({ url, filename: req.file.filename });
  } catch (err) {
    return res.status(500).json({ error: '图片处理失败' });
  }
});

router.post('/file', adminAuth, uploadFile.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请选择文件' });
  }
  return res.json({
    url: toUrl(req.file.path),
    filename: req.file.filename,
    original_name: req.file.originalname,
    size: req.file.size,
  });
});

router.delete('/:filepath', adminAuth, (req, res) => {
  const resolved = safeResolve(req.params.filepath);
  if (!resolved) {
    return res.status(400).json({ error: '无效的文件路径' });
  }

  if (!fs.existsSync(resolved)) {
    return res.status(404).json({ error: '文件不存在' });
  }

  fs.unlinkSync(resolved);

  // Also try deleting the .webp variant
  const ext = path.extname(resolved);
  if (ext) {
    const webpPath = resolved.replace(ext, '.webp');
    try { if (fs.existsSync(webpPath)) fs.unlinkSync(webpPath); } catch {}
  }

  return res.json({ success: true });
});

export default router;
