"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  alpha: number;
};

interface CanvasShimmerProps {
  active: boolean;
  /**
   * Multiplier for particle density. 1 = default used on curtains,
   * values > 1 create more twinkles for hero moments.
   */
  density?: number;
}

export function CanvasShimmer({ active, density = 1 }: CanvasShimmerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const baseCount = 80;
    const particleCount = Math.round(baseCount * Math.max(density, 0.3));
    const particles: Particle[] = [];

    const randomParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.7 + 0.6,
      speedX: (Math.random() - 0.5) * 0.12,
      speedY: Math.random() * 0.24 + 0.06,
      alpha: Math.random() * 0.65 + 0.15,
    });

    for (let i = 0; i < particleCount; i++) {
      particles.push(randomParticle());
    }

    particlesRef.current = particles;

    const draw = () => {
      if (!active) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (const p of particlesRef.current) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        gradient.addColorStop(0, `rgba(247, 231, 206, ${p.alpha})`);
        gradient.addColorStop(1, "rgba(247, 231, 206, 0)");
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y -= p.speedY;

        if (p.y + p.radius * 4 < 0 || p.x < -50 || p.x > width + 50) {
          Object.assign(p, randomParticle(), { y: height + 20 });
        }
      }

      animationRef.current = window.requestAnimationFrame(draw);
    };

    animationRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

