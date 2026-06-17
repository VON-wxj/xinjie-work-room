import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { ImageUploader } from '../../components/admin/FileUploader';
import api from '../../api';

const emptyForm = { title: '', description: '', event_date: '', image_url: '', sort_order: 0 };

export default function CreatorManage() {
  const { isSuperAdmin } = useAuthStore();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  if (!isSuperAdmin) return <Navigate to="/admin" replace />;

  const fetch = () => {
    setLoading(true);
    api.get('/creator').then(r => { setExperiences(r.data.experiences); setLoading(false); });
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.event_date) return;
    setSaving(true);
    try {
      if (editing === 'new') {
        await api.post('/creator', form);
      } else {
        await api.put(`/creator/${editing}`, form);
      }
      setEditing(null);
      setForm(emptyForm);
      fetch();
    } catch (err) { alert(err.response?.data?.error || '保存失败'); }
    setSaving(false);
  };

  const handleEdit = (exp) => {
    setEditing(exp.id);
    setForm({
      title: exp.title, description: exp.description || '', event_date: exp.event_date,
      image_url: exp.image_url || '', sort_order: exp.sort_order || 0,
    });
  };

  const handleDelete = async (exp) => {
    if (!confirm(`确定删除 "${exp.title}"？`)) return;
    await api.delete(`/creator/${exp.id}`);
    fetch();
  };

  const labelClass = 'block text-xs font-semibold text-secondary mb-1 font-mono';
  const inputClass = 'w-full px-3 py-2 rounded-lg input-tech text-sm';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-main font-mono">创作者经历 ({experiences.length})</h1>
        <button
          onClick={() => { setEditing('new'); setForm(emptyForm); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-glow text-main text-sm font-semibold"
        >
          <Plus size={16} />添加经历
        </button>
      </div>

      {editing !== null && (
        <div className="tech-card rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-main font-mono text-sm mb-4">{editing === 'new' ? '新建经历' : '编辑经历'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>标题 *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>日期 *</label>
                <input value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} className={inputClass} placeholder="2025.11" required />
              </div>
            </div>
            <div>
              <label className={labelClass}>描述</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass} rows={2} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>图片</label>
                <ImageUploader value={form.image_url} onChange={v => setForm({...form, image_url: v})} />
              </div>
              <div>
                <label className={labelClass}>排序</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} className={`${inputClass} w-20`} />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary-500/20 text-primary-400 border border-primary-500/30 text-sm font-medium hover:bg-primary-500/30">
                {saving ? '保存中...' : '保存'}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-white/5 text-sm text-muted hover:bg-white/10">取消</button>
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
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">日期</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">标题</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">图片</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">排序</th>
                  <th className="text-right px-4 py-3 font-semibold text-secondary font-mono text-xs">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-secondary font-mono text-xs">{exp.event_date}</td>
                    <td className="px-4 py-3 text-secondary font-medium">{exp.title}</td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {exp.image_url ? <span className="text-emerald-400 font-mono">有图</span> : <span className="text-muted font-mono">无</span>}
                    </td>
                    <td className="px-4 py-3 text-muted font-mono text-xs">{exp.sort_order}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(exp)} className="p-1.5 rounded hover:bg-white/5 text-muted hover:text-primary-400"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(exp)} className="p-1.5 rounded hover:bg-red-500/10 text-muted hover:text-red-400"><Trash2 size={14} /></button>
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
