import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/init.js';
import config from '../config.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    if (username.length < 2 || username.length > 20) {
      return res.status(400).json({ error: '用户名长度2-20个字符' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少6位' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
      return res.status(400).json({ error: '用户名已被注册' });
    }

    // 异步哈希，不阻塞事件循环
    const hash = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hash);

    const user = db.prepare('SELECT id, username, role, status, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    return res.json({ token, user });
  } catch (err) {
    console.error('注册失败:', err);
    return res.status(500).json({ error: '注册失败，请稍后重试' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const user = db.prepare('SELECT id, username, password_hash, role, status, created_at FROM users WHERE username = ?').get(username);
    if (!user) {
      // 防止用户名枚举：对不存在的用户也执行一次虚拟哈希比对
      await bcrypt.hash(password, 1);
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    if (user.status === 'disabled') {
      return res.status(403).json({ error: '账号已被禁用' });
    }

    // 异步比对，不阻塞事件循环
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    const { password_hash, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (err) {
    console.error('登录失败:', err);
    return res.status(500).json({ error: '登录失败，请稍后重试' });
  }
});

router.get('/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, username, role, status, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  return res.json({ user });
});

export default router;
