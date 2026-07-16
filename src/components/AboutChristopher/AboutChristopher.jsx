import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./AboutChristopher.css";

import portraitLibrary from "../../assets/images/christopher-portrait-library.png";
import portraitBlack from "../../assets/images/christopher-portrait-black.png";
import portraitGray from "../../assets/images/christopher-portrait-gray.png";
import portraitLeadership from "../../assets/images/christopher-portrait-leadership.png";
import portraitStudio from "../../assets/images/christopher-capitol-portrait.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const bentoImages = [
  { src: portraitLibrary, alt: "Christopher DiCristo seated in his library" },
  { src: portraitBlack, alt: "Christopher DiCristo in a black suit" },
  { src: portraitStudio, alt: "Christopher DiCristo portrait at the United States Capitol" },
  { src: portraitGray, alt: "Christopher DiCristo in a modern office" },
  { src: portraitLeadership, alt: "Christopher DiCristo with leadership books" },
  { src: portraitBlack, alt: "Christopher DiCristo executive portrait" },
  { src: portraitGray, alt: "Christopher DiCristo smiling in a gray suit" },
  { src: portraitLibrary, alt: "Christopher DiCristo author portrait" },
];

function AboutChristopher() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = section?.querySelector(".about-bento");
    if (!section || !grid) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => grid.classList.toggle("is-in-view", entry.isIntersecting),
      { threshold: 0.18 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const wrap = sectionRef.current.querySelector(".gallery-wrap");
      const items = gsap.utils.toArray(".about-bento__item", sectionRef.current);
      const sideItems = items.filter((_, index) => index !== 2);
      const centerItem = items[2];
      const focusImage = sectionRef.current.querySelector(".about-focus__image");
      const focusCopy = sectionRef.current.querySelector(".about-focus__copy");
      const focusCta = sectionRef.current.querySelector(".about-focus__cta");
      const focusLine = sectionRef.current.querySelector(".about-focus__line");

      if (window.matchMedia("(max-width: 640px)").matches) {
        gsap.set([focusImage, focusCopy, focusCta], { clearProps: "transform,opacity,visibility,filter" });
        return undefined;
      }

      gsap.set([focusImage, focusCopy, focusCta, focusLine], { autoAlpha: 0 });
      gsap.set(focusImage, { scale: 0.72, y: 34 });
      gsap.set(focusCopy, { x: 72 });
      gsap.set(focusCta, { x: -72 });
      gsap.set(focusLine, { scaleY: 0, transformOrigin: "50% 50%" });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=150%",
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(sideItems, {
          autoAlpha: 0.12,
          scale: 0.86,
          filter: "blur(5px)",
          stagger: { each: 0.025, from: "center" },
          duration: 0.35,
        })
        .to(centerItem, { autoAlpha: 0, scale: 1.18, duration: 0.28 }, 0.08)
        .to(focusImage, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5 }, 0.12)
        .to(focusLine, { autoAlpha: 1, scaleY: 1, duration: 0.36 }, 0.28)
        .to(focusCta, { autoAlpha: 1, x: 0, duration: 0.42 }, 0.34)
        .to(focusCopy, { autoAlpha: 1, x: 0, duration: 0.42 }, 0.38)
        .to(focusImage, { scale: 1.045, duration: 0.42, ease: "none" }, 0.66);

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        gsap.set([centerItem, ...sideItems, focusImage, focusCopy, focusCta, focusLine], {
          clearProps: "all",
        });
      };
    },
    { scope: sectionRef }
  );

  return (
    <section className="about-christopher" id="about-christopher" ref={sectionRef}>
      <div className="about-kicker">
        <span />
        About Christopher DiCristo
        <span />
      </div>

      <div className="gallery-wrap">
        <div className="about-bento" id="gallery-8">
          {bentoImages.map((image, index) => (
            <div className="about-bento__item" key={`${image.alt}-${index}`}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>

        <div className="about-focus__image" aria-hidden="true">
          <img src={portraitStudio} alt="" />
        </div>

        <span className="about-focus__line" aria-hidden="true" />

        <div className="about-focus__copy">
          <p className="about-eyebrow">FROM SOUTH PHILLY TO CEO</p>
          <h2>He Teaches What He Has Lived.</h2>
          <p>
            A former United States Marine, Christopher rebuilt after losing his first
            business, developed communities across greater Philadelphia, helped grow
            American Mortgage to 26 offices, survived terminal cancer, and went on to
            found Loormax Lending Franchise Corporation.
          </p>
          <a className="about-focus__cta" href="/about">
            LEARN MORE ABOUT THE AUTHOR
          </a>
        </div>
      </div>
    </section>
  );
}

export default AboutChristopher;
