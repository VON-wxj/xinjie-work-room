import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import api from '../../api';
import { Check, X, Loader2, Clock, User, Mail, FileText } from 'lucide-react';

export default function ApplicationManage() {
  const { isSuperAdmin } = useAuthStore();
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  if (!isSuperAdmin) return <Navigate to="/admin" replace />;

  const fetch = () => {
    setLoading(true);
    api.get('/applications', { params: { status: statusFilter, page, limit: 20 } }).then((r) => {
      setApps(r.data.applications);
      setTotal(r.data.total);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page, statusFilter]);

  const handleReview = async (id, status) => {
    await api.put(`/applications/${id}`, { status });
    fetch();
  };

  const pendingCount = apps.filter(a => a.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-main font-mono">团队申请 ({total})</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-yellow-400 mt-1">{pendingCount} 条待审核</p>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg select-tech text-sm"
        >
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>

      <div className="tech-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={28} className="animate-spin text-primary-400/50" />
          </div>
        ) : apps.length === 0 ? (
          <div className="py-12 text-center text-muted text-sm font-mono">暂无申请</div>
        ) : (
          <div className="divide-y divide-white/5">
            {apps.map((app) => (
              <div key={app.id} className="p-5 hover:bg-white/[0.02]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-surface-300 to-surface-400 flex items-center justify-center text-main text-sm font-bold">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-main">{app.name}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-mono ${
                          app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                          app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {app.status === 'pending' ? '待审核' : app.status === 'approved' ? '已通过' : '已拒绝'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted mb-2">
                      <span className="flex items-center gap-1"><Mail size={11} />{app.contact}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{new Date(app.created_at).toLocaleString('zh-CN')}</span>
                      {app.reviewer_name && (
                        <span className="flex items-center gap-1"><User size={11} />审核：{app.reviewer_name}</span>
                      )}
                    </div>

                    {app.reason && (
                      <div className="flex items-start gap-1.5 text-sm text-secondary">
                        <FileText size={13} className="mt-0.5 flex-shrink-0" />
                        {app.reason}
                      </div>
                    )}
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleReview(app.id, 'approved')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
                      >
                        <Check size={14} />通过
                      </button>
                      <button
                        onClick={() => handleReview(app.id, 'rejected')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                      >
                        <X size={14} />拒绝
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
              >{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
