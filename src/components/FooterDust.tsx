import { useEffect, useRef } from 'react';

type Dust = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  twinkle: number;
  twSpeed: number;
  wobble: number;
  phase: number;
};

const PALETTE = [
  [243, 186, 47],
  [255, 210, 90],
  [232, 150, 48],
  [255, 168, 64],
  [196, 118, 42],
  [255, 230, 160],
];

export default function FooterDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let visible = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let dots: Dust[] = [];
    let last = performance.now();
    const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gauss = () => {
      let u = 0;
      let v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * v);
    };

    const rebuild = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = w < 640;
      const count = isMobile ? 280 : 620;

      dots = Array.from({ length: count }, (_, i) => {
        const clustered = i < count * 0.72;
        const x = clustered
          ? Math.min(w, Math.max(0, w * 0.5 + gauss() * w * 0.22))
          : Math.random() * w;
        const y = clustered
          ? Math.min(h, Math.max(0, h * 0.5 + gauss() * h * 0.38))
          : Math.random() * h;
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const depth = Math.random();
        const dir = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
        const speed = 8 + Math.random() * 18 + depth * 10;
        return {
          x,
          y,
          vx: Math.cos(dir) * speed * 0.35,
          vy: Math.sin(dir) * speed,
          size: 0.35 + depth * 1.7,
          r: color[0],
          g: color[1],
          b: color[2],
          alpha: 0.25 + depth * 0.7,
          twinkle: Math.random() * Math.PI * 2,
          twSpeed: 0.6 + Math.random() * 1.8,
          wobble: 0.4 + Math.random() * 1.1,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    rebuild();

    const ro = new ResizeObserver(rebuild);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '80px' }
    );
    io.observe(canvas);

    const draw = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      if (!visible) {
        last = now;
        return;
      }

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      ctx.fillStyle = '#070504';
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(w * 0.52, h * 0.48, 0, w * 0.52, h * 0.48, Math.max(w, h) * 0.58);
      glow.addColorStop(0, 'rgba(92, 42, 10, 0.55)');
      glow.addColorStop(0.28, 'rgba(48, 22, 6, 0.38)');
      glow.addColorStop(0.62, 'rgba(18, 10, 5, 0.18)');
      glow.addColorStop(1, 'rgba(7, 5, 4, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';

      for (const d of dots) {
        if (!preferReduced) {
          d.x += (d.vx + Math.sin(t * d.wobble + d.phase) * 7) * dt;
          d.y += (d.vy + Math.cos(t * d.wobble * 0.7 + d.phase) * 4) * dt;
          if (d.x > w + 6) d.x = -6;
          else if (d.x < -6) d.x = w + 6;
          if (d.y > h + 6) d.y = -6;
          else if (d.y < -6) d.y = h + 6;
        }

        const tw = 0.45 + Math.abs(Math.sin(t * d.twSpeed + d.twinkle)) * 0.55;
        const a = d.alpha * tw;

        if (d.size > 1.35) {
          const r = d.size * 3.4;
          const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r);
          g.addColorStop(0, `rgba(${d.r},${d.g},${d.b},${a})`);
          g.addColorStop(0.4, `rgba(${d.r},${d.g},${d.b},${a * 0.28})`);
          g.addColorStop(1, `rgba(${d.r},${d.g},${d.b},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${d.r},${d.g},${d.b},${a})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
