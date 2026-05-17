import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export default {
  port: process.env.PORT || 3003,
  jwtSecret: process.env.JWT_SECRET || 'xj-studio-jwt-secret-change-in-production',
  jwtExpiresIn: '7d',
  dbPath: path.join(rootDir, 'data', 'studio.db'),
  uploadDir: path.join(rootDir, 'uploads'),
  clientDist: path.join(rootDir, 'client', 'dist'),
  maxFileSize: 50 * 1024 * 1024, // 50MB
};
