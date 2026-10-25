import { useEffect, useRef } from "react";

// Soft purple dots that drift upwards behind the hero section.
export default function ParticleField({ count = 45 }) {
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
    const dots = Array.from({ length: count }, make);

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

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
