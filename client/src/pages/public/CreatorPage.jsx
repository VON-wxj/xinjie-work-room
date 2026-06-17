import { motion } from 'framer-motion';
import { Award, Star, Zap, BookOpen, Users, Globe } from 'lucide-react';

const experiences = [
  {
    date: '2025.11',
    title: '芯捷工作室成立',
    description: '创立芯捷工作室，集结 8 名志同道合的伙伴，开启团队协作与技术探索之路。',
    icon: Users,
    color: 'from-primary-400 to-cyan-400',
    shadow: 'rgba(6,182,212,0.4)',
  },
  {
    date: '2025.12',
    title: '南昌鸿蒙极客分享会',
    description: '带领团队成员丁博、李豪然参加南昌鸿蒙极客分享会，深入学习鸿蒙生态技术。',
    icon: Globe,
    color: 'from-blue-400 to-indigo-500',
    shadow: 'rgba(59,130,246,0.4)',
  },
  {
    date: '2025.12',
    title: '腾讯云社区创作之星',
    description: '荣获腾讯云社区创作之星称号，技术内容创作能力获得平台认可。',
    icon: Award,
    color: 'from-yellow-400 to-amber-500',
    shadow: 'rgba(251,191,36,0.4)',
  },
  {
    date: '2026.01',
    title: '鸿蒙跨平台训练营',
    description: '寒假期间发起训练营，带领 10+ 人产出技术文章 500 余篇，推动鸿蒙生态内容建设。',
    icon: BookOpen,
    color: 'from-emerald-400 to-green-500',
    shadow: 'rgba(52,211,153,0.4)',
  },
  {
    date: '2026.03',
    title: '鸿蒙开发实战训练营',
    description: '信息工程学院 × 鸿蒙生态联合举办春季训练营，持续推动鸿蒙技术在高校的普及。',
    icon: Zap,
    color: 'from-purple-400 to-pink-500',
    shadow: 'rgba(168,85,247,0.4)',
  },
  {
    date: '2026.03',
    title: 'G-Star 武汉站',
    description: '参加 G-Star 武汉站技术大会，与业界开发者交流学习，拓展技术视野。',
    icon: Globe,
    color: 'from-orange-400 to-red-500',
    shadow: 'rgba(251,146,60,0.4)',
  },
  {
    date: '2026.05',
    title: '计算机设计大赛',
    description: '与王钊杰、蔡新佳组队参加计算机设计大赛，以实战项目检验团队技术实力。',
    icon: Star,
    color: 'from-cyan-400 to-teal-500',
    shadow: 'rgba(6,182,212,0.4)',
  },
  {
    date: '2026.06',
    title: '工作室正式版上线',
    description: '平台从测试版升级为正式版，新增图片上传修复、性能优化、全中文化等功能。',
    icon: Zap,
    color: 'from-primary-400 to-accent-500',
    shadow: 'rgba(6,182,212,0.4)',
  },
];

export default function CreatorPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-400/20 bg-accent-400/5 text-xs text-accent-400 font-mono mb-4">
            <Star size={12} />
            创作者经历
          </div>
          <h1 className="text-4xl font-extrabold text-main mb-3 font-mono">
            <span className="gradient-text">~/</span> 创作者经历
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            从鸿蒙布道到团队建设，每一步都算数
          </p>
        </motion.div>

        {/* Horizontal Timeline */}
        <div className="relative">
          {/* Horizontal line */}
          <div className="hidden lg:block absolute left-0 right-0 top-14 h-[2px] bg-gradient-to-r from-transparent via-accent-400/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {experiences.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="relative pt-14 lg:pt-0"
                >
                  {/* Dot on the line (desktop) */}
                  <div className="hidden lg:flex absolute top-14 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}
                      style={{ boxShadow: `0 0 20px ${item.shadow}` }}
                    >
                      <Icon size={16} className="text-white" />
                    </div>
                  </div>

                  {/* Mobile dot */}
                  <div className="lg:hidden absolute left-4 top-0 z-10">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}
                      style={{ boxShadow: `0 0 20px ${item.shadow}` }}
                    >
                      <Icon size={16} className="text-white" />
                    </div>
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -4, borderColor: 'rgba(6,182,212,0.15)' }}
                    className="tech-card rounded-xl p-5 h-full ml-6 lg:ml-0 lg:mt-8"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-mono text-accent-400 font-bold">{item.date}</span>
                      {index === 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-mono">
                          起点
                        </span>
                      )}
                      {index === experiences.length - 1 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-400/20 font-mono">
                          最新
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-main mb-2">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '8', label: '里程碑', icon: Star },
            { value: '500+', label: '产出文章', icon: BookOpen },
            { value: '10+', label: '训练营学员', icon: Users },
            { value: '5+', label: '技术大会', icon: Globe },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="tech-card rounded-xl p-6 text-center"
              >
                <Icon size={24} className="text-accent-400 mx-auto mb-3" />
                <div className="text-3xl font-extrabold text-main font-mono mb-1">{stat.value}</div>
                <div className="text-xs text-muted font-mono">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
