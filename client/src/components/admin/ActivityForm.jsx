import { useState, useEffect } from 'react';
import { categoryAPI } from '../../api';
import { ImageUploader, FileUploader } from './FileUploader';

export default function ActivityForm({ initialData, onSubmit, loading }) {
  const [categories, setCategories] = useState({ profit: [], team_building: [] });
  const [type, setType] = useState(initialData?.type || 'profit');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [startDate, setStartDate] = useState(initialData?.start_date || '');
  const [endDate, setEndDate] = useState(initialData?.end_date || '');
  const [profit, setProfit] = useState(initialData?.profit || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [status, setStatus] = useState(initialData?.status || 'published');
  const [attachments, setAttachments] = useState(initialData?.attachments || []);

  useEffect(() => {
    categoryAPI.list().then((data) => setCategories(data.categories));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const data = {
      type,
      category_id: categoryId ? Number(categoryId) : null,
      title: title.trim(),
      content,
      cover_image: coverImage,
      url: type === 'profit' ? url : null,
      start_date: startDate || null,
      end_date: endDate || null,
      profit: type === 'profit' && profit ? Number(profit) : null,
      location: location || null,
      status,
    };
    onSubmit(data, attachments);
  };

  const labelClass = 'block text-sm font-semibold text-secondary mb-2 font-mono text-xs';
  const inputClass = 'w-full px-4 py-2.5 rounded-lg input-tech text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Type */}
      <div>
        <label className={labelClass}>类型</label>
        <div className="flex gap-3">
          {[
            { value: 'profit', label: '营利' },
            { value: 'team_building', label: '团建' },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => { setType(value); setCategoryId(''); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-mono font-semibold border transition-all ${
                type === value
                  ? 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                  : 'border-white/5 text-muted hover:text-secondary hover:border-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Category & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>分类</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`${inputClass} select-tech`}>
            <option value="">未分类</option>
            {(categories[type] || []).map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>状态</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} select-tech`}>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
            <option value="archived">已归档</option>
          </select>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>标题 *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="请输入活动标题" className={inputClass} required />
      </div>

      {/* Profit fields */}
      {type === 'profit' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-accent-500/5 border border-accent-500/10">
          <div>
            <label className={labelClass}>网址</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>利润 (¥)</label>
            <input type="number" step="0.01" value={profit} onChange={(e) => setProfit(e.target.value)} placeholder="0.00" className={inputClass} />
          </div>
          <div className="sm:col-span-3">
            <label className={labelClass}>附件</label>
            <FileUploader value={attachments} onChange={setAttachments} />
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>开始日期</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>结束日期</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>地点</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="可选" className={inputClass} />
      </div>

      {/* Cover */}
      <div>
        <label className={labelClass}>封面图片</label>
        <ImageUploader value={coverImage} onChange={setCoverImage} />
      </div>

      {/* Content */}
      <div>
        <label className={labelClass}>内容 (Markdown)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在此编写活动内容，支持 Markdown 格式..."
          rows={16}
          className={`${inputClass} font-mono resize-y`}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="px-6 py-2.5 rounded-lg btn-glow text-main font-semibold disabled:opacity-50"
        >
          {loading ? '保存中...' : initialData ? '更新' : '创建'}
        </button>
      </div>
    </form>
  );
}
