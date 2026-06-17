import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Check, UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';
import useAuthStore from '../../store/auth';

export default function JoinForm() {
  const { user, token } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.username || '');
  const [contact, setContact] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Only show for regular users (not admins, not team members)
  if (!token || (user && user.role !== 'user')) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/applications', {
        name: name.trim(),
        contact: contact.trim(),
        reason: reason.trim(),
      });
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); setName(''); setContact(''); setReason(''); }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || '提交失败');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button - only for logged-in regular users */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
      >
        <UserPlus size={18} />
        加入团队
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="tech-card rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                    <UserPlus size={14} className="text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-main">加入团队</h2>
                </div>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted"><X size={18} /></button>
              </div>

              {done ? (
                <div className="text-center py-8">
                  <Check size={48} className="mx-auto text-emerald-400 mb-3" />
                  <p className="text-main font-semibold">申请已提交</p>
                  <p className="text-sm text-muted mt-1">等待管理员审核，通过后自动成为管理员</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1 font-mono">姓名 *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg input-tech text-sm" placeholder="你的姓名" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1 font-mono">联系方式 *</label>
                    <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full px-4 py-2.5 rounded-lg input-tech text-sm" placeholder="QQ/微信/手机号" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1 font-mono">申请理由</label>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-3 rounded-lg input-tech text-sm resize-none" rows={3} placeholder="简单介绍一下自己..." />
                  </div>
                  <button type="submit" disabled={loading || !name.trim() || !contact.trim()}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}提交申请
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
