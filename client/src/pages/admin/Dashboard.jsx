import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange, TrendingUp, Users as UsersIcon, MessageSquareText, Plus, ArrowRight } from 'lucide-react';
import { activityAPI, commentAPI, userAPI } from '../../api';
import useAuthStore from '../../store/auth';
import useLanguage from '../../store/language';

export default function Dashboard() {
  const { isSuperAdmin } = useAuthStore();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ totalActivities: 0, profitActivities: 0, teamActivities: 0, totalComments: 0, totalUsers: 0 });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    activityAPI.adminList({ limit: 5 }).then(d => { setRecentActivities(d.activities); setStats(s => ({ ...s, totalActivities: d.total })); });
    activityAPI.adminList({ type: 'profit', limit: 1 }).then(d => setStats(s => ({ ...s, profitActivities: d.total })));
    activityAPI.adminList({ type: 'team_building', limit: 1 }).then(d => setStats(s => ({ ...s, teamActivities: d.total })));
    commentAPI.all({ limit: 1 }).then(d => setStats(s => ({ ...s, totalComments: d.total })));
    if (isSuperAdmin) userAPI.list({ limit: 1 }).then(d => setStats(s => ({ ...s, totalUsers: d.total })));
  }, [isSuperAdmin]);

  const statCards = [
    { icon: CalendarRange, label: t('allActivities'), value: stats.totalActivities, color: 'from-primary-400 to-cyan-400', link: '/admin/activities' },
    { icon: TrendingUp, label: t('profitActivities'), value: stats.profitActivities, color: 'from-accent-400 to-blue-400', link: '/admin/activities' },
    { icon: UsersIcon, label: t('teamActivities'), value: stats.teamActivities, color: 'from-violet-400 to-purple-400', link: '/admin/activities' },
    { icon: MessageSquareText, label: t('comments'), value: stats.totalComments, color: 'from-amber-400 to-orange-400', link: '/admin/comments' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-main font-mono">{t('dashboard')}</h1>
          <p className="text-sm text-muted mt-1">{t('welcome')}</p>
        </div>
        <Link to="/admin/activities/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-glow text-main text-sm font-semibold"><Plus size={16} />{t('newActivity')}</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ icon: Icon, label, value, color, link }) => (
          <Link key={label} to={link} className="tech-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg bg-gradient-to-br ${color} text-white`}><Icon size={18} /></div>
              <ArrowRight size={14} className="text-muted" />
            </div>
            <div className="text-3xl font-extrabold text-main font-mono">{value}</div>
            <div className="text-sm text-muted mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      <div className="tech-card rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="font-semibold text-main font-mono">{t('recentActivities')}</h2>
          <Link to="/admin/activities" className="text-sm text-primary-400 hover:text-primary-300 font-mono">{t('viewAll')}</Link>
        </div>
        <div className="divide-y divide-white/5">
          {recentActivities.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted font-mono">{t('noData')}</div>
          ) : recentActivities.map((a) => (
            <Link key={a.id} to={`/admin/activities/${a.id}/edit`} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border ${a.type === 'profit' ? 'bg-accent-500/10 text-accent-400 border-accent-500/20' : 'bg-primary-500/10 text-primary-400 border-primary-400/20'}`}>
                {a.type === 'profit' ? t('profitActivities') : t('teamActivities')}
              </span>
              <span className="flex-1 text-sm font-medium text-secondary truncate">{a.title}</span>
              <span className={`px-2 py-0.5 rounded text-xs ${a.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : a.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-secondary'}`}>
                {a.status === 'published' ? t('published') : a.status === 'draft' ? t('draft') : t('archived')}
              </span>
              <span className="text-xs text-muted font-mono">{new Date(a.created_at).toLocaleDateString('zh-CN')}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
