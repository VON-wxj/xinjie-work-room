import { Router } from 'express';
import { URL } from 'url';
import dns from 'dns';
import { promisify } from 'util';

const dnsResolve4 = promisify(dns.resolve4);
const router = Router();

// Allowed image hosts for proxy
const ALLOWED_HOSTS = [
  'i-blog.csdnimg.cn',
];

function isPrivateIP(ip) {
  const parts = ip.split('.').map(Number);
  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 0) return true;
  if (ip === '169.254.169.254') return true; // cloud metadata
  return false;
}

router.get('/image', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: '缺少 url 参数' });

  // Only allow http/https URLs
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return res.status(400).json({ error: '无效的 URL' });
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: '无效的 URL' });
  }

  const hostname = parsed.hostname;

  // Block raw IP addresses to internal ranges
  const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  if (isIP) {
    if (isPrivateIP(hostname)) {
      return res.status(403).json({ error: '禁止访问内网地址' });
    }
  } else {
    // Resolve hostname and check against allowed hosts
    if (ALLOWED_HOSTS.length > 0 && !ALLOWED_HOSTS.some(h => hostname === h || hostname.endsWith('.' + h))) {
      return res.status(403).json({ error: '不允许的域名' });
    }

    try {
      const ips = await dnsResolve4(hostname);
      if (ips.length > 0 && isPrivateIP(ips[0])) {
        return res.status(403).json({ error: '禁止访问内网地址' });
      }
    } catch {
      return res.status(400).json({ error: '无法解析域名' });
    }
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; XinjieStudio/1.0)',
      },
      signal: AbortSignal.timeout(10000),
      // Prevent automatic redirects to internal hosts
      redirect: 'manual',
    });

    if (!response.ok && response.status !== 301 && response.status !== 302) {
      return res.status(response.status).json({ error: '获取图片失败' });
    }

    // If redirect, check the target isn't internal
    if (response.status === 301 || response.status === 302) {
      const location = response.headers.get('location');
      if (location) {
        try {
          const redirectUrl = new URL(location, url);
          if (isIP && isPrivateIP(redirectUrl.hostname)) {
            return res.status(403).json({ error: '禁止的重定向目标' });
          }
        } catch {}
      }
    }

    const contentType = response.headers.get('content-type');
    // Only serve image MIME types
    if (!contentType || !contentType.startsWith('image/')) {
      return res.status(400).json({ error: '只能代理图片资源' });
    }

    if (contentType) res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch {
    return res.status(500).json({ error: '代理请求失败' });
  }
});

export default router;
