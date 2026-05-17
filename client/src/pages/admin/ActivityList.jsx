import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityAPI } from '../../api';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

export default function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = () => {
    setLoading(true);
    activityAPI.adminList({ type: typeFilter, status: statusFilter, page, limit: 20 }).then((data) => {
      setActivities(data.activities);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, typeFilter, statusFilter]);

  const handleDelete = async (id, title) => {
    if (!confirm(`确定删除活动 "${title}"？`)) return;
    await activityAPI.delete(id);
    fetchData();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-main font-mono">活动管理 ({total})</h1>
        <Link
          to="/admin/activities/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-glow text-main text-sm font-semibold"
        >
          <Plus size={16} />
          新建活动
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg select-tech text-sm"
        >
          <option value="">全部类型</option>
          <option value="profit">营利性活动</option>
          <option value="team_building">团队团建</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg select-tech text-sm"
        >
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
          <option value="archived">已归档</option>
        </select>
      </div>

      <div className="tech-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={28} className="animate-spin text-primary-400/50" />
          </div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted font-mono">NO_ACTIVITIES</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-tech">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">TITLE</th>
                    <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">TYPE</th>
                    <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">STATUS</th>
                    <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">PROFIT</th>
                    <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">CREATED</th>
                    <th className="text-right px-5 py-3 font-semibold text-secondary font-mono text-xs">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activities.map((a) => (
                    <tr key={a.id} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-medium text-secondary max-w-xs truncate">{a.title}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono border ${
                          a.type === 'profit'
                            ? 'bg-accent-500/10 text-accent-400 border-accent-500/20'
                            : 'bg-primary-500/10 text-primary-400 border-primary-400/20'
                        }`}>
                          {a.type === 'profit' ? 'PROFIT' : 'TEAM'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          a.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                          a.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-secondary'
                        }`}>
                          {a.status === 'published' ? 'PUBLISHED' : a.status === 'draft' ? 'DRAFT' : 'ARCHIVED'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-secondary font-mono">
                        {a.type === 'profit' && a.profit != null ? `¥${Number(a.profit).toLocaleString()}` : '-'}
                      </td>
                      <td className="px-5 py-3 text-muted font-mono text-xs">{new Date(a.created_at).toLocaleDateString('zh-CN')}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/activities/${a.id}/edit`} className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-primary-400">
                            <Edit2 size={15} />
                          </Link>
                          <button onClick={() => handleDelete(a.id, a.title)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {total > 20 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                <span className="text-xs text-muted font-mono">共 {total} 条</span>
                <div className="flex gap-1">
                  {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-mono transition-all ${
                        page === i + 1 ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-muted hover:bg-white/5'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
