import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowDown, TrendingUp, Users, Calendar } from 'lucide-react';
import useLanguage from '../../store/language';
import ParticleBg from './ParticleBg';
import { Typewriter } from './TextReveal';

export default function HeroSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface">
      <motion.div style={{ y, scale }} className="absolute inset-0 grid-bg" />
      <ParticleBg count={40} color="6, 182, 212" />
      <motion.div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-1/4 -right-32 w-[32rem] h-[32rem] bg-accent-500/10 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.8, 0.5, 0.8] }} transition={{ duration: 10, repeat: Infinity }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary-400/5 rounded-full blur-3xl" />

      <motion.div style={{ opacity }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-400/20 bg-primary-400/5 text-sm font-medium text-primary-400 mb-8">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400" /></span>
          {t('welcome')}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-main mb-6">
          {t('heroTitle')}
          <div className="gradient-text mt-2 font-mono"><Typewriter text={t('heroSubtitle')} speed={80} delay={0.5} /></div>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.8, delay: 0.5 }} className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('heroDesc')}<br /><span className="text-muted">{t('heroDesc2')}</span>
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="flex items-center justify-center gap-10 sm:gap-16 mb-12">
          {[{ icon: TrendingUp, label: t('profitActivities'), value: '50+' }, { icon: Users, label: t('teamActivities'), value: '100+' }, { icon: Calendar, label: t('continuousOperation'), value: '3年+' }].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.8 + i * 0.15, ease: [0.175, 0.885, 0.32, 1.275] }} className="text-center">
              <stat.icon size={22} className="mx-auto text-primary-400 mb-2" />
              <div className="text-3xl font-bold text-main font-mono">{stat.value}</div>
              <div className="text-xs text-muted mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.1 }}>
          <motion.a href="#activities" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg btn-glow text-main font-semibold text-lg hvr-icon-forward">
            {t('exploreBtn')}<ArrowDown size={20} className="icon-arrow" />
          </motion.a>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </section>
  );
}
