import React, { useEffect, useRef } from "react";
import "./FlickeringGrid.css";

function FlickeringGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    let frameId = 0;
    let lastFrame = 0;
    let columns = 0;
    let rows = 0;
    let values = new Float32Array(0);
    let tones = new Uint8Array(0);

    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const configure = () => {
      const mobile = mobileQuery.matches;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
      const step = mobile ? 24 : 19;

      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.ceil(window.innerWidth / step);
      rows = Math.ceil(window.innerHeight / step);
      values = new Float32Array(columns * rows);
      tones = new Uint8Array(columns * rows);

      for (let index = 0; index < values.length; index += 1) {
        values[index] = 0.08 + Math.random() * (mobile ? 0.14 : 0.24);
        tones[index] = Math.random() > 0.7 ? 1 : 0;
      }
    };

    const draw = () => {
      const mobile = mobileQuery.matches;
      const step = mobile ? 24 : 19;
      const size = mobile ? 2.5 : 3;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let column = 0; column < columns; column += 1) {
        for (let row = 0; row < rows; row += 1) {
          const index = column * rows + row;
          const alpha = values[index];
          context.fillStyle = tones[index]
            ? `rgba(150, 150, 145, ${alpha})`
            : `rgba(217, 171, 85, ${alpha})`;
          context.fillRect(column * step, row * step, size, size);
        }
      }
    };

    const animate = (time) => {
      const mobile = mobileQuery.matches;
      const interval = 1000 / (mobile ? 12 : 22);

      if (time - lastFrame >= interval) {
        const changes = Math.max(1, Math.floor(values.length * (mobile ? 0.004 : 0.007)));
        for (let change = 0; change < changes; change += 1) {
          const index = Math.floor(Math.random() * values.length);
          values[index] = 0.07 + Math.random() * (mobile ? 0.16 : 0.26);
        }
        draw();
        lastFrame = time;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    const restart = () => {
      window.cancelAnimationFrame(frameId);
      configure();
      draw();
      if (!motionQuery.matches) frameId = window.requestAnimationFrame(animate);
    };

    restart();
    window.addEventListener("resize", restart, { passive: true });
    mobileQuery.addEventListener?.("change", restart);
    motionQuery.addEventListener?.("change", restart);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", restart);
      mobileQuery.removeEventListener?.("change", restart);
      motionQuery.removeEventListener?.("change", restart);
    };
  }, []);

  return (
    <div className="site-flickering-grid" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default FlickeringGrid;
