import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectAPI } from '../../api';
import useLanguage from '../../store/language';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/public/ScrollReveal';
import { ExternalLink, Eye, Loader2, Tag, RefreshCw } from 'lucide-react';

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setError(null);
    projectAPI.list({ signal: abort.signal })
      .then((data) => setProjects(data.projects))
      .catch((err) => { if (!abort.signal.aborted) setError(err); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    projectAPI.list()
      .then((data) => setProjects(data.projects))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  const featured = projects[0];
  const rest = projects.length > 1 ? projects.slice(1) : [];
  const onImgError = (e) => { e.target.style.display = 'none'; };

  // 安全解析 tags
  const safeSplitTags = (tags) => {
    if (typeof tags === 'string') return tags.split(',');
    if (Array.isArray(tags)) return tags;
    return [];
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--c-bg)' }}>
      <section className="py-16 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-400/20 bg-primary-400/5 text-xs text-primary-400 font-mono mb-4"
          >PROJECT_SHOWCASE</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-main mb-4">
            <span className="gradient-text font-mono">$</span> {t('projectShowcase')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-secondary max-w-2xl mx-auto">
            {t('projectDesc')}
          </motion.p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400/50" /></div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted text-sm font-mono mb-3">{t('errorLoadFailed')}</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-400/20 text-sm text-primary-400 hover:bg-primary-500/10 transition-all font-mono"
              >
                <RefreshCw size={14} /> {t('retry')}
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-lg font-mono">{t('noProjects')}</p>
            </div>
          ) : (
            <>
              {featured && (
                <ScrollReveal>
                  <motion.div
                    whileHover={{ borderColor: 'rgba(6,182,212,0.3)' }}
                    className="tech-card rounded-2xl overflow-hidden group grid grid-cols-1 lg:grid-cols-5 mb-10"
                  >
                    <div className="lg:col-span-3 relative h-64 lg:h-full overflow-hidden bg-surface-200">
                      {featured.cover_image ? (
                        <>
                          <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" onError={onImgError} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-surface/50" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Tag size={64} className="text-primary-400/20" /></div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-accent-500/90 text-white backdrop-blur-sm">FEATURED</span>
                      </div>
                    </div>
                    <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-center">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-main mb-3 group-hover:text-primary-400 transition-colors">{featured.title}</h3>
                      {featured.description && (
                        <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">{featured.description}</p>
                      )}
                      {featured.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {safeSplitTags(featured.tags).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono tag-chip">{typeof tag === 'string' ? tag.trim() : tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        {featured.url && (
                          <a href={featured.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg btn-glow text-white text-sm font-semibold">
                            <ExternalLink size={14} />{t('visitProject')}
                          </a>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-sm text-primary-400 font-mono">
                          <Eye size={15} />{featured.creator_name || '芯捷工作室'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              )}

              <StaggerContainer>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((project) => {
                    const tags = safeSplitTags(project.tags);
                    return (
                      <StaggerItem key={project.id}>
                        <motion.div
                          whileHover={{ borderColor: 'rgba(6,182,212,0.3)', y: -4 }}
                          className="tech-card rounded-xl overflow-hidden h-full hvr-shadow flex flex-col"
                        >
                          <div className="relative h-48 overflow-hidden bg-surface-200">
                            {project.cover_image ? (
                              <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" onError={onImgError} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Tag size={48} className="text-primary-400/20" /></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-main mb-2 line-clamp-1">{project.title}</h3>
                            {project.description && (
                              <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2 flex-1">{project.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                              {tags.map((tag) => (
                                <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono tag-chip">{typeof tag === 'string' ? tag.trim() : tag}</span>
                              ))}
                            </div>
                            {project.url && (
                              <a href={project.url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 mt-3 font-mono">
                                <ExternalLink size={11} />{t('visitProject')}
                              </a>
                            )}
                          </div>
                        </motion.div>
                      </StaggerItem>
                    );
                  })}
                </div>
              </StaggerContainer>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
