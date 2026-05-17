import { useState, useEffect } from 'react';
import { timelineAPI } from '../../api';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

const emptyForm = { title: '', description: '', event_date: '', image_url: '', type: 'event', links: '' };

const typeOptions = [
  { value: 'milestone', label: 'MILESTONE' },
  { value: 'event', label: 'EVENT' },
  { value: 'team', label: 'TEAM' },
  { value: 'achievement', label: 'ACHIEVEMENT' },
];

export default function TimelineManage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    timelineAPI.list().then(d => { setEvents(d.events); setLoading(false); });
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.event_date) return;
    setSaving(true);
    try {
      const data = {
        ...form,
        links: form.links ? (() => { try { return JSON.parse(form.links); } catch { return null; } })() : null,
      };
      if (editing === 'new') await timelineAPI.create(data);
      else await timelineAPI.update(editing, data);
      setEditing(null);
      setForm(emptyForm);
      fetch();
    } catch (err) { alert(err.response?.data?.error || '保存失败'); }
    setSaving(false);
  };

  const handleEdit = (ev) => {
    setEditing(ev.id);
    setForm({
      title: ev.title, description: ev.description || '', event_date: ev.event_date,
      image_url: ev.image_url || '', type: ev.type, links: ev.links || '',
    });
  };

  const handleDelete = async (ev) => {
    if (!confirm(`确定删除 "${ev.title}"？`)) return;
    await timelineAPI.delete(ev.id);
    fetch();
  };

  const labelClass = 'block text-xs font-semibold text-secondary mb-1 font-mono';
  const inputClass = 'w-full px-3 py-2 rounded-lg input-tech text-sm';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-main font-mono">时间线管理 ({events.length})</h1>
        <button
          onClick={() => { setEditing('new'); setForm(emptyForm); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-glow text-main text-sm font-semibold"
        >
          <Plus size={16} />添加事件
        </button>
      </div>

      {editing !== null && (
        <div className="tech-card rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-main font-mono text-sm mb-4">{editing === 'new' ? 'NEW_EVENT' : 'EDIT_EVENT'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>标题 *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>日期 *</label>
                <input type="date" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} className={inputClass} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>类型</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className={`${inputClass} select-tech`}>
                  {typeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>图片 URL</label>
                <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className={inputClass} placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className={labelClass}>描述</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass} rows={2} />
            </div>
            <div>
              <label className={labelClass}>链接（JSON格式）</label>
              <input value={form.links} onChange={e => setForm({...form, links: e.target.value})} className={inputClass} placeholder='[{"label":"文章","url":"https://..."}]' />
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
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">DATE</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">TYPE</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">TITLE</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary font-mono text-xs">IMAGE</th>
                  <th className="text-right px-4 py-3 font-semibold text-secondary font-mono text-xs">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-secondary font-mono text-xs">{ev.event_date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary-500/10 text-primary-400 border border-primary-500/20">{ev.type}</span>
                    </td>
                    <td className="px-4 py-3 text-secondary font-medium">{ev.title}</td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {ev.image_url ? <span className="text-emerald-400 font-mono">HAS_IMAGE</span> : <span className="text-muted font-mono">NONE</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(ev)} className="p-1.5 rounded hover:bg-white/5 text-muted hover:text-primary-400"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(ev)} className="p-1.5 rounded hover:bg-red-500/10 text-muted hover:text-red-400"><Trash2 size={14} /></button>
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
