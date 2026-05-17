import { Router } from 'express';
import db from '../db/init.js';
import { adminAuth } from '../middleware/auth.js';
import { logOperation } from '../utils/logger.js';

const router = Router();

// Public: Get all timeline events
router.get('/', (_req, res) => {
  const events = db.prepare(
    'SELECT * FROM timeline_events ORDER BY event_date ASC, sort_order ASC'
  ).all();
  return res.json({ events });
});

// Admin: Create event
router.post('/', adminAuth, (req, res) => {
  const { title, description, event_date, image_url, type, links } = req.body;
  if (!title || !event_date) return res.status(400).json({ error: '标题和日期不能为空' });

  const maxSort = db.prepare('SELECT MAX(sort_order) as mx FROM timeline_events').get();
  const result = db.prepare(
    'INSERT INTO timeline_events (title, description, event_date, image_url, type, links, sort_order, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description || null, event_date, image_url || null, type || 'event',
    links ? JSON.stringify(links) : null, (maxSort?.mx || 0) + 1, req.user.id);

  logOperation({ userId: req.user.id, action: 'create_timeline', targetType: 'timeline_event', targetId: result.lastInsertRowid, detail: { title }, ip: req.ip });
  const event = db.prepare('SELECT * FROM timeline_events WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ event });
});

// Admin: Update event
router.put('/:id', adminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM timeline_events WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '事件不存在' });

  const { title, description, event_date, image_url, type, links, sort_order } = req.body;
  db.prepare(
    'UPDATE timeline_events SET title=?, description=?, event_date=?, image_url=?, type=?, links=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(
    title ?? existing.title, description ?? existing.description,
    event_date ?? existing.event_date, image_url ?? existing.image_url,
    type ?? existing.type, links !== undefined ? JSON.stringify(links) : existing.links,
    sort_order ?? existing.sort_order, req.params.id
  );

  const updated = db.prepare('SELECT * FROM timeline_events WHERE id = ?').get(req.params.id);
  return res.json({ event: updated });
});

// Admin: Delete event
router.delete('/:id', adminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM timeline_events WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '事件不存在' });
  db.prepare('DELETE FROM timeline_events WHERE id = ?').run(req.params.id);
  return res.json({ success: true });
});

export default router;
