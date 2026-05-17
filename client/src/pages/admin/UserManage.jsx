import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import { userAPI } from '../../api';
import { Plus, Loader2, Shield, UserCog } from 'lucide-react';

export default function UserManage() {
  const { isSuperAdmin } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  if (!isSuperAdmin) return <Navigate to="/admin" replace />;

  const fetchUsers = () => {
    setLoading(true);
    userAPI.list({ limit: 50 }).then((data) => {
      setUsers(data.users);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');
    if (!newUsername || !newPassword) { setError('用户名和密码不能为空'); return; }
    try {
      await userAPI.createAdmin({ username: newUsername, password: newPassword });
      setNewUsername(''); setNewPassword(''); setShowAddForm(false);
      fetchUsers();
    } catch (err) { setError(err.response?.data?.error || '创建失败'); }
  };

  const handleToggleStatus = async (user) => {
    await userAPI.update(user.id, { status: user.status === 'active' ? 'disabled' : 'active' });
    fetchUsers();
  };

  const handleDelete = async (user) => {
    if (!confirm(`确定删除用户 "${user.username}"？`)) return;
    await userAPI.delete(user.id);
    fetchUsers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-main font-mono">管理员管理 ({total})</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-glow text-main text-sm font-semibold"
        >
          <Plus size={16} />添加管理员
        </button>
      </div>

      {showAddForm && (
        <div className="tech-card rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-main font-mono text-sm mb-4">CREATE_ADMIN</h2>
          {error && <div className="mb-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}
          <form onSubmit={handleAddAdmin} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1 font-mono">USERNAME</label>
              <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-40 px-3 py-2 rounded-lg input-tech text-sm" placeholder="用户名" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1 font-mono">PASSWORD</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-40 px-3 py-2 rounded-lg input-tech text-sm" placeholder="至少6位" />
            </div>
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary-500/20 text-primary-400 border border-primary-500/30 text-sm font-medium hover:bg-primary-500/30">确认</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg bg-white/5 text-sm text-muted hover:bg-white/10">取消</button>
          </form>
        </div>
      )}

      <div className="tech-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={28} className="animate-spin text-primary-400/50" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-tech">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">USER</th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">ROLE</th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">STATUS</th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary font-mono text-xs">REGISTERED</th>
                  <th className="text-right px-5 py-3 font-semibold text-secondary font-mono text-xs">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-surface text-xs font-bold">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-secondary">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${
                        u.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        u.role === 'admin' ? 'bg-primary-500/10 text-primary-400 border-primary-400/20' : 'bg-gray-500/10 text-secondary border-gray-500/20'
                      }`}>
                        {u.role === 'super_admin' ? <Shield size={11} /> : u.role === 'admin' ? <UserCog size={11} /> : null}
                        {u.role === 'super_admin' ? 'ROOT' : u.role === 'admin' ? 'ADMIN' : 'USER'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2 py-0.5 rounded text-xs font-mono ${
                          u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {u.status === 'active' ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-muted font-mono text-xs">{new Date(u.created_at).toLocaleDateString('zh-CN')}</td>
                    <td className="px-5 py-3 text-right">
                      {u.role !== 'super_admin' && (
                        <button onClick={() => handleDelete(u)} className="px-3 py-1 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                          DELETE
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
