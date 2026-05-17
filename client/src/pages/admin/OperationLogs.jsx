import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import { logAPI } from '../../api';
import { Loader2, FileText, Clock, User } from 'lucide-react';

const actionLabels = {
  create_activity: 'CREATE_ACT',
  update_activity: 'UPDATE_ACT',
  delete_activity: 'DELETE_ACT',
  create_category: 'CREATE_CAT',
  delete_category: 'DELETE_CAT',
  create_admin: 'CREATE_ADMIN',
  update_user: 'UPDATE_USER',
  delete_user: 'DELETE_USER',
  update_settings: 'UPDATE_SETTINGS',
  update_comment_status: 'REVIEW_COMMENT',
};

export default function OperationLogs() {
  const { isSuperAdmin } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  if (!isSuperAdmin) return <Navigate to="/admin" replace />;

  const fetchLogs = () => {
    setLoading(true);
    logAPI.list({ action: actionFilter, page, limit: 30 }).then((data) => {
      setLogs(data.logs);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, [page, actionFilter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-main font-mono">OPERATION_LOGS ({total})</h1>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg select-tech text-sm"
        >
          <option value="">全部操作</option>
          {Object.entries(actionLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="tech-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={28} className="animate-spin text-primary-400/50" /></div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted font-mono">NO_LOGS</div>
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <FileText size={14} className="text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-secondary font-mono">
                        {actionLabels[log.action] || log.action}
                      </span>
                      {log.target_type && (
                        <span className="text-xs text-muted font-mono">
                          {log.target_type}:#{log.target_id}
                        </span>
                      )}
                    </div>
                    {log.detail && <p className="text-xs text-muted mt-0.5">{log.detail}</p>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted flex-shrink-0 font-mono">
                    <span className="flex items-center gap-1"><User size={11} />{log.username || 'SYSTEM'}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{new Date(log.created_at).toLocaleString('zh-CN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {total > 30 && (
          <div className="flex justify-center gap-1 p-4 border-t border-white/5">
            {Array.from({ length: Math.ceil(total / 30) }, (_, i) => (
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
