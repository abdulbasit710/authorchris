import React, { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import "./DecayCard.css";

function DecayCard({
  width = 420,
  height = 560,
  image,
  baseFrequency = 0.015,
  numOctaves = 5,
  seed = 4,
  maxDisplacement = 220,
  movementBound = 38,
  children,
}) {
  const cardRef = useRef(null);
  const displacementRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const cachedPointer = useRef({ x: 0, y: 0 });
  const filterId = `decay-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId;
    let active = false;
    const values = { x: 0, y: 0, rotation: 0, displacement: 0 };
    const lerp = (a, b, amount) => a + (b - a) * amount;

    const handlePointerMove = (event) => {
      const bounds = card.getBoundingClientRect();
      pointer.current = {
        x: (event.clientX - bounds.left) / bounds.width - 0.5,
        y: (event.clientY - bounds.top) / bounds.height - 0.5,
      };
    };

    const handleEnter = (event) => {
      active = true;
      handlePointerMove(event);
      cachedPointer.current = { ...pointer.current };
    };

    const handleLeave = () => {
      active = false;
      pointer.current = { x: 0, y: 0 };
    };

    const render = () => {
      const targetX = active ? pointer.current.x * movementBound : 0;
      const targetY = active ? pointer.current.y * movementBound : 0;
      const targetRotation = active ? pointer.current.x * 7 : 0;
      values.x = lerp(values.x, targetX, 0.09);
      values.y = lerp(values.y, targetY, 0.09);
      values.rotation = lerp(values.rotation, targetRotation, 0.09);

      const travel = Math.hypot(
        pointer.current.x - cachedPointer.current.x,
        pointer.current.y - cachedPointer.current.y
      );
      values.displacement = lerp(
        values.displacement,
        active ? Math.min(maxDisplacement, travel * maxDisplacement * 9) : 0,
        0.08
      );

      gsap.set(card, { x: values.x, y: values.y, rotateZ: values.rotation });
      if (displacementRef.current) {
        gsap.set(displacementRef.current, { attr: { scale: values.displacement } });
      }
      cachedPointer.current = { ...pointer.current };
      frameId = requestAnimationFrame(render);
    };

    if (!reduceMotion) {
      card.addEventListener("pointerenter", handleEnter);
      card.addEventListener("pointermove", handlePointerMove);
      card.addEventListener("pointerleave", handleLeave);
      frameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(frameId);
      card.removeEventListener("pointerenter", handleEnter);
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerleave", handleLeave);
    };
  }, [maxDisplacement, movementBound]);

  return (
    <div
      className="decay-card"
      style={{ "--decay-width": `${width}px`, "--decay-height": `${height}px` }}
      ref={cardRef}
    >
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="decay-card__svg" aria-hidden="true">
        <filter id={filterId}>
          <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves={numOctaves} seed={seed} stitchTiles="stitch" result="noise" />
          <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B" />
        </filter>
        <image href={image} width={width} height={height} filter={`url(#${filterId})`} preserveAspectRatio="xMidYMin slice" />
      </svg>
      <div className="decay-card__shade" />
      <div className="decay-card__content">{children}</div>
    </div>
  );
}

export default DecayCard;
