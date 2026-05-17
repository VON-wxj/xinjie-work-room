import { Router } from 'express';
import db from '../db/init.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Get my favorites
router.get('/', auth, (req, res) => {
  const favorites = db.prepare(`
    SELECT f.*, a.title, a.cover_image, a.type, a.created_at as activity_date, a.status,
           c.name as category_name
    FROM favorites f
    JOIN activities a ON f.activity_id = a.id
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `).all(req.user.id);

  return res.json({ favorites });
});

// Toggle favorite
router.post('/:activityId', auth, (req, res) => {
  const activityId = req.params.activityId;
  const activity = db.prepare('SELECT id FROM activities WHERE id = ?').get(activityId);
  if (!activity) {
    return res.status(404).json({ error: '活动不存在' });
  }

  const existing = db.prepare(
    'SELECT id FROM favorites WHERE user_id = ? AND activity_id = ?'
  ).get(req.user.id, activityId);

  if (existing) {
    db.prepare('DELETE FROM favorites WHERE id = ?').run(existing.id);
    return res.json({ favorited: false });
  }

  db.prepare('INSERT INTO favorites (user_id, activity_id) VALUES (?, ?)').run(req.user.id, activityId);
  return res.json({ favorited: true });
});

// Check if favorited
router.get('/check/:activityId', auth, (req, res) => {
  const existing = db.prepare(
    'SELECT id FROM favorites WHERE user_id = ? AND activity_id = ?'
  ).get(req.user.id, req.params.activityId);
  return res.json({ favorited: !!existing });
});

export default router;
