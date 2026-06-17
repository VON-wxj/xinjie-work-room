import { motion } from 'framer-motion';
import { Info, GitCommit, Calendar, ChevronRight } from 'lucide-react';
import useLanguage from '../../store/language';

const changelog = [
  {
    date: '2026-06-17',
    title: 'v1.0 正式版',
    items: [
      '修复图片上传由于扩展名丢失导致的文件损坏问题',
      '前端全面性能优化：页面懒加载、拆包、Canvas 动画降频',
      '页面过渡动画简化，移除昂贵的 blur 滤镜',
      '后台管理界面全中文化，移除所有英文硬编码',
      '导航栏新增"关于"页面，展示完整版本更新记录',
      '导航栏新增 HarmonyTeam 入口',
      '页脚版本号从"测试版"升级为"正式版"',
      '新增加入团队表单与申请管理后台',
    ],
  },
  {
    date: '2026-06-10',
    title: '安全加固 + 前后端重构',
    items: [
      '修复 ProfilePage 缺少 useLanguage 导入',
      'JWT 密钥强制校验，拒绝弱默认值',
      'CORS 白名单精确控制',
      '统一错误处理中间件',
    ],
  },
  {
    date: '2026-06-05',
    title: '页脚开发者信息 + 小V智能体',
    items: [
      '页脚展示开发者链接（CSDN、GitHub、AtomGit）与联系方式',
      '集成小米 MiMo 小V智能体聊天助手',
    ],
  },
  {
    date: '2026-05-25',
    title: '芯捷工作室 v1.0 测试版',
    items: [
      '团队活动管理与项目展示平台',
      '支持营利性活动与团建活动分类管理',
      '管理员后台：活动/分类/评论/用户/团队/时间线/项目/设置',
      'Markdown 编辑器、图片上传、附件管理',
      '深色/浅色主题切换、中英文双语',
      '访问者注册与评论系统',
      '团队时间线展示，可视化发展历程',
    ],
  },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2.5 mb-4 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
            <Info size={16} className="text-primary-400" />
            <span className="text-sm font-medium text-primary-400 font-mono">{t('about')}</span>
          </div>
          <h1 className="text-3xl font-bold text-main mb-3 font-mono">{t('aboutTitle')}</h1>
          <p className="text-secondary">{t('aboutDesc')}</p>
        </div>

        {/* Changelog */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-main mb-6 flex items-center gap-2 font-mono">
            <GitCommit size={18} className="text-primary-400" />
            {t('updateHistory')}
          </h2>

          <div className="relative pl-8">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary-400/40 via-primary-400/20 to-transparent" />

            <div className="space-y-8">
              {changelog.map((release, i) => (
                <motion.div
                  key={release.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Dot */}
                  <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 ${i === 0 ? 'bg-primary-400 border-primary-400' : 'bg-surface border-primary-400/30'}`} />

                  {/* Release header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs text-muted font-mono">
                      <Calendar size={11} />
                      {release.date}
                    </span>
                    {i === 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/15 text-primary-400 font-mono">
                        LATEST
                      </span>
                    )}
                  </div>

                  <div className="tech-card rounded-xl p-5">
                    <h3 className="text-sm font-bold text-main mb-3 font-mono">{release.title}</h3>
                    <ul className="space-y-1.5">
                      {release.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-secondary">
                          <ChevronRight size={14} className="text-primary-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted font-mono">
          芯捷工作室 &copy; 2025-2026
        </p>
      </motion.div>
    </div>
  );
}
