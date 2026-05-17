import { Router } from 'express';
import db from '../db/init.js';
import { adminAuth, superAdminAuth } from '../middleware/auth.js';
import { logOperation } from '../utils/logger.js';

const router = Router();

// Anyone can view team
router.get('/', (_req, res) => {
  const members = db.prepare(
    'SELECT * FROM team_members ORDER BY sort_order'
  ).all();
  return res.json({ members });
});

router.get('/:id', (req, res) => {
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) return res.status(404).json({ error: '成员不存在' });
  if (member.skills) member.skills = member.skills.split(',');
  return res.json({ member });
});

// Only super admin can create/edit/delete team members
router.post('/', superAdminAuth, (req, res) => {
  const { name, role, title, bio, avatar_url, github_url, skills, join_date, is_founder, sort_order } = req.body;
  if (!name) return res.status(400).json({ error: '姓名不能为空' });

  const result = db.prepare(
    'INSERT INTO team_members (name, role, title, bio, avatar_url, github_url, skills, join_date, is_founder, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(name, role || null, title || null, bio || null, avatar_url || null, github_url || null,
    Array.isArray(skills) ? skills.join(',') : (skills || null),
    join_date || null, is_founder ? 1 : 0, sort_order || 0);

  logOperation({ userId: req.user.id, action: 'create_member', targetType: 'team_member', targetId: result.lastInsertRowid, detail: { name }, ip: req.ip });
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ member });
});

// Super admin only: Update member
router.put('/:id', superAdminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '成员不存在' });

  const { name, role, title, bio, avatar_url, github_url, skills, join_date, is_founder, sort_order } = req.body;
  db.prepare(
    'UPDATE team_members SET name=?, role=?, title=?, bio=?, avatar_url=?, github_url=?, skills=?, join_date=?, is_founder=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(
    name ?? existing.name, role ?? existing.role, title ?? existing.title,
    bio ?? existing.bio, avatar_url ?? existing.avatar_url, github_url ?? existing.github_url,
    Array.isArray(skills) ? skills.join(',') : (skills ?? existing.skills),
    join_date ?? existing.join_date, is_founder !== undefined ? (is_founder ? 1 : 0) : existing.is_founder,
    sort_order ?? existing.sort_order, req.params.id
  );

  const updated = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  return res.json({ member: updated });
});

// Super admin only: Delete member
router.delete('/:id', superAdminAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '成员不存在' });
  db.prepare('DELETE FROM team_members WHERE id = ?').run(req.params.id);
  return res.json({ success: true });
});

export default router;
