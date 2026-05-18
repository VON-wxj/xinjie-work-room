import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import useAuthStore from '../../store/auth';
import useLanguage from '../../store/language';
import useTheme from '../../store/theme';
import { Menu, X, User, LogOut, Settings, Zap, UserCircle, Globe, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuthStore();
  const { t, lang, toggleLang } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-panel shadow-lg shadow-black/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-surface font-bold text-lg group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-shadow">
              <Zap size={18} />
            </div>
            <span className="text-lg font-bold text-main font-mono tracking-tight">
              芯捷<span className="text-primary-400">工作室</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <Link to="/" className="text-sm font-medium text-secondary hover:text-primary-400 transition-colors">{t('home')}</Link>
            <Link to="/projects" className="text-sm font-medium text-secondary hover:text-primary-400 transition-colors">{t('projects_nav')}</Link>
            <Link to="/team" className="text-sm font-medium text-secondary hover:text-primary-400 transition-colors">{t('team')}</Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary-400 transition-colors">
                  <UserCircle size={15} />{t('profile')}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-400/20 text-sm font-medium text-primary-400 hover:bg-primary-400/10 transition-all">
                    <Settings size={14} />{t('admin')}
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                  <User size={16} className="text-muted" />
                  <span className="text-sm text-secondary">{user.username}</span>
                  <button onClick={handleLogout} className="p-1 rounded hover:bg-white/5 text-muted hover:text-red-400 transition-colors"><LogOut size={14} /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-secondary hover:text-primary-400 transition-colors">{t('login')}</Link>
                <Link to="/register" className="px-4 py-2 rounded-lg btn-glow text-main text-sm font-semibold">{t('register')}</Link>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded border border-white/10 text-secondary hover:text-primary-400 hover:border-primary-400/30 transition-all"
              title={theme === 'dark' ? '切换亮色模式' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1 rounded border border-white/10 text-xs text-secondary hover:text-primary-400 hover:border-primary-400/30 transition-all font-mono"
            >
              <Globe size={12} />
              {lang === 'zh' ? 'EN' : '中'}
            </button>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/5 text-secondary">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 origin-left" style={{ scaleX }} />

      {mobileOpen && (
        <div className="md:hidden glass-panel border-t border-white/5">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" className="block py-2 text-sm text-secondary" onClick={() => setMobileOpen(false)}>{t('home')}</Link>
            <Link to="/projects" className="block py-2 text-sm text-secondary" onClick={() => setMobileOpen(false)}>{t('projects_nav')}</Link>
            <Link to="/team" className="block py-2 text-sm text-secondary" onClick={() => setMobileOpen(false)}>{t('team')}</Link>
            {user ? (
              <>
                <Link to="/profile" className="block py-2 text-sm text-secondary" onClick={() => setMobileOpen(false)}>{t('profile')}</Link>
                {isAdmin && <Link to="/admin" className="block py-2 text-sm text-primary-400" onClick={() => setMobileOpen(false)}>{t('admin')}</Link>}
                <button onClick={handleLogout} className="block py-2 text-sm text-red-400 w-full text-left">{t('logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-sm text-secondary" onClick={() => setMobileOpen(false)}>{t('login')}</Link>
                <Link to="/register" className="block py-2 text-sm text-primary-400" onClick={() => setMobileOpen(false)}>{t('register')}</Link>
              </>
            )}
            <button onClick={toggleTheme} className="flex items-center gap-1 py-2 text-sm text-secondary">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {theme === 'dark' ? '亮色模式' : 'Dark mode'}
            </button>
            <button onClick={toggleLang} className="flex items-center gap-1 py-2 text-sm text-secondary">
              <Globe size={12} />{lang === 'zh' ? 'Switch to English' : '切换到中文'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
