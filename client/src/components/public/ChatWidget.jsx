import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles, Bot, User } from 'lucide-react';
import api from '../../api';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好！我是小V 🎯\n芯捷工作室的智能助手。有什么可以帮你的吗？' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '抱歉，AI 服务暂时不可用，请稍后再试。' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          open
            ? 'bg-surface-100 border border-white/10 rotate-90'
            : 'bg-gradient-to-br from-primary-400 to-accent-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-105'
        }`}
      >
        {open ? (
          <X size={22} className="text-secondary" />
        ) : (
          <div className="relative">
            <MessageCircle size={24} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-surface" />
          </div>
        )}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] tech-card rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-surface-100/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-main">小V</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  在线
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-primary-400 to-accent-500'
                      : 'bg-surface-300'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <Bot size={14} className="text-white" />
                    ) : (
                      <User size={14} className="text-secondary" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[75%] whitespace-pre-wrap ${
                    msg.role === 'assistant'
                      ? 'bg-surface-200 text-main'
                      : 'bg-primary-500/10 text-main border border-primary-500/20'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="rounded-2xl px-4 py-2.5 bg-surface-200">
                    <Loader2 size={16} className="animate-spin text-primary-400" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的问题..."
                  className="flex-1 px-4 py-2.5 rounded-xl input-tech text-sm"
                  disabled={loading}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 text-white flex items-center justify-center disabled:opacity-30 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
