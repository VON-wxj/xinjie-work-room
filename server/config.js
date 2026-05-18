import path from 'path';
import { fileURLToPath } from 'url';

function validateSecret() {
  const secret = process.env.JWT_SECRET;
  const weakDefaults = [
    'xj-studio-jwt-secret-change-in-production',
    'change-this-to-a-random-string',
  ];
  if (!secret || weakDefaults.includes(secret)) {
    console.error('[FATAL] JWT_SECRET 不能使用默认值。请设置环境变量 JWT_SECRET 为一个随机字符串。');
    console.error('示例: export JWT_SECRET=$(openssl rand -hex 32)');
    process.exit(1);
  }
  return secret;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export default {
  port: process.env.PORT || 3003,
  jwtSecret: validateSecret(),
  jwtExpiresIn: '7d',
  dbPath: path.join(rootDir, 'data', 'studio.db'),
  uploadDir: path.join(rootDir, 'uploads'),
  clientDist: path.join(rootDir, 'client', 'dist'),
  maxFileSize: 50 * 1024 * 1024, // 50MB
};
