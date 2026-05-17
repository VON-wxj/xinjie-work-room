import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { activityAPI } from '../../api';
import ScrollReveal from './ScrollReveal';
import { ExternalLink, TrendingUp, Calendar, Loader2, Eye } from 'lucide-react';
import useLanguage from '../../store/language';

export default function ProjectShowcase() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    activityAPI.list({ type: 'profit', limit: 6, sort: 'created_at' }).then((data) => {
      setProjects(data.activities);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="animate-spin text-primary-400/50" />
        </div>
      </section>
    );
  }

  if (!projects.length) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-64 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-14">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-400/20 bg-primary-400/5 text-xs text-primary-400 font-mono mb-4"
            >
              <TrendingUp size={12} className="animate-pulse-soft" />
              PROJECT_SHOWCASE
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-main mb-3">
              <span className="gradient-text font-mono">$</span>{' '}
              项目展示
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              团队接手的营利性项目，用技术创造价值
            </p>
          </div>
        </ScrollReveal>

        {/* Featured project - first one, larger */}
        {projects[0] && (
          <ScrollReveal delay={0.1}>
            <Link to={`/activity/${projects[0].id}`} className="block mb-8">
              <motion.div
                onMouseEnter={() => setHoveredId(projects[0].id)}
                onMouseLeave={() => setHoveredId(null)}
                className="tech-card rounded-2xl overflow-hidden group grid grid-cols-1 lg:grid-cols-5"
              >
                {/* Image */}
                <div className="lg:col-span-3 relative h-64 lg:h-full overflow-hidden bg-surface-200">
                  {projects[0].cover_image ? (
                    <>
                      <img
                        src={projects[0].cover_image}
                        alt={projects[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-surface/50" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TrendingUp size={64} className="text-primary-400/20" />
                    </div>
                  )}
                  {/* Overlay tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-accent-500/90 text-white backdrop-blur-sm">
                      FEATURED
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    {projects[0].category_name && (
                      <span className="text-xs text-primary-400 font-mono uppercase tracking-wider">
                        {projects[0].category_name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-main mb-3 group-hover:text-primary-400 transition-colors">
                    {projects[0].title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
                    {projects[0].start_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {projects[0].start_date}
                      </span>
                    )}
                    {projects[0].profit != null && (
                      <span className="flex items-center gap-1.5 text-emerald-500 font-mono font-semibold">
                        <TrendingUp size={14} />
                        ¥{Number(projects[0].profit).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary-400 font-mono group-hover:gap-2.5 transition-all">
                      <Eye size={15} />
                      查看项目详情
                    </span>
                    {projects[0].url && (
                      <a
                        href={projects[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary-400 transition-colors"
                      >
                        <ExternalLink size={14} />
                        项目链接
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          </ScrollReveal>
        )}

        {/* Grid of remaining projects */}
        {projects.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(1).map((project, index) => (
              <ScrollReveal key={project.id} delay={0.15 + index * 0.08}>
                <Link to={`/activity/${project.id}`} className="block group">
                  <motion.div
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="tech-card rounded-xl overflow-hidden h-full hvr-shadow"
                  >
                    {/* Cover */}
                    <div className="relative h-44 overflow-hidden bg-surface-200">
                      {project.cover_image ? (
                        <img
                          src={project.cover_image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <TrendingUp size={40} className="text-primary-400/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 left-3">
                        {project.category_name && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/50 text-white backdrop-blur-sm">
                            {project.category_name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-main mb-1 group-hover:text-primary-400 transition-colors line-clamp-1">
                        {project.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs">
                        {project.profit != null && (
                          <span className="text-emerald-500 font-mono font-semibold">
                            ¥{Number(project.profit).toLocaleString()}
                          </span>
                        )}
                        <span className="text-muted font-mono">
                          {project.start_date || ''}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            to="/"
            onClick={(e) => { e.preventDefault(); document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-primary-400/20 text-sm text-primary-400 hover:bg-primary-500/10 transition-all font-mono group"
          >
            VIEW_ALL_PROJECTS
            <Eye size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
