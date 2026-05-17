import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export function useScrollReveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  };
}

export function useParallaxScroll(speed = 0.5) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return { ref, y, scrollYProgress };
}
