import { Router } from 'express';
import db from '../db/init.js';
import { superAdminAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', superAdminAuth, (req, res) => {
  const { action, target_type, page = 1, limit = 30 } = req.query;

  let query = `
    SELECT ol.*, u.username
    FROM operation_logs ol
    LEFT JOIN users u ON ol.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (action) {
    query += ' AND ol.action = ?';
    params.push(action);
  }
  if (target_type) {
    query += ' AND ol.target_type = ?';
    params.push(target_type);
  }

  const countQuery = query.replace(/SELECT .* FROM/, 'SELECT COUNT(*) as total FROM');
  const { total } = db.prepare(countQuery).get(...params);

  query += ' ORDER BY ol.created_at DESC LIMIT ? OFFSET ?';
  const offset = (Number(page) - 1) * Number(limit);
  params.push(Number(limit), offset);

  const logs = db.prepare(query).all(...params);
  return res.json({ logs, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

export default router;
