import { Router } from 'express';
import db from '../db/init.js';
import { adminAuth } from '../middleware/auth.js';
import { logOperation } from '../utils/logger.js';

const router = Router();

// Get categories grouped by parent_type
router.get('/', (req, res) => {
  const { parent_type } = req.query;

  let query = 'SELECT * FROM categories';
  const params = [];

  if (parent_type) {
    query += ' WHERE parent_type = ?';
    params.push(parent_type);
  }

  query += ' ORDER BY parent_type, sort_order';
  const categories = db.prepare(query).all(...params);

  // Group by parent_type
  const grouped = {
    profit: categories.filter(c => c.parent_type === 'profit'),
    team_building: categories.filter(c => c.parent_type === 'team_building'),
  };

  return res.json({ categories: grouped, all: categories });
});

// Create category
router.post('/', adminAuth, (req, res) => {
  const { name, parent_type, sort_order } = req.body;
  if (!name || !parent_type) {
    return res.status(400).json({ error: '分类名称和类型不能为空' });
  }
  if (!['profit', 'team_building'].includes(parent_type)) {
    return res.status(400).json({ error: '无效的分类类型' });
  }

  const result = db.prepare(
    'INSERT INTO categories (name, parent_type, sort_order) VALUES (?, ?, ?)'
  ).run(name, parent_type, sort_order || 0);

  logOperation({
    userId: req.user.id,
    action: 'create_category',
    targetType: 'category',
    targetId: result.lastInsertRowid,
    detail: { name, parent_type },
    ip: req.ip,
  });

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ category });
});

// Update category
router.put('/:id', adminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '分类不存在' });
  }

  const { name, sort_order } = req.body;
  db.prepare('UPDATE categories SET name = ?, sort_order = ? WHERE id = ?').run(
    name || existing.name,
    sort_order !== undefined ? sort_order : existing.sort_order,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  return res.json({ category: updated });
});

// Delete category
router.delete('/:id', adminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '分类不存在' });
  }

  // Update activities in this category to null
  db.prepare('UPDATE activities SET category_id = NULL WHERE category_id = ?').run(req.params.id);
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);

  logOperation({
    userId: req.user.id,
    action: 'delete_category',
    targetType: 'category',
    targetId: Number(req.params.id),
    detail: { name: existing.name },
    ip: req.ip,
  });

  return res.json({ success: true });
});

export default router;
