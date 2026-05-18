import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { timelineAPI } from '../../api';
import useLanguage from '../../store/language';

const typeConfig = {
  milestone: { dot: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
  event: { dot: 'from-primary-400 to-cyan-400', bg: 'bg-primary-500/10', border: 'border-primary-400/20', text: 'text-primary-400' },
  team: { dot: 'from-emerald-400 to-green-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  achievement: { dot: 'from-purple-400 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
};

export default function Timeline() {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setError(null);
    timelineAPI.list({ signal: abort.signal })
      .then((data) => setEvents(data.events))
      .catch((err) => { if (!abort.signal.aborted) setError(err); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, []);

  // i18n type label map
  const typeLabels = {
    milestone: t('milestone'),
    event: t('event'),
    team: t('teamBuilding'),
    achievement: t('achievement'),
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-primary-400/50" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="text-center">
          <p className="text-muted text-sm font-mono mb-3">{t('errorLoadFailed')}</p>
          <button
            onClick={() => {
              setLoading(true); setError(null);
              timelineAPI.list().then((data) => setEvents(data.events)).catch((err) => setError(err)).finally(() => setLoading(false));
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-400/20 text-sm text-primary-400 hover:bg-primary-500/10 transition-all font-mono"
          >
            <RefreshCw size={14} /> {t('retry')}
          </button>
        </div>
      </section>
    );
  }

  if (!events.length) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-400/20 bg-primary-400/5 text-xs text-primary-400 font-mono mb-4">
            <Calendar size={12} className="animate-pulse-soft" />
            {t('timeline')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-main mb-3">
            <span className="gradient-text font-mono">~/</span> {t('timeline')}
          </h2>
          <p className="text-muted">{t('timelineDesc')}</p>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px">
            <div className="h-full w-full bg-gradient-to-b from-primary-400/20 via-primary-400/40 to-transparent" />
          </div>

          <div className="space-y-8">
            {events.map((event, index) => {
              const isLeft = index % 2 === 0;
              const config = typeConfig[event.type] || typeConfig.event;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-3.5 h-3.5 -translate-x-1/2 mt-5 z-10">
                    <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${config.dot} shadow-[0_0_10px_rgba(6,182,212,0.3)]`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${config.dot} animate-ping absolute inset-0 opacity-30`} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <motion.div
                      whileHover={{ scale: 1.01, borderColor: 'rgba(6,182,212,0.2)' }}
                      className={`tech-card rounded-xl p-5 border-l-2 ${config.border}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-primary-400 font-semibold">{event.event_date}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${config.bg} ${config.border} ${config.text}`}>
                          {typeLabels[event.type] || t('event')}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-main mb-1.5">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-muted leading-relaxed">{event.description}</p>
                      )}

                      {event.links && (() => {
                        try {
                          const links = JSON.parse(event.links);
                          if (Array.isArray(links) && links.length > 0) {
                            return (
                              <div className="mt-3 space-y-1">
                                {links.map((link, i) => (
                                  <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                                  >
                                    <ExternalLink size={11} />
                                    {link.label}
                                  </a>
                                ))}
                              </div>
                            );
                          }
                        } catch { return null; }
                        return null;
                      })()}
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
