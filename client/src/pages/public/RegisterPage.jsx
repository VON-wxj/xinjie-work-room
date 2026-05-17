import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Loader2, Zap } from 'lucide-react';
import { authAPI } from '../../api';
import useAuthStore from '../../store/auth';
import useLanguage from '../../store/language';

export default function RegisterPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (username.length < 2 || username.length > 20) { setError('用户名长度2-20个字符'); return; }
    if (password.length < 6) { setError('密码至少6位'); return; }
    if (password !== confirmPassword) { setError('两次密码输入不一致'); return; }
    setLoading(true);
    try { const data = await authAPI.register({ username, password }); login(data.token, data.user); navigate('/'); }
    catch (err) { setError(err.response?.data?.error || '注册失败'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 bg-surface grid-bg">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="tech-card rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-surface font-bold text-xl mx-auto mb-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]"><Zap size={20} /></div>
          <h1 className="text-2xl font-bold text-main font-mono">{t('registerTitle')}</h1>
          <p className="text-sm text-muted mt-1">{t('registerSubtitle')}</p>
        </div>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1 font-mono">{t('username')}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2.5 rounded-lg input-tech text-sm" placeholder={t('usernamePlaceholder')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1 font-mono">{t('password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg input-tech text-sm" placeholder={t('passwordPlaceholder')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1 font-mono">{t('confirmPassword')}</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg input-tech text-sm" placeholder={t('confirmPwdPlaceholder')} required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg btn-glow text-main font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}{t('signUp')}
          </button>
        </form>
        <p className="text-center text-sm text-muted mt-6">{t('hasAccount')} <Link to="/login" className="text-primary-400 font-medium hover:underline">{t('signIn')}</Link></p>
      </motion.div>
    </div>
  );
}
