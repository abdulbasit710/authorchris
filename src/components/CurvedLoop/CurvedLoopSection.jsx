import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CurvedLoop from "./CurvedLoop";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function CurvedLoopSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const intro = sectionRef.current.querySelector(".curved-loop__intro");
    const loop = sectionRef.current.querySelector(".curved-loop__jacket");

    gsap.from(intro, {
      y: 55,
      autoAlpha: 0,
      scrollTrigger: { trigger: sectionRef.current, start: "top 78%", end: "top 42%", scrub: 1 },
    });
    gsap.from(loop, {
      y: 100,
      autoAlpha: 0,
      scrollTrigger: { trigger: loop, start: "top 92%", end: "center 62%", scrub: 1 },
    });
  }, { scope: sectionRef });

  return (
    <section className="curved-loop" ref={sectionRef} aria-labelledby="curved-loop-title">
      <header className="curved-loop__intro">
        <p>From lived experience to lasting impact</p>
        <h2 id="curved-loop-title">Build. Rebuild. Keep moving.</h2>
        <span>Drag the message or watch it move</span>
      </header>
      <CurvedLoop
        marqueeText="REAL ESTATE BEYOND LIMITS ✦ COURAGE ✦ CONSISTENCY ✦ LEGACY ✦ "
        speed={1.25}
        curveAmount={0}
        direction="left"
        interactive
      />
    </section>
  );
}

export default CurvedLoopSection;
