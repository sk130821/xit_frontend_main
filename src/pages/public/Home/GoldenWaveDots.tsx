import { useEffect, useRef } from 'react';

/** Sparse golden dots with sea-like wave motion across the full hero */
export default function GoldenWaveDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let dpr = 1;

    type Dot = {
      col: number;
      row: number;
      baseX: number;
      baseY: number;
      size: number;
      alpha: number;
    };

    let dots: Dot[] = [];
    let cols = 0;
    let rows = 0;
    let gapX = 36;
    let gapY = 34;

    const rebuild = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = w < 640;
      const isTablet = w < 1024;
      // fewer dots — wider spacing
      gapX = isMobile ? 48 : isTablet ? 42 : 38;
      gapY = isMobile ? 44 : isTablet ? 40 : 36;

      cols = Math.ceil(w / gapX) + 3;
      rows = Math.ceil(h / gapY) + 3;
      dots = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = col * gapX - gapX;
          const baseY = row * gapY - gapY;
          const depth = baseY / h;
          // slightly denser feel only near bottom, still sparse overall
          if (depth < 0.15 && (col + row) % 2 === 0) continue;

          dots.push({
            col,
            row,
            baseX,
            baseY,
            size: isMobile ? 1.4 : 1.8,
            alpha: 0.28 + Math.min(0.45, depth * 0.5),
          });
        }
      }
    };

    rebuild();
    const onResize = () => rebuild();
    window.addEventListener('resize', onResize);

    const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t0 = performance.now();

    const draw = (now: number) => {
      if (!running) return;
      const t = preferReduced ? 0 : (now - t0) / 1000;

      ctx.clearRect(0, 0, w, h);

      // sea wave params — slow rolling ocean
      const wave1 = t * 1.1;
      const wave2 = t * 0.75;
      const wave3 = t * 0.5;

      for (const d of dots) {
        // ocean-like: multiple sine waves travel across X, lift Y like water
        const nx = d.baseX / w;
        const ny = d.baseY / h;

        const seaY =
          Math.sin(nx * Math.PI * 2.2 + wave1) * 18 +
          Math.sin(nx * Math.PI * 1.1 + ny * 2.5 + wave2) * 14 +
          Math.sin(nx * Math.PI * 3.4 + wave3 + d.row * 0.15) * 8;

        const seaX =
          Math.cos(ny * Math.PI * 1.6 + wave2 * 0.8) * 6 +
          Math.sin(nx * Math.PI * 1.8 + wave1 * 0.6) * 4;

        const x = d.baseX + seaX;
        const y = d.baseY + seaY;

        // soft glow
        const glow = d.size * 3.2;
        const g = ctx.createRadialGradient(x, y, 0, x, y, glow);
        g.addColorStop(0, `rgba(243, 186, 47, ${Math.min(0.95, d.alpha)})`);
        g.addColorStop(0.5, `rgba(243, 186, 47, ${d.alpha * 0.28})`);
        g.addColorStop(1, 'rgba(243, 186, 47, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, glow, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 224, 130, ${Math.min(1, d.alpha + 0.2)})`;
        ctx.beginPath();
        ctx.arc(x, y, d.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
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
