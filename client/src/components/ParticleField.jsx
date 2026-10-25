import { useEffect, useRef } from "react";

// Soft purple dots that drift upwards. Used once in App.jsx as a fixed
// full-screen background, so every page gets the effect.
export default function ParticleField({
  count,
  className = "pointer-events-none absolute inset-0 h-full w-full",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let raf;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const make = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.5,
      vy: -(Math.random() * 0.4 + 0.1),
      vx: (Math.random() - 0.5) * 0.2,
      o: Math.random() * 0.5 + 0.1,
    });
    const total = count ?? (window.innerWidth < 640 ? 25 : 45); // fewer dots on phones
    const dots = Array.from({ length: total }, make);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of dots) {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < 0) Object.assign(p, make(), { y: h }); // re-enter from the bottom
        ctx.fillStyle = `rgba(167, 139, 250, ${p.o})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}