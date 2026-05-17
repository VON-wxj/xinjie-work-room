import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Calendar, MapPin, TrendingUp, Users, Link as LinkIcon,
  Download, Image as ImageIcon, ArrowLeft, Heart,
  MessageSquare, Send, Loader2,
} from 'lucide-react';
import { activityAPI, commentAPI, favoriteAPI } from '../../api';
import { formatDate, getActivityStatus } from '../../lib/utils';
import useAuthStore from '../../store/auth';
import ScrollReveal from '../../components/public/ScrollReveal';

export default function ActivityDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [activity, setActivity] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    activityAPI.get(id).then((data) => {
      setActivity(data);
      setLoading(false);
    });
    commentAPI.list(id).then((data) => setComments(data.comments));
    if (user) {
      favoriteAPI.check(id).then((data) => setFavorited(data.favorited));
    }
  }, [id, user]);

  const handleFavorite = async () => {
    if (!user) return;
    const data = await favoriteAPI.toggle(id);
    setFavorited(data.favorited);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const data = await commentAPI.create(id, { content: commentText });
      setComments([data.comment, ...comments]);
      setCommentText('');
    } catch {}
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-surface">
        <Loader2 size={32} className="animate-spin text-primary-400" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-surface">
        <div className="text-center">
          <p className="text-lg text-muted mb-4 font-mono">404_NOT_FOUND</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 underline">返回首页</Link>
        </div>
      </div>
    );
  }

  const status = getActivityStatus(activity.start_date, activity.end_date);
  const isProfit = activity.type === 'profit';

  return (
    <div className="min-h-screen pt-16 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft size={16} />
          返回活动列表
        </Link>
      </div>

      {/* Cover */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden bg-surface-200 border border-white/5">
          {activity.cover_image ? (
            <img src={activity.cover_image} alt={activity.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isProfit ? <TrendingUp size={64} className="text-primary-400/20" /> : <Users size={64} className="text-accent-400/20" />}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <ScrollReveal>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded text-xs font-mono font-semibold border ${
                  isProfit
                    ? 'bg-accent-500/10 text-accent-400 border-accent-500/30'
                    : 'bg-primary-500/10 text-primary-400 border-primary-400/30'
                }`}>
                  {isProfit ? 'PROFIT' : 'TEAM'}
                </span>
                {activity.category_name && (
                  <span className="text-xs text-muted">{activity.category_name}</span>
                )}
                {status && (
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    status.label === '进行中'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : status.label === '已结束'
                      ? 'bg-gray-500/20 text-secondary'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {status.label}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-main font-mono">
                {activity.title}
              </h1>
            </div>
            <button
              onClick={handleFavorite}
              className={`p-3 rounded-lg border transition-all ${
                favorited
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'border-white/5 text-muted hover:text-red-400 hover:border-red-500/30'
              }`}
            >
              <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
            </button>
          </div>
        </ScrollReveal>

        {/* Meta */}
        <ScrollReveal delay={0.1}>
          <div className="tech-card rounded-xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {activity.start_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-primary-400" />
                <div>
                  <div className="text-xs text-muted">活动期限</div>
                  <div className="font-medium text-secondary font-mono text-xs">
                    {formatDate(activity.start_date)}
                    {activity.end_date && ` - ${formatDate(activity.end_date)}`}
                  </div>
                </div>
              </div>
            )}
            {activity.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-primary-400" />
                <div>
                  <div className="text-xs text-muted">地点</div>
                  <div className="font-medium text-secondary">{activity.location}</div>
                </div>
              </div>
            )}
            {isProfit && activity.profit != null && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-emerald-400" />
                <div>
                  <div className="text-xs text-muted">利润</div>
                  <div className="font-mono font-semibold text-emerald-400">
                    ¥{Number(activity.profit).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
            {isProfit && activity.url && (
              <div className="flex items-center gap-2 text-sm">
                <LinkIcon size={16} className="text-primary-400" />
                <div>
                  <div className="text-xs text-muted">活动网址</div>
                  <a href={activity.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-400 hover:text-primary-300 underline text-xs">
                    访问链接
                  </a>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Content */}
        {activity.content && (
          <ScrollReveal delay={0.2}>
            <div className="tech-card rounded-xl p-6 sm:p-8 mb-10">
              <div className="markdown-body">
                <ReactMarkdown>{activity.content}</ReactMarkdown>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Photos */}
        {activity.photos?.length > 0 && (
          <ScrollReveal delay={0.25}>
            <div className="mb-10">
              <h2 className="text-xl font-bold text-main mb-4 flex items-center gap-2 font-mono">
                <ImageIcon size={20} className="text-primary-400" />
                GALLERY
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {activity.photos.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="aspect-square rounded-lg overflow-hidden bg-surface-200 border border-white/5"
                  >
                    <img
                      src={`/${photo.file_path}`}
                      alt=""
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Attachments */}
        {activity.attachments?.length > 0 && (
          <ScrollReveal delay={0.3}>
            <div className="mb-10">
              <h2 className="text-xl font-bold text-main mb-4 flex items-center gap-2 font-mono">
                <Download size={20} className="text-primary-400" />
                FILES
              </h2>
              <div className="space-y-2">
                {activity.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={`/${att.file_path}`}
                    download={att.original_name}
                    className="flex items-center justify-between tech-card rounded-lg px-4 py-3"
                  >
                    <span className="text-sm font-medium text-secondary">{att.original_name}</span>
                    <span className="text-xs text-muted font-mono">
                      {att.file_size ? `${(att.file_size / 1024).toFixed(1)} KB` : ''}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Comments */}
        <ScrollReveal delay={0.35}>
          <div>
            <h2 className="text-xl font-bold text-main mb-6 flex items-center gap-2 font-mono">
              <MessageSquare size={20} className="text-primary-400" />
              COMMENTS ({comments.length})
            </h2>

            {user ? (
              <form onSubmit={handleComment} className="tech-card rounded-lg p-4 mb-6 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-surface text-xs font-bold flex-shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="写下你的评论..."
                    maxLength={500}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted text-secondary"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submitting}
                    className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 disabled:opacity-30 transition-colors border border-primary-500/30"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="tech-card rounded-lg p-4 mb-6 text-center text-sm text-muted">
                <Link to="/login" className="text-primary-400 hover:underline">登录</Link> 后即可评论
              </div>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-sm text-muted py-8 font-mono">NO_COMMENTS_YET</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="tech-card rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400/30 to-accent-500/30 flex items-center justify-center text-main text-xs font-bold">
                        {comment.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-secondary">{comment.username}</span>
                      {comment.role !== 'user' && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-primary-500/20 text-primary-400 border border-primary-500/30">ADMIN</span>
                      )}
                      <span className="text-xs text-muted ml-auto font-mono">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary pl-9">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
