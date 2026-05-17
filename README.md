# 芯捷工作室

团队活动管理与项目展示平台。前台展示团队介绍、时间线、项目成果和活动汇总；后台支持管理员对活动、项目、成员、评论、访客等进行管理。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + Vite 6 + Tailwind CSS 3 + Framer Motion 11 |
| 后端 | Node.js + Express 4 |
| 数据库 | SQLite (better-sqlite3) |
| 认证 | JWT (jsonwebtoken + bcryptjs) |
| 部署 | PM2 |

## 线上地址

| 服务 | 地址 |
|------|------|
| 前端 | http://8.160.162.33:3002 |
| API | http://8.160.162.33:3003 |

## 账号体系

| 姓名 | 用户名 | 密码 | 角色 |
|------|--------|------|------|
| 王鑫杰 | `wangxinjie` | `xinjie2025` | 超级管理员 |
| 李豪然 | `lihaoran` | `xinjie2025` | 管理员 |
| 韦淇元 | `weiqiyuan` | `xinjie2025` | 管理员 |
| 王钊杰 | `wangzhaojie` | `xinjie2025` | 管理员 |
| 蔡新佳 | `caixinjia` | `xinjie2025` | 管理员 |
| 杜勇明 | `duyongming` | `xinjie2025` | 管理员 |
| 单传辉 | `shanchuanhui` | `xinjie2025` | 管理员 |
| 丁博 | `dingbo` | `xinjie2025` | 管理员 |

> 首次登录后建议修改密码。超管可修改成员信息、查看操作日志。普通管理员可管理活动和项目。普通成员可编辑个人资料。

## 功能结构

```
前台页面
├── /                   首页（Hero + 团队 + 时间线 + 活动瀑布流）
├── /projects           项目展示
├── /team               团队成员列表
├── /team/:id           成员个人主页
├── /activity/:id       活动详情
├── /profile            个人资料（登录后）
├── /login              登录
└── /register           注册

后台管理（管理员登录后）
├── /admin              仪表盘
├── /admin/activities   活动管理
├── /admin/projects     项目管理
├── /admin/categories   分类管理
├── /admin/comments     评论管理
├── /admin/visitors     访客管理
├── /admin/team         团队成员管理
├── /admin/timeline     时间线管理
├── /admin/users        管理员管理（超管）
├── /admin/settings     站点设置（超管）
└── /admin/logs         操作日志（超管）
```

## 权限说明

| 操作 | 超管 | 管理员 | 普通用户 |
|------|:--:|:--:|:--:|
| 浏览前台 | ✅ | ✅ | ✅ |
| 评论/收藏 | ✅ | ✅ | ✅ |
| 编辑个人资料 | ✅ | ✅ | ✅ |
| 管理活动/项目/分类 | ✅ | ✅ | ❌ |
| 审核评论 | ✅ | ✅ | ❌ |
| 查看访客 | ✅ | ✅ | ❌ |
| 增删改团队成员 | ✅ | ❌ | ❌ |
| 站点设置/操作日志 | ✅ | ❌ | ❌ |

## 本地开发

```bash
cd xj-work-room
npm install
npm run seed        # 初始化数据库
npm run dev         # 前端 :5173（代理 API 到 :3003）
npm run server      # 后端 :3003
```

## 部署

```bash
# 构建前端
npm run build

# 同步到服务器
rsync -avz --exclude node_modules --exclude data --exclude .git ./ root@8.160.162.33:/opt/xj-work-room/

# 服务器上
cd /opt/xj-work-room
npm install --production
npm run seed
pm2 start ecosystem.config.cjs
pm2 save
```

## 项目结构

```
xj-work-room/
├── server/               # 后端
│   ├── index.js          # 入口
│   ├── config.js         # 配置
│   ├── db/init.js        # 数据库初始化
│   ├── db/seed.js        # 种子数据
│   ├── middleware/        # 中间件（auth、upload）
│   ├── routes/           # 路由
│   └── utils/            # 工具函数
├── client/               # 前端
│   ├── src/
│   │   ├── api/          # API 请求封装
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   ├── store/        # 状态管理（zustand）
│   │   ├── i18n/         # 国际化
│   │   └── hooks/        # 自定义 Hooks
│   └── vite.config.js
├── ecosystem.config.cjs  # PM2 配置
└── package.json
```

## 数据库表

| 表名 | 说明 |
|------|------|
| users | 用户（角色：super_admin / admin / user） |
| team_members | 团队成员（关联 users） |
| activities | 活动（营利性 / 团队团建） |
| projects | 项目展示 |
| timeline_events | 时间线事件 |
| categories | 活动分类 |
| comments | 评论 |
| favorites | 收藏 |
| operation_logs | 操作日志 |
| settings | 站点设置 |

## 特色功能

- 深色/亮色双主题切换
- 中英文双语支持
- React Bits 风格动画背景
- Framer Motion 页面过渡与滚动动画
- 瀑布流活动卡片
- 图片 Lightbox 查看
- Markdown 正文编辑与渲染
- JWT 认证 + 权限分级
