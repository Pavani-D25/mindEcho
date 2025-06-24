"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const SparklesCore = ({
  id,
  className,
  background,
  minSize,
  maxSize,
  particleDensity,
  particleColor,
}) => {
  const [init, setInit] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const container = containerRef.current;

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    resizeCanvas();

    const particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / (particleDensity * 100));

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        opacityDirection: Math.random() > 0.5 ? 1 : -1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Update opacity for twinkling effect
        particle.opacity += particle.opacityDirection * 0.01;
        if (particle.opacity <= 0.2 || particle.opacity >= 1) {
          particle.opacityDirection *= -1;
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particleColor || "#FFFFFF";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Add sparkle effect
        if (Math.random() > 0.98) {
          ctx.save();
          ctx.globalAlpha = particle.opacity * 0.8;
          ctx.strokeStyle = particleColor || "#FFFFFF";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.size * 2, particle.y);
          ctx.lineTo(particle.x + particle.size * 2, particle.y);
          ctx.moveTo(particle.x, particle.y - particle.size * 2);
          ctx.lineTo(particle.x, particle.y + particle.size * 2);
          ctx.stroke();
          ctx.restore();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [maxSize, minSize, particleColor, particleDensity]);

  useEffect(() => {
    if (!init && mounted) {
      initCanvas();
      setInit(true);
    }
  }, [init, initCanvas, mounted]);

  if (!mounted) {
    return (
      <div
        ref={containerRef}
        className={cn("relative", className)}
        style={{
          background: background || "transparent",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        background: background || "transparent",
      }}
    >
      <canvas
        ref={canvasRef}
        id={id}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: background || "transparent",
        }}
      />
    </div>
  );
};