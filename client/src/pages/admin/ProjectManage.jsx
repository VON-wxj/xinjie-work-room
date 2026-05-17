import { useState, useEffect } from 'react';
import { projectAPI } from '../../api';
import { ImageUploader } from '../../components/admin/FileUploader';
import { Plus, Edit2, Trash2, Loader2, X, Check } from 'lucide-react';

const emptyForm = { title: '', description: '', cover_image: '', url: '', tags: '', status: 'published', sort_order: 0 };

export default function ProjectManage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    projectAPI.adminList().then(d => { setProjects(d.projects); setLoading(false); });
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    try {
      const data = { ...form, tags: form.tags.split(',').map(s => s.trim()).filter(Boolean) };
      if (editing === 'new') await projectAPI.create(data);
      else await projectAPI.update(editing, data);
      setEditing(null); setForm(emptyForm); fetch();
    } catch (err) { alert(err.response?.data?.error || '保存失败'); }
    setSaving(false);
  };

  const handleEdit = (p) => {
    setEditing(p.id);
    setForm({ title: p.title, description: p.description || '', cover_image: p.cover_image || '', url: p.url || '', tags: p.tags || '', status: p.status, sort_order: p.sort_order || 0 });
  };

  const handleDelete = async (p) => {
    if (!confirm(`确定删除项目 "${p.title}"？`)) return;
    await projectAPI.delete(p.id); fetch();
  };

  const labelClass = 'block text-xs font-semibold text-muted mb-1 font-mono';
  const inputClass = 'w-full px-3 py-2 rounded-lg input-tech text-sm';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-main font-mono">项目管理 ({projects.length})</h1>
        <button onClick={() => { setEditing('new'); setForm(emptyForm); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-glow text-white text-sm font-semibold">
          <Plus size={16} />添加项目
        </button>
      </div>

      {editing !== null && (
        <div className="tech-card rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-main font-mono text-sm mb-4">{editing === 'new' ? 'NEW_PROJECT' : 'EDIT_PROJECT'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>标题 *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>项目链接</label>
                <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} className={inputClass} placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className={labelClass}>描述</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass} rows={3} />
            </div>
            <div>
              <label className={labelClass}>标签（逗号分隔）</label>
              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={inputClass} placeholder="Web, React, 鸿蒙" />
            </div>
            <div>
              <label className={labelClass}>封面图片</label>
              <ImageUploader value={form.cover_image} onChange={v => setForm({...form, cover_image: v})} />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <label className={labelClass}>状态</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={`${inputClass} select-tech`}>
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                </select>
              </div>
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

      <div className="tech-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={28} className="animate-spin text-primary-400/50" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-tech">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 font-semibold text-muted font-mono text-xs">TITLE</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted font-mono text-xs">IMAGE</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted font-mono text-xs">STATUS</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted font-mono text-xs">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.cover_image ? (
                          <img src={p.cover_image} className="w-8 h-8 rounded object-cover bg-surface-200" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-surface-200" />
                        )}
                        <div>
                          <div className="font-medium text-main">{p.title}</div>
                          {p.url && <a href={p.url} target="_blank" className="text-xs text-primary-400">{p.url}</a>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs font-mono">{p.cover_image ? '有图' : '无'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono ${p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {p.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1.5 rounded hover:bg-white/5 text-muted hover:text-primary-400"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p)} className="p-1.5 rounded hover:bg-red-500/10 text-muted hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
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
