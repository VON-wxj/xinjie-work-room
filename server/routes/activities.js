import { Router } from 'express';
import db from '../db/init.js';
import { adminAuth } from '../middleware/auth.js';
import { uploadImage, uploadFile } from '../middleware/upload.js';
import { logOperation } from '../utils/logger.js';
import fs from 'fs';

const router = Router();

// Get public activity list
router.get('/', (req, res) => {
  const { type, category_id, status, sort = 'created_at', order = 'desc', page = 1, limit = 12 } = req.query;

  let query = `
    SELECT a.*, c.name as category_name, u.username as creator_name
    FROM activities a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.created_by = u.id
    WHERE a.status = 'published'
  `;
  const params = [];

  if (type) {
    query += ' AND a.type = ?';
    params.push(type);
  }
  if (category_id) {
    query += ' AND a.category_id = ?';
    params.push(category_id);
  }

  // Count total
  const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
  const { total } = db.prepare(countQuery).get(...params);

  // Sort and paginate
  const allowedSort = ['created_at', 'start_date', 'profit', 'title'];
  const sortCol = allowedSort.includes(sort) ? sort : 'created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  query += ` ORDER BY a.${sortCol} ${sortOrder} LIMIT ? OFFSET ?`;
  const offset = (Number(page) - 1) * Number(limit);
  params.push(Number(limit), offset);

  const activities = db.prepare(query).all(...params);

  return res.json({ activities, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// Get admin activity list (includes drafts)
router.get('/admin', adminAuth, (req, res) => {
  const { type, status, page = 1, limit = 20 } = req.query;

  let query = `
    SELECT a.*, c.name as category_name, u.username as creator_name
    FROM activities a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.created_by = u.id
    WHERE 1=1
  `;
  const params = [];

  if (type) {
    query += ' AND a.type = ?';
    params.push(type);
  }
  if (status) {
    query += ' AND a.status = ?';
    params.push(status);
  }

  const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
  const { total } = db.prepare(countQuery).get(...params);

  query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
  const offset = (Number(page) - 1) * Number(limit);
  params.push(Number(limit), offset);

  const activities = db.prepare(query).all(...params);

  return res.json({ activities, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// Get single activity
router.get('/:id', (req, res) => {
  const activity = db.prepare(`
    SELECT a.*, c.name as category_name, u.username as creator_name
    FROM activities a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.created_by = u.id
    WHERE a.id = ?
  `).get(req.params.id);

  if (!activity) {
    return res.status(404).json({ error: '活动不存在' });
  }

  // Get photos
  const photos = db.prepare('SELECT * FROM photos WHERE activity_id = ? ORDER BY sort_order').all(activity.id);

  // Get attachments
  const attachments = db.prepare('SELECT * FROM attachments WHERE activity_id = ?').all(activity.id);

  // Get comment count
  const { comment_count } = db.prepare(
    'SELECT COUNT(*) as comment_count FROM comments WHERE activity_id = ? AND status = ?'
  ).get(activity.id, 'approved');

  return res.json({ ...activity, photos, attachments, comment_count });
});

// Create activity
router.post('/', adminAuth, (req, res) => {
  const { type, category_id, title, content, cover_image, url, start_date, end_date, profit, location, participants, status } = req.body;

  if (!type || !title) {
    return res.status(400).json({ error: '活动类型和标题不能为空' });
  }
  if (!['profit', 'team_building'].includes(type)) {
    return res.status(400).json({ error: '无效的活动类型' });
  }

  const result = db.prepare(`
    INSERT INTO activities (type, category_id, title, content, cover_image, url, start_date, end_date, profit, location, participants, status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(type, category_id || null, title, content || '', cover_image || null, url || null,
    start_date || null, end_date || null, profit || null, location || null,
    participants ? JSON.stringify(participants) : null,
    status || 'published', req.user.id);

  logOperation({
    userId: req.user.id,
    action: 'create_activity',
    targetType: 'activity',
    targetId: result.lastInsertRowid,
    detail: { title, type },
    ip: req.ip,
  });

  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ activity });
});

// Update activity
router.put('/:id', adminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '活动不存在' });
  }

  const { type, category_id, title, content, cover_image, url, start_date, end_date, profit, location, participants, status } = req.body;

  db.prepare(`
    UPDATE activities SET
      type = ?, category_id = ?, title = ?, content = ?, cover_image = ?,
      url = ?, start_date = ?, end_date = ?, profit = ?, location = ?,
      participants = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    type || existing.type,
    category_id !== undefined ? category_id : existing.category_id,
    title || existing.title,
    content !== undefined ? content : existing.content,
    cover_image !== undefined ? cover_image : existing.cover_image,
    url !== undefined ? url : existing.url,
    start_date !== undefined ? start_date : existing.start_date,
    end_date !== undefined ? end_date : existing.end_date,
    profit !== undefined ? profit : existing.profit,
    location !== undefined ? location : existing.location,
    participants !== undefined ? JSON.stringify(participants) : existing.participants,
    status || existing.status,
    req.params.id
  );

  logOperation({
    userId: req.user.id,
    action: 'update_activity',
    targetType: 'activity',
    targetId: Number(req.params.id),
    detail: { title: title || existing.title },
    ip: req.ip,
  });

  const updated = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  return res.json({ activity: updated });
});

// Delete activity
router.delete('/:id', adminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '活动不存在' });
  }

  // Delete associated files
  const photos = db.prepare('SELECT file_path FROM photos WHERE activity_id = ?').all(req.params.id);
  const attachments = db.prepare('SELECT file_path FROM attachments WHERE activity_id = ?').all(req.params.id);
  for (const f of [...photos, ...attachments]) {
    try { fs.unlinkSync(f.file_path); } catch {}
  }

  db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);

  logOperation({
    userId: req.user.id,
    action: 'delete_activity',
    targetType: 'activity',
    targetId: Number(req.params.id),
    detail: { title: existing.title },
    ip: req.ip,
  });

  return res.json({ success: true });
});

// Photo management
router.get('/:id/photos', (req, res) => {
  const photos = db.prepare('SELECT * FROM photos WHERE activity_id = ? ORDER BY sort_order').all(req.params.id);
  return res.json({ photos });
});

router.post('/:id/photos', adminAuth, uploadImage.array('photos', 10), (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: '请选择图片' });
  }

  const insert = db.prepare('INSERT INTO photos (activity_id, file_path, sort_order) VALUES (?, ?, ?)');
  const photos = [];
  for (const file of files) {
    const result = insert.run(req.params.id, file.path, photos.length);
    photos.push({ id: result.lastInsertRowid, file_path: file.path });
  }

  return res.status(201).json({ photos });
});

router.delete('/:id/photos/:photoId', adminAuth, (req, res) => {
  const photo = db.prepare('SELECT * FROM photos WHERE id = ? AND activity_id = ?').get(req.params.photoId, req.params.id);
  if (!photo) {
    return res.status(404).json({ error: '图片不存在' });
  }
  try { fs.unlinkSync(photo.file_path); } catch {}
  db.prepare('DELETE FROM photos WHERE id = ?').run(req.params.photoId);
  return res.json({ success: true });
});

// Attachment management
router.get('/:id/attachments', (req, res) => {
  const attachments = db.prepare('SELECT * FROM attachments WHERE activity_id = ?').all(req.params.id);
  return res.json({ attachments });
});

router.post('/:id/attachments', adminAuth, uploadFile.array('files', 10), (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: '请选择文件' });
  }

  const insert = db.prepare(
    'INSERT INTO attachments (activity_id, filename, original_name, file_path, file_size, file_type) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const attachments = [];
  for (const file of files) {
    const result = insert.run(req.params.id, file.filename, file.originalname, file.path, file.size, file.mimetype);
    attachments.push({
      id: result.lastInsertRowid,
      filename: file.filename,
      original_name: file.originalname,
      file_path: file.path,
      file_size: file.size,
    });
  }

  return res.status(201).json({ attachments });
});

router.delete('/:id/attachments/:attId', adminAuth, (req, res) => {
  const att = db.prepare('SELECT * FROM attachments WHERE id = ? AND activity_id = ?').get(req.params.attId, req.params.id);
  if (!att) {
    return res.status(404).json({ error: '文件不存在' });
  }
  try { fs.unlinkSync(att.file_path); } catch {}
  db.prepare('DELETE FROM attachments WHERE id = ?').run(req.params.attId);
  return res.json({ success: true });
});

export default router;
