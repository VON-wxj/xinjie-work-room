import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
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
app.use(cors());
app.use(express.json());
app.use(morgan('short'));

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

app.use('/api/auth', authRoutes);
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

// Serve frontend static files in production
const distPath = config.clientDist;
if (fs.existsSync(distPath)) {
  const frontApp = express();
  frontApp.use(express.static(distPath));
  frontApp.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  frontApp.listen(3002, () => {
    console.log(`前端已启动: http://localhost:3002`);
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
