import { useState, useEffect } from 'react';
import { categoryAPI } from '../../api';
import { Plus, Edit2, Trash2, Loader2, X, Check } from 'lucide-react';

export default function CategoryManage() {
  const [categories, setCategories] = useState({ profit: [], team_building: [] });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchData = () => {
    categoryAPI.list().then((data) => {
      setCategories(data.categories);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (parentType) => {
    if (!newName.trim()) return;
    await categoryAPI.create({ name: newName.trim(), parent_type: parentType });
    setNewName('');
    setAdding(null);
    fetchData();
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    await categoryAPI.update(id, { name: editName.trim() });
    setEditingId(null);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm('确定删除此分类？')) return;
    await categoryAPI.delete(id);
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-400/50" /></div>;
  }

  const CategoryGroup = ({ title, items, parentType }) => (
    <div className="tech-card rounded-xl">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h2 className="font-semibold text-main font-mono text-sm">{title} ({items.length})</h2>
        <button
          onClick={() => setAdding(parentType)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-400 text-xs font-medium border border-primary-500/20 hover:bg-primary-500/20 transition-colors"
        >
          <Plus size={14} />
          添加
        </button>
      </div>

      <div className="divide-y divide-white/5">
        {items.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted font-mono">EMPTY</div>
        ) : (
          items.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3 px-4">
              {editingId === cat.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg input-tech text-sm"
                  />
                  <button onClick={() => handleUpdate(cat.id)} className="p-1.5 rounded text-emerald-400 hover:bg-emerald-500/10"><Check size={14} /></button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 rounded text-muted hover:bg-white/5"><X size={14} /></button>
                </div>
              ) : (
                <>
                  <span className="text-sm text-secondary">{cat.name}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} className="p-1.5 rounded hover:bg-white/5 text-muted hover:text-primary-400">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded hover:bg-red-500/10 text-muted hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}

        {adding === parentType && (
          <div className="flex items-center gap-2 p-3 px-4 bg-primary-500/5">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="分类名称"
              className="flex-1 px-3 py-1.5 rounded-lg input-tech text-sm"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAdd(parentType)}
            />
            <button onClick={() => handleAdd(parentType)} className="p-1.5 rounded text-emerald-400 hover:bg-emerald-500/10"><Check size={14} /></button>
            <button onClick={() => { setAdding(null); setNewName(''); }} className="p-1.5 rounded text-muted hover:bg-white/5"><X size={14} /></button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-main font-mono mb-6">CATEGORIES</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryGroup title="PROFIT_CATEGORIES" items={categories.profit || []} parentType="profit" />
        <CategoryGroup title="TEAM_CATEGORIES" items={categories.team_building || []} parentType="team_building" />
      </div>
    </div>
  );
}
