import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/init.js';
import { auth, adminAuth, superAdminAuth } from '../middleware/auth.js';
import { logOperation } from '../utils/logger.js';

const router = Router();

// Get visitors list (any admin can view)
router.get('/visitors', adminAuth, (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const { total } = db.prepare(
    "SELECT COUNT(*) as total FROM users WHERE role = 'user'"
  ).get();

  const visitors = db.prepare(
    "SELECT id, username, role, status, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC LIMIT ? OFFSET ?"
  ).all(Number(limit), (Number(page) - 1) * Number(limit));

  return res.json({ visitors, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// Get all users (super admin only)
router.get('/', superAdminAuth, (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;

  let query = 'SELECT id, username, role, status, created_at, updated_at FROM users WHERE 1=1';
  const params = [];

  if (role) {
    query += ' AND role = ?';
    params.push(role);
  }

  const countQuery = query.replace(/SELECT .* FROM/, 'SELECT COUNT(*) as total FROM');
  const { total } = db.prepare(countQuery).get(...params);

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  const offset = (Number(page) - 1) * Number(limit);
  params.push(Number(limit), offset);

  const users = db.prepare(query).all(...params);
  return res.json({ users, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// Create admin account (super admin only)
router.post('/admin', superAdminAuth, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少6位' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)'
    ).run(username, hash, 'admin');

    logOperation({
      userId: req.user.id,
      action: 'create_admin',
      targetType: 'user',
      targetId: result.lastInsertRowid,
      detail: { username },
      ip: req.ip,
    });

    const user = db.prepare('SELECT id, username, role, status, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ user });
  } catch (err) {
    console.error('创建管理员失败:', err);
    return res.status(500).json({ error: '创建管理员失败' });
  }
});

// Update user (super admin only)
router.put('/:id', superAdminAuth, async (req, res) => {
  try {
    const existing = db.prepare('SELECT id, username, role, status FROM users WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const { role, status, password } = req.body;

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hash, req.params.id);
    }

    if (role) {
      db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, req.params.id);
    }

    if (status) {
      db.prepare('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);
    }

    logOperation({
      userId: req.user.id,
      action: 'update_user',
      targetType: 'user',
      targetId: Number(req.params.id),
      detail: { role, status },
      ip: req.ip,
    });

    const updated = db.prepare('SELECT id, username, role, status, created_at, updated_at FROM users WHERE id = ?').get(req.params.id);
    return res.json({ user: updated });
  } catch (err) {
    console.error('更新用户失败:', err);
    return res.status(500).json({ error: '更新用户失败' });
  }
});

// Delete user (super admin only)
router.delete('/:id', superAdminAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  if (user.role === 'super_admin') {
    return res.status(400).json({ error: '不能删除超级管理员' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);

  logOperation({
    userId: req.user.id,
    action: 'delete_user',
    targetType: 'user',
    targetId: Number(req.params.id),
    detail: { username: user.username },
    ip: req.ip,
  });

  return res.json({ success: true });
});

export default router;
