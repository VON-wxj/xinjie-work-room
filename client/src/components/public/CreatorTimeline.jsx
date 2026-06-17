import { motion } from 'framer-motion';
import { Award, Star, Zap, BookOpen, Users, Globe } from 'lucide-react';

const experiences = [
  {
    date: '2025.11',
    title: '芯捷工作室成立',
    description: '创立芯捷工作室，集结 8 名志同道合的伙伴，开启团队协作与技术探索之路。',
    icon: Users,
    color: 'from-primary-400 to-cyan-400',
    bg: 'bg-primary-500/10',
    border: 'border-primary-400/20',
    text: 'text-primary-400',
  },
  {
    date: '2025.12',
    title: '南昌鸿蒙极客分享会',
    description: '带领团队成员丁博、李豪然参加南昌鸿蒙极客分享会，深入学习鸿蒙生态技术。',
    icon: Globe,
    color: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-400/20',
    text: 'text-blue-400',
  },
  {
    date: '2025.12',
    title: '腾讯云社区创作之星',
    description: '荣获腾讯云社区创作之星称号，技术内容创作能力获得平台认可。',
    icon: Award,
    color: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
  },
  {
    date: '2026.01',
    title: '鸿蒙跨平台训练营',
    description: '寒假期间发起鸿蒙跨平台训练营，带领 10+ 人产出技术文章 500 余篇，推动鸿蒙生态内容建设。',
    icon: BookOpen,
    color: 'from-emerald-400 to-green-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
  },
  {
    date: '2026.03',
    title: '鸿蒙开发实战训练营',
    description: '信息工程学院 × 鸿蒙生态联合举办春季训练营，持续推动鸿蒙技术在高校的普及与应用。',
    icon: Zap,
    color: 'from-purple-400 to-pink-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
  },
  {
    date: '2026.03',
    title: 'G-Star 武汉站',
    description: '参加 G-Star 武汉站技术大会，与业界开发者交流学习，拓展技术视野。',
    icon: Globe,
    color: 'from-orange-400 to-red-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
  },
  {
    date: '2026.05',
    title: '计算机设计大赛',
    description: '与王钊杰、蔡新佳组队参加计算机设计大赛，以实战项目检验团队技术实力。',
    icon: Star,
    color: 'from-cyan-400 to-teal-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
  },
  {
    date: '2026.06',
    title: '工作室正式版上线',
    description: '芯捷工作室平台从测试版升级为正式版，新增后台管理中文化、图片上传修复、前端性能优化、HarmonyTeam 导航等功能。',
    icon: Zap,
    color: 'from-primary-400 to-accent-500',
    bg: 'bg-primary-500/10',
    border: 'border-primary-400/20',
    text: 'text-primary-400',
  },
];

export default function CreatorTimeline() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-400/20 bg-accent-400/5 text-xs text-accent-400 font-mono mb-4">
            <Star size={12} />
            创作者经历
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-main mb-3">
            <span className="gradient-text font-mono">~/</span> 创作者经历
          </h2>
          <p className="text-muted">从鸿蒙布道到团队建设，每一步都算数</p>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px">
            <div className="h-full w-full bg-gradient-to-b from-accent-400/40 via-primary-400/30 to-transparent" />
          </div>

          <div className="space-y-8">
            {experiences.map((item, index) => {
              const isLeft = index % 2 === 0;
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Dot with icon */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 mt-5 z-10">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]`}>
                      <Icon size={15} className="text-white" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <motion.div
                      whileHover={{ scale: 1.01, borderColor: 'rgba(6,182,212,0.2)' }}
                      className={`tech-card rounded-xl p-5 border-l-2 ${item.border}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-accent-400 font-semibold">{item.date}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${item.bg} ${item.border} ${item.text}`}>
                          {index === 0 ? '起点' : index === experiences.length - 1 ? '最新' : '经历'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-main mb-1.5">{item.title}</h3>
                      <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
