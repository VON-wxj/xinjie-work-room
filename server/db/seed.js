import db from './init.js';
import bcrypt from 'bcryptjs';

const seed = () => {
  console.log('Seeding database...');

  // Create default admin account (admin / admin123456)
  const admin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!admin) {
    const hash = bcrypt.hashSync('admin123456', 10);
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(
      'admin', hash, 'admin'
    );
    console.log('Default admin created: admin / admin123456');
  }

  // Create default categories for profit activities
  const profitCategories = [
    'Web开发', 'App开发', '技术服务', '咨询合作'
  ];
  for (const name of profitCategories) {
    const exists = db.prepare('SELECT id FROM categories WHERE name = ? AND parent_type = ?').get(name, 'profit');
    if (!exists) {
      db.prepare('INSERT INTO categories (name, parent_type, sort_order) VALUES (?, ?, ?)').run(
        name, 'profit', profitCategories.indexOf(name)
      );
    }
  }

  // Create default categories for team building activities
  const teamCategories = [
    '户外团建', '技术培训', '工作会议', '聚餐活动'
  ];
  for (const name of teamCategories) {
    const exists = db.prepare('SELECT id FROM categories WHERE name = ? AND parent_type = ?').get(name, 'team_building');
    if (!exists) {
      db.prepare('INSERT INTO categories (name, parent_type, sort_order) VALUES (?, ?, ?)').run(
        name, 'team_building', teamCategories.indexOf(name)
      );
    }
  }

  // Default site settings
  const defaultSettings = {
    site_name: '芯捷工作室',
    site_description: '团队活动汇总展示平台',
    site_logo: '',
  };
  const upsert = db.prepare(
    'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
  );
  for (const [key, value] of Object.entries(defaultSettings)) {
    upsert.run(key, value);
  }

  // Seed team members with admin accounts
  const memberAccounts = [
    { name: '王鑫杰', username: 'wangxinjie', accountRole: 'super_admin', role: '团队创建者', title: 'Founder & Lead', bio: '芯捷工作室创始人，鸿蒙生态布道者。主导多个跨平台开发项目，举办鸿蒙跨平台训练营，获得腾讯云社区创作之星称号。', skills: '鸿蒙开发,跨平台,团队管理,技术写作', is_founder: 1 },
    { name: '李豪然', username: 'lihaoran', role: '核心成员', title: 'Core Developer', bio: '参与南昌鸿蒙极客分享会，积极参与鸿蒙生态技术学习与实践。', skills: '鸿蒙开发,前端技术', is_founder: 0 },
    { name: '韦淇元', username: 'weiqiyuan', role: '核心成员', title: 'Core Developer', bio: '团队核心开发者，专注于技术成长与项目实践。', skills: 'Web开发,编程', is_founder: 0 },
    { name: '王钊杰', username: 'wangzhaojie', role: '核心成员', title: 'Core Developer', bio: '参加鸿蒙HDD郑州站、G-Star武汉站，活跃于各类技术大会。参与计算机设计大赛。', skills: '鸿蒙开发,技术演讲,竞赛', is_founder: 0 },
    { name: '蔡新佳', username: 'caixinjia', role: '核心成员', title: 'Core Developer', bio: '参与计算机设计大赛，积极投身技术竞赛与项目开发。', skills: '算法,竞赛,编程', is_founder: 0 },
    { name: '杜勇明', username: 'duyongming', role: '核心成员', title: 'Core Developer', bio: '团队中的学长力量，为团队提供经验指导与技术支持。', skills: '全栈开发,技术指导', is_founder: 0 },
    { name: '单传辉', username: 'shanchuanhui', role: '核心成员', title: 'Core Developer', bio: '团队核心成员，专注于技术学习与项目实践。', skills: '前端开发,编程', is_founder: 0 },
    { name: '丁博', username: 'dingbo', role: '核心成员', title: 'Core Developer', bio: '参与南昌鸿蒙极客分享会，深入学习鸿蒙生态技术。', skills: '鸿蒙开发,移动开发', is_founder: 0 },
  ];

  const defaultPwd = bcrypt.hashSync('xinjie2025', 10);
  const insertUser = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');
  const insertMember = db.prepare(
    'INSERT INTO team_members (user_id, name, role, title, bio, skills, is_founder, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  for (let i = 0; i < memberAccounts.length; i++) {
    const m = memberAccounts[i];
    const accountRole = m.accountRole || 'admin';
    // Check if team member exists
    const existing = db.prepare('SELECT id FROM team_members WHERE name = ?').get(m.name);
    if (!existing) {
      // Create user account
      const userExists = db.prepare('SELECT id FROM users WHERE username = ?').get(m.username);
      let userId;
      if (!userExists) {
        const result = insertUser.run(m.username, defaultPwd, accountRole);
        userId = result.lastInsertRowid;
        const roleLabel = accountRole === 'super_admin' ? 'SUPER_ADMIN' : 'ADMIN';
        console.log(`  ${roleLabel} created: ${m.username} / xinjie2025`);
      } else {
        userId = userExists.id;
        // Update role if needed
        db.prepare('UPDATE users SET role = ? WHERE id = ?').run(accountRole, userId);
      }
      insertMember.run(userId, m.name, m.role, m.title, m.bio, m.skills, m.is_founder, i);
    }
  }

  // Seed timeline events
  const timelineEvents = [
    { title: '团队正式成立', description: '芯捷工作室由王鑫杰创建，8名团队成员集结完毕。', event_date: '2025-11-12', type: 'milestone' },
    { title: '首次团建活动', description: '团队首次聚餐，拉近成员距离。', event_date: '2025-11-21', type: 'team' },
    { title: '第二次团建', description: '团队再次相聚，持续增进感情。', event_date: '2025-11-29', type: 'team' },
    { title: '南昌鸿蒙极客分享会', description: '丁博、李豪然在王鑫杰带领下参加分享会。', event_date: '2025-12-19', image_url: 'https://i-blog.csdnimg.cn/direct/e66d385e1ce4485ea33fc47ddcba2239.jpeg', type: 'event' },
    { title: '鸿蒙 HDD 郑州站', description: '王钊杰参加鸿蒙 HDD 郑州站。', event_date: '2025-12-22', image_url: 'https://i-blog.csdnimg.cn/direct/cd2e28bd23474fbf82f29588c94d3fce.jpeg', type: 'event' },
    { title: '腾讯云社区创作之星', description: '王鑫杰荣获腾讯云社区创作之星称号。', event_date: '2025-12-24', image_url: 'https://i-blog.csdnimg.cn/direct/9ecb041ab08c4012969381a485cb4f3f.jpeg', type: 'achievement' },
    { title: '鸿蒙跨平台训练营', description: '寒假期间王鑫杰发起训练营，带领10+人产出文章500余篇。', event_date: '2026-01-15', type: 'achievement', links: JSON.stringify([{ label: '启动文章', url: 'https://mp.weixin.qq.com/s/wUCE12I1XrAOLSLt0hvAGw' }, { label: '结束文章', url: 'https://mp.weixin.qq.com/s/JR2bXOlCfz9yroCOmT0VUg' }]) },
    { title: '鸿蒙开发实战训练营启动', description: '信息工程学院 × 鸿蒙生态联合举办春季训练营。', event_date: '2026-03-12', type: 'event', links: JSON.stringify([{ label: '官宣文章', url: 'https://mp.weixin.qq.com/s/QOcGzHkptkqDxVjIZU1g-g' }]) },
    { title: 'G-Star 武汉站 & 团建', description: '王钊杰、王鑫杰参加 G-Star 武汉站，同日团队26年第一次团建。', event_date: '2026-03-21', image_url: 'https://i-blog.csdnimg.cn/direct/4d0cb01dd07f4bd09fa7ec0d612b670f.jpeg', type: 'event' },
    { title: '26年第二次团建', description: '前往郑州线下龙虾交流会。', event_date: '2026-03-28', image_url: 'https://i-blog.csdnimg.cn/direct/4168fcfd50e24432b525fe9fc2030756.jpeg', type: 'team' },
    { title: '26年第三次团建', description: '商讨四月发展规划。', event_date: '2026-03-31', image_url: 'https://i-blog.csdnimg.cn/direct/9138cde2327345c08199699120999030.jpeg', type: 'team' },
    { title: '26年第四次团建', description: '探讨个人发展规划与未来方向。', event_date: '2026-05-09', image_url: 'https://i-blog.csdnimg.cn/direct/7e932045fe0541bbbed3e7160aee7f4d.jpeg', type: 'team' },
    { title: '计算机设计大赛', description: '王鑫杰、王钊杰、蔡新佳参加计算机设计大赛。', event_date: '2026-05-16', image_url: 'https://i-blog.csdnimg.cn/direct/8618ff6fc08f4e1c850e3ed50c75e6ba.jpeg', type: 'achievement' },
  ];

  const insertEvent = db.prepare(
    'INSERT INTO timeline_events (title, description, event_date, image_url, type, links, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  for (let i = 0; i < timelineEvents.length; i++) {
    const e = timelineEvents[i];
    const exists = db.prepare('SELECT id FROM timeline_events WHERE title = ? AND event_date = ?').get(e.title, e.event_date);
    if (!exists) {
      insertEvent.run(e.title, e.description, e.event_date, e.image_url || null, e.type, e.links || null, i);
    }
  }

  console.log('Seed complete.');
  process.exit(0);
};

seed();
