import { useState, useEffect } from 'react';
import { userAPI } from '../../api';
import { Trash2, Loader2, Users, Search } from 'lucide-react';

export default function VisitorsManage() {
  const [visitors, setVisitors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    userAPI.visitors({ page, limit: 20 }).then((data) => {
      setVisitors(data.visitors);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleDelete = async (user) => {
    if (!confirm(`确定删除用户 "${user.username}"？`)) return;
    await userAPI.delete(user.id);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-main font-mono">访客管理 ({total})</h1>
          <p className="text-sm text-muted mt-1">非团队成员的注册用户</p>
        </div>
      </div>

      <div className="tech-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={28} className="animate-spin text-primary-400/50" />
          </div>
        ) : visitors.length === 0 ? (
          <div className="py-12 text-center">
            <Users size={32} className="mx-auto text-muted mb-3" />
            <p className="text-sm text-muted font-mono">NO_VISITORS</p>
            <p className="text-xs text-main mt-1">暂无访客注册</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-tech">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">USERNAME</th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">STATUS</th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">REGISTERED</th>
                  <th className="text-right px-5 py-3 font-semibold text-secondary font-mono text-xs">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visitors.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-surface-300 to-surface-400 flex items-center justify-center text-main text-xs font-bold">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-secondary">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                        u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {u.status === 'active' ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted font-mono text-xs">
                      {new Date(u.created_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(u)}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 20 && (
          <div className="flex justify-center gap-1 p-4 border-t border-white/5">
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
        )}
      </div>
    </div>
  );
}
