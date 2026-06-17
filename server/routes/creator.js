import { Router } from 'express';
import db from '../db/init.js';
import { adminAuth, superAdminAuth } from '../middleware/auth.js';

const router = Router();

// Public: list all experiences
router.get('/', (_req, res) => {
  const experiences = db.prepare(
    'SELECT * FROM creator_experiences ORDER BY sort_order ASC, event_date ASC'
  ).all();
  return res.json({ experiences });
});

// Super admin: create
router.post('/', superAdminAuth, (req, res) => {
  const { title, description, event_date, image_url, sort_order } = req.body;
  if (!title || !event_date) {
    return res.status(400).json({ error: '标题和日期为必填项' });
  }
  const result = db.prepare(
    'INSERT INTO creator_experiences (title, description, event_date, image_url, sort_order, created_by) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, description || '', event_date, image_url || null, sort_order || 0, req.user.id);
  return res.status(201).json({ id: result.lastInsertRowid });
});

// Super admin: update
router.put('/:id', superAdminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM creator_experiences WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '记录不存在' });

  const { title, description, event_date, image_url, sort_order } = req.body;
  db.prepare(
    'UPDATE creator_experiences SET title=?, description=?, event_date=?, image_url=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(
    title ?? existing.title,
    description ?? existing.description,
    event_date ?? existing.event_date,
    image_url ?? existing.image_url,
    sort_order ?? existing.sort_order,
    req.params.id
  );
  return res.json({ success: true });
});

// Super admin: delete
router.delete('/:id', superAdminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM creator_experiences WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '记录不存在' });
  db.prepare('DELETE FROM creator_experiences WHERE id = ?').run(req.params.id);
  return res.json({ success: true });
});

export default router;
