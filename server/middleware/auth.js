import jwt from 'jsonwebtoken';
import config from '../config.js';

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '请先登录' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
};

export const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
      return next();
    }
    return res.status(403).json({ error: '需要管理员权限' });
  });
};

export const superAdminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user && req.user.role === 'super_admin') {
      return next();
    }
    return res.status(403).json({ error: '需要超级管理员权限' });
  });
};
