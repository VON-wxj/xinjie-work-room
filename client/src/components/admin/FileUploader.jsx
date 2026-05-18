import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, File } from 'lucide-react';
import { uploadAPI } from '../../api';
import useLanguage from '../../store/language';

export function ImageUploader({ value, onChange, multiple = false }) {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      if (multiple) {
        const results = [];
        for (const file of files) {
          const formData = new FormData();
          formData.append('image', file);
          const data = await uploadAPI.image(formData);
          results.push(data.url);
        }
        onChange([...(value || []), ...results]);
      } else {
        const formData = new FormData();
        formData.append('image', files[0]);
        const data = await uploadAPI.image(formData);
        onChange(data.url);
      }
    } catch {}
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {multiple ? (
          (value || []).map((url, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden bg-surface-200 border border-white/5">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 p-0.5 rounded bg-red-500 text-main"
              >
                <X size={12} />
              </button>
            </div>
          ))
        ) : value ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-surface-200 border border-white/5">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button onClick={() => onChange('')} className="absolute top-1 right-1 p-0.5 rounded bg-red-500 text-main">
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg bg-surface-200 border-2 border-dashed border-white/10 flex items-center justify-center text-muted">
            <ImageIcon size={24} />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-secondary hover:bg-white/10 hover:text-secondary transition-colors"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {multiple ? t('uploadImage') : value ? t('changeImage') : t('uploadImage')}
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} onChange={handleUpload} className="hidden" />
    </div>
  );
}

export function FileUploader({ value, onChange }) {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const results = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const data = await uploadAPI.file(formData);
        results.push({ url: data.url, original_name: data.original_name, size: data.size });
      }
      onChange([...(value || []), ...results]);
    } catch {}
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {value?.length > 0 && (
        <div className="space-y-2 mb-3">
          {value.map((f, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 text-sm">
              <File size={14} className="text-muted" />
              <span className="flex-1 text-secondary truncate">{f.original_name}</span>
              <button
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="p-0.5 rounded hover:bg-red-500/10 text-muted hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-secondary hover:bg-white/10 hover:text-secondary transition-colors"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {t('uploadFile')}
      </button>
      <input ref={inputRef} type="file" multiple onChange={handleUpload} className="hidden" />
    </div>
  );
}
