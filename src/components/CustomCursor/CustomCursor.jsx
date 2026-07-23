import React, { useEffect, useRef } from "react";
import "./CustomCursor.css";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input[type='button']",
  "input[type='submit']",
  "input[type='reset']",
  "input[type='checkbox']",
  "input[type='radio']",
  "input[type='range']",
  "input[type='color']",
  "input[type='file']",
  "[role='button']",
  "summary",
  "label[for]",
  "[data-cursor='interactive']",
].join(",");

const PRECISION_SELECTOR = [
  "input:not([type])",
  "input[type='text']",
  "input[type='email']",
  "input[type='password']",
  "input[type='search']",
  "input[type='tel']",
  "input[type='url']",
  "input[type='number']",
  "input[type='date']",
  "input[type='time']",
  "textarea",
  "select",
  "[contenteditable='true']",
].join(",");

function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const cursorQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    if (!cursor || !ring || !dot || !cursorQuery.matches) return undefined;

    document.documentElement.classList.add("custom-cursor-enabled");

    let pointerX = -100;
    let pointerY = -100;
    let ringX = -100;
    let ringY = -100;
    let hasPosition = false;
    let frameId;

    const moveElement = (element, x, y) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const updateTargetState = (target) => {
      if (!(target instanceof Element)) return;

      const isPrecision = Boolean(target.closest(PRECISION_SELECTOR));
      const isInteractive = !isPrecision && Boolean(target.closest(INTERACTIVE_SELECTOR));
      const isDraggable = Boolean(target.closest(".curved-loop__jacket, [data-cursor='drag']"));

      cursor.classList.toggle("is-precision", isPrecision);
      cursor.classList.toggle("is-interactive", isInteractive || isDraggable);
      cursor.classList.toggle("is-draggable", isDraggable);
    };

    const handlePointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!hasPosition) {
        ringX = pointerX;
        ringY = pointerY;
        hasPosition = true;
      }

      moveElement(dot, pointerX, pointerY);
      updateTargetState(event.target);
      cursor.classList.add("is-visible");
    };

    const handlePointerDown = () => cursor.classList.add("is-pressed");
    const handlePointerUp = () => cursor.classList.remove("is-pressed");
    const hideCursor = () => cursor.classList.remove("is-visible");
    const handlePointerOut = (event) => {
      if (!event.relatedTarget) hideCursor();
    };

    const render = () => {
      ringX += (pointerX - ringX) * 0.58;
      ringY += (pointerY - ringY) * 0.58;
      moveElement(ring, ringX, ringY);
      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("blur", hideCursor);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", hideCursor);
      document.documentElement.classList.remove("custom-cursor-enabled");
    };
  }, []);

  return (
    <div className="custom-cursor" ref={cursorRef} aria-hidden="true">
      <div className="custom-cursor__position" ref={ringRef}>
        <span className="custom-cursor__ring" />
      </div>
      <div className="custom-cursor__position" ref={dotRef}>
        <span className="custom-cursor__dot" />
      </div>
    </div>
  );
}

export default CustomCursor;
