import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { activityAPI } from '../../api';
import ActivityForm from '../../components/admin/ActivityForm';

export default function ActivityEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      activityAPI.get(id).then((data) => {
        setInitialData(data);
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (data, attachments) => {
    setSaving(true);
    try {
      if (isEdit) {
        await activityAPI.update(id, data);
      } else {
        await activityAPI.create(data);
      }
      navigate('/admin/activities');
    } catch (err) {
      alert(err.response?.data?.error || '保存失败');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-400/50" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/activities')} className="p-2 rounded-lg hover:bg-white/5 text-secondary">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-main font-mono">
          {isEdit ? 'EDIT_ACTIVITY' : 'NEW_ACTIVITY'}
        </h1>
      </div>

      <div className="tech-card rounded-xl p-6">
        <ActivityForm initialData={initialData} onSubmit={handleSubmit} loading={saving} />
      </div>
    </div>
  );
}
