import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import Waves from "../Waves/Waves";
import skylinePortrait from "../../assets/images/christopher-skyline-portrait.png";
import "./MoreAboutAuthor.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const chapters = [
  {
    title: "Built by discipline.",
    text: "After losing his father at nine, Christopher learned early that a life is measured by what you build—not by what you are given. The United States Marine Corps turned that lesson into a lifelong standard.",
  },
  {
    title: "Proven through rebuilding.",
    text: "Business failure did not end the story. Christopher rebuilt through real estate, development, and mortgage leadership—creating communities, growing teams, and turning experience into opportunity for others.",
  },
  {
    title: "Focused on lasting impact.",
    text: "Surviving terminal cancer sharpened his purpose: share the practical principles that helped him build, rebuild, survive, and lead so the next generation can move forward with courage.",
  },
];

function MoreAboutAuthor() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const splits = [];

    gsap.utils.toArray(".more-author__text", sectionRef.current).forEach((block) => {
      const split = new SplitType(block, { types: "lines", lineClass: "more-author__line" });
      splits.push(split);
      gsap.from(split.lines, {
        yPercent: 80,
        opacity: 0,
        filter: "blur(12px)",
        stagger: .1,
        scrollTrigger: {
          trigger: block.closest(".more-author__panel"),
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    });

    const depthTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom 25%",
        scrub: 1.2,
      },
    });

    depthTimeline
      .fromTo(".more-author__portrait-card", { rotateY: -11, rotateX: 5, y: 55 }, { rotateY: 8, rotateX: -3, y: -35, ease: "none" }, 0)
      .fromTo(".more-author__glow", { scale: .72, opacity: .28 }, { scale: 1.12, opacity: .72, ease: "none" }, 0);

    return () => {
      splits.forEach((split) => split.revert());
      depthTimeline.scrollTrigger?.kill();
      depthTimeline.kill();
    };
  }, { scope: sectionRef });

  return (
    <section className="more-author" id="more-about-chris" ref={sectionRef} aria-labelledby="more-author-title">
      <Waves lineColor="rgba(217, 171, 85, 0.16)" waveSpeedX={0.0125} waveSpeedY={0.01} waveAmpX={40} waveAmpY={20} friction={0.9} tension={0.01} maxCursorMove={120} xGap={18} yGap={36} />

      <header className="more-author__header">
        <p className="more-author__eyebrow">More About Chris</p>
        <h2 id="more-author-title">A life built<br /><em>beyond limits.</em></h2>
        <span>Scroll through the experiences behind the leadership</span>
      </header>

      <div className="more-author__story">
        <div className="more-author__visual">
          <span className="more-author__glow" />
          <figure className="more-author__portrait-card">
            <img src={skylinePortrait} alt="Christopher DiCristo overlooking the New York City skyline" />
            <figcaption><b>50+</b><span>Years of lived<br />experience</span></figcaption>
          </figure>
        </div>

        <div className="more-author__chapters">
          {chapters.map((chapter, index) => (
            <article className="more-author__panel" key={chapter.title}>
              <p className="more-author__number">{String(index + 1).padStart(2, "0")}</p>
              <p className="more-author__chapter-label">Chapter {String(index + 1).padStart(2, "0")}</p>
              <h3>{chapter.title}</h3>
              <p className="more-author__text">{chapter.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MoreAboutAuthor;
