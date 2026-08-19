import { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  z: number;
  size: number;
  twinkle: number;
  speed: number;
};

type Dust = {
  angle: number;
  radius: number;
  size: number;
  alpha: number;
  arm: number;
};

type GoldDot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
};

export default function GalaxyBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let dust: Dust[] = [];
    let goldDots: GoldDot[] = [];
    let cx = 0;
    let cy = 0;
    let last = performance.now();

    const rebuild = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cx = w * 0.62;
      cy = h * 0.48;

      const isMobile = w < 640;
      const starCount = isMobile ? 90 : 180;
      const dustCount = isMobile ? 220 : 480;

      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        size: Math.random() * 1.6 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
      }));

      dust = Array.from({ length: dustCount }, () => {
        const arm = Math.floor(Math.random() * 3);
        return {
          angle: Math.random() * Math.PI * 2,
          radius: 20 + Math.random() * Math.min(w, h) * 0.55,
          size: Math.random() * 1.8 + 0.4,
          alpha: 0.15 + Math.random() * 0.55,
          arm,
        };
      });

      const goldCount = isMobile ? 55 : 110;
      goldDots = Array.from({ length: goldCount }, () => {
        const dir = Math.random() * Math.PI * 2;
        const speed = 12 + Math.random() * 28;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(dir) * speed,
          vy: Math.sin(dir) * speed * 0.55,
          size: 0.8 + Math.random() * 1.6,
          alpha: 0.35 + Math.random() * 0.5,
        };
      });
    };

    rebuild();
    window.addEventListener('resize', rebuild);

    const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t0 = performance.now();

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = preferReduced ? 0 : (now - t0) / 1000;

      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, w, h);

      // nebula glow
      const nebula = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
      nebula.addColorStop(0, 'rgba(243, 186, 47, 0.14)');
      nebula.addColorStop(0.28, 'rgba(88, 28, 135, 0.12)');
      nebula.addColorStop(0.55, 'rgba(20, 40, 90, 0.08)');
      nebula.addColorStop(1, 'rgba(5, 7, 15, 0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      // spiral dust
      for (const d of dust) {
        const spin = t * 0.08 + d.arm * 2.1;
        const a = d.angle + spin + d.radius * 0.006;
        const r = d.radius * (0.85 + Math.sin(t * 0.15 + d.arm) * 0.04);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * 0.55;
        const glow = d.size * 2.4;
        const g = ctx.createRadialGradient(x, y, 0, x, y, glow);
        const gold = d.arm === 0;
        g.addColorStop(0, gold ? `rgba(255, 220, 140, ${d.alpha})` : `rgba(180, 160, 255, ${d.alpha * 0.7})`);
        g.addColorStop(1, 'rgba(5,7,15,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, glow, 0, Math.PI * 2);
        ctx.fill();
      }

      // small golden dots — wrap forever
      if (!preferReduced) {
        for (const d of goldDots) {
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          if (d.x > w + 8) d.x = -8;
          else if (d.x < -8) d.x = w + 8;
          if (d.y > h + 8) d.y = -8;
          else if (d.y < -8) d.y = h + 8;
        }
      }

      for (const d of goldDots) {
        const glow = d.size * 3.2;
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, glow);
        g.addColorStop(0, `rgba(243, 186, 47, ${d.alpha})`);
        g.addColorStop(0.45, `rgba(243, 186, 47, ${d.alpha * 0.35})`);
        g.addColorStop(1, 'rgba(243, 186, 47, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, glow, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 236, 170, ${Math.min(1, d.alpha + 0.25)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // stars
      for (const s of stars) {
        const tw = 0.35 + Math.abs(Math.sin(t * s.speed + s.twinkle)) * 0.65;
        const x = (s.x + t * (4 + s.z * 10)) % (w + 20) - 10;
        const y = s.y + Math.sin(t * 0.2 + s.twinkle) * 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${tw * (0.35 + s.z * 0.65)})`;
        ctx.beginPath();
        ctx.arc(x, y, s.size * (0.6 + s.z), 0, Math.PI * 2);
        ctx.fill();
      }

      // core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      core.addColorStop(0, 'rgba(255, 236, 180, 0.35)');
      core.addColorStop(0.4, 'rgba(243, 186, 47, 0.12)');
      core.addColorStop(1, 'rgba(5,7,15,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', rebuild);
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
