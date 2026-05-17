import { useState, useEffect } from 'react';
import useAuthStore from '../../store/auth';
import { teamAPI } from '../../api';
import { Plus, Edit2, Trash2, Loader2, Save, X, Check } from 'lucide-react';

const emptyForm = { name: '', role: '', title: '', bio: '', avatar_url: '', github_url: '', skills: '', join_date: '', is_founder: false, sort_order: 0 };

export default function TeamManage() {
  const { isSuperAdmin } = useAuthStore();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null=idle, 'new'=creating, id=editing
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    teamAPI.list().then(d => { setMembers(d.members); setLoading(false); });
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      if (editing === 'new') {
        await teamAPI.create(form);
      } else {
        await teamAPI.update(editing, form);
      }
      setEditing(null);
      setForm(emptyForm);
      fetch();
    } catch (err) { alert(err.response?.data?.error || '保存失败'); }
    setSaving(false);
  };

  const handleEdit = (m) => {
    setEditing(m.id);
    setForm({ name: m.name, role: m.role || '', title: m.title || '', bio: m.bio || '', avatar_url: m.avatar_url || '', github_url: m.github_url || '', skills: m.skills || '', join_date: m.join_date || '', is_founder: !!m.is_founder, sort_order: m.sort_order || 0 });
  };

  const handleDelete = async (m) => {
    if (!confirm(`确定删除成员 "${m.name}"？`)) return;
    await teamAPI.delete(m.id);
    fetch();
  };

  const labelClass = 'block text-xs font-semibold text-secondary mb-1 font-mono';
  const inputClass = 'w-full px-3 py-2 rounded-lg input-tech text-sm';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-main font-mono">团队成员管理 ({members.length})</h1>
        {isSuperAdmin && (
          <button
            onClick={() => { setEditing('new'); setForm(emptyForm); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-glow text-main text-sm font-semibold"
          >
            <Plus size={16} />添加成员
          </button>
        )}
      </div>

      {/* Form - super admin only */}
      {isSuperAdmin && editing !== null && (
        <div className="tech-card rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-main font-mono text-sm mb-4">
            {editing === 'new' ? 'NEW_MEMBER' : 'EDIT_MEMBER'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>姓名 *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>角色</label>
                <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>职位标题</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} placeholder="Founder & Lead" />
              </div>
              <div>
                <label className={labelClass}>加入日期</label>
                <input type="date" value={form.join_date} onChange={e => setForm({...form, join_date: e.target.value})} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>头像 URL</label>
                <input value={form.avatar_url} onChange={e => setForm({...form, avatar_url: e.target.value})} className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label className={labelClass}>GitHub URL</label>
                <input value={form.github_url} onChange={e => setForm({...form, github_url: e.target.value})} className={inputClass} placeholder="https://github.com/..." />
              </div>
            </div>
            <div>
              <label className={labelClass}>简介</label>
              <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>技能（逗号分隔）</label>
              <input value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} className={inputClass} placeholder="鸿蒙开发, 前端, 竞赛" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                <input type="checkbox" checked={form.is_founder} onChange={e => setForm({...form, is_founder: e.target.checked})} className="rounded" />
                创始人
              </label>
              <div>
                <label className={labelClass}>排序</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} className={`${inputClass} w-20`} />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary-500/20 text-primary-400 border border-primary-500/30 text-sm font-medium hover:bg-primary-500/30">
                {saving ? 'SAVING...' : 'SAVE'}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-white/5 text-sm text-muted hover:bg-white/10">CANCEL</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="tech-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={28} className="animate-spin text-primary-400/50" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-tech">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">NAME</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">TITLE</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">SKILLS</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">ROLE</th>
                  <th className="text-right px-4 py-3 font-semibold text-secondary font-mono text-xs">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-main text-xs font-bold ${m.is_founder ? 'bg-gradient-to-br from-primary-400 to-accent-500' : 'bg-surface-300'}`}>
                          {m.avatar_url ? <img src={m.avatar_url} className="w-full h-full rounded-full object-cover" /> : m.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-secondary">{m.name}</span>
                        {m.is_founder && <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary-500/10 text-primary-400 font-mono">FOUNDER</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{m.title}</td>
                    <td className="px-4 py-3 text-muted text-xs max-w-[200px] truncate">{m.skills}</td>
                    <td className="px-4 py-3 text-muted text-xs">{m.role}</td>
                    <td className="px-4 py-3 text-right">
                      {isSuperAdmin && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(m)} className="p-1.5 rounded hover:bg-white/5 text-muted hover:text-primary-400"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(m)} className="p-1.5 rounded hover:bg-red-500/10 text-muted hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
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
