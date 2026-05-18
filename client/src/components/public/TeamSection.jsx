import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Zap, Award, Calendar, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { teamAPI } from '../../api';
import useLanguage from '../../store/language';
import ScrollReveal, { StaggerContainer, StaggerItem } from './ScrollReveal';

export default function TeamSection() {
  const { t } = useLanguage();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setError(null);
    teamAPI.list({ signal: abort.signal })
      .then((data) => setMembers(data.members))
      .catch((err) => { if (!abort.signal.aborted) setError(err); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    teamAPI.list()
      .then((data) => setMembers(data.members))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  const stats = [
    { icon: Users, label: t('teamMembers'), value: String(members.length) },
    { icon: Calendar, label: t('teamFounded'), value: '2025.11' },
    { icon: Award, label: t('teamPartners'), value: '4+' },
    { icon: Zap, label: t('teamArticles'), value: '500+' },
  ];

  // Image fallback handler
  const onImgError = (e) => { e.target.style.display = 'none'; };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-14">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-400/20 bg-primary-400/5 text-xs text-primary-400 font-mono mb-4"
            >
              <Users size={12} className="animate-pulse-soft" />
              TEAM_XINJIE
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-main mb-3">
              <span className="gradient-text font-mono">&gt;</span> {t('teamSection')}
            </h2>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed">
              {t('teamDesc').replace('{count}', String(members.length))}
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map(({ icon: Icon, label, value }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.03, borderColor: 'rgba(6, 182, 212, 0.3)' }}
                className="tech-card rounded-xl p-5 text-center"
              >
                <Icon size={22} className="mx-auto text-primary-400 mb-2" />
                <div className="text-2xl font-extrabold text-main font-mono mb-1">{value}</div>
                <div className="text-xs text-muted">{label}</div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* View all */}
        <div className="text-center mb-10">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-primary-400/20 text-sm text-primary-400 hover:bg-primary-500/10 transition-all font-mono group"
          >
            VIEW_ALL_MEMBERS
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Member grid */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={28} className="animate-spin text-primary-400/50" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted text-sm font-mono mb-3">{t('errorLoadFailed')}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-400/20 text-sm text-primary-400 hover:bg-primary-500/10 transition-all font-mono"
            >
              <RefreshCw size={14} /> {t('retry')}
            </button>
          </div>
        ) : (
          <StaggerContainer>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {members.map((member) => (
                <StaggerItem key={member.id}>
                  <Link to={`/team/${member.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.04, borderColor: 'rgba(6, 182, 212, 0.4)', y: -4 }}
                      className={`tech-card rounded-xl p-5 text-center h-full transition-all ${
                        member.is_founder ? 'ring-1 ring-primary-400/30' : ''
                      }`}
                    >
                      <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3 text-main font-bold text-lg ${
                        member.is_founder
                          ? 'bg-gradient-to-br from-primary-400 to-accent-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                          : 'bg-gradient-to-br from-surface-300 to-surface-400'
                      }`}>
                        {member.avatar_url ? (
                          <img src={member.avatar_url} alt={member.name} className="w-full h-full rounded-full object-cover" loading="lazy" decoding="async" onError={onImgError} />
                        ) : null}
                        {(!member.avatar_url) && (member.name?.charAt(0))}
                      </div>
                      <div className="text-sm font-bold text-main mb-0.5">{member.name}</div>
                      <div className={`text-xs font-mono ${member.is_founder ? 'text-primary-400' : 'text-muted'}`}>
                        {member.role}
                      </div>
                      {!!member.is_founder && (
                        <div className="mt-2">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-primary-500/10 text-primary-400 border border-primary-500/20 font-mono">
                            FOUNDER
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
