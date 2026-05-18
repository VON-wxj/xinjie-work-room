import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, Save, Github, MapPin, Calendar, Camera, Zap,
  ArrowLeft, ExternalLink, Check,
} from 'lucide-react';
import { profileAPI } from '../../api';
import useAuthStore from '../../store/auth';

export default function ProfilePage() {
  const { user, token } = useAuthStore();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!token) return;
    profileAPI.get().then((data) => {
      setMember(data.member);
      setForm({
        bio: data.member.bio || '',
        title: data.member.title || '',
        avatar_url: data.member.avatar_url || '',
        github_url: data.member.github_url || '',
        skills: data.member.skills || '',
      });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [token]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-surface">
        <Loader2 size={32} className="animate-spin text-primary-400/50" />
      </div>
    );
  }
  if (!member) {
    return (
      <div className="min-h-screen pt-24 bg-surface text-center">
        <p className="text-muted text-lg font-mono">NOT_A_TEAM_MEMBER</p>
        <p className="text-muted text-sm mt-2">你的账号未关联团队成员信息</p>
        <Link to="/" className="text-primary-400 hover:underline mt-4 inline-block">返回首页</Link>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const data = {
        bio: form.bio,
        title: form.title,
        avatar_url: form.avatar_url,
        github_url: form.github_url,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      await profileAPI.update(data);
      setMember({ ...member, ...data, skills: form.skills });
      setEditing(false);
      setMessage('SAVED');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('SAVE_FAILED');
    }
    setSaving(false);
  };

  const skills = member.skills ? (typeof member.skills === 'string' ? member.skills.split(',') : member.skills) : [];

  return (
    <div className="min-h-screen pt-16 bg-surface grid-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary-400 transition-colors mb-6">
          <ArrowLeft size={16} />
          {t('backToAdmin')}
        </Link>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8 mb-10"
        >
          {/* Avatar */}
          <div className="flex-shrink-0 relative group">
            <div className={`w-36 h-36 sm:w-48 sm:h-48 rounded-full flex items-center justify-center text-main text-6xl font-bold ${
              member.is_founder
                ? 'bg-gradient-to-br from-primary-400 to-accent-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                : 'bg-gradient-to-br from-surface-300 to-surface-400'
            }`}>
              {form.avatar_url ? (
                <img src={form.avatar_url} alt={member.name} className="w-full h-full rounded-full object-cover" loading="lazy" decoding="async" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                member.name?.charAt(0)
              )}
            </div>
            {editing && (
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera size={24} className="text-main" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-2">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-main">{member.name}</h1>
              {!!member.is_founder && (
                <span className="px-2 py-1 rounded text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20 font-mono">
                  FOUNDER
                </span>
              )}
            </div>

            {editing ? (
              <input
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="text-lg text-primary-400 font-mono mb-3 bg-transparent border-b border-primary-400/30 outline-none w-full max-w-xs"
                placeholder="你的职位标题"
              />
            ) : (
              <p className="text-lg text-primary-400 font-mono mb-3">{member.title || member.role}</p>
            )}

            {message && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-mono mb-3 ${
                message === 'SAVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'
              }`}>
                {message === 'SAVED' ? <Check size={12} /> : null}
                {message}
              </span>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-5">
              {member.join_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-muted" />
                  加入于 {member.join_date}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-muted" />
                中国
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 mb-5">
              {editing ? (
                <div className="flex items-center gap-2 flex-1">
                  <Github size={16} className="text-muted" />
                  <input
                    value={form.github_url}
                    onChange={e => setForm({...form, github_url: e.target.value})}
                    className="flex-1 bg-transparent border-b border-primary-400/30 outline-none text-sm text-secondary font-mono"
                    placeholder="https://github.com/yourname"
                  />
                </div>
              ) : member.github_url ? (
                <a
                  href={member.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-200 border border-white/5 text-sm text-secondary hover:text-primary-400 transition-all font-mono"
                >
                  <Github size={16} />
                  GitHub
                  <ExternalLink size={12} />
                </a>
              ) : null}
            </div>

            {/* Edit toggle */}
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-lg border border-primary-400/20 text-sm text-primary-400 hover:bg-primary-500/10 transition-all font-mono"
              >
                EDIT_PROFILE
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg btn-glow text-main text-sm font-semibold disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  SAVE
                </button>
                <button
                  onClick={() => { setEditing(false); setForm({...member, skills: member.skills || ''}); }}
                  className="px-4 py-2 rounded-lg bg-white/5 text-sm text-muted hover:bg-white/10"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="tech-card rounded-xl p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-main font-mono mb-3">BIO</h2>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={e => setForm({...form, bio: e.target.value})}
              className="w-full bg-transparent border border-primary-400/20 rounded-lg p-3 text-sm text-secondary outline-none focus:border-primary-400/50 resize-y"
              rows={4}
              placeholder="介绍一下你自己..."
            />
          ) : (
            <p className="text-sm text-secondary leading-relaxed">{member.bio || '暂无简介'}</p>
          )}
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="tech-card rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-primary-400" />
            <h2 className="text-lg font-bold text-main font-mono">SKILLS</h2>
          </div>
          {editing ? (
            <div>
              <input
                value={form.skills}
                onChange={e => setForm({...form, skills: e.target.value})}
                className="w-full bg-transparent border border-primary-400/20 rounded-lg px-3 py-2 text-sm text-secondary outline-none focus:border-primary-400/50 font-mono"
                placeholder="鸿蒙开发, 前端, React（逗号分隔）"
              />
              <p className="text-xs text-muted mt-1">逗号分隔多个技能标签</p>
            </div>
          ) : skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20 text-sm text-primary-400 font-mono">
                  {skill.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">暂无技能标签</p>
          )}
        </motion.div>

        {/* Avatar URL field when editing */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tech-card rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Camera size={16} className="text-accent-400" />
              <h2 className="text-lg font-bold text-main font-mono">AVATAR</h2>
            </div>
            <input
              value={form.avatar_url}
              onChange={e => setForm({...form, avatar_url: e.target.value})}
              className="w-full bg-transparent border border-primary-400/20 rounded-lg px-3 py-2 text-sm text-secondary outline-none focus:border-primary-400/50 font-mono"
              placeholder="https://... （头像图片URL）"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
