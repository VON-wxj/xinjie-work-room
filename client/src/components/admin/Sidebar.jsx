import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import useLanguage from '../../store/language';
import {
  LayoutDashboard, CalendarRange, Tags, MessageSquareText,
  Users, Settings, FileText, X, Zap, UserCog, GitBranch, Eye, FolderKanban,
  ArrowLeft, Home,
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const { isSuperAdmin } = useAuthStore();
  const { t } = useLanguage();

  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);

  const contentLinks = [
    { to: '/admin/activities', icon: CalendarRange, label: '活动管理' },
    { to: '/admin/projects', icon: FolderKanban, label: '项目管理' },
    { to: '/admin/timeline', icon: GitBranch, label: '时间线' },
  ];

  const manageLinks = [
    { to: '/admin/categories', icon: Tags, label: '分类管理' },
    { to: '/admin/comments', icon: MessageSquareText, label: '评论管理' },
    { to: '/admin/visitors', icon: Eye, label: '访客管理' },
    { to: '/admin/team', icon: UserCog, label: '团队成员' },
  ];

  const superLinks = [
    { to: '/admin/users', icon: Users, label: '管理员' },
    { to: '/admin/settings', icon: Settings, label: '站点设置' },
    { to: '/admin/logs', icon: FileText, label: '操作日志' },
  ];

  const sectionClass = 'px-3 pt-5 pb-1 text-[11px] font-semibold text-muted/60 uppercase tracking-widest';

  return (
    <div className="h-full bg-surface-100 border-r border-white/5 flex flex-col">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
        <Link to="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-surface font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-shadow">
          <Zap size={14} />
        </Link>
        <div className="flex-1">
          <div className="text-sm font-bold text-main font-mono">芯捷工作室</div>
          <div className="text-xs text-muted">管理后台</div>
        </div>
        {onClose && <button onClick={onClose} className="p-1 rounded hover:bg-white/5 lg:hidden text-secondary"><X size={16} /></button>}
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {/* Dashboard */}
        <Link to="/admin" onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive('/admin', true)
              ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
              : 'text-secondary hover:text-main hover:bg-white/5'
          }`}>
          <LayoutDashboard size={18} />仪表盘
        </Link>

        {/* Content */}
        <div className={sectionClass}>内容管理</div>
        {contentLinks.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive(to) ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-secondary hover:text-main hover:bg-white/5'
            }`}>
            <Icon size={18} />{label}
          </Link>
        ))}

        {/* Manage */}
        <div className={sectionClass}>运营管理</div>
        {manageLinks.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive(to) ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-secondary hover:text-main hover:bg-white/5'
            }`}>
            <Icon size={18} />{label}
          </Link>
        ))}

        {/* Super admin */}
        {isSuperAdmin && (
          <>
            <div className={sectionClass}>系统管理</div>
            {superLinks.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(to) ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'text-secondary hover:text-main hover:bg-white/5'
                }`}>
                <Icon size={18} />{label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Return to frontend */}
      <div className="p-3 border-t border-white/5">
        <Link to="/"
          className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-secondary hover:text-primary-400 hover:bg-primary-500/5 transition-all">
          <ArrowLeft size={14} />
          <Home size={14} />
          返回前台
        </Link>
      </div>
    </div>
  );
}
