import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Github, ArrowRight, Loader2 } from 'lucide-react';
import { teamAPI } from '../../api';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/public/ScrollReveal';

export default function TeamList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamAPI.list().then((data) => {
      setMembers(data.members);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const founders = members.filter(m => m.is_founder);
  const others = members.filter(m => !m.is_founder);

  // Stats
  const totalMembers = members.length;

  return (
    <div className="min-h-screen pt-16 bg-surface grid-bg">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-400/20 bg-primary-400/5 text-xs text-primary-400 font-mono mb-4"
          >
            <Users size={12} />
            {totalMembers} MEMBERS
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-main mb-4"
          >
            <span className="gradient-text font-mono">&gt;</span> 团队成员
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted max-w-2xl mx-auto"
          >
            八位志同道合的伙伴，因为技术而相聚，因为热爱而前行
          </motion.p>
        </div>
      </section>

      {/* Founder section */}
      {founders.length > 0 && (
        <section className="pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-gradient-to-b from-primary-400 to-accent-500 rounded-full" />
              <h2 className="text-lg font-bold text-main font-mono">FOUNDER</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {founders.map((member) => (
                <MemberCard key={member.id} member={member} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All members */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full" />
            <h2 className="text-lg font-bold text-main font-mono">CORE_TEAM</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-primary-400/50" />
            </div>
          ) : (
            <StaggerContainer>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {others.map((member) => (
                  <StaggerItem key={member.id}>
                    <MemberCard member={member} />
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}

function MemberCard({ member, featured = false }) {
  const skills = member.skills ? member.skills.split(',') : [];

  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: 'rgba(6, 182, 212, 0.3)' }}
      className={`tech-card rounded-xl overflow-hidden hvr-sweep-right ${
        featured ? 'ring-1 ring-primary-400/30' : ''
      }`}
    >
      <div className="flex items-start gap-5 p-5">
        {/* Avatar */}
        <Link to={`/team/${member.id}`} className="flex-shrink-0 group block">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-main text-3xl font-bold ${
            member.is_founder
              ? 'bg-gradient-to-br from-primary-400 to-accent-500 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
              : 'bg-gradient-to-br from-surface-300 to-surface-400'
          } group-hover:scale-105 transition-transform`}>
            {member.avatar_url ? (
              <img src={member.avatar_url} alt={member.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              member.name?.charAt(0)
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/team/${member.id}`} className="text-lg font-bold text-main hover:text-primary-400 transition-colors">
              {member.name}
            </Link>
            {member.is_founder && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary-500/10 text-primary-400 border border-primary-500/20 font-mono">
                FOUNDER
              </span>
            )}
          </div>
          <p className="text-sm text-primary-400 font-mono mb-2">{member.title || member.role}</p>

          {member.bio && (
            <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">{member.bio}</p>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {skills.map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded text-[10px] bg-surface-300 text-secondary border border-white/5 font-mono">
                  {skill.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to={`/team/${member.id}`}
              className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 font-mono group/link"
            >
              VIEW_PROFILE
              <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
            {member.github_url && (
              <a
                href={member.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted hover:text-primary-400 font-mono"
              >
                <Github size={12} />
                GITHUB
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
