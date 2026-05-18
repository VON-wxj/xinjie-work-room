import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import config from './config.js';

// Ensure directories exist
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// CORS 白名单：仅允许开发端口和生产域名
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3003',
  'http://8.160.162.33:3003',
  'http://8.160.162.33',
];
app.use(cors({
  origin: (origin, callback) => {
    // 允许无 origin 的请求（如 curl、Postman、服务端调用）
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('不允许的跨域来源'));
  },
}));
app.use(express.json());
app.use(morgan('short'));

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '请求过于频繁，请稍后再试' },
});

// Serve uploaded files
app.use('/uploads', express.static(config.uploadDir));

// API routes
import authRoutes from './routes/auth.js';
import activityRoutes from './routes/activities.js';
import categoryRoutes from './routes/categories.js';
import commentRoutes from './routes/comments.js';
import favoriteRoutes from './routes/favorites.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';
import logRoutes from './routes/logs.js';
import settingsRoutes from './routes/settings.js';
import teamRoutes from './routes/team.js';
import timelineRoutes from './routes/timeline.js';
import profileRoutes from './routes/profile.js';
import projectRoutes from './routes/projects.js';
import proxyRoutes from './routes/proxy.js';
import chatRoutes from './routes/chat.js';

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proxy', proxyRoutes);
app.use('/api/chat', chatRoutes);

// 生产环境：同一端口托管前端静态文件（前后端同源部署）
const distPath = config.clientDist;
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res, next) => {
    // 仅对非 API 请求回退到 index.html（SPA 路由）
    if (_req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: '文件大小超出限制' });
  }
  return res.status(500).json({ error: '服务器内部错误' });
});

app.listen(config.port, () => {
  console.log(`API服务已启动: http://localhost:${config.port}`);
});
