import { Router } from 'express';
import db from '../db/init.js';
import { auth, superAdminAuth } from '../middleware/auth.js';
import { logOperation } from '../utils/logger.js';

const router = Router();

// Public: submit application
router.post('/', (req, res) => {
  const { name, contact, reason } = req.body;
  if (!name || !contact) {
    return res.status(400).json({ error: '姓名和联系方式不能为空' });
  }

  // Rate limit: max 3 applications from same contact
  const count = db.prepare(
    "SELECT COUNT(*) as cnt FROM applications WHERE contact = ? AND created_at > datetime('now', '-1 day')"
  ).get(contact);
  if (count.cnt >= 3) {
    return res.status(429).json({ error: '申请过于频繁，请明天再试' });
  }

  db.prepare(
    'INSERT INTO applications (name, contact, reason) VALUES (?, ?, ?)'
  ).run(name, contact, reason || '');

  return res.status(201).json({ success: true, message: '申请已提交，请等待审核' });
});

// Admin: list applications
router.get('/', superAdminAuth, (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  let query = `
    SELECT a.*, u.username as reviewer_name
    FROM applications a
    LEFT JOIN users u ON a.reviewed_by = u.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND a.status = ?';
    params.push(status);
  }

  const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
  const { total } = db.prepare(countQuery).get(...params);

  query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
  const offset = (Number(page) - 1) * Number(limit);
  params.push(Number(limit), offset);

  const applications = db.prepare(query).all(...params);
  return res.json({ applications, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// Admin: approve/reject
router.put('/:id', superAdminAuth, (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: '无效的状态' });
  }

  const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  if (!app) return res.status(404).json({ error: '申请不存在' });

  db.prepare(
    'UPDATE applications SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(status, req.user.id, req.params.id);

  // If approved, auto-add to team members + upgrade user role
  if (status === 'approved') {
    const existing = db.prepare('SELECT id FROM team_members WHERE name = ?').get(app.name);
    if (!existing) {
      // Try to find matching user by username (name might match username)
      const user = db.prepare('SELECT id, role FROM users WHERE username = ? OR username = ?').get(app.name, app.contact);
      const userId = user?.id || null;

      const maxSort = db.prepare('SELECT MAX(sort_order) as mx FROM team_members').get();
      db.prepare(
        'INSERT INTO team_members (user_id, name, role, title, bio, skills, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(userId, app.name, '新成员', 'Team Member',
        `联系方式：${app.contact}${app.reason ? '。申请理由：' + app.reason : ''}`,
        '团队协作', (maxSort?.mx || 0) + 1);

      // Upgrade user role to admin
      if (userId && user.role === 'user') {
        db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', userId);
      }
    }
  }

  logOperation({
    userId: req.user.id,
    action: status === 'approved' ? 'approve_application' : 'reject_application',
    targetType: 'application',
    targetId: Number(req.params.id),
    detail: { name: app.name, status },
    ip: req.ip,
  });

  return res.json({ success: true });
});

export default router;
