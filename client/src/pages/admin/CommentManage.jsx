import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { commentAPI } from '../../api';
import { Trash2, Loader2, Check, X, ExternalLink } from 'lucide-react';

export default function CommentManage() {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = () => {
    setLoading(true);
    commentAPI.all({ status: statusFilter, page, limit: 20 }).then((data) => {
      setComments(data.comments);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, statusFilter]);

  const handleDelete = async (id) => {
    if (!confirm('确定删除此评论？')) return;
    await commentAPI.delete(id);
    fetchData();
  };

  const handleStatus = async (id, status) => {
    await commentAPI.updateStatus(id, { status });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-main font-mono">评论管理 ({total})</h1>
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
          <div className="flex items-center justify-center py-12"><Loader2 size={28} className="animate-spin text-primary-400/50" /></div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted font-mono">NO_COMMENTS</div>
        ) : (
          <div className="divide-y divide-white/5">
            {comments.map((c) => (
              <div key={c.id} className="p-4 hover:bg-white/[0.02]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-secondary">{c.username}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                        c.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        c.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {c.status === 'approved' ? 'APPROVED' : c.status === 'pending' ? 'PENDING' : 'REJECTED'}
                      </span>
                      <span className="text-xs text-muted font-mono">{new Date(c.created_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                    <p className="text-sm text-secondary mb-1">{c.content}</p>
                    <Link to={`/activity/${c.activity_id}`} className="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                      <ExternalLink size={11} />
                      {c.activity_title}
                    </Link>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {c.status !== 'approved' && (
                      <button onClick={() => handleStatus(c.id, 'approved')} className="p-1.5 rounded hover:bg-emerald-500/10 text-muted hover:text-emerald-400" title="通过">
                        <Check size={14} />
                      </button>
                    )}
                    {c.status !== 'rejected' && (
                      <button onClick={() => handleStatus(c.id, 'rejected')} className="p-1.5 rounded hover:bg-yellow-500/10 text-muted hover:text-yellow-400" title="拒绝">
                        <X size={14} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded hover:bg-red-500/10 text-muted hover:text-red-400" title="删除">
                      <Trash2 size={14} />
                    </button>
                  </div>
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
