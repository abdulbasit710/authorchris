import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import "./CurvedLoop.css";

function CurvedLoop({
  marqueeText = "",
  speed = 1.2,
  className = "",
  curveAmount = 250,
  direction = "left",
  interactive = true,
}) {
  const text = useMemo(() => `${marqueeText.trim()}\u00A0`, [marqueeText]);
  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const uid = useId().replace(/:/g, "");
  const pathId = `curve-${uid}`;
  const pathY = 150;
  const pathD = `M-100,${pathY} Q720,${pathY + curveAmount} 1540,${pathY}`;
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const directionRef = useRef(direction);
  const velocityRef = useRef(0);
  const totalText = spacing
    ? Array(Math.ceil(1900 / spacing) + 3).fill(text).join("")
    : text;

  useEffect(() => {
    const measure = () => {
      if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [text, className]);

  useEffect(() => {
    if (!spacing || !textPathRef.current) return undefined;
    textPathRef.current.setAttribute("startOffset", `${-spacing}px`);
    let frame;

    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = directionRef.current === "right" ? speed : -speed;
        const current = Number.parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
        let next = current + delta;
        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;
        textPathRef.current.setAttribute("startOffset", `${next}px`);
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed]);

  const handlePointerDown = (event) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = event.clientX;
    velocityRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!interactive || !dragRef.current || !textPathRef.current || !spacing) return;
    const delta = event.clientX - lastXRef.current;
    lastXRef.current = event.clientX;
    velocityRef.current = delta;
    const current = Number.parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
    let next = current + delta;
    while (next <= -spacing) next += spacing;
    while (next > 0) next -= spacing;
    textPathRef.current.setAttribute("startOffset", `${next}px`);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    if (velocityRef.current) directionRef.current = velocityRef.current > 0 ? "right" : "left";
  };

  return (
    <div
      className="curved-loop__jacket"
      style={{ visibility: spacing ? "visible" : "hidden" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      role={interactive ? "presentation" : undefined}
    >
      <svg className="curved-loop__svg" viewBox="0 0 1440 330" aria-label={marqueeText}>
        <text ref={measureRef} className={`curved-loop__measure ${className}`} xmlSpace="preserve">{text}</text>
        <defs><path id={pathId} d={pathD} fill="none" /></defs>
        {spacing > 0 && (
          <text className={`curved-loop__text ${className}`} xmlSpace="preserve">
            <textPath ref={textPathRef} href={`#${pathId}`} xmlSpace="preserve">{totalText}</textPath>
          </text>
        )}
      </svg>
    </div>
  );
}

export default CurvedLoop;
