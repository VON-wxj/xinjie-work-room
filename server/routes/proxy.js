import { Router } from 'express';

const router = Router();

router.get('/image', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: '缺少 url 参数' });

  // Only allow http/https URLs
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return res.status(400).json({ error: '无效的 URL' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; XinjieStudio/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: '获取图片失败' });
    }

    const contentType = response.headers.get('content-type');
    if (contentType) res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch {
    return res.status(500).json({ error: '代理请求失败' });
  }
});

export default router;
