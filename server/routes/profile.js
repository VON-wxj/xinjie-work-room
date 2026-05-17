import { Router } from 'express';
import db from '../db/init.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Get own profile (team member linked to current user)
router.get('/', auth, (req, res) => {
  const member = db.prepare(
    'SELECT * FROM team_members WHERE user_id = ?'
  ).get(req.user.id);

  if (!member) {
    return res.status(404).json({ error: '未绑定团队成员信息' });
  }

  return res.json({ member });
});

// Update own profile
router.put('/', auth, (req, res) => {
  const member = db.prepare(
    'SELECT * FROM team_members WHERE user_id = ?'
  ).get(req.user.id);

  if (!member) {
    return res.status(404).json({ error: '未绑定团队成员信息' });
  }

  const { bio, avatar_url, github_url, skills, title } = req.body;

  db.prepare(`
    UPDATE team_members SET
      bio = ?, avatar_url = ?, github_url = ?, skills = ?, title = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    bio !== undefined ? bio : member.bio,
    avatar_url !== undefined ? avatar_url : member.avatar_url,
    github_url !== undefined ? github_url : member.github_url,
    Array.isArray(skills) ? skills.join(',') : (skills !== undefined ? skills : member.skills),
    title !== undefined ? title : member.title,
    member.id
  );

  const updated = db.prepare('SELECT * FROM team_members WHERE id = ?').get(member.id);
  return res.json({ member: updated });
});

export default router;
