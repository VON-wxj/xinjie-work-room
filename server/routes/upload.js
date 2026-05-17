import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { adminAuth } from '../middleware/auth.js';
import { uploadImage, uploadFile, compressImage } from '../middleware/upload.js';

function toUrl(absolutePath) {
  // Convert /opt/xj-work-room/uploads/... → uploads/...
  const parts = absolutePath.replace(/\\/g, '/').split('/');
  const idx = parts.indexOf('uploads');
  return '/' + parts.slice(idx).join('/');
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
  const filePath = req.params.filepath;
  if (filePath.includes('..') || !filePath.startsWith('uploads/')) {
    return res.status(400).json({ error: '无效的文件路径' });
  }

  try {
    fs.unlinkSync(filePath);
    // Also try deleting the .webp variant
    const webpPath = filePath.replace(/\.[^.]+$/, '.webp');
    if (webpPath !== filePath) {
      try { fs.unlinkSync(webpPath); } catch {}
    }
  } catch {
    return res.status(404).json({ error: '文件不存在' });
  }

  return res.json({ success: true });
});

export default router;
