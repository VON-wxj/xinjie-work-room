import { useEffect, useRef } from 'react';

// Lightweight animated floating squares background (canvas-based)
export function SquaresBg({ count = 12, speed = 0.15 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return; // Skip entirely for accessibility

    let animId;
    let squares = [];
    let lastTime = 0;
    const FPS = 30; // Throttle to 30fps
    const frameInterval = 1000 / FPS;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initSquares();
    };

    const isDark = document.documentElement.classList.contains('dark');
    const colors = isDark
      ? ['rgba(6,182,212,0.06)', 'rgba(59,130,246,0.04)']
      : ['rgba(6,182,212,0.08)', 'rgba(59,130,246,0.06)'];

    const initSquares = () => {
      squares = [];
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      for (let i = 0; i < count; i++) {
        squares.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 30 + 20,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 0.3,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          opacity: Math.random() * 0.3 + 0.08,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const animate = (timestamp) => {
      if (timestamp - lastTime < frameInterval) {
        animId = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Grid (only every 160px)
      ctx.strokeStyle = isDark ? 'rgba(6,182,212,0.02)' : 'rgba(6,182,212,0.04)';
      ctx.lineWidth = 0.5;
      const gridSize = 160;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Squares
      for (const sq of squares) {
        ctx.save();
        ctx.globalAlpha = sq.opacity;
        ctx.translate(sq.x, sq.y);
        ctx.rotate((sq.rotation * Math.PI) / 180);
        ctx.fillStyle = sq.color;
        ctx.fillRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);
        ctx.restore();

        sq.x += sq.vx;
        sq.y += sq.vy;
        sq.rotation += sq.rotSpeed;

        if (sq.x < -sq.size) sq.x = w + sq.size;
        if (sq.x > w + sq.size) sq.x = -sq.size;
        if (sq.y < -sq.size) sq.y = h + sq.size;
        if (sq.y > h + sq.size) sq.y = -sq.size;
      }

      animId = requestAnimationFrame(animate);
    };

    // Pause when page is not visible
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        lastTime = 0;
        animId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [count, speed]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// Static gradient orbs with reduced GPU cost
export function GradientOrbs({ count = 2 }) {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const colors = [
    'bg-primary-500/15',
    'bg-accent-500/10',
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-2xl ${colors[i % colors.length]}`}
          style={{
            width: `${300 + i * 150}px`,
            height: `${300 + i * 150}px`,
            top: `${25 + i * 35}%`,
            left: `${15 + i * 40}%`,
            animation: `float ${8 + i * 3}s ease-in-out infinite`,
            animationDelay: `${-i * 3}s`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
