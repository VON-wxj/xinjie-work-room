import { Router } from 'express';
import db from '../db/init.js';
import { superAdminAuth } from '../middleware/auth.js';
import { logOperation } from '../utils/logger.js';

const router = Router();

// Get all public settings
router.get('/', (_req, res) => {
  const settings = db.prepare('SELECT key, value FROM settings').all();
  const result = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return res.json({ settings: result });
});

// Update settings (super admin only)
router.put('/', superAdminAuth, (req, res) => {
  const { settings } = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: '请提供有效的设置数据' });
  }

  const upsert = db.prepare(
    'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
  );

  for (const [key, value] of Object.entries(settings)) {
    upsert.run(key, String(value));
  }

  logOperation({
    userId: req.user.id,
    action: 'update_settings',
    targetType: 'settings',
    targetId: null,
    detail: { keys: Object.keys(settings) },
    ip: req.ip,
  });

  return res.json({ success: true });
});

export default router;
