import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function AnimatedCounter({ from = 0, to, duration = 2, suffix = '', prefix = '', className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration, ease: 'easeOut' });
      return () => controls.stop();
    }
  }, [isInView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

// Skeleton loader
export function Skeleton({ className = '', width, height }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: width || '100%', height: height || '1rem' }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="tech-card rounded-xl overflow-hidden animate-pulse-soft">
      <Skeleton height="12rem" />
      <div className="p-5 space-y-3">
        <Skeleton width="30%" height="0.75rem" />
        <Skeleton height="1.25rem" />
        <Skeleton width="60%" height="0.875rem" />
      </div>
    </div>
  );
}

// Spinkit-inspired loader
export function DotSpinner({ className = '' }) {
  return (
    <div className={`spinner-dots flex items-center justify-center ${className}`}>
      <div /><div /><div />
    </div>
  );
}
