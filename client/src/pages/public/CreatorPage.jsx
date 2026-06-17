import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Zap, BookOpen, Users, Globe, Loader2 } from 'lucide-react';
import api from '../../api';

const iconMap = [Users, Globe, Award, BookOpen, Zap, Globe, Star, Zap];
const colorMap = [
  { color: 'from-primary-400 to-cyan-400', shadow: 'rgba(6,182,212,0.4)' },
  { color: 'from-blue-400 to-indigo-500', shadow: 'rgba(59,130,246,0.4)' },
  { color: 'from-yellow-400 to-amber-500', shadow: 'rgba(251,191,36,0.4)' },
  { color: 'from-emerald-400 to-green-500', shadow: 'rgba(52,211,153,0.4)' },
  { color: 'from-purple-400 to-pink-500', shadow: 'rgba(168,85,247,0.4)' },
  { color: 'from-orange-400 to-red-500', shadow: 'rgba(251,146,60,0.4)' },
  { color: 'from-cyan-400 to-teal-500', shadow: 'rgba(6,182,212,0.4)' },
  { color: 'from-primary-400 to-accent-500', shadow: 'rgba(6,182,212,0.4)' },
];

export default function CreatorPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/creator').then(r => {
      setExperiences(r.data.experiences);
    }).finally(() => setLoading(false));
  }, []);

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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary-400/50" />
          </div>
        ) : (
          <>
            {/* Horizontal Timeline */}
            <div className="relative">
              <div className="hidden lg:block absolute left-0 right-0 top-14 h-[2px] bg-gradient-to-r from-transparent via-accent-400/30 to-transparent" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {experiences.map((item, index) => {
                  const Icon = iconMap[index % iconMap.length];
                  const style = colorMap[index % colorMap.length];

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                      className="relative pt-14 lg:pt-0"
                    >
                      {/* Dot on the line */}
                      <div className="hidden lg:flex absolute top-14 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center`}
                          style={{ boxShadow: `0 0 20px ${style.shadow}` }}
                        >
                          <Icon size={16} className="text-white" />
                        </div>
                      </div>

                      {/* Mobile dot */}
                      <div className="lg:hidden absolute left-4 top-0 z-10">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center`}
                          style={{ boxShadow: `0 0 20px ${style.shadow}` }}
                        >
                          <Icon size={16} className="text-white" />
                        </div>
                      </div>

                      {/* Card */}
                      <motion.div
                        whileHover={{ y: -4, borderColor: 'rgba(6,182,212,0.15)' }}
                        className="tech-card rounded-xl overflow-hidden h-full ml-6 lg:ml-0 lg:mt-8"
                      >
                        {item.image_url && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-mono text-accent-400 font-bold">{item.event_date}</span>
                            {index === 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-mono">起点</span>
                            )}
                            {index === experiences.length - 1 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-400/20 font-mono">最新</span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-main mb-2">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                          )}
                        </div>
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
                { value: experiences.length, label: '里程碑', icon: Star },
                { value: '500+', label: '产出文章', icon: BookOpen },
                { value: '10+', label: '训练营学员', icon: Users },
                { value: '5+', label: '技术大会', icon: Globe },
              ].map((stat, i) => {
                const SIcon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="tech-card rounded-xl p-6 text-center"
                  >
                    <SIcon size={24} className="text-accent-400 mx-auto mb-3" />
                    <div className="text-3xl font-extrabold text-main font-mono mb-1">{stat.value}</div>
                    <div className="text-xs text-muted font-mono">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
