import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import useLanguage from '../../store/language';
import {
  LayoutDashboard, CalendarRange, Tags, MessageSquareText,
  Users, Settings, FileText, X, Zap, UserCog, GitBranch, Eye, FolderKanban,
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const { isSuperAdmin } = useAuthStore();
  const { t } = useLanguage();

  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);

  const mainLinks = [
    { to: '/admin', icon: LayoutDashboard, label: t('dashboard'), exact: true },
    { to: '/admin/activities', icon: CalendarRange, label: t('activityMgmt') },
    { to: '/admin/projects', icon: FolderKanban, label: '项目管理' },
    { to: '/admin/categories', icon: Tags, label: t('categoryMgmt') },
    { to: '/admin/comments', icon: MessageSquareText, label: t('commentMgmt') },
    { to: '/admin/visitors', icon: Eye, label: t('visitorMgmt') },
    { to: '/admin/team', icon: UserCog, label: t('teamMgmt') },
    { to: '/admin/timeline', icon: GitBranch, label: t('timelineMgmt') },
  ];

  const superLinks = [
    { to: '/admin/users', icon: Users, label: t('adminMgmt') },
    { to: '/admin/settings', icon: Settings, label: t('settings') },
    { to: '/admin/logs', icon: FileText, label: t('operationLogs') },
  ];

  return (
    <div className="h-full bg-surface-100 border-r border-white/5 flex flex-col">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-surface font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]"><Zap size={14} /></div>
        <div>
          <div className="text-sm font-bold text-main font-mono">芯捷工作室</div>
          <div className="text-xs text-muted font-mono">{t('adminPanel')}</div>
        </div>
        {onClose && <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-white/5 lg:hidden text-secondary"><X size={16} /></button>}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainLinks.map(({ to, icon: Icon, label, exact }) => (
          <Link key={to} to={to} onClick={onClose} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(to, exact) ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-muted hover:text-secondary hover:bg-white/5'}`}>
            <Icon size={18} />{label}
          </Link>
        ))}

        {isSuperAdmin && (
          <>
            <div className="pt-4 pb-1"><div className="px-3 text-xs text-muted uppercase tracking-wider font-mono">{t('superAdmin')}</div></div>
            {superLinks.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} onClick={onClose} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(to) ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'text-muted hover:text-secondary hover:bg-white/5'}`}>
                <Icon size={18} />{label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link to="/" className="flex items-center justify-center gap-1 text-xs text-muted hover:text-primary-400 transition-colors font-mono">{t('backToFrontend')}</Link>
      </div>
    </div>
  );
}
