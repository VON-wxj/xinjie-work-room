import { Router } from 'express';

const router = Router();

const API_KEY = 'tp-caowsja4lqblno57a8l4u5iu6xdg8ieiz7zhjcjq64l2t1ha';
const API_URL = 'https://token-plan-cn.xiaomimimo.com/v1/chat/completions';

router.post('/', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: '缺少消息' });
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mimo-v2-omni',
        messages: [
          { role: 'system', content: '你是小V，芯捷工作室的智能助手。你热情、专业，帮助用户了解团队信息、活动详情、项目展示等。回答简洁明了，使用中文。团队有8名成员，由王鑫杰创立于2025年11月12日。' },
          ...messages,
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答。';
    return res.json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'AI 服务暂时不可用' });
  }
});

export default router;
