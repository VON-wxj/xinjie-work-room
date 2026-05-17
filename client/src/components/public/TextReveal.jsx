import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Character-by-character reveal
export function CharReveal({ text, className = '', delay = 0, duration = 0.03 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const chars = [...text];

  return (
    <span ref={ref} className={className} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.4, delay: delay + i * duration, ease: 'easeOut' }}
          style={{ display: char === ' ' ? 'inline' : 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// Word-by-word reveal
export function WordReveal({ text, className = '', delay = 0, duration = 0.1 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + i * duration, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Typewriter effect
export function Typewriter({ text, className = '', speed = 50, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const chars = [...text];

  return (
    <span ref={ref} className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.01, delay: delay + i * (speed / 1000) }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 1 }}
        animate={isInView ? { opacity: [1, 0] } : {}}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="text-primary-400"
      >
        _
      </motion.span>
    </span>
  );
}

// Line reveal with clip path
export function LineReveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.77, 0, 0.175, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
