import { Router } from 'express';
import db from '../db/init.js';
import { adminAuth } from '../middleware/auth.js';

const router = Router();

// Public: list all published projects
router.get('/', (_req, res) => {
  const projects = db.prepare(
    'SELECT p.*, u.username as creator_name FROM projects p LEFT JOIN users u ON p.created_by = u.id WHERE p.status = ? ORDER BY p.sort_order, p.created_at DESC'
  ).all('published');
  return res.json({ projects });
});

// Public: get single project
router.get('/:id', (req, res) => {
  const project = db.prepare(
    'SELECT p.*, u.username as creator_name FROM projects p LEFT JOIN users u ON p.created_by = u.id WHERE p.id = ?'
  ).get(req.params.id);
  if (!project) return res.status(404).json({ error: '项目不存在' });
  return res.json({ project });
});

// Admin: list all (including drafts)
router.get('/admin/all', adminAuth, (_req, res) => {
  const projects = db.prepare(
    'SELECT p.*, u.username as creator_name FROM projects p LEFT JOIN users u ON p.created_by = u.id ORDER BY p.sort_order, p.created_at DESC'
  ).all();
  return res.json({ projects });
});

// Admin: create
router.post('/', adminAuth, (req, res) => {
  const { title, description, cover_image, url, tags, status, sort_order } = req.body;
  if (!title) return res.status(400).json({ error: '标题不能为空' });

  const maxSort = db.prepare('SELECT MAX(sort_order) as mx FROM projects').get();
  const result = db.prepare(
    'INSERT INTO projects (title, description, cover_image, url, tags, status, sort_order, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description || '', cover_image || null, url || null,
    Array.isArray(tags) ? tags.join(',') : (tags || null),
    status || 'published', sort_order ?? (maxSort?.mx || 0) + 1, req.user.id);

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ project });
});

// Admin: update
router.put('/:id', adminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '项目不存在' });

  const { title, description, cover_image, url, tags, status, sort_order } = req.body;
  db.prepare(
    'UPDATE projects SET title=?, description=?, cover_image=?, url=?, tags=?, status=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(
    title ?? existing.title, description ?? existing.description,
    cover_image ?? existing.cover_image, url ?? existing.url,
    Array.isArray(tags) ? tags.join(',') : (tags ?? existing.tags),
    status ?? existing.status, sort_order ?? existing.sort_order, req.params.id
  );
  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  return res.json({ project: updated });
});

// Admin: delete
router.delete('/:id', adminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '项目不存在' });
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  return res.json({ success: true });
});

export default router;
