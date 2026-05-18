import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { activityAPI, categoryAPI } from '../../api';
import HeroSection from '../../components/public/HeroSection';
import TeamSection from '../../components/public/TeamSection';
import Timeline from '../../components/public/Timeline';
import ActivityCard from '../../components/public/ActivityCard';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/public/ScrollReveal';
import { CardSkeleton } from '../../components/public/AnimatedCounter';
import { Filter, Zap, RefreshCw } from 'lucide-react';
import useLanguage from '../../store/language';

export default function HomePage() {
  const { t } = useLanguage();
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState({ profit: [], team_building: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setError(null);
    Promise.all([
      activityAPI.list({ limit: 50, signal: abort.signal }),
      categoryAPI.list({ signal: abort.signal }),
    ]).then(([actData, catData]) => {
      if (!abort.signal.aborted) {
        setActivities(actData.activities);
        setCategories(catData.categories);
      }
    }).catch((err) => {
      if (!abort.signal.aborted) setError(err);
    }).finally(() => {
      if (!abort.signal.aborted) setLoading(false);
    });
    return () => abort.abort();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      activityAPI.list({ limit: 50 }),
      categoryAPI.list(),
    ]).then(([actData, catData]) => {
      setActivities(actData.activities);
      setCategories(catData.categories);
    }).catch((err) => setError(err))
    .finally(() => setLoading(false));
  };

  const filtered = activities.filter((a) => {
    if (typeFilter && a.type !== typeFilter) return false;
    if (catFilter && a.category_id !== Number(catFilter)) return false;
    return true;
  });

  return (
    <>
      <HeroSection />
      <TeamSection />
      <Timeline />

      <section id="activities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ScrollReveal direction="scale">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-400/20 bg-primary-400/5 text-xs text-primary-400 font-mono mb-4"
              whileHover={{ scale: 1.05, borderColor: 'rgba(6,182,212,0.4)' }}
            >
              <Zap size={12} className="animate-pulse-soft" />
              EXPLORE
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-main mb-3">
              <span className="gradient-text font-mono">//</span>{' '}
              <span className="tracking-tight">{t('activities')}</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              {t('activitiesDesc')}
            </p>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={0.1} direction="fadeUp">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface-100 text-sm">
              <Filter size={14} className="text-muted" />
              {[
                { value: '', label: 'ALL' },
                { value: 'profit', label: 'PROFIT' },
                { value: 'team_building', label: 'TEAM' },
              ].map(({ value, label }) => (
                <motion.button
                  key={value}
                  onClick={() => { setTypeFilter(value); setCatFilter(''); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    typeFilter === value
                      ? value === 'profit'
                        ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                        : value === 'team_building'
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-secondary hover:text-primary-400'
                  }`}
                >
                  {label}
                </motion.button>
              ))}
            </div>

            {typeFilter && categories[typeFilter]?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface-100 text-sm"
              >
                {categories[typeFilter].map((cat) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setCatFilter(catFilter === String(cat.id) ? '' : String(cat.id))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded text-xs transition-all ${
                      catFilter === String(cat.id)
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-secondary hover:text-primary-400'
                    }`}
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </ScrollReveal>

        {/* Activity grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
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
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted text-lg font-mono">NO_ACTIVITIES_FOUND</p>
            <p className="text-main text-sm mt-2">{t('noActivities')}</p>
          </motion.div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((activity, i) => (
              <StaggerItem key={activity.id}>
                <ActivityCard activity={activity} index={i} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>
    </>
  );
}
