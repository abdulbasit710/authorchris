import React, { useEffect, useRef } from "react";
import "./Waves.css";

function Waves({
  lineColor = "rgba(217, 171, 85, 0.2)",
  waveSpeedX = 0.0125,
  waveSpeedY = 0.01,
  waveAmpX = 40,
  waveAmpY = 20,
  friction = 0.9,
  tension = 0.01,
  maxCursorMove = 120,
  xGap = 18,
  yGap = 36,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return undefined;

    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, strength: 0 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let visible = true;

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updatePointer = (event) => {
      if (mobile) return;
      const bounds = container.getBoundingClientRect();
      pointer.targetX = event.clientX - bounds.left;
      pointer.targetY = event.clientY - bounds.top;
      pointer.strength = 1;
    };

    const leavePointer = () => {
      pointer.strength = 0;
    };

    const draw = (time) => {
      if (!visible) {
        frameId = window.requestAnimationFrame(draw);
        return;
      }

      const speed = reducedMotion ? 0.12 : mobile ? 0.45 : 1;
      const gap = mobile ? Math.max(xGap, 28) : xGap;
      pointer.x += (pointer.targetX - pointer.x) * (1 - friction + 0.035);
      pointer.y += (pointer.targetY - pointer.y) * (1 - friction + 0.035);
      context.clearRect(0, 0, width, height);
      context.lineWidth = mobile ? 0.65 : 0.8;

      const columns = Math.ceil(width / gap) + 4;
      for (let column = -2; column < columns; column += 1) {
        const baseX = column * gap;
        context.beginPath();
        context.strokeStyle = column % 5 === 0 ? "rgba(140, 142, 140, 0.13)" : lineColor;

        for (let y = -yGap; y <= height + yGap; y += 8) {
          const phase = column * 0.18 + y * 0.006;
          let displacement = Math.sin(phase + time * waveSpeedX * 0.055 * speed) * waveAmpX;
          displacement += Math.cos(y * 0.004 + time * waveSpeedY * 0.04 * speed) * waveAmpY;

          if (!mobile && pointer.strength > 0.001) {
            const dx = baseX + displacement - pointer.x;
            const dy = y - pointer.y;
            const distance = Math.hypot(dx, dy);
            const influence = Math.max(0, 1 - distance / 230) * pointer.strength;
            displacement += Math.max(-maxCursorMove, Math.min(maxCursorMove, -dx * influence * tension * 8));
          }

          const x = baseX + displacement;
          if (y === -yGap) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }

      pointer.strength *= 0.992;
      frameId = window.requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    resize();
    observer.observe(container);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", leavePointer);
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      document.documentElement.removeEventListener("mouseleave", leavePointer);
    };
  }, [friction, lineColor, maxCursorMove, tension, waveAmpX, waveAmpY, waveSpeedX, waveSpeedY, xGap, yGap]);

  return (
    <div className="waves" ref={containerRef} aria-hidden="true">
      <canvas className="waves-canvas" ref={canvasRef} />
    </div>
  );
}

export default Waves;
