import db from '../db/init.js';

export function logOperation({ userId, action, targetType, targetId, detail, ip }) {
  db.prepare(
    'INSERT INTO operation_logs (user_id, action, target_type, target_id, detail, ip) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(userId, action, targetType, targetId || null, detail ? JSON.stringify(detail) : null, ip || null);
}
