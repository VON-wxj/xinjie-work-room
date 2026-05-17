import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import { settingsAPI } from '../../api';
import { Loader2, Save } from 'lucide-react';

export default function SiteSettings() {
  const { isSuperAdmin } = useAuthStore();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (!isSuperAdmin) return <Navigate to="/admin" replace />;

  useEffect(() => {
    settingsAPI.get().then((data) => {
      setSettings(data.settings);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await settingsAPI.update({ settings });
      setMessage('SAVED_SUCCESSFULLY');
      setTimeout(() => setMessage(''), 3000);
    } catch { setMessage('SAVE_FAILED'); }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-400/50" /></div>;
  }

  const fields = [
    { key: 'site_name', label: 'SITE_NAME' },
    { key: 'site_description', label: 'SITE_DESCRIPTION' },
    { key: 'site_logo', label: 'LOGO_URL' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-main font-mono mb-6">SETTINGS</h1>

      <div className="tech-card rounded-xl p-6 max-w-2xl">
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-mono ${
            message.includes('SUCCESS') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>{message}</div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-secondary mb-2 font-mono">{label}</label>
              <input
                type="text"
                value={settings[key] || ''}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg input-tech text-sm"
              />
            </div>
          ))}

          <div className="pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg btn-glow text-main font-semibold disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
