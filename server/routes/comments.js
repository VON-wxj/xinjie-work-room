import { Router } from 'express';
import db from '../db/init.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { logOperation } from '../utils/logger.js';

const router = Router();

// Get comments for an activity
router.get('/activity/:id', (req, res) => {
  const comments = db.prepare(`
    SELECT c.*, u.username, u.role
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.activity_id = ? AND c.status = 'approved'
    ORDER BY c.created_at DESC
  `).all(req.params.id);

  return res.json({ comments });
});

// Get all comments (admin)
router.get('/all', adminAuth, (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  let query = `
    SELECT c.*, u.username, a.title as activity_title
    FROM comments c
    JOIN users u ON c.user_id = u.id
    JOIN activities a ON c.activity_id = a.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND c.status = ?';
    params.push(status);
  }

  const countQuery = query.replace(/SELECT .* FROM/, 'SELECT COUNT(*) as total FROM');
  const { total } = db.prepare(countQuery).get(...params);

  query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
  const offset = (Number(page) - 1) * Number(limit);
  params.push(Number(limit), offset);

  const comments = db.prepare(query).all(...params);
  return res.json({ comments, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// Post a comment
router.post('/activity/:id', auth, (req, res) => {
  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: '评论内容不能为空' });
  }
  if (content.length > 500) {
    return res.status(400).json({ error: '评论内容不能超过500字' });
  }

  const activity = db.prepare('SELECT id FROM activities WHERE id = ?').get(req.params.id);
  if (!activity) {
    return res.status(404).json({ error: '活动不存在' });
  }

  const result = db.prepare('INSERT INTO comments (activity_id, user_id, content) VALUES (?, ?, ?)').run(
    req.params.id, req.user.id, content.trim()
  );

  const comment = db.prepare(`
    SELECT c.*, u.username, u.role
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `).get(result.lastInsertRowid);

  return res.status(201).json({ comment });
});

// Delete comment
router.delete('/:id', adminAuth, (req, res) => {
  const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id);
  if (!comment) {
    return res.status(404).json({ error: '评论不存在' });
  }

  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  return res.json({ success: true });
});

// Update comment status (approve/reject)
router.put('/:id/status', adminAuth, (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: '无效的状态' });
  }

  const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id);
  if (!comment) {
    return res.status(404).json({ error: '评论不存在' });
  }

  db.prepare('UPDATE comments SET status = ? WHERE id = ?').run(status, req.params.id);

  logOperation({
    userId: req.user.id,
    action: 'update_comment_status',
    targetType: 'comment',
    targetId: Number(req.params.id),
    detail: { status },
    ip: req.ip,
  });

  return res.json({ success: true });
});

export default router;
