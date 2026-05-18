import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Github,
  BookOpen, Zap, Loader2, ExternalLink, RefreshCw,
} from 'lucide-react';
import { teamAPI } from '../../api';
import useLanguage from '../../store/language';
import ScrollReveal from '../../components/public/ScrollReveal';

export default function TeamMember() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMember = () => {
    const abort = new AbortController();
    setLoading(true);
    setError(null);
    teamAPI.get(id, { signal: abort.signal })
      .then((data) => setMember(data.member))
      .catch((err) => { if (!abort.signal.aborted) setError(err); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  };

  useEffect(() => {
    const cleanup = fetchMember();
    return cleanup;
  }, [id]);

  const onImgError = (e) => { e.target.style.display = 'none'; };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-surface">
        <Loader2 size={32} className="animate-spin text-primary-400/50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-surface">
        <div className="text-center">
          <p className="text-muted text-sm font-mono mb-3">{t('errorLoadFailed')}</p>
          <button
            onClick={() => { const c = fetchMember(); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-400/20 text-sm text-primary-400 hover:bg-primary-500/10 transition-all font-mono"
          >
            <RefreshCw size={14} /> {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-surface">
        <div className="text-center">
          <p className="text-muted text-lg font-mono">{t('memberNotFound')}</p>
          <Link to="/team" className="text-primary-400 hover:underline mt-2 inline-block">{t('backToTeam')}</Link>
        </div>
      </div>
    );
  }

  // 安全解析 skills
  const skills = typeof member.skills === 'string' ? member.skills.split(',') : (Array.isArray(member.skills) ? member.skills : []);

  return (
    <div className="min-h-screen pt-16 bg-surface grid-bg">
      {/* Back link */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <Link to="/team" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary-400 transition-colors">
          <ArrowLeft size={16} />
          {t('backToTeam')}
        </Link>
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Left: Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <div className={`w-40 h-40 sm:w-56 sm:h-56 rounded-full flex items-center justify-center text-main text-7xl font-bold ${
              member.is_founder
                ? 'bg-gradient-to-br from-primary-400 to-accent-500 shadow-[0_0_40px_rgba(6,182,212,0.3)]'
                : 'bg-gradient-to-br from-surface-300 to-surface-400'
            }`}>
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.name} className="w-full h-full rounded-full object-cover" loading="lazy" decoding="async" onError={onImgError} />
              ) : null}
              {(!member.avatar_url) && (member.name?.charAt(0))}
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 pt-2"
          >
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-main">{member.name}</h1>
              {!!member.is_founder && (
                <span className="px-2 py-1 rounded text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20 font-mono">
                  FOUNDER
                </span>
              )}
            </div>
            <p className="text-lg text-primary-400 font-mono mb-3">{member.title || member.role}</p>

            {member.bio && (
              <p className="text-secondary leading-relaxed mb-4 max-w-xl">{member.bio}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-5">
              {member.join_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-muted" />
                  {t('joinedAt')} {member.join_date}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-muted" />
                {t('china')}
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 mb-6">
              {member.github_url && (
                <a
                  href={member.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-200 border border-white/5 text-sm text-secondary hover:text-primary-400 hover:border-white/20 transition-all font-mono"
                >
                  <Github size={16} />
                  GitHub
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-main font-mono">--</div>
                <div className="text-xs text-muted mt-1">{t('activeDays')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-main font-mono">{skills.length}</div>
                <div className="text-xs text-muted mt-1">{t('skillCount')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <ScrollReveal delay={0.2}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-primary-400" />
              <h2 className="text-lg font-bold text-main font-mono">SKILLS</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20 text-sm text-primary-400 font-mono">
                  {typeof skill === 'string' ? skill.trim() : skill}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Activity overview */}
      <ScrollReveal delay={0.3}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <div className="tech-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-accent-400" />
              <h2 className="text-lg font-bold text-main font-mono">ACTIVITY_OVERVIEW</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {t('activityOverviewDesc')}
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
