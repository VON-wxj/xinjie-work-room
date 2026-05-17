import { useEffect, useRef } from 'react';

// React Bits inspired: animated floating squares/grid background
export function SquaresBg({ count = 40, speed = 0.3 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId;
    let squares = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initSquares();
    };

    const isDark = document.documentElement.classList.contains('dark');
    const colors = isDark
      ? ['rgba(6,182,212,0.08)', 'rgba(59,130,246,0.06)', 'rgba(139,92,246,0.04)']
      : ['rgba(6,182,212,0.10)', 'rgba(59,130,246,0.08)', 'rgba(139,92,246,0.06)'];

    const initSquares = () => {
      squares = [];
      for (let i = 0; i < count; i++) {
        squares.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 40 + 20,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * (reduced ? 0.1 : 0.5),
          vx: (Math.random() - 0.5) * (reduced ? 0.1 : speed),
          vy: (Math.random() - 0.5) * (reduced ? 0.1 : speed),
          opacity: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const sq of squares) {
        ctx.save();
        ctx.translate(sq.x, sq.y);
        ctx.rotate((sq.rotation * Math.PI) / 180);
        ctx.fillStyle = sq.color;
        ctx.fillRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);
        ctx.strokeStyle = sq.color.replace('0.0', '0.15');
        ctx.lineWidth = 1;
        ctx.strokeRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);
        ctx.restore();

        sq.x += sq.vx;
        sq.y += sq.vy;
        sq.rotation += sq.rotSpeed;

        if (sq.x < -sq.size) sq.x = canvas.width + sq.size;
        if (sq.x > canvas.width + sq.size) sq.x = -sq.size;
        if (sq.y < -sq.size) sq.y = canvas.height + sq.size;
        if (sq.y > canvas.height + sq.size) sq.y = -sq.size;
      }

      // Draw subtle grid lines
      ctx.strokeStyle = isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.06)';
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [count, speed]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// React Bits inspired: flowing gradient orbs
export function GradientOrbs({ count = 3 }) {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const colors = [
    'bg-primary-500/20',
    'bg-accent-500/15',
    'bg-purple-500/10',
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-3xl ${colors[i % colors.length]}`}
          style={{
            width: `${300 + i * 150}px`,
            height: `${300 + i * 150}px`,
            top: `${20 + i * 30}%`,
            left: `${10 + i * 35}%`,
            animation: `float ${6 + i * 2}s ease-in-out infinite`,
            animationDelay: `${-i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
