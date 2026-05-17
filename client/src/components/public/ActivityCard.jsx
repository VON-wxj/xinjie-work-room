import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, TrendingUp, Users, ArrowRight } from 'lucide-react';
import useLanguage from '../../store/language';
import { formatDate, getActivityStatus } from '../../lib/utils';

const cardVariants = [
  { hidden: { opacity: 0, y: 50, rotate: -2 }, visible: { opacity: 1, y: 0, rotate: 0 } },
  { hidden: { opacity: 0, y: 50, rotate: 2 }, visible: { opacity: 1, y: 0, rotate: 0 } },
  { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
];

export default function ActivityCard({ activity, index = 0 }) {
  const { t } = useLanguage();
  const status = getActivityStatus(activity.start_date, activity.end_date);
  const isProfit = activity.type === 'profit';
  const variant = cardVariants[index % cardVariants.length];

  const statusStyle = (label) => {
    if (label === t('ongoing')) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (label === t('ended')) return 'bg-gray-500/20 text-secondary border border-gray-500/30';
    return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
  };

  return (
    <motion.div variants={variant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}>
      <Link to={`/activity/${activity.id}`} className="block group">
        <div className="tech-card rounded-xl overflow-hidden hvr-sweep-right hvr-shadow">
          <div className="relative h-48 overflow-hidden bg-surface-200">
            {activity.cover_image ? (
              <motion.img src={activity.cover_image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {isProfit ? <TrendingUp size={48} className="text-primary-400/30" /> : <Users size={48} className="text-accent-400/30" />}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-3 left-3 z-10">
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-semibold animate-fade-in ${isProfit ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30' : 'bg-primary-500/20 text-primary-400 border border-primary-400/30'}`}>
                {isProfit ? t('profitActivities') : t('teamActivities')}
              </span>
            </div>

            {status && (
              <div className="absolute top-3 right-3 z-10">
                <motion.span initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyle(status.label)}`}>
                  {status.label}
                </motion.span>
              </div>
            )}
          </div>

          <div className="p-5 relative">
            {activity.category_name && <span className="text-xs text-primary-400/70 font-mono uppercase tracking-wider">{activity.category_name}</span>}
            <h3 className="text-lg font-bold text-main mt-1 mb-3 group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">{activity.title}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              {activity.start_date && (
                <span className="flex items-center gap-1"><Calendar size={13} />{formatDate(activity.start_date)}{activity.end_date && ` - ${formatDate(activity.end_date)}`}</span>
              )}
              {activity.location && <span className="flex items-center gap-1"><MapPin size={13} />{activity.location}</span>}
              {isProfit && activity.profit != null && <span className="flex items-center gap-1 text-primary-400 font-mono font-semibold ml-auto"><TrendingUp size={13} />¥{Number(activity.profit).toLocaleString()}</span>}
            </div>
            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <span className="text-xs text-primary-400 font-mono">{t('viewDetails')}</span>
              <ArrowRight size={14} className="text-primary-400 icon-arrow" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
